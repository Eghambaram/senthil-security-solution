import { neon } from "@neondatabase/serverless";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { applications, enquiries, submissionAttempts, type NewApplication, type NewEnquiry } from "@/lib/db/schema";
import type { Backends } from "@/lib/config";

export type FormName = "enquiry" | "careers";
export type Table = "enquiries" | "applications";

/** Persistence used by the form handlers; Neon in production, memory in dev/E2E. */
export type FormStore = {
  countAttempts(form: FormName, ipHash: string, since: Date): Promise<number>;
  recordAttempt(form: FormName, ipHash: string, at: Date): Promise<void>;
  insertEnquiry(row: NewEnquiry): Promise<{ id: string }>;
  insertApplication(row: NewApplication): Promise<{ id: string }>;
  markNotified(table: Table, id: string, error?: string): Promise<void>;
  /** Retention: delete rows older than the cut-offs; returns CV keys to remove. */
  purge(cutoffs: { enquiries: Date; applications: Date; attempts: Date }): Promise<{
    enquiries: number;
    applications: number;
    attempts: number;
    resumeKeys: string[];
  }>;
};

function neonStore(url: string): FormStore {
  const db = drizzle(neon(url));
  return {
    async countAttempts(form, ipHash, since) {
      const [row] = await db
        .select({ n: count() })
        .from(submissionAttempts)
        .where(and(eq(submissionAttempts.form, form), eq(submissionAttempts.ipHash, ipHash), gte(submissionAttempts.createdAt, since)));
      return row?.n ?? 0;
    },
    async recordAttempt(form, ipHash, at) {
      await db.insert(submissionAttempts).values({ form, ipHash, createdAt: at });
    },
    async insertEnquiry(row) {
      const [r] = await db.insert(enquiries).values(row).returning({ id: enquiries.id });
      return { id: r!.id };
    },
    async insertApplication(row) {
      const [r] = await db.insert(applications).values(row).returning({ id: applications.id });
      return { id: r!.id };
    },
    async markNotified(table, id, error) {
      const t = table === "enquiries" ? enquiries : applications;
      await db
        .update(t)
        .set(error ? { notifyError: error.slice(0, 500) } : { notifiedAt: new Date(), notifyError: null })
        .where(eq(t.id, id));
    },
    async purge(cutoffs) {
      const e = await db.delete(enquiries).where(lt(enquiries.createdAt, cutoffs.enquiries)).returning({ id: enquiries.id });
      const a = await db
        .delete(applications)
        .where(lt(applications.createdAt, cutoffs.applications))
        .returning({ key: applications.resumeKey });
      const s = await db
        .delete(submissionAttempts)
        .where(lt(submissionAttempts.createdAt, cutoffs.attempts))
        .returning({ id: submissionAttempts.id });
      return {
        enquiries: e.length,
        applications: a.length,
        attempts: s.length,
        resumeKeys: a.map((r) => r.key).filter((k): k is string => !!k),
      };
    },
  };
}

type MemoryState = {
  attempts: { form: FormName; ipHash: string; at: Date }[];
  enquiries: (NewEnquiry & { id: string; createdAt: Date })[];
  applications: (NewApplication & { id: string; createdAt: Date })[];
};

/** Process-wide in-memory store (dev / E2E only). Exposed for tests. */
export function memoryState(): MemoryState {
  const g = globalThis as { __sssMemoryStore?: MemoryState };
  g.__sssMemoryStore ??= { attempts: [], enquiries: [], applications: [] };
  return g.__sssMemoryStore;
}

export function memoryStore(state: MemoryState = memoryState()): FormStore {
  return {
    async countAttempts(form, ipHash, since) {
      return state.attempts.filter((a) => a.form === form && a.ipHash === ipHash && a.at >= since).length;
    },
    async recordAttempt(form, ipHash, at) {
      state.attempts.push({ form, ipHash, at });
    },
    async insertEnquiry(row) {
      const id = crypto.randomUUID();
      state.enquiries.push({ ...row, id, createdAt: row.createdAt ?? new Date() });
      return { id };
    },
    async insertApplication(row) {
      const id = crypto.randomUUID();
      state.applications.push({ ...row, id, createdAt: row.createdAt ?? new Date() });
      return { id };
    },
    async markNotified(table, id, error) {
      const row = state[table].find((r) => r.id === id);
      if (row) Object.assign(row, error ? { notifyError: error } : { notifiedAt: new Date(), notifyError: null });
    },
    async purge(cutoffs) {
      const before = { e: state.enquiries.length, a: state.applications.length, s: state.attempts.length };
      const expiredApps = state.applications.filter((r) => r.createdAt < cutoffs.applications);
      state.enquiries = state.enquiries.filter((r) => r.createdAt >= cutoffs.enquiries);
      state.applications = state.applications.filter((r) => r.createdAt >= cutoffs.applications);
      state.attempts = state.attempts.filter((r) => r.at >= cutoffs.attempts);
      return {
        enquiries: before.e - state.enquiries.length,
        applications: before.a - state.applications.length,
        attempts: before.s - state.attempts.length,
        resumeKeys: expiredApps.map((r) => r.resumeKey).filter((k): k is string => !!k),
      };
    },
  };
}

export function createStore(config: Backends["store"]): FormStore {
  return config.kind === "neon" ? neonStore(config.url) : memoryStore();
}
