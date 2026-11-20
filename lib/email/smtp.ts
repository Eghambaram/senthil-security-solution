/**
 * Minimal SMTP client for sending form notifications through the company's
 * own mailbox (e.g. info@senthilsecuritysolutions.com at its mail host), with
 * no third-party email service.
 *
 * Runs on Cloudflare Workers (TCP via `cloudflare:sockets`) and on Node
 * (`node:net` / `node:tls`), so `pnpm dev`, `next start` and the deployed
 * Worker all send the same way. Supports implicit TLS (port 465) and
 * STARTTLS (port 587); Cloudflare blocks outbound port 25.
 *
 * Self-contained (no path-alias imports) so `scripts/send-test-email.mjs`
 * can load it directly with Node's type stripping.
 */

export type SmtpSecurity = "tls" | "starttls" | "none";

export type SmtpConfig = {
  host: string;
  port: number;
  /** "tls" = implicit TLS (465), "starttls" = upgrade after connect (587), "none" = plain (local test servers only). */
  secure: SmtpSecurity;
  user?: string;
  pass?: string;
  /** Name sent with EHLO; defaults to the sender's domain. */
  clientName?: string;
  /** Whole-conversation timeout. */
  timeoutMs?: number;
};

export type SmtpAttachment = { filename: string; contentType: string; content: Uint8Array };

export type SmtpMessage = {
  from: { name?: string; address: string };
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  attachments?: SmtpAttachment[];
  date?: Date;
};

export type SmtpResult = { ok: true; messageId: string } | { ok: false; error: string };

export class SmtpError extends Error {
  readonly code: number | undefined;
  constructor(message: string, code?: number) {
    super(message);
    this.name = "SmtpError";
    this.code = code;
  }
}

/* ------------------------------------------------------------------ */
/* Transport: one small interface over Workers and Node sockets        */
/* ------------------------------------------------------------------ */

type Conn = {
  write(data: Uint8Array): Promise<void>;
  /** Next chunk from the server; null when the connection has closed. */
  read(): Promise<Uint8Array | null>;
  startTls(): Promise<Conn>;
  close(): void;
};

const isWorkers = () => typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

type WorkersSocket = {
  opened: Promise<unknown>;
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  startTls(options?: { expectedServerHostname?: string }): WorkersSocket;
  close(): Promise<void>;
};

async function workersConnect(cfg: SmtpConfig): Promise<Conn> {
  // Left to the Workers runtime: bundlers must not try to resolve it.
  const { connect } = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ "cloudflare:sockets")) as {
    connect(address: { hostname: string; port: number }, options: { secureTransport: "on" | "off" | "starttls"; allowHalfOpen: boolean }): WorkersSocket;
  };
  const secureTransport = cfg.secure === "tls" ? "on" : cfg.secure === "starttls" ? "starttls" : "off";
  const socket = connect({ hostname: cfg.host, port: cfg.port }, { secureTransport, allowHalfOpen: false });
  await socket.opened;

  const wrap = (s: WorkersSocket): Conn => {
    const reader = s.readable.getReader();
    const writer = s.writable.getWriter();
    return {
      write: (data) => writer.write(data),
      async read() {
        const { value, done } = await reader.read();
        return done ? null : (value ?? new Uint8Array());
      },
      async startTls() {
        reader.releaseLock();
        writer.releaseLock();
        return wrap(s.startTls({ expectedServerHostname: cfg.host }));
      },
      close() {
        s.close().catch(() => undefined);
      },
    };
  };
  return wrap(socket);
}

