import { defineConfig, devices } from "@playwright/test";

const PORT = 3300;

/**
 * E2E runs against a production build with in-memory stand-ins for the
 * database, email, storage and Turnstile (E2E_FAKE_BACKENDS=1), so success
 * and failure paths can be tested without real accounts.
 * Locally it uses the installed Microsoft Edge; in CI, Playwright's Chromium.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.CI ? undefined : "msedge",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: false,
    // Blank values win over .env.local (Next never overrides a variable that is
    // already set), so a developer's real mail/DB/storage settings are never
    // used by the tests and the build gets the production site URL.
    env: {
      E2E_FAKE_BACKENDS: "1",
      NEXT_PUBLIC_SITE_URL: "https://senthilsecuritysolutions.com",
      NEXT_PUBLIC_REVIEW_MODE: "",
      ...Object.fromEntries(
        [
          "SMTP_HOST",
          "SMTP_USER",
          "SMTP_PASS",
          "ENQUIRY_FROM_EMAIL",
          "ENQUIRY_TO_EMAIL",
          "CAREERS_TO_EMAIL",
          "RESEND_API_KEY",
          "DATABASE_URL",
          "R2_ACCOUNT_ID",
          "R2_ACCESS_KEY_ID",
          "R2_SECRET_ACCESS_KEY",
          "R2_BUCKET",
          "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
          "TURNSTILE_SECRET_KEY",
          "NEXT_PUBLIC_CF_ANALYTICS_TOKEN",
        ].map((name) => [name, ""]),
      ),
    },
  },
});
