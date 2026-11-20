import net from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { buildMessage, dotStuff, encodeHeader, sendMail, verifySmtp, type SmtpMessage } from "@/lib/email/smtp";

/**
 * A scripted SMTP server on localhost. Plain text only (secure: "none"),
 * which the client allows for local test servers; TLS is the same protocol
 * over an encrypted socket.
 */
type Script = {
  ehlo?: string[];
  auth?: (line: string) => string;
  onData?: (message: string) => string;
  dropAfter?: string;
  silent?: boolean;
};

type Server = { port: number; commands: string[]; messages: string[]; close: () => Promise<void> };

const servers: Server[] = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map((s) => s.close()));
});

async function fakeServer(script: Script = {}): Promise<Server> {
  const commands: string[] = [];
  const messages: string[] = [];
  const sockets = new Set<net.Socket>();

  const server = net.createServer((socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    if (script.silent) return;
    let buffer = "";
    let inData = false;
    let loginStep = 0;
    socket.write("220 test.local ESMTP ready\r\n");

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      for (;;) {
        if (inData) {
          const end = buffer.indexOf("\r\n.\r\n");
          if (end === -1) return;
          const message = buffer.slice(0, end);
          buffer = buffer.slice(end + 5);
          inData = false;
          messages.push(message);
          socket.write(script.onData?.(message) ?? "250 2.0.0 queued as TEST1\r\n");
          continue;
        }
        const nl = buffer.indexOf("\r\n");
        if (nl === -1) return;
        const line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 2);
        commands.push(line);
        const verb = line.split(" ")[0]!.toUpperCase();
        if (script.dropAfter && verb === script.dropAfter) {
          socket.destroy();
          return;
        }
        if (loginStep === 1) {
          loginStep = 2;
          socket.write("334 UGFzc3dvcmQ6\r\n");
        } else if (loginStep === 2) {
          loginStep = 0;
          socket.write(script.auth?.(line) ?? "235 2.7.0 Authentication successful\r\n");
        } else if (verb === "EHLO") {
          const caps = script.ehlo ?? ["AUTH PLAIN LOGIN", "SIZE 35882577"];
          socket.write(["250-test.local", ...caps.slice(0, -1).map((c) => `250-${c}`), `250 ${caps.at(-1)}`].join("\r\n") + "\r\n");
        } else if (verb === "AUTH" && line.toUpperCase() === "AUTH LOGIN") {
          loginStep = 1;
          socket.write("334 VXNlcm5hbWU6\r\n");
        } else if (verb === "AUTH") {
          socket.write(script.auth?.(line) ?? "235 2.7.0 Authentication successful\r\n");
        } else if (verb === "MAIL" || verb === "RCPT") {
          socket.write("250 2.1.0 OK\r\n");
        } else if (verb === "DATA") {
          inData = true;
          socket.write("354 End data with <CR><LF>.<CR><LF>\r\n");
        } else if (verb === "QUIT") {
          socket.end("221 2.0.0 Bye\r\n");
        } else {
          socket.write("502 5.5.2 Command not recognised\r\n");
        }
      }
    });
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as net.AddressInfo).port;
  const s: Server = {
    port,
    commands,
    messages,
    close: () =>
      new Promise<void>((resolve) => {
        for (const socket of sockets) socket.destroy();
        server.close(() => resolve());
      }),
  };
  servers.push(s);
  return s;
}

const config = (port: number, extra = {}) => ({
  host: "127.0.0.1",
  port,
  secure: "none" as const,
  user: "info@senthilsecuritysolutions.com",
  pass: "s3cret-Pass",
  timeoutMs: 3000,
  ...extra,
});

const message: SmtpMessage = {
  from: { name: "Senthil Security Solutions Website", address: "info@senthilsecuritysolutions.com" },
  to: ["ops@senthilsecuritysolutions.com", "md@senthilsecuritysolutions.com"],
  replyTo: "priya@example.com",
  subject: "New site assessment request: Priya Raman (SSS-ENQ-261120-ABCD)",
  text: "Reference: SSS-ENQ-261120-ABCD\n.hidden line starting with a dot",
  html: "<p>Reference: <b>SSS-ENQ-261120-ABCD</b></p>",
};

function decodeParts(raw: string): string[] {
  // Every body part is base64; decode each block that follows a blank line.
  return raw
    .split(/\r\n--/)
    .map((part) => part.split("\r\n\r\n")[1] ?? "")
    .filter((b) => /^[A-Za-z0-9+/=\r\n]+$/.test(b.trim()) && b.trim().length > 0)
    .map((b) => Buffer.from(b.replace(/\r\n/g, ""), "base64").toString("utf8"));
}

