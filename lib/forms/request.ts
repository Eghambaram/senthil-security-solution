/** Client IP as seen behind Cloudflare / a proxy; undefined if unknown. */
export function getClientIp(request: Request): string | undefined {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    undefined
  );
}

/** Salted SHA-256 of the IP, so raw addresses are never stored. */
export async function hashIp(ip: string | undefined, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${ip ?? "unknown"}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
