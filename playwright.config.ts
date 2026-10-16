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
    env: { E2E_FAKE_BACKENDS: "1" },
  },
});
