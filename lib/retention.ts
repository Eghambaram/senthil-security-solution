import type { FormStore } from "@/lib/db/store";
import type { FileStore } from "@/lib/storage";

/** Default retention pending client policy (CLAUDE.md §10). */
export const RETENTION = { enquiryMonths: 12, applicationMonths: 6, attemptsHours: 24 } as const;

function monthsAgo(now: Date, months: number): Date {
  const d = new Date(now);
  d.setUTCMonth(d.getUTCMonth() - months);
  return d;
}

/** Delete expired enquiries, applications (and their CVs) and rate-limit rows. */
export async function purgeExpired(store: FormStore, files: FileStore, now: Date = new Date()) {
  const result = await store.purge({
    enquiries: monthsAgo(now, RETENTION.enquiryMonths),
    applications: monthsAgo(now, RETENTION.applicationMonths),
    attempts: new Date(now.getTime() - RETENTION.attemptsHours * 60 * 60 * 1000),
  });
  let filesDeleted = 0;
  for (const key of result.resumeKeys) {
    try {
      await files.remove(key);
      filesDeleted++;
    } catch (err) {
      console.error("retention: failed to delete", key, err);
    }
  }
  return { enquiries: result.enquiries, applications: result.applications, attempts: result.attempts, filesDeleted };
}
