import { AwsClient } from "aws4fetch";
import type { Backends } from "@/lib/config";

/** Private CV storage. Objects are never public; access is by presigned URL only. */
export type FileStore = {
  put(key: string, body: Uint8Array, contentType: string): Promise<void>;
  remove(key: string): Promise<void>;
  /** Time-limited download link (max 7 days for S3 SigV4). */
  signedUrl(key: string, expiresInSeconds: number): Promise<string>;
};

/** Default lifetime of the CV link sent to the careers inbox. */
export const RESUME_LINK_TTL_SECONDS = 7 * 24 * 60 * 60;

function r2Store(cfg: Extract<Backends["files"], { kind: "r2" }>): FileStore {
  const client = new AwsClient({
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
    service: "s3",
    region: "auto",
  });
  const objectUrl = (key: string) =>
    `https://${cfg.accountId}.r2.cloudflarestorage.com/${cfg.bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;

  return {
    async put(key, body, contentType) {
      const res = await client.fetch(objectUrl(key), {
        method: "PUT",
        // Copy into a plain ArrayBuffer-backed view (satisfies BodyInit typing).
        body: new Uint8Array(body),
        headers: { "Content-Type": contentType, "Content-Length": String(body.byteLength) },
      });
      if (!res.ok) throw new Error(`R2 upload failed: ${res.status}`);
    },
    async remove(key) {
      const res = await client.fetch(objectUrl(key), { method: "DELETE" });
      if (!res.ok && res.status !== 404) throw new Error(`R2 delete failed: ${res.status}`);
    },
    async signedUrl(key, expiresInSeconds) {
      const url = new URL(objectUrl(key));
      url.searchParams.set("X-Amz-Expires", String(Math.min(expiresInSeconds, 604800)));
      const signed = await client.sign(new Request(url, { method: "GET" }), { aws: { signQuery: true } });
      return signed.url;
    },
  };
}

type MemoryFiles = Map<string, { body: Uint8Array; contentType: string }>;

export function memoryFiles(): MemoryFiles {
  const g = globalThis as { __sssMemoryFiles?: MemoryFiles };
  g.__sssMemoryFiles ??= new Map();
  return g.__sssMemoryFiles;
}

export function memoryFileStore(files: MemoryFiles = memoryFiles()): FileStore {
  return {
    async put(key, body, contentType) {
      files.set(key, { body, contentType });
    },
    async remove(key) {
      files.delete(key);
    },
    async signedUrl(key) {
      return `memory://resumes/${key}`;
    },
  };
}

export function createFileStore(config: Backends["files"]): FileStore {
  return config.kind === "r2" ? r2Store(config) : memoryFileStore();
}
