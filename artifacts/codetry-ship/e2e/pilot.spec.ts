import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  expect(widths.document, "the document should fit within the viewport").toBeLessThanOrEqual(
    widths.viewport,
  );
  expect(widths.body, "the body should fit within the viewport").toBeLessThanOrEqual(
    widths.viewport,
  );
}

test.describe("public care pilot invitation", () => {
  test("explains the care pilot, fits the viewport, and reaches the private conversation", async ({
    page,
  }) => {
    await page.goto("/pilot");

    await expect(page).toHaveURL(/\/pilot$/);
    await expect(
      page.getByRole("heading", { name: "A care pilot for staying represented." }),
    ).toBeVisible();
    await expect(page.getByText(/human-translation gap/i)).toBeVisible();
    await expect(
      page.getByText(/community care organizations and practical host partners/i),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const conversationLink = page.getByRole("link", {
      name: "Explore a private pilot conversation with Bobbie",
    });
    await expect(conversationLink).toHaveAttribute("href", "/listen");
    await conversationLink.click();
    await expect(page).toHaveURL(/\/listen$/);
  });

  test("public home invitation reaches the pilot while workbench stays protected", async ({
    page,
  }) => {
    await page.goto("/");

    const pilotLink = page.getByRole("link", { name: "Explore a care pilot" });
    await expect(pilotLink).toBeVisible();
    await expect(pilotLink).toHaveAttribute("href", "/pilot");
    await pilotLink.click();
    await expect(page).toHaveURL(/\/pilot$/);
    await expect(
      page.getByRole("heading", { name: "A care pilot for staying represented." }),
    ).toBeVisible();

    await page.goto("/workbench");
    await expect(page).toHaveURL(/\/sign-on$/);
    await expect(page.getByRole("heading", { name: "Sign on." })).toBeVisible();
  });
});