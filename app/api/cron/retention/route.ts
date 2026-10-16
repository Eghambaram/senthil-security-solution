import { ConfigError, getBackends } from "@/lib/config";
import { createStore } from "@/lib/db/store";
import { purgeExpired } from "@/lib/retention";
import { createFileStore } from "@/lib/storage";

/**
 * Data-retention job. Call daily with `Authorization: Bearer <CRON_SECRET>`
 * (scheduled in Phase 7). Without CRON_SECRET configured it is disabled.
 */
export async function POST(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }
  try {
    const backends = getBackends();
    const result = await purgeExpired(createStore(backends.store), createFileStore(backends.files));
    return Response.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof ConfigError) return Response.json({ ok: false, error: err.message }, { status: 503 });
    throw err;
  }
}
