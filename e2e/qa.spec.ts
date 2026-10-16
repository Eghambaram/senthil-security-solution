import AxeBuilder from "@axe-core/playwright";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

/**
 * Phase 6 QA (PROMPT.md §9): every page in the sitemap is checked for
 * accessibility, metadata, structured data, layout at each breakpoint and
 * keyboard focus; every link on the site is crawled.
 */

const SITE = "https://senthilsecuritysolutions.com";
const WIDTHS = [320, 375, 768, 1024, 1440];

async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
}

test.describe("site-wide QA", () => {
  test.skip(({ isMobile }) => isMobile, "runs once; widths are covered inside the tests");
  test.describe.configure({ timeout: 300_000 });

  test("robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Disallow: /api/");
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);

    const paths = await sitemapPaths(request);
    expect(paths.length).toBeGreaterThanOrEqual(10);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) {
      expect((await request.get(path, { maxRedirects: 0 })).status(), path).toBe(200);
    }
    // Gated and dev-only routes stay out of the sitemap.
    for (const hidden of ["/styleguide", "/services/armed-ex-servicemen", "/services/event-security", "/gallery"]) {
      expect(paths, hidden).not.toContain(hidden);
    }
  });

  test("unknown URLs return a 404 page", async ({ page }) => {
    const res = await page.goto("/no-such-page");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText(/couldn’t find/);
  });

  test("metadata: unique titles and descriptions, canonical, Open Graph, JSON-LD", async ({ page, request }) => {
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();

    for (const path of await sitemapPaths(request)) {
      await page.goto(path);
      const title = await page.title();
      expect(title, path).toMatch(/ \| Senthil Security Solutions, Chennai$/);
      expect(titles.get(title), `${path} duplicates the title of ${titles.get(title)}`).toBeUndefined();
      titles.set(title, path);

      const description = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(description.length, `${path} description`).toBeGreaterThan(50);
      expect(description.length, `${path} description`).toBeLessThanOrEqual(155);
      expect(descriptions.get(description), `${path} duplicates a description`).toBeUndefined();
      descriptions.set(description, path);

      await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute("href", `${SITE}${path === "/" ? "" : path}`);
      await expect(page.locator('meta[property="og:image"]').first(), path).toHaveAttribute("content", /^https:\/\//);
      await expect(page.locator('meta[name="robots"][content*="noindex"]'), path).toHaveCount(0);
      expect(await page.locator("html").getAttribute("lang"), path).toBe("en-IN");

      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      for (const block of blocks) expect(() => JSON.parse(block), path).not.toThrow();
      if (path !== "/") expect(blocks.some((b) => b.includes('"BreadcrumbList"')), `${path} breadcrumbs`).toBe(true);
    }
  });

  test("structure: one h1, no skipped heading levels, images have alt text", async ({ page, request }) => {
    for (const path of await sitemapPaths(request)) {
      await page.goto(path);
      await expect(page.locator("h1"), path).toHaveCount(1);
      await expect(page.locator("main"), path).toHaveCount(1);

      const levels = await page.locator("main h1, main h2, main h3, main h4, main h5, main h6").evaluateAll((els) =>
        els.map((el) => Number(el.tagName[1])),
      );
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i]! - levels[i - 1]!, `${path}: h${levels[i - 1]} followed by h${levels[i]}`).toBeLessThanOrEqual(1);
      }

      expect(await page.locator("img:not([alt])").count(), `${path} images without alt`).toBe(0);
    }
  });

  test("accessibility: axe finds no violations (WCAG 2.2 A/AA)", async ({ page, request }) => {
    for (const path of await sitemapPaths(request)) {
      await page.goto(path);
      // Reveal animations start hidden; show everything so axe checks final colours.
      await page.addStyleTag({ content: "*{animation:none!important;transition:none!important} [data-reveal]{opacity:1!important;transform:none!important}" });
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const summary = violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
      expect(summary, path).toEqual([]);
    }
  });

  test("layout: no horizontal scrolling at 320, 375, 768, 1024 and 1440 px", async ({ page, request }) => {
    const paths = await sitemapPaths(request);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    }
  });

  test("links: every link resolves, anchors exist, external links are safe", async ({ page, request }) => {
    type Found = { href: string; target: string | null; rel: string | null; from: string };
    const links: Found[] = [];

    for (const path of await sitemapPaths(request)) {
      await page.goto(path);
      const found = await page.locator("a").evaluateAll((as) =>
        as.map((a) => ({ href: a.getAttribute("href") ?? "", target: a.getAttribute("target"), rel: a.getAttribute("rel") })),
      );
      links.push(...found.map((l) => ({ ...l, from: path })));
    }

    const checked = new Map<string, number>();
    const anchorCache = new Map<string, string[]>();

    async function idsOn(path: string): Promise<string[]> {
      if (!anchorCache.has(path)) {
        await page.goto(path);
        anchorCache.set(path, await page.locator("[id]").evaluateAll((els) => els.map((el) => el.id)));
      }
      return anchorCache.get(path)!;
    }

    for (const { href, target, rel, from } of links) {
      const where = `${href} (on ${from})`;
      expect(href, where).not.toBe("");
      expect(href, where).not.toBe("#");

      if (href.startsWith("tel:")) {
        expect(href, where).toMatch(/^tel:\+91\d{10}$/);
        continue;
      }
      if (href.startsWith("mailto:")) {
        expect(href, where).toMatch(/^mailto:[a-z]+@senthilsecuritysolutions\.com$/);
        continue;
      }
      if (/^https?:\/\//.test(href)) {
        expect(target, `${where} opens in a new tab`).toBe("_blank");
        expect(rel ?? "", `${where} rel`).toContain("noopener");
        expect(rel ?? "", `${where} rel`).toContain("noreferrer");
        continue;
      }

      const url = new URL(href, `http://localhost${from}`);
      if (!checked.has(url.pathname)) {
        checked.set(url.pathname, (await request.get(url.pathname)).status());
      }
      expect(checked.get(url.pathname), where).toBe(200);

      if (url.hash) {
        const ids = await idsOn(url.pathname);
        expect(ids, `${where}: missing anchor`).toContain(decodeURIComponent(url.hash.slice(1)));
      }
    }
  });

  test("external links answer (WhatsApp, Facebook, maps)", async ({ page, request }) => {
    await page.goto("/contact");
    const external = new Set(
      await page.locator('a[href^="http"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href)),
    );
    expect(external.size).toBeGreaterThan(0);
    for (const href of external) {
      // Some sites block automated requests; only a missing page counts as broken.
      const res = await request.get(href, { maxRedirects: 5, timeout: 20_000, failOnStatusCode: false }).catch(() => null);
      if (res) expect(res.status(), href).not.toBe(404);
    }
  });
});

