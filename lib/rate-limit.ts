import type { FormName, FormStore } from "@/lib/db/store";

export const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } as const;

/**
 * Postgres-backed limit: 5 attempts per 10 minutes per hashed IP per form
 * (CLAUDE.md §5). Every attempt is recorded, including rejected ones, so
 * retries after a failed security check also count.
 */
export async function checkRateLimit(store: FormStore, form: FormName, ipHash: string, now: Date): Promise<boolean> {
  const since = new Date(now.getTime() - RATE_LIMIT.windowMs);
  const recent = await store.countAttempts(form, ipHash, since);
  if (recent >= RATE_LIMIT.max) return false;
  await store.recordAttempt(form, ipHash, now);
  return true;
}
