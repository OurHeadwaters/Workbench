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
      name: "Email Bobbie to explore a private care pilot conversation",
    });
    await expect(conversationLink).toHaveAttribute("href", /^mailto:/);
  });

  test("quiet public home reaches the selected quote path while workbench stays protected", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Important work should not depend on finding more hours.",
      }),
    ).toBeVisible();
    await expect(page.getByText(/lack the time, specialized people, or operating structure/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Time is the constraint." })).toBeVisible();
    await expect(page.getByText("Define the project & team", { exact: true })).toBeVisible();
    await expect(page.getByText("Choose the toolkits to increase capacity", { exact: true })).toBeVisible();
    await expect(page.getByText("Craft Practical tools", { exact: true })).toBeVisible();
    await expect(page.getByText("Handoff and Sustainable Growth", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Turn a board priority into work the next board can carry." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Make handoffs and follow-through easier when staffing is tight." })).toBeVisible();
    await expect(page.getByText("For a small business with demand to serve", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Use a known bottleneck to earn back the build." })).toBeVisible();
    await expect(page.getByText(/revenue-first path from interest to purchase/i)).toBeVisible();
    await expect(page.getByText(/a \$20,000 annual engagement is not automatically appropriate for a brand-new business without validated demand/i)).toBeVisible();
    await expect(page.getByText(/credible payback path/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Practical apps for real situations." })).toBeVisible();
    await expect(page.getByText("A decision-rights map, meeting rhythm, and action tracker", { exact: true })).toBeVisible();
    await expect(page.getByText("Shift, coverage, and escalation maps", { exact: true })).toBeVisible();
    await expect(page.getByText("A revenue-first path from interest to purchase", { exact: true })).toBeVisible();
    await expect(page.getByText("Year 1 · Base build", { exact: true })).toBeVisible();
    await expect(page.getByText("Year 2 · Additional layer", { exact: true })).toBeVisible();
    await expect(page.getByText("Custom review", { exact: true })).toBeVisible();
    await expect(page.getByText(/\$20,000 CAD/).first()).toBeVisible();
    await expect(page.getByText(/normal \$6,000 operating fee/i)).toBeVisible();

    const coopLink = page.getByTestId("practical-example-link-coop");
    await expect(coopLink).toHaveAttribute("href", "https://807foodcoop.ca");
    await expect(coopLink).toHaveAttribute("target", "_blank");
    await expect(coopLink).toHaveAttribute("rel", /noopener/);
    await expect(coopLink).toHaveAttribute("rel", /noreferrer/);
    await expect(coopLink).toHaveAccessibleName(/807 Food Co-op.*opens in a new tab/i);

    const careLink = page.getByTestId("practical-example-link-care");
    await expect(careLink).toHaveAttribute("href", /\/pilot$/);
    await expect(careLink).toHaveAttribute("target", "_blank");
    await expect(careLink).toHaveAttribute("rel", /noopener/);
    await expect(careLink).toHaveAttribute("rel", /noreferrer/);
    await expect(careLink).toHaveAccessibleName(/person-centred care continuity pilot.*opens in a new tab/i);

    const businessLink = page.getByTestId("practical-example-link-business");
    await expect(businessLink).toHaveAttribute("href", "https://parrsjars.ca");
    await expect(businessLink).toHaveAttribute("target", "_blank");
    await expect(businessLink).toHaveAttribute("rel", /noopener/);
    await expect(businessLink).toHaveAttribute("rel", /noreferrer/);
    await expect(businessLink).toHaveAccessibleName(/Parr's Jars.*small-business example.*opens in a new tab/i);
    await expectNoHorizontalOverflow(page);

    await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(page.getByTestId("quiet-primary-cta")).toHaveAccessibleName("Request a quote");
    await expect(page.getByRole("link", { name: "Request a quote" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Constellation|The Legend|Workbench|Tools/i })).toHaveCount(0);

    await page.getByTestId("quiet-offer-02").click();
    await expect(page).toHaveURL(/\/quote\?offer=additional(?:%20|\+)standard(?:%20|\+)tool$/);

    // Step 1: The Situation
    await expect(page.getByRole("heading", { name: "Tell us what you're facing." })).toBeVisible();
    await page.getByLabel(/What are we calling this work\?/i).fill("Test Project");
    await page.getByLabel(/What is the situation\?/i).fill("We need a better tool.");
    await page.getByLabel(/What does better look like\?/i).fill("Everything works smoothly.");
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 2: The Context
    await expect(page.getByRole("heading", { name: "The landscape around the work." })).toBeVisible();
    await page.getByRole("button", { name: "Community organization" }).click();
    await page.getByLabel(/When are you hoping to start or finish\?/i).fill("Fall 2025");
    await page.getByLabel(/How is this being funded\?/i).fill("Internal budget");
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 3: Technical & Safety Boundaries
    await expect(page.getByRole("heading", { name: "Technical & safety boundaries." })).toBeVisible();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 4: The Match
    await expect(page.getByRole("heading", { name: "Finding the right shape." })).toBeVisible();
    await expect(
      page.locator('input[name="selectedOffer"][value="year 2 codetry engagement"]'),
    ).toBeChecked();
    await expect(page.getByTestId("quote-selected-offer-price")).toContainText("$20,000 CAD");
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 5: The Particulars
    await expect(page.getByRole("heading", { name: "Where should we send this?" })).toBeVisible();
    await page.getByLabel(/Legal organization name/i).fill("Test Organization");
    await page.getByLabel(/Organization address/i).fill("1 Main Street, Ontario");
    await page.getByLabel(/Your name/i).fill("Test Contact");
    await page.getByLabel(/Your email/i).fill("test@example.com");

    await page.goto("/workbench");
    await expect(page).toHaveURL(/\/sign-on$/);
    await expect(page.getByRole("heading", { name: "Sign on." })).toBeVisible();
  });

  test("records a privacy-safe consulting conversion after a successful quote submission", async ({
    page,
  }) => {
    type TrackedEvent = {
      name: string;
      data?: Record<string, string | number | boolean>;
    };

    await page.addInitScript(() => {
      type TestWindow = Window & {
        __testAnalyticsEvents?: TrackedEvent[];
        umami?: {
          track(name: string, data?: Record<string, string | number | boolean>): void;
        };
      };

      const testWindow = window as TestWindow;
      const storageKey = "__testAnalyticsEvents";
      const storedEvents = window.localStorage.getItem(storageKey);
      const events: TrackedEvent[] = storedEvents ? JSON.parse(storedEvents) : [];
      testWindow.__testAnalyticsEvents = events;
      testWindow.umami = {
        track(name, data) {
          events.push({ name, data });
          window.localStorage.setItem(storageKey, JSON.stringify(events));
        },
      };
    });

    const quotePayload = {
      contactName: "Sentinel Contact Name",
      email: "sentinel-contact@example.test",
      legalOrganizationName: "Sentinel Organization",
      organizationAddress: "123 Sentinel Street",
      projectTitle: "Sentinel Project Title",
      projectDescription: "Sentinel project details should never reach analytics.",
      desiredOutcome: "Sentinel desired outcome should never reach analytics.",
    };

    let receivedQuotePayload: Record<string, unknown> | undefined;
    await page.route("**/api/quote-intake", async (route) => {
      receivedQuotePayload = JSON.parse(route.request().postData() ?? "{}");
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          mode: "standard",
          quoteNumber: "Q-TEST-001",
          pdfUrl: "/api/quote-intake/test/quote.pdf?sig=test",
          name: quotePayload.contactName,
        }),
      });
    });

    await page.goto("/");
    await page.getByTestId("quiet-offer-02").click();
    await expect(page).toHaveURL(/\/quote\?offer=additional(?:%20|\+)standard(?:%20|\+)tool$/);

    // Step 1: The Situation
    await expect(page.getByRole("heading", { name: "Tell us what you're facing." })).toBeVisible();
    await page.getByLabel(/What are we calling this work\?/i).fill(quotePayload.projectTitle);
    await page.getByLabel(/What is the situation\?/i).fill(quotePayload.projectDescription);
    await page.getByLabel(/What does better look like\?/i).fill(quotePayload.desiredOutcome);
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 2: The Context
    await expect(page.getByRole("heading", { name: "The landscape around the work." })).toBeVisible();
    await page.getByRole("button", { name: "Community organization" }).click();
    await page.getByLabel(/When are you hoping to start or finish\?/i).fill("Sentinel timing");
    await page.getByLabel(/How is this being funded\?/i).fill("Sentinel funding");
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 3: Technical & Safety Boundaries
    await expect(page.getByRole("heading", { name: "Technical & safety boundaries." })).toBeVisible();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 4: The Match
    await expect(page.getByRole("heading", { name: "Finding the right shape." })).toBeVisible();
    await expect(
      page.locator('input[name="selectedOffer"][value="year 2 codetry engagement"]'),
    ).toBeChecked();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 5: The Particulars
    await expect(page.getByRole("heading", { name: "Where should we send this?" })).toBeVisible();
    await page.getByLabel(/Legal organization name/i).fill(quotePayload.legalOrganizationName);
    await page.getByLabel(/Organization address/i).fill(quotePayload.organizationAddress);
    await page.getByLabel(/Your name/i).fill(quotePayload.contactName);
    await page.getByLabel(/Your email/i).fill(quotePayload.email);
    await page.getByRole("button", { name: "Send Request" }).click();

    await expect(page.getByTestId("quote-success")).toBeVisible();
    await expect(page.getByText("Q-TEST-001")).toBeVisible();

    expect(receivedQuotePayload).toMatchObject({
      selectedOffer: "year 2 codetry engagement",
      contactName: quotePayload.contactName,
      email: quotePayload.email,
      projectTitle: quotePayload.projectTitle,
      projectDescription: quotePayload.projectDescription,
      desiredOutcome: quotePayload.desiredOutcome,
    });

    const analyticsEvents = await page.evaluate(() => {
      const testWindow = window as Window & {
        __testAnalyticsEvents?: TrackedEvent[];
      };
      return testWindow.__testAnalyticsEvents ?? [];
    });

    expect(analyticsEvents).toEqual(
      expect.arrayContaining([
        {
          name: "consulting_offer_selected",
          data: {
            offer: "year 2 codetry engagement",
            location: "offers_grid",
          },
        },
        {
          name: "quote_request_submitted",
          data: {
            offer: "year 2 codetry engagement",
            mode: "standard",
          },
        },
      ]),
    );

    const analyticsPayload = JSON.stringify(analyticsEvents);
    for (const sensitiveValue of Object.values(quotePayload)) {
      expect(analyticsPayload).not.toContain(sensitiveValue);
    }
    expect(analyticsEvents.every(({ data }) => {
      const keys = Object.keys(data ?? {});
      return keys.every((key) =>
        ["offer", "location", "mode", "organization_type", "quote_mode"].includes(key),
      );
    })).toBe(true);
  });

  test("real-work example paths remain usable on a mobile-width viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByTestId("practical-example-link-coop")).toBeVisible();
    await expect(page.getByTestId("practical-example-link-care")).toBeVisible();
    await expect(page.getByTestId("practical-example-link-business")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