async function nodeConnect(cfg: SmtpConfig): Promise<Conn> {
  const net = await import("node:net");
  const tls = await import("node:tls");
  type Socket = import("node:net").Socket;

  const wrap = (socket: Socket): Conn => {
    const queue: Uint8Array[] = [];
    let waiting: { resolve: (v: Uint8Array | null) => void; reject: (e: Error) => void } | null = null;
    let closed = false;
    let failure: Error | null = null;

    const onData = (chunk: Buffer) => {
      const bytes = new Uint8Array(chunk);
      if (waiting) {
        const w = waiting;
        waiting = null;
        w.resolve(bytes);
      } else queue.push(bytes);
    };
    const onEnd = () => {
      closed = true;
      waiting?.resolve(null);
      waiting = null;
    };
    const onError = (err: Error) => {
      failure = err;
      waiting?.reject(err);
      waiting = null;
    };
    socket.on("data", onData);
    socket.on("end", onEnd);
    socket.on("close", onEnd);
    socket.on("error", onError);
    const detach = () => {
      socket.off("data", onData);
      socket.off("end", onEnd);
      socket.off("close", onEnd);
      socket.off("error", onError);
    };

    return {
      write: (data) =>
        new Promise<void>((resolve, reject) => socket.write(data, (err) => (err ? reject(err) : resolve()))),
      read() {
        if (queue.length) return Promise.resolve(queue.shift()!);
        if (failure) return Promise.reject(failure);
        if (closed) return Promise.resolve(null);
        return new Promise((resolve, reject) => (waiting = { resolve, reject }));
      },
      startTls() {
        detach();
        return new Promise<Conn>((resolve, reject) => {
          const secure = tls.connect({ socket, servername: cfg.host }, () => resolve(wrap(secure)));
          secure.once("error", reject);
        });
      },
      close() {
        socket.destroy();
      },
    };
  };

  return new Promise<Conn>((resolve, reject) => {
    const socket: Socket =
      cfg.secure === "tls"
        ? tls.connect({ host: cfg.host, port: cfg.port, servername: cfg.host }, () => resolve(wrap(socket)))
        : net.connect({ host: cfg.host, port: cfg.port }, () => resolve(wrap(socket)));
    socket.once("error", reject);
  });
}

/* ------------------------------------------------------------------ */
/* Protocol                                                            */
/* ------------------------------------------------------------------ */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

type Reply = { code: number; lines: string[] };

class Session {
  private buffer = "";
  private conn: Conn;

  constructor(conn: Conn) {
    this.conn = conn;
  }

  async reply(): Promise<Reply> {
    for (;;) {
      const lines = this.buffer.split("\r\n");
      // A reply ends with a line "NNN text" (space after the code).
      const end = lines.findIndex((l) => /^\d{3}(?: |$)/.test(l));
      if (end !== -1 && end < lines.length - 1) {
        const replyLines = lines.slice(0, end + 1);
        this.buffer = lines.slice(end + 1).join("\r\n");
        return { code: Number(replyLines[end]!.slice(0, 3)), lines: replyLines.map((l) => l.slice(4)) };
      }
      const chunk = await this.conn.read();
      if (chunk === null) throw new SmtpError("The mail server closed the connection unexpectedly.");
      this.buffer += decoder.decode(chunk, { stream: true });
    }
  }

  async expect(codes: number[], step: string): Promise<Reply> {
    const r = await this.reply();
    if (!codes.includes(r.code)) {
      throw new SmtpError(`${step} failed: ${r.code} ${r.lines.join(" ").slice(0, 200)}`, r.code);
    }
    return r;
  }

  async command(line: string, codes: number[], step = line.split(" ")[0]!): Promise<Reply> {
    await this.conn.write(encoder.encode(`${line}\r\n`));
    return this.expect(codes, step);
  }

  async send(data: Uint8Array): Promise<void> {
    await this.conn.write(data);
  }

  async upgrade(): Promise<void> {
    this.conn = await this.conn.startTls();
    this.buffer = "";
  }

  close(): void {
    this.conn.close();
  }
}

function capabilities(r: Reply): Set<string> {
  return new Set(r.lines.slice(1).map((l) => l.toUpperCase()));
}

function authMechanisms(caps: Set<string>): string[] {
  for (const c of caps) {
    const m = /^AUTH[ =](.*)$/.exec(c);
    if (m) return m[1]!.split(/\s+/);
  }
  return [];
}

