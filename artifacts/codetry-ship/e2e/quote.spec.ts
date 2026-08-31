import { expect, test, type Page, type Route } from "@playwright/test";

type QuotePayload = {
  contactName: string;
  organizationType: string;
  selectedOffer: string;
  integrationNeeded: string;
  sensitiveDataInvolved: string;
  specialRequirements: string;
  website?: string;
};

async function completeQuoteForm(
  page: Page,
  options: {
    organizationType?: string;
    selectedOffer?: "year 1 codetry engagement" | "year 2 codetry engagement" | "needs custom review";
    integrationNeeded?: string;
    sensitiveDataInvolved?: string;
    specialRequirements?: string;
    submit?: boolean;
  } = {},
) {
  await page.getByLabel("What are we calling this work?").fill("Funding-ready operations");
  await page.getByLabel("What is the situation?").fill(
    "Make the operating work easier to carry locally.",
  );
  await page.getByLabel("What does better look like?").fill(
    "A working system with trained local operators.",
  );
  await page.getByRole("button", { name: /continue/i }).click();

  const organizationType = options.organizationType ?? "co-op/not-for-profit";
  const organizationLabels: Record<string, string> = {
    "co-op/not-for-profit": "Co-op / Not-for-profit",
    "community organization": "Community organization",
    "commercial/institutional": "Commercial / Institutional",
  };
  await page.getByRole("button", { name: organizationLabels[organizationType], exact: true }).click();
  await page.getByLabel("When are you hoping to start or finish?").fill("Fall 2026");
  await page.getByLabel("How is this being funded?").fill("Community Fund");
  await page.getByRole("button", { name: /continue/i }).click();

  const chooseBoundary = async (question: string, value: string) => {
    await page
      .getByText(question, { exact: true })
      .locator("..")
      .getByRole("button", { name: value === "not sure" ? "Not sure" : value === "yes" ? "Yes" : "No", exact: true })
      .click();
  };
  await chooseBoundary(
    "Will this need to integrate with other systems?",
    options.integrationNeeded ?? "no",
  );
  await chooseBoundary(
    "Will sensitive data be involved?",
    options.sensitiveDataInvolved ?? "no",
  );
  if (options.specialRequirements) {
    await page.getByLabel("Any other special requirements?").fill(options.specialRequirements);
  }
  await page.getByRole("button", { name: /continue/i }).click();

  if (options.selectedOffer === "needs custom review") {
    await page.getByRole("radio", { name: /CodeTry Build/i }).check({ force: true });
  }
  await page.getByRole("button", { name: /continue/i }).click();

  await page.getByLabel("Your name").fill("Morgan Funding");
  await page.getByLabel("Your email").fill("morgan@example.test");
  await page.getByLabel("Legal organization name").fill("North Shore Test Co-op");
  await page.getByLabel("Organization address").fill("1 Test Road, Wabigoon, ON");

  if (options.submit !== false) {
    await page.getByRole("button", { name: "Send Request" }).dispatchEvent("click");
  }
}

function expectedMode(body: QuotePayload): "standard" | "custom" {
  return body.selectedOffer === "needs custom review" ||
    body.integrationNeeded !== "no" ||
    body.sensitiveDataInvolved !== "no" ||
    Boolean(body.specialRequirements)
    ? "custom"
    : "standard";
}

async function fulfillSuccess(route: Route, index: number) {
  const body = route.request().postDataJSON() as QuotePayload;
  const mode = expectedMode(body);
  // Let the submit click finish before React swaps the entire form for the
  // success state. An immediate mocked response can detach the button during
  // Playwright's actionability cycle and make it retry an already-sent click.
  await new Promise((resolve) => setTimeout(resolve, 50));
  await route.fulfill({
    status: 201,
    contentType: "application/json",
    body: JSON.stringify({
      ok: true,
      mode,
      name: body.contactName,
      quoteNumber: `HW-20260830-TEST${index}`,
      deliveryStatus: "sent",
      ...(mode === "standard"
        ? { pdfUrl: `/api/quote-intake/quote-${index}/quote.pdf?sig=signed-${index}` }
        : {}),
    }),
  });
}

