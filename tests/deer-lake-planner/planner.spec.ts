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
    await expect(page.getByText("LFIF intake opens this fall.")).toBeVisible();

    await expect(page.getByTestId("today-doors-open")).toHaveText(/2027|2028|2029/);
    await expect(page.getByTestId("today-total-months")).toHaveText(/\d+\.\d+ mo/);

    for (const id of ["optimistic", "realistic", "slippage"]) {
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

    await expect(page.getByText("Phase 1 · Design + pilot + application")).toBeVisible();
    await expect(page.getByText("Phase 2 · Build + handover")).toBeVisible();

    const keyDates = page.getByTestId("key-dates");
    await expect(keyDates).toBeVisible();
    await expect(keyDates.getByText("Funding-secured trigger")).toBeVisible();
    await expect(keyDates.getByText("Doors open")).toBeVisible();
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
  });

  test("header walkthrough button navigates back to the read surface", async ({ page }) => {
    await page.goto(PLANNER_PATH);
    await page.getByTestId("planner-header-jump-walkthrough").click();
    await page.waitForURL(/\/deer-lake-walkthrough\/?$/);
    await expect(page).toHaveURL(/\/deer-lake-walkthrough\/?$/);
  });
});