const b64 = (s: string) => base64(encoder.encode(s));

async function login(session: Session, caps: Set<string>, user: string, pass: string): Promise<void> {
  const mechanisms = authMechanisms(caps);
  if (mechanisms.includes("PLAIN")) {
    await session.command(`AUTH PLAIN ${b64(`\0${user}\0${pass}`)}`, [235], "Login");
  } else if (mechanisms.includes("LOGIN")) {
    await session.command("AUTH LOGIN", [334], "Login");
    await session.command(b64(user), [334], "Login");
    await session.command(b64(pass), [235], "Login");
  } else {
    throw new SmtpError(`The mail server offers no supported login method (${mechanisms.join(", ") || "none"}).`);
  }
}

function domainOf(address: string): string {
  return address.split("@")[1] ?? "localhost";
}

async function withTimeout<T>(ms: number, work: (session: () => Session | undefined) => Promise<T>, open: () => Promise<Session>): Promise<T> {
  let session: Session | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      session?.close();
      reject(new SmtpError(`The mail server did not respond within ${Math.round(ms / 1000)} s.`));
    }, ms);
  });
  try {
    return await Promise.race([
      (async () => {
        session = await open();
        return work(() => session);
      })(),
      timeout,
    ]);
  } finally {
    clearTimeout(timer);
    session?.close();
  }
}

/** Connects, says hello, upgrades to TLS if asked, and logs in. */
async function handshake(cfg: SmtpConfig, clientName: string): Promise<Session> {
  const session = new Session(await (isWorkers() ? workersConnect(cfg) : nodeConnect(cfg)));
  try {
    await session.expect([220], "Connect");
    let caps = capabilities(await session.command(`EHLO ${clientName}`, [250], "EHLO"));
    if (cfg.secure === "starttls") {
      if (!caps.has("STARTTLS")) throw new SmtpError("The mail server does not offer STARTTLS on this port.");
      await session.command("STARTTLS", [220]);
      await session.upgrade();
      caps = capabilities(await session.command(`EHLO ${clientName}`, [250], "EHLO"));
    }
    if (cfg.user && cfg.pass) await login(session, caps, cfg.user, cfg.pass);
    return session;
  } catch (err) {
    session.close();
    throw err;
  }
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Sends one message. Resolves (never throws) with the outcome. */
export async function sendMail(cfg: SmtpConfig, message: SmtpMessage): Promise<SmtpResult> {
  const clientName = cfg.clientName ?? domainOf(message.from.address);
  const messageId = `<${crypto.randomUUID()}@${domainOf(message.from.address)}>`;
  const data = dotStuff(buildMessage(message, messageId));
  try {
    await withTimeout(
      cfg.timeoutMs ?? 20_000,
      async (current) => {
        const session = current()!;
        await session.command(`MAIL FROM:<${clean(message.from.address)}>`, [250], "Sender");
        for (const to of message.to) await session.command(`RCPT TO:<${clean(to)}>`, [250, 251], "Recipient");
        await session.command("DATA", [354]);
        await session.send(encoder.encode(`${data}\r\n.\r\n`));
        await session.expect([250], "Message");
        await session.command("QUIT", [221]).catch(() => undefined);
      },
      () => handshake(cfg, clientName),
    );
    return { ok: true, messageId };
  } catch (err) {
    return { ok: false, error: `SMTP ${cfg.host}:${cfg.port}: ${errorText(err)}` };
  }
}

/** Checks the connection and login without sending anything. */
export async function verifySmtp(cfg: SmtpConfig, clientName = "localhost"): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await withTimeout(
      cfg.timeoutMs ?? 20_000,
      async (current) => {
        await current()!.command("QUIT", [221]).catch(() => undefined);
      },
      () => handshake(cfg, clientName),
    );
    return { ok: true };
  } catch (err) {
    return { ok: false, error: `SMTP ${cfg.host}:${cfg.port}: ${errorText(err)}` };
  }
}