test.describe("Headwaters quote journey", () => {
  test("submits commercial, nonprofit, community, and custom-review requests", async ({
    page,
  }) => {
    const submissions: QuotePayload[] = [];
    await page.route("**/api/quote-intake", async (route) => {
      submissions.push(route.request().postDataJSON() as QuotePayload);
      await fulfillSuccess(route, submissions.length);
    });

    const cases = [
      {
        organizationType: "commercial/institutional",
        expected: "standard",
      },
      {
        organizationType: "co-op/not-for-profit",
        expected: "standard",
      },
      {
        organizationType: "community organization",
        expected: "standard",
      },
      {
        organizationType: "co-op/not-for-profit",
        selectedOffer: "needs custom review" as const,
        expected: "custom",
      },
    ];

    for (const scenario of cases) {
      await page.goto("/quote");
      await completeQuoteForm(page, scenario);
      await expect(page.getByTestId("quote-success")).toBeVisible();
      if (scenario.expected === "custom") {
        await expect(page.getByText(/needs a human review/i)).toBeVisible();
        await expect(page.getByRole("link", { name: /open your quote/i })).toHaveCount(0);
      } else {
        await expect(page.getByRole("link", { name: /open your quote/i })).toBeVisible();
      }
    }

    expect(submissions.map((submission) => submission.organizationType)).toEqual(
      cases.map((scenario) => scenario.organizationType),
    );
    expect(submissions.map(expectedMode)).toEqual(cases.map((scenario) => scenario.expected));
  });

  test("forces integration, sensitive-data, and special-requirement work to review", async ({
    page,
  }) => {
    const submissions: QuotePayload[] = [];
    await page.route("**/api/quote-intake", async (route) => {
      submissions.push(route.request().postDataJSON() as QuotePayload);
      await fulfillSuccess(route, submissions.length);
    });

    for (const scenario of [
      { integrationNeeded: "yes" },
      { sensitiveDataInvolved: "yes" },
      { specialRequirements: "Requires an offline winter-road workflow." },
    ]) {
      await page.goto("/quote");
      await completeQuoteForm(page, scenario);
      await expect(page.getByText(/needs a human review/i)).toBeVisible();
    }

    expect(submissions).toHaveLength(3);
    expect(submissions.every((submission) => expectedMode(submission) === "custom")).toBe(true);
  });

  test("keeps the draft through validation, a failed save, and a safe retry", async ({
    page,
  }) => {
    let requests = 0;
    await page.route("**/api/quote-intake", async (route) => {
      requests += 1;
      if (requests === 1) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            error:
              "We could not save your request just now. Nothing was lost in this form — please try again.",
          }),
        });
        return;
      }
      await fulfillSuccess(route, requests);
    });

    await page.goto("/quote");
    await page.getByRole("button", { name: /continue/i }).focus();
    await page.keyboard.press("Space");
    await expect(page.getByRole("alert")).toHaveCount(3);
    await expect(page.getByLabel("What are we calling this work?")).toHaveAttribute("aria-invalid", "true");

    await completeQuoteForm(page, { submit: false });
    const submit = page.getByRole("button", { name: "Send Request" });
    await submit.evaluate((button) => {
      (button as HTMLButtonElement).click();
      (button as HTMLButtonElement).click();
    });
    await expect(page.getByRole("alert")).toContainText(/nothing was lost in this form/i);
    expect(requests).toBe(1);
    await expect(page.getByLabel("Legal organization name")).toHaveValue("North Shore Test Co-op");

    await submit.dispatchEvent("click");
    await expect(page.getByTestId("quote-success")).toBeVisible();
    expect(requests).toBe(2);
  });

  test("shows rate-limit recovery without clearing the reviewed request", async ({ page }) => {
    await page.route("**/api/quote-intake", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Too many quote requests. Please wait before submitting again.",
          retryAfterSec: 3600,
        }),
      });
    });
    await page.goto("/quote");
    await completeQuoteForm(page);
    await expect(page.getByRole("alert")).toContainText(/too many quote requests/i);
    await expect(page.getByLabel("Legal organization name")).toHaveValue("North Shore Test Co-op");
  });

  test("does not submit a honeypot-filled form", async ({ page }) => {
    let requests = 0;
    await page.route("**/api/quote-intake", async (route) => {
      requests += 1;
      await fulfillSuccess(route, requests);
    });
    await page.goto("/quote");
    await completeQuoteForm(page, { submit: false });
    await page.locator("#quote-website").fill("bot", { force: true });
    await page.getByRole("button", { name: "Send Request" }).dispatchEvent("click");
    await page.waitForTimeout(100);
    expect(requests).toBe(0);
    await expect(page.getByTestId("quote-success")).toHaveCount(0);
  });

  test("opens the signed quote link without contacting a real mail service", async ({ page }) => {
    await page.route("**/api/quote-intake", async (route) => fulfillSuccess(route, 1));
    await page.context().route(/\/api\/quote-intake\/quote-1\/quote\.pdf\?sig=signed-1$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<title>Test quote</title><h1>Printable Headwaters quote</h1>",
      });
    });
    await page.goto("/quote");
    await completeQuoteForm(page);

    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("link", { name: /open your quote/i }).click();
    const popup = await popupPromise;
    await expect(popup.getByRole("heading", { name: "Printable Headwaters quote" })).toBeVisible();
    expect(popup.url()).toContain("sig=signed-1");
  });

  test("fits the quote flow on mobile without horizontal overflow", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile-only layout assertion");
    await page.goto("/quote");
    const widths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(widths.document).toBeLessThanOrEqual(widths.viewport);
    await expect(page.getByRole("heading", { name: "Tell us what you're facing." })).toBeVisible();
    await expect(page.getByRole("button", { name: /continue/i })).toBeVisible();
  });
});