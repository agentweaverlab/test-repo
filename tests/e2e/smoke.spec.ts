import { expect, test } from "@playwright/test";

test("home loads and primary cta is visible", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("app-shell")).toBeVisible();
  await expect(page.getByTestId("primary-cta")).toBeVisible();
});

test("create flow works", async ({ page }) => {
  const title = `hello from smoke ${Date.now()}`;

  await page.goto("/");
  await page.getByTestId("create-item").click();
  await page.getByTestId("item-title").fill(title);
  await page.getByTestId("save-item").click();

  await expect(page.getByTestId("toast-success")).toContainText("Saved");
  await expect(page.getByTestId("item-list").getByText(title, { exact: true })).toBeVisible();
});
