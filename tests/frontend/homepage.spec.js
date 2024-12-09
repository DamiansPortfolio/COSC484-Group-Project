import { test, expect } from "@playwright/test"

test.describe("Homepage Tests", () => {
  // This will run before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/welcome")
  })

  test("homepage has correct title", async ({ page }) => {
    const title = await page.title()
    expect(title).toBe("Palette")
  })

  test("Get Started, Sign In, and Create Account buttons are visible", async ({
    page,
  }) => {
    // Use the selectors for the buttons (adjust if necessary)
    const getStartedButton = page.locator('button:has-text("Get Started")')

    // Select the first "Sign In" button
    const signInButton = page.locator('button:has-text("Sign In")').nth(0)

    const createAccountButton = page.locator(
      'button:has-text("Create Account")'
    )
    // Check that both buttons are visible
    await expect(getStartedButton).toBeVisible()
    await expect(signInButton).toBeVisible()
    await expect(createAccountButton).toBeVisible()
  })
})
