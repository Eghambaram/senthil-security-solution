// Crockford-style alphabet without easily confused characters (0/O, 1/I/L).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Human-friendly reference, e.g. SSS-ENQ-261016-7KQ3 (date in IST). */
export function makeReference(kind: "ENQ" | "APP", now: Date = new Date()): string {
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const date = ist.toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const suffix = [...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join("");
  return `SSS-${kind}-${date}-${suffix}`;
}