describe("SMTP client", () => {
  it("logs in with AUTH PLAIN and delivers to every recipient", async () => {
    const server = await fakeServer();
    const result = await sendMail(config(server.port), message);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.messageId).toMatch(/^<[0-9a-f-]{36}@senthilsecuritysolutions\.com>$/);

    const auth = server.commands.find((c) => c.startsWith("AUTH PLAIN "))!;
    expect(Buffer.from(auth.slice(11), "base64").toString()).toBe("\0info@senthilsecuritysolutions.com\0s3cret-Pass");
    expect(server.commands).toContain("EHLO senthilsecuritysolutions.com");
    expect(server.commands).toContain("MAIL FROM:<info@senthilsecuritysolutions.com>");
    expect(server.commands).toContain("RCPT TO:<ops@senthilsecuritysolutions.com>");
    expect(server.commands).toContain("RCPT TO:<md@senthilsecuritysolutions.com>");
    expect(server.commands.at(-1)).toBe("QUIT");

    const raw = server.messages[0]!;
    expect(raw).toContain('From: "Senthil Security Solutions Website" <info@senthilsecuritysolutions.com>');
    expect(raw).toContain("Reply-To: priya@example.com");
    expect(raw).toContain("Content-Type: multipart/alternative");
    const [text, html] = decodeParts(raw);
    expect(text).toBe("Reference: SSS-ENQ-261120-ABCD\r\n.hidden line starting with a dot");
    expect(html).toBe(message.html);
  });

  it("falls back to AUTH LOGIN when PLAIN is not offered", async () => {
    const server = await fakeServer({ ehlo: ["AUTH LOGIN"] });
    expect((await sendMail(config(server.port), message)).ok).toBe(true);
    const i = server.commands.indexOf("AUTH LOGIN");
    expect(Buffer.from(server.commands[i + 1]!, "base64").toString()).toBe("info@senthilsecuritysolutions.com");
    expect(Buffer.from(server.commands[i + 2]!, "base64").toString()).toBe("s3cret-Pass");
  });

  it("attaches files as base64 MIME parts with safe file names", async () => {
    const server = await fakeServer();
    const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, ...new Array(3000).fill(0x41)]);
    const result = await sendMail(config(server.port), {
      ...message,
      attachments: [{ filename: 'முருகன் "CV".pdf', contentType: "application/pdf", content: pdf }],
    });
    expect(result.ok).toBe(true);

    const raw = server.messages[0]!;
    expect(raw).toContain("Content-Type: multipart/mixed");
    expect(raw).toContain('Content-Disposition: attachment; filename="');
    expect(raw).toContain("filename*=UTF-8''%E0%AE%AE");
    const block = raw.split('filename*=UTF-8')[1]!.split("\r\n\r\n")[1]!.split("\r\n--")[0]!;
    expect(block.split("\r\n").every((l) => l.length <= 76)).toBe(true);
    expect(new Uint8Array(Buffer.from(block.replace(/\r\n/g, ""), "base64"))).toEqual(pdf);
  });

  it("reports a rejected login without revealing the password", async () => {
    const server = await fakeServer({ auth: () => "535 5.7.8 Username and Password not accepted\r\n" });
    const result = await sendMail(config(server.port), message);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Login failed: 535");
      expect(result.error).not.toContain("s3cret-Pass");
    }
    expect(server.messages).toHaveLength(0);
  });

  it("reports a message the server refuses", async () => {
    const server = await fakeServer({ onData: () => "554 5.7.1 Message rejected as spam\r\n" });
    const result = await sendMail(config(server.port), message);
    expect(result).toMatchObject({ ok: false });
    if (!result.ok) expect(result.error).toContain("Message failed: 554");
  });

  it("reports a dropped connection", async () => {
    const server = await fakeServer({ dropAfter: "DATA" });
    const result = await sendMail(config(server.port), message);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/closed the connection|ECONNRESET|EPIPE/);
  });

  it("gives up when the server never answers", async () => {
    const server = await fakeServer({ silent: true });
    const result = await sendMail(config(server.port, { timeoutMs: 300 }), message);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("did not respond");
  });

  it("refuses to continue in plain text when STARTTLS is required but not offered", async () => {
    const server = await fakeServer({ ehlo: ["AUTH PLAIN"] });
    const result = await sendMail(config(server.port, { secure: "starttls" }), message);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("does not offer STARTTLS");
    expect(server.commands.some((c) => c.startsWith("AUTH"))).toBe(false);
  });

  it("reports a server that cannot be reached", async () => {
    const server = await fakeServer();
    await server.close();
    const result = await sendMail(config(server.port), message);
    expect(result.ok).toBe(false);
  });

  it("verifies the connection and login without sending", async () => {
    const server = await fakeServer();
    expect(await verifySmtp(config(server.port))).toEqual({ ok: true });
    expect(server.commands.some((c) => c.startsWith("MAIL"))).toBe(false);
    expect(server.messages).toHaveLength(0);
  });
});

describe("MIME", () => {
  it("strips line breaks from headers (no header injection)", () => {
    const raw = buildMessage({ ...message, subject: "Hello\r\nBcc: victim@example.com", replyTo: "a@b.com\r\nBcc: x@y.com" }, "<id@x>");
    const headerBlock = raw.split("\r\n\r\n")[0]!;
    expect(headerBlock.split("\r\n").some((l) => l.startsWith("Bcc:"))).toBe(false);
  });

  it("encodes non-ASCII subjects as UTF-8 encoded words", () => {
    const encoded = encodeHeader("புதிய விண்ணப்பம்: முருகன்");
    const words = encoded.split("\r\n ");
    expect(words.every((w) => /^=\?UTF-8\?B\?[A-Za-z0-9+/=]+\?=$/.test(w) && w.length <= 75)).toBe(true);
    const decoded = words.map((w) => Buffer.from(w.slice(10, -2), "base64").toString("utf8")).join("");
    expect(decoded).toBe("புதிய விண்ணப்பம்: முருகன்");
  });

  it("dot-stuffs lines that start with a dot", () => {
    expect(dotStuff(".a\r\n.b\r\nc")).toBe("..a\r\n..b\r\nc");
  });
});
