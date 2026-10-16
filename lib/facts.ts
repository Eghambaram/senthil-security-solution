export type FactStatus = "verified" | "pending" | "missing" | "conflict";

export type Gated = { status: FactStatus };

/**
 * Client review mode (NEXT_PUBLIC_REVIEW_MODE=1): a deployed preview that
 * shows pending content with its yellow badge so the client can approve it,
 * and is kept out of search engines. Never set it on the live site.
 */
export const REVIEW_MODE = process.env.NEXT_PUBLIC_REVIEW_MODE === "1";

/** Whether pending content (and its dev badge) is shown in this build. */
export const SHOW_PENDING = process.env.NODE_ENV !== "production" || REVIEW_MODE;

/**
 * Whether gated content may render. Verified always; pending only in
 * development or review mode (with a badge); missing/conflict never.
 */
export function isVisible(item: Gated): boolean {
  if (item.status === "verified") return true;
  if (item.status === "pending") return SHOW_PENDING;
  return false;
}

export function isPending(item: Gated): boolean {
  return item.status === "pending";
}

export function visible<T extends Gated>(items: readonly T[]): T[] {
  return items.filter(isVisible);
}

/** Strictly verified, in every environment (structured data, legal text). */
export function isVerified(item: Gated): boolean {
  return item.status === "verified";
}
