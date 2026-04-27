import { expect, test } from "@playwright/test";

const PLANNER_PATH = "/deer-lake-walkthrough/planner";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      window.localStorage.removeItem("dlpp:v1:saved");
      window.localStorage.removeItem("dlpp:v1:lastScenario");
    } catch {}
  });
});

test.describe("Deer Lake Phase Planner", () => {
  test("renders shell, today card, scenarios, gantts and key dates", async ({ page }) => {
    await page.goto(PLANNER_PATH);

    await expect(page.getByText("Phase planner", { exact: true })).toBeVisible();
    await expect(page.getByTestId("planner-header-jump-walkthrough")).toBeVisible();

    await expect(page.getByText(/Today is Apr 27, 2026\./)).toBeVisible();
    await expect(page.getByTestId("today-subhead")).toHaveText(
      "LFIF intake opens this fall.",
    );

    await expect(page.getByTestId("today-doors-open")).toHaveText(/2027|2028|2029/);
    await expect(page.getByTestId("today-total-months")).toHaveText(/\d+\.\d+ mo/);

    for (const id of ["optimistic", "realistic", "slippage", "selfFund"]) {
      await expect(page.getByTestId(`scenario-${id}`)).toBeVisible();
    }
    await expect(page.getByTestId("scenario-save")).toBeVisible();

    await expect(page.getByTestId("date-pegs")).toBeVisible();
    for (const peg of [
      "contractOneStart",
      "coldChainPilotStart",
      "lfifIntake",
      "councilDecision",
      "iscDecision",
    ]) {
      await expect(page.getByTestId(`peg-${peg}`)).toBeVisible();
    }
    await expect(page.getByTestId("peg-truckLfifIntake")).toHaveCount(0);

    await expect(page.getByText("Phase 1 · Design + pilot + application")).toBeVisible();
    await expect(page.getByText("Phase 2 · Build + handover")).toBeVisible();

    const keyDates = page.getByTestId("key-dates");
    await expect(keyDates).toBeVisible();
    await expect(keyDates.getByText("Funding-secured trigger")).toBeVisible();
    await expect(keyDates.getByText("Doors open")).toBeVisible();
    await expect(keyDates.getByText("LFIF decision")).toBeVisible();
  });

  test("scenario picker swaps anchors and updates downstream dates", async ({ page }) => {
    await page.goto(PLANNER_PATH);

    await page.getByTestId("scenario-realistic").click();
    const realisticDoors = await page.getByTestId("today-doors-open").innerText();
    const realisticTotal = await page.getByTestId("today-total-months").innerText();
    await expect(page.getByTestId("scenario-realistic")).toHaveAttribute("aria-selected", "true");

    await page.getByTestId("scenario-slippage").click();
    await expect(page.getByTestId("scenario-slippage")).toHaveAttribute("aria-selected", "true");
    const slippageDoors = await page.getByTestId("today-doors-open").innerText();
    const slippageTotal = await page.getByTestId("today-total-months").innerText();
    expect(slippageDoors).not.toBe(realisticDoors);
    expect(slippageTotal).not.toBe(realisticTotal);

    await page.getByTestId("scenario-optimistic").click();
    await expect(page.getByTestId("scenario-optimistic")).toHaveAttribute("aria-selected", "true");
    const optimisticDoors = await page.getByTestId("today-doors-open").innerText();
    expect(optimisticDoors).not.toBe(slippageDoors);
  });

  test("editing an anchor updates derived dates and clears scenario selection", async ({ page }) => {
    await page.goto(PLANNER_PATH);

    await page.getByTestId("scenario-realistic").click();
    await expect(page.getByTestId("scenario-realistic")).toHaveAttribute("aria-selected", "true");

    const before = await page.getByTestId("today-doors-open").innerText();

    await page.getByTestId("peg-iscDecision").fill("2028-01-15");
    await page.getByTestId("peg-iscDecision").blur();

    const after = await page.getByTestId("today-doors-open").innerText();
    expect(after).not.toBe(before);

    await expect(page.getByTestId("scenario-realistic")).toHaveAttribute("aria-selected", "false");
  });

  test("save button persists state and shows the saved-at chip", async ({ page }) => {
    await page.goto(PLANNER_PATH);

    await page.getByTestId("scenario-optimistic").click();
    await page.getByTestId("peg-lfifIntake").fill("2026-09-30");
    await page.getByTestId("peg-lfifIntake").blur();

    await expect(page.getByTestId("scenario-save")).toHaveText(/Save \*/);

    await page.getByTestId("scenario-save").click();
    await expect(page.getByText(/Last saved /)).toBeVisible();

    const saved = await page.evaluate(() => window.localStorage.getItem("dlpp:v1:saved"));
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved as string);
    expect(parsed.anchors.lfifIntake).toBe("2026-09-30");
    expect(parsed.mode).toBe("grants");
  });

  test("header walkthrough button navigates back to the read surface", async ({ page }) => {
    await page.goto(PLANNER_PATH);
    await page.getByTestId("planner-header-jump-walkthrough").click();
    await page.waitForURL(/\/deer-lake-walkthrough\/?$/);
    await expect(page).toHaveURL(/\/deer-lake-walkthrough\/?$/);
  });

  test("legacy localStorage save (no mode, no truckLfifIntake) hydrates as grants", async ({ page }) => {
    // Simulate a save written before the self-fund mode shipped: scenarioId
    // is "realistic", anchors lack truckLfifIntake, and the mode field is
    // absent. The storage layer should infer mode from scenarioId and
    // inject a default truck intake date.
    await page.addInitScript(() => {
      const legacy = {
        scenarioId: "realistic",
        anchors: {
          contractOneStart: "2026-04-27",
          coldChainPilotStart: "2026-06-01",
          lfifIntake: "2026-10-15",
          councilDecision: "2026-11-15",
          iscDecision: "2027-07-15",
        },
        savedAt: "2026-04-26 10:00",
      };
      try {
        window.localStorage.setItem("dlpp:v1:saved", JSON.stringify(legacy));
      } catch {}
    });

    await page.goto(PLANNER_PATH);

    // Restored as grants mode
    await expect(page.getByTestId("today-subhead")).toHaveText(
      "LFIF intake opens this fall.",
    );
    await expect(page.getByTestId("scenario-realistic")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByTestId("peg-lfifIntake")).toBeVisible();
    await expect(page.getByTestId("peg-iscDecision")).toBeVisible();
    await expect(page.getByTestId("peg-truckLfifIntake")).toHaveCount(0);

    // Switching to self-fund still works because the default truck intake
    // date was injected on load — derived dates compute, don't NaN out.
    await page.getByTestId("scenario-selfFund").click();
    await expect(page.getByTestId("peg-truckLfifIntake")).toHaveValue(
      "2026-10-15",
    );
    await expect(page.getByTestId("today-doors-open")).toContainText("2027");
  });

  test("self-fund mode swaps pegs, gates, off-ramp, and key dates", async ({ page }) => {
    await page.goto(PLANNER_PATH);

    await page.getByTestId("scenario-selfFund").click();
    await expect(page.getByTestId("scenario-selfFund")).toHaveAttribute(
      "aria-selected",
      "true",
    );

    // Subhead changes
    await expect(page.getByTestId("today-subhead")).toHaveText(
      "Council vote could happen this summer.",
    );

    // Doors-open should be earlier than realistic — realistic gives ~Feb 2028,
    // self-fund preset gives ~Mar 2027.
    await expect(page.getByTestId("today-doors-open")).toContainText("2027");

    // Pegs: four shown, LFIF-intake and ISC-decision dropped, truck added
    await expect(page.getByTestId("peg-contractOneStart")).toBeVisible();
    await expect(page.getByTestId("peg-coldChainPilotStart")).toBeVisible();
    await expect(page.getByTestId("peg-councilDecision")).toBeVisible();
    await expect(page.getByTestId("peg-truckLfifIntake")).toBeVisible();
    await expect(page.getByTestId("peg-lfifIntake")).toHaveCount(0);
    await expect(page.getByTestId("peg-iscDecision")).toHaveCount(0);

    // Council peg label changed for self-fund
    await expect(
      page.getByText("Council commits to private spend"),
    ).toBeVisible();

    // Off-ramp text mode-specific
    const offramp = page.getByTestId("offramp");
    await expect(offramp).toContainText("spend reserve capital");
    await expect(offramp).toContainText("807-partnership");

    // Key dates: truck rows present, grant rows gone
    const keyDates = page.getByTestId("key-dates");
    await expect(
      keyDates.getByText("Truck LFIF intake (807 partnership)"),
    ).toBeVisible();
    await expect(keyDates.getByText("Truck LFIF decision")).toBeVisible();
    await expect(
      keyDates.getByText("Truck arrives (807 partnership)"),
    ).toBeVisible();
    await expect(keyDates.getByText("LFIF decision")).toHaveCount(0);
    await expect(keyDates.getByText("FedNor decision")).toHaveCount(0);
    await expect(keyDates.getByText("Applications filed")).toHaveCount(0);

    // Save round-trips the mode
    await page.getByTestId("scenario-save").click();
    const saved = await page.evaluate(() =>
      window.localStorage.getItem("dlpp:v1:saved"),
    );
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved as string);
    expect(parsed.mode).toBe("self-fund");
    expect(parsed.scenarioId).toBe("selfFund");
    expect(parsed.anchors.truckLfifIntake).toBe("2026-10-15");
  });
});
