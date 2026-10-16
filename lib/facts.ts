export type FactStatus = "verified" | "pending" | "missing" | "conflict";

export type Gated = { status: FactStatus };

/**
 * Whether gated content may render. Verified always; pending only outside
 * production (with a dev badge); missing/conflict never.
 */
export function isVisible(item: Gated): boolean {
  if (item.status === "verified") return true;
  if (item.status === "pending") return process.env.NODE_ENV !== "production";
  return false;
}

export function isPending(item: Gated): boolean {
  return item.status === "pending";
}

export function visible<T extends Gated>(items: readonly T[]): T[] {
  return items.filter(isVisible);
}