/* ------------------------------------------------------------------ */
/* MIME                                                                */
/* ------------------------------------------------------------------ */

/** Header values must never carry line breaks (header injection). */
function clean(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function base64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function wrap76(s: string): string {
  return s.replace(/.{1,76}/g, "$&\r\n").replace(/\r\n$/, "");
}

/** RFC 2047 encoded words, split on character boundaries, each ≤ 75 chars. */
export function encodeHeader(value: string): string {
  const v = clean(value);
  if (/^[\x20-\x7e]*$/.test(v) && v.length <= 70) return v;
  const words: string[] = [];
  let chunk = "";
  for (const ch of v) {
    if (encoder.encode(chunk + ch).length > 45) {
      words.push(chunk);
      chunk = "";
    }
    chunk += ch;
  }
  if (chunk) words.push(chunk);
  return words.map((w) => `=?UTF-8?B?${b64(w)}?=`).join("\r\n ");
}

function mailbox(name: string | undefined, address: string): string {
  const addr = clean(address);
  if (!name) return addr;
  const n = clean(name);
  return /^[\x20-\x7e]*$/.test(n) ? `"${n.replace(/["\\]/g, "\\$&")}" <${addr}>` : `${encodeHeader(n)} <${addr}>`;
}

function attachmentHeaders(a: SmtpAttachment): string {
  const name = clean(a.filename).replace(/["\\]/g, "");
  const ascii = name.replace(/[^\x20-\x7e]/g, "_");
  const extended = encodeURIComponent(name).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  return [
    `Content-Type: ${clean(a.contentType)}; name="${ascii}"`,
    `Content-Disposition: attachment; filename="${ascii}"; filename*=UTF-8''${extended}`,
    "Content-Transfer-Encoding: base64",
  ].join("\r\n");
}

function textPart(type: "plain" | "html", body: string): string {
  const normalised = body.replace(/\r?\n/g, "\r\n");
  return [`Content-Type: text/${type}; charset=utf-8`, "Content-Transfer-Encoding: base64", "", wrap76(b64(normalised))].join("\r\n");
}

/** Builds the RFC 5322 message (CRLF line endings, base64 bodies). */
export function buildMessage(m: SmtpMessage, messageId: string): string {
  const boundary = (tag: string) => `----=_sss_${tag}_${crypto.randomUUID().replace(/-/g, "")}`;
  const alt = boundary("alt");
  const alternative = [
    `--${alt}`,
    textPart("plain", m.text),
    `--${alt}`,
    textPart("html", m.html),
    `--${alt}--`,
  ].join("\r\n");

  const headers = [
    `From: ${mailbox(m.from.name, m.from.address)}`,
    `To: ${m.to.map((t) => clean(t)).join(", ")}`,
    ...(m.replyTo ? [`Reply-To: ${clean(m.replyTo)}`] : []),
    `Subject: ${encodeHeader(m.subject)}`,
    `Date: ${(m.date ?? new Date()).toUTCString()}`,
    `Message-ID: ${messageId}`,
    "MIME-Version: 1.0",
  ];

  if (!m.attachments?.length) {
    return [...headers, `Content-Type: multipart/alternative; boundary="${alt}"`, "", alternative].join("\r\n");
  }

  const mixed = boundary("mixed");
  const parts = [
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alt}"`,
    "",
    alternative,
    ...m.attachments.flatMap((a) => [`--${mixed}`, attachmentHeaders(a), "", wrap76(base64(a.content))]),
    `--${mixed}--`,
  ];
  return [...headers, `Content-Type: multipart/mixed; boundary="${mixed}"`, "", ...parts].join("\r\n");
}

/** SMTP transparency: a line starting with "." gets an extra "." (RFC 5321 §4.5.2). */
export function dotStuff(message: string): string {
  return message.replace(/^\./, "..").replace(/\r\n\./g, "\r\n..");
}
