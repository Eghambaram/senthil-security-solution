import { expect, test } from "@playwright/test";

const LEGACY: [string, string][] = [
  ["/index.php", "/"],
  ["/aboutus.php", "/about"],
  ["/company.php", "/about"],
  ["/service.php", "/services"],
  ["/projects.php", "/industries"],
  ["/contact_us.php", "/contact"],
];

test("legacy PHP URLs redirect with 301", async ({ request }) => {
  for (const [from, to] of LEGACY) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(new URL(res.headers()["location"]!, "http://x").pathname, from).toBe(to);
  }
});

test("main pages load with one h1 and a canonical URL", async ({ page }) => {
  for (const path of ["/", "/about", "/services", "/industries", "/careers", "/contact", "/site-assessment", "/privacy-policy", "/terms"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute("href", /^https:\/\/senthilsecuritysolutions\.com/);
  }
});

test("unconfirmed service pages are not published", async ({ request }) => {
  expect((await request.get("/services/industrial-security")).status()).toBe(404);
  expect((await request.get("/services/armed-ex-servicemen")).status()).toBe(404);
  expect((await request.get("/styleguide")).status()).toBe(404);
});

test("the header navigation reaches inner pages", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
    await page.getByRole("dialog").getByRole("link", { name: "Careers" }).click();
  } else {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Careers" }).click();
  }
  await expect(page).toHaveURL(/\/careers$/);
  await expect(page.locator("h1")).toContainText("security team");
});

test("mobile action bar hides while a form is on screen", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/careers");
  const bar = page.getByRole("navigation", { name: "Quick contact" });
  await expect(bar).toBeInViewport();
  await page.locator("#career-fullName").scrollIntoViewIfNeeded();
  await expect(bar).not.toBeInViewport();
});

test("no horizontal scrolling", async ({ page }) => {
  for (const path of ["/", "/careers", "/site-assessment"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow, path).toBe(false);
  }
});
