import { expect, test } from "@playwright/test";

test("home loads and primary cta is visible", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("app-shell")).toBeVisible();
  await expect(page.getByTestId("primary-cta")).toBeVisible();
});

test("create flow works even if the initial fetch resolves late", async ({ page }) => {
  const title = `hello from smoke ${Date.now()}`;
  let handledInitialItemsRequest = false;

  await page.route("**/api/items", async (route, request) => {
    if (request.method() !== "GET" || handledInitialItemsRequest) {
      await route.continue();
      return;
    }

    handledInitialItemsRequest = true;
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.fulfill({
      contentType: "application/json",
      json: {
        items: [
          {
            id: "proof-of-life-item-1",
            title: "Proof-of-life item"
          },
          {
            id: "codex-ready-verify-flow-2",
            title: "Codex-ready verify flow"
          }
        ]
      }
    });
  });

  await page.goto("/");
  await page.getByTestId("create-item").click();
  await page.getByTestId("item-title").fill(title);
  await page.getByTestId("save-item").click();

  await expect(page.getByTestId("toast-success")).toContainText("Saved");
  await expect(
    page.getByTestId("item-list").getByText(title, { exact: true })
  ).toBeVisible();
});
