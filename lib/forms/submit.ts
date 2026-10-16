/**
 * Client-side form submission. Success is reported only when the server
 * answers 2xx with `{ ok: true, reference }` (CLAUDE.md §2.6); anything
 * else — network failure, non-2xx, malformed body — is an error.
 */
export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

const GENERIC_ERROR = "We couldn’t send your details just now. Please try again, or call us instead.";

export async function submitForm(url: string, body: FormData | Record<string, unknown>): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      ...(body instanceof FormData
        ? { body }
        : { body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
    });
  } catch {
    return { ok: false, message: "We couldn’t reach our server. Please check your connection and try again, or call us." };
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON body (e.g. a 404 page) — treated as a failure below.
  }

  if (response.ok && isSuccess(data)) return { ok: true, reference: data.reference };

  const err = (data ?? {}) as { error?: unknown; fieldErrors?: unknown };
  return {
    ok: false,
    message: typeof err.error === "string" && err.error ? err.error : GENERIC_ERROR,
    fieldErrors: isStringRecord(err.fieldErrors) ? err.fieldErrors : undefined,
  };
}

function isSuccess(data: unknown): data is { ok: true; reference: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { ok?: unknown }).ok === true &&
    typeof (data as { reference?: unknown }).reference === "string"
  );
}

function isStringRecord(v: unknown): v is Record<string, string> {
  return typeof v === "object" && v !== null && Object.values(v).every((x) => typeof x === "string");
}
