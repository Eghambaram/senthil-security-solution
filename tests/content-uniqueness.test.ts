import { describe, expect, it } from "vitest";
import { industries } from "@/content/industries";
import { services } from "@/content/services";

/**
 * PROMPT.md §9 Phase 4 exit: no duplicate paragraphs across service pages,
 * and no page that is a title-swapped copy of another (CLAUDE.md §12).
 */

const withCopy = services.filter((s) => s.overview.length > 0);

function serviceTexts(s: (typeof services)[number]): string[] {
  return [
    s.intro,
    s.metaDescription,
    ...s.overview,
    ...s.requirements,
    ...s.capabilities.flatMap((c) => [c.title, c.body]),
    ...s.benefits.flatMap((b) => [b.title, b.body]),
    ...s.faqs.flatMap((f) => [f.question, f.answer]),
    ...(s.procedures
      ? [s.procedures.title, s.procedures.intro, ...s.procedures.groups.flatMap((g) => [g.title, ...g.items])]
      : []),
  ];
}

function industryTexts(i: (typeof industries)[number]): string[] {
  return [i.intro, i.metaDescription, ...i.challenges.flatMap((c) => [c.title, c.body]), ...i.planningPoints];
}

const normalise = (t: string) => t.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

function shingles(text: string, size = 3): Set<string> {
  const words = normalise(text).split(" ");
  const out = new Set<string>();
  for (let i = 0; i + size <= words.length; i++) out.add(words.slice(i, i + size).join(" "));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function checkGroup<T extends { slug: string }>(label: string, items: readonly T[], texts: (item: T) => string[]) {
  describe(label, () => {
    it("has no paragraph, bullet or FAQ repeated on another page", () => {
      const seen = new Map<string, string>();
      const dupes: string[] = [];
      for (const item of items) {
        for (const t of new Set(texts(item).map(normalise))) {
          const owner = seen.get(t);
          if (owner && owner !== item.slug) dupes.push(`"${t}" (${owner} & ${item.slug})`);
          seen.set(t, item.slug);
        }
      }
      expect(dupes).toEqual([]);
    });

    it("pages are not near-copies of each other (3-word shingle overlap < 15%)", () => {
      const pairs: string[] = [];
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i]!;
          const b = items[j]!;
          const score = jaccard(shingles(texts(a).join(" ")), shingles(texts(b).join(" ")));
          if (score >= 0.15) pairs.push(`${a.slug} ~ ${b.slug}: ${score.toFixed(2)}`);
        }
      }
      expect(pairs).toEqual([]);
    });
  });
}

checkGroup("service pages", withCopy, serviceTexts);
checkGroup("industry pages", industries, industryTexts);

describe("content references", () => {
  it("related services and industry services point at real slugs", () => {
    const slugs = new Set(services.map((s) => s.slug));
    const broken = [
      ...services.flatMap((s) => s.related.filter((r) => !slugs.has(r)).map((r) => `${s.slug} → ${r}`)),
      ...industries.flatMap((i) => i.services.filter((r) => !slugs.has(r)).map((r) => `${i.slug} → ${r}`)),
    ];
    expect(broken).toEqual([]);
  });

  it("every service page has 4–6 FAQs and meta descriptions ≤ 155 characters", () => {
    for (const s of withCopy) {
      expect(s.faqs.length, s.slug).toBeGreaterThanOrEqual(4);
      expect(s.faqs.length, s.slug).toBeLessThanOrEqual(6);
      expect(s.metaDescription.length, s.slug).toBeLessThanOrEqual(155);
    }
    for (const i of industries) expect(i.metaDescription.length, i.slug).toBeLessThanOrEqual(155);
  });
});
