import { expect, test, type Page } from "@playwright/test";

/** Forms reject submissions made in under 3 s (bot check), so give the clock time to pass. */
async function waitForHumanTiming(page: Page) {
  await page.waitForTimeout(3100);
}

const formAlert = (page: Page) => page.locator('form [role="alert"]');

test.describe("site assessment form", () => {
  test("shows field errors on an empty submit and focuses the summary", async ({ page }) => {
    await page.goto("/site-assessment");
    await page.getByRole("button", { name: "Request a Site Assessment" }).last().click();
    await expect(formAlert(page)).toBeVisible();
    await expect(formAlert(page).locator("li")).toHaveCount(7);
    await expect(formAlert(page)).toBeFocused();
    await expect(page.locator('[aria-invalid="true"]')).toHaveCount(7);
  });

  test("submits and shows a reference, saying plainly that a preview did not send", async ({ page }) => {
    await page.goto("/site-assessment");
    await page.getByLabel("Full name").fill("Priya Raman");
    await page.getByLabel("Organisation").fill("Raman Textiles");
    await page.getByLabel("Phone").fill("98765 43210");
    await page.getByLabel("Email").fill("priya@example.com");
    await page.getByLabel("Service required").selectOption("Industrial Security");
    await page.getByLabel("Type of premises").selectOption("Factory");
    await page.getByLabel("Site location").fill("Guindy, Chennai");
    await page.locator("#enq-assessment-consent").check();
    await waitForHumanTiming(page);
    await page.getByRole("button", { name: "Request a Site Assessment" }).last().click();

    // E2E runs on in-memory backends, so the panel must say nothing was sent.
    const success = page.getByRole("status");
    await expect(success).toContainText("not sent");
    await expect(success).toContainText(/SSS-ENQ-\d{6}-[2-9A-Z]{4}/);
  });

  test("submitting too fast is rejected honestly", async ({ page }) => {
    await page.goto("/site-assessment");
    await page.getByLabel("Full name").fill("Fast Bot");
    await page.getByLabel("Phone").fill("9876543210");
    await page.getByLabel("Email").fill("bot@example.com");
    await page.getByLabel("Service required").selectOption("Not sure / need advice");
    await page.getByLabel("Type of premises").selectOption("Office");
    await page.getByLabel("Site location").fill("Chennai");
    await page.locator("#enq-assessment-consent").check();
    await page.getByRole("button", { name: "Request a Site Assessment" }).last().click();
    await expect(formAlert(page)).toContainText("very quick");
    await expect(page.getByRole("status")).toHaveCount(0);
  });
});

test.describe("contact form", () => {
  test("a server failure shows an error with the phone number and keeps the input", async ({ page }) => {
    await page.route("**/api/enquiry", (route) =>
      route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false }) }),
    );
    await page.goto("/contact");
    await page.getByLabel("Full name").fill("Arun K");
    await page.getByLabel("Phone").fill("044 4380 6837");
    await page.getByLabel("Email").fill("arun@example.com");
    await page.getByLabel("How can we help?").fill("Need two guards for our office in Guindy.");
    await page.locator("#enq-contact-consent").check();
    await waitForHumanTiming(page);
    await page.getByRole("button", { name: "Send Enquiry" }).click();

    await expect(formAlert(page)).toContainText("couldn’t send your details");
    await expect(formAlert(page).getByRole("link", { name: /\+91 44 4380 6837/ })).toHaveAttribute("href", "tel:+914443806837");
    await expect(page.getByLabel("Full name")).toHaveValue("Arun K");
    await expect(page.getByText("Your reference")).toHaveCount(0);
  });

  test("a network failure is reported, not hidden", async ({ page }) => {
    await page.route("**/api/enquiry", (route) => route.abort("failed"));
    await page.goto("/contact");
    await page.getByLabel("Full name").fill("Arun K");
    await page.getByLabel("Phone").fill("9876543210");
    await page.getByLabel("Email").fill("arun@example.com");
    await page.getByLabel("How can we help?").fill("Please call me back about security.");
    await page.locator("#enq-contact-consent").check();
    await waitForHumanTiming(page);
    await page.getByRole("button", { name: "Send Enquiry" }).click();
    await expect(formAlert(page)).toContainText("couldn’t reach our server");
  });
});

const PDF = Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(512, 0x20)]);

async function fillApplication(page: Page) {
  await page.goto("/careers");
  await page.getByLabel("Full name").fill("Murugan S");
  await page.getByLabel("Phone").fill("9876543210");
  await page.getByLabel("Where do you live?").fill("Tambaram");
  await page.getByLabel("Preferred role").selectOption("security-guard");
  await page.getByLabel("Security experience").selectOption("3–5 years");
  await page.getByLabel("Yes", { exact: true }).check();
  await page.getByLabel("Where did you serve?").selectOption("Army");
  await page.locator("#career-consent").check();
}

test.describe("careers form", () => {
  test("submits an application with a CV", async ({ page }) => {
    await fillApplication(page);
    await page.locator("#career-resume").setInputFiles({ name: "Murugan CV.pdf", mimeType: "application/pdf", buffer: PDF });
    await expect(page.getByText("Murugan CV.pdf")).toBeVisible();
    await waitForHumanTiming(page);
    await page.getByRole("button", { name: "Submit Application" }).click();
    await expect(page.getByRole("status")).toContainText(/SSS-APP-\d{6}-[2-9A-Z]{4}/);
    await expect(page.getByRole("status")).toContainText("not sent");
  });

  test("rejects a disguised file on the server and explains why", async ({ page }) => {
    await fillApplication(page);
    await page.locator("#career-resume").setInputFiles({
      name: "cv.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("MZ this is not a pdf"),
    });
    await waitForHumanTiming(page);
    await page.getByRole("button", { name: "Submit Application" }).click();
    await expect(formAlert(page)).toContainText("doesn’t look like a PDF, DOC or DOCX");
    await expect(page.getByRole("status")).toHaveCount(0);
  });

  test("rejects an oversized CV before upload", async ({ page }) => {
    await fillApplication(page);
    await page.locator("#career-resume").setInputFiles({
      name: "big.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.concat([PDF, Buffer.alloc(5 * 1024 * 1024)]),
    });
    await expect(page.getByText("Please upload a file smaller than 5 MB.")).toBeVisible();
  });
});
