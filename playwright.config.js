import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests", // Directory containing tests
  timeout: 30000, // 30 seconds per test timeout
  expect: {
    timeout: 5000, // Timeout for assertions
  },
  retries: 2, // Retries on failure
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],

  projects: [
    {
      name: "Chromium",
      use: {
        browserName: "chromium",
        headless: false, // Set to true for headless mode
        viewport: { width: 1280, height: 720 },
        baseURL: "http://localhost:5173/", // Set baseURL here
        trace: "on-first-retry", // Enable trace for debugging
      },
    },
    {
      name: "Firefox",
      use: {
        browserName: "firefox",
        headless: false,
        viewport: { width: 1280, height: 720 },
        baseURL: "http://localhost:5173/", // Set baseURL here
        trace: "on-first-retry", // Enable trace for debugging
      },
    },
    {
      name: "Webkit",
      use: {
        browserName: "webkit",
        headless: false,
        viewport: { width: 1280, height: 720 },
        baseURL: "http://localhost:5173/", // Set baseURL here
        trace: "on-first-retry", // Enable trace for debugging
      },
    },
  ],
})
