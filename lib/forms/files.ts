export type ResumeKind = "pdf" | "doc" | "docx";

const CONTENT_TYPES: Record<ResumeKind, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/**
 * Identify a CV from its first bytes, not its name or declared type
 * (CLAUDE.md §10). PDF: "%PDF-". DOC: OLE2 compound file. DOCX: ZIP
 * container that includes "word/" parts.
 */
export function detectResume(bytes: Uint8Array): ResumeKind | null {
  const starts = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (starts([0x25, 0x50, 0x44, 0x46, 0x2d])) return "pdf";
  if (starts([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) return "doc";
  if (starts([0x50, 0x4b, 0x03, 0x04])) {
    // ZIP local-file headers store names in plain ASCII; a .docx always contains word/ parts.
    const head = bytes.subarray(0, Math.min(bytes.length, 64 * 1024));
    return containsAscii(head, "word/") || containsAscii(head, "[Content_Types].xml") ? "docx" : null;
  }
  return null;
}

function containsAscii(haystack: Uint8Array, needle: string): boolean {
  const n = [...needle].map((c) => c.charCodeAt(0));
  outer: for (let i = 0; i + n.length <= haystack.length; i++) {
    for (let j = 0; j < n.length; j++) if (haystack[i + j] !== n[j]) continue outer;
    return true;
  }
  return false;
}

export function resumeContentType(kind: ResumeKind): string {
  return CONTENT_TYPES[kind];
}

/** The declared extension must agree with the detected type. */
export function extensionMatches(name: string, kind: ResumeKind): boolean {
  const ext = name.toLowerCase().split(".").pop();
  return ext === kind;
}