/** The focused element must show an outline or ring. */
async function focusIsVisible(page: Page): Promise<{ ok: boolean; label: string }> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return { ok: false, label: "body" };
    const style = getComputedStyle(el);
    const ring = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2;
    const shadow = style.boxShadow !== "none";
    const rect = el.getBoundingClientRect();
    const label = `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}"`;
    return { ok: (ring || shadow) && rect.width > 0 && rect.height > 0, label };
  });
}

test.describe("keyboard", () => {
  test("skip link is first and moves focus to the main content", async ({ page }) => {
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("every tab stop shows a visible focus ring", async ({ page, isMobile }) => {
    for (const path of ["/", "/about", "/services", "/contact", "/careers", "/site-assessment"]) {
      await page.goto(path);
      const stops = isMobile ? 25 : 60;
      for (let i = 0; i < stops; i++) {
        await page.keyboard.press("Tab");
        const { ok, label } = await focusIsVisible(page);
        // Past the last link, focus moves to the browser itself: the page is done.
        if (label === "body" && i > 5) break;
        expect(ok, `${path}: tab stop ${i + 1} ${label}`).toBe(true);
      }
    }
  });

  // A native modal <dialog> makes the page inert: after its last item, focus
  // goes to the browser's own UI (document.body here), never to the page behind.
  test("mobile menu opens, keeps focus off the page behind, and closes with Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open menu" });
    await open.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate((d) => d.contains(document.activeElement) || document.activeElement === document.body);
      expect(inside, `tab ${i + 1} reached the page behind the menu`).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
  });

  test("desktop dropdowns open from the keyboard", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    const triggers = nav.locator("button[aria-expanded]");
    const count = await triggers.count();
    for (let i = 0; i < count; i++) {
      const trigger = triggers.nth(i);
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toBeFocused();
    }
  });
});
