import type { Backends } from "@/lib/config";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Server-side Turnstile check. Tokens are single-use and expire after 5 minutes. */
export async function verifyTurnstile(
  config: Backends["turnstile"],
  token: string | undefined,
  ip: string | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (config.kind === "skip") return true;
  if (!token) return false;

  const body = new FormData();
  body.append("secret", config.secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  try {
    const res = await fetchImpl(VERIFY_URL, { method: "POST", body });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
