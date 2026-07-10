import { test, expect, type Page } from "@playwright/test";

// Fail a test if the browser logs any console error while on the page.
function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

const PERSONAS = [
  { path: "/", tagline: "architecting scalable" },
  { path: "/motion", tagline: "bringing interfaces to life" },
  { path: "/writer", tagline: "crafting narratives" },
];

test.describe("persona pages", () => {
  for (const p of PERSONAS) {
    test(`${p.path} loads with hero + no console errors`, async ({ page }) => {
      const errors = trackConsoleErrors(page);
      await page.goto(p.path);
      await expect(page.getByRole("heading", { name: /Hello, I'm Iyke/i })).toBeVisible();
      await expect(page.getByText(new RegExp(p.tagline, "i"))).toBeVisible();
      // Section nav pill is present.
      await expect(page.getByRole("navigation", { name: /section navigation/i })).toBeVisible();
      expect(errors, `console errors on ${p.path}: ${errors.join("; ")}`).toEqual([]);
    });
  }
});

test("theme toggle flips and persists", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const before = await html.getAttribute("data-theme");
  await page.getByRole("button", { name: /switch to (light|dark) mode/i }).click();
  const after = await html.getAttribute("data-theme");
  expect(after).not.toEqual(before);
  // Persists across navigation.
  await page.goto("/motion");
  await expect(page.locator("html")).toHaveAttribute("data-theme", after!);
});

test("persona switcher dropdown navigates", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /open navigation menu/i }).click();
  await page.getByRole("menuitem", { name: /writer/i }).click();
  await expect(page).toHaveURL(/\/writer$/);
});

test("admin gate rejects wrong passcode", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByText(/ADMIN ACCESS/i)).toBeVisible();
  await page.getByPlaceholder(/passcode/i).fill("definitely-wrong");
  await page.getByRole("button", { name: /enter/i }).click();
  await expect(page.getByText(/incorrect passcode|too many attempts/i)).toBeVisible();
});

/**
 * Authenticated admin add/delete. Requires E2E_ADMIN_PASSCODE to match the
 * server's ADMIN_PASSCODE; skipped otherwise so the suite stays green locally.
 */
test("admin can add and delete a toolkit item", async ({ page }) => {
  const passcode = process.env.E2E_ADMIN_PASSCODE;
  test.skip(!passcode, "set E2E_ADMIN_PASSCODE to run the authenticated admin test");

  await page.goto("/admin");
  await page.getByPlaceholder(/passcode/i).fill(passcode!);
  await page.getByRole("button", { name: /enter/i }).click();
  await expect(page.getByText(/CONTENT ADMIN/i)).toBeVisible();

  await page.getByRole("button", { name: /^Toolkit$/i }).click();
  const name = `E2E-${Date.now()}`;
  await page.getByLabel(/^Name/i).fill(name);
  await page.getByRole("button", { name: /^Create$/i }).click();
  await expect(page.getByText(name)).toBeVisible();

  page.once("dialog", (d) => d.accept()); // confirm() on delete
  await page
    .locator("li", { hasText: name })
    .getByRole("button", { name: /delete/i })
    .click();
  await expect(page.getByText(name)).toHaveCount(0);
});
