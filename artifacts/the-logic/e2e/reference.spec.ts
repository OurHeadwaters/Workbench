import { expect, test, type Locator, type Page } from "@playwright/test";

function assertNoHorizontalDocumentOverflow(page: Page) {
  return expect
    .poll(() =>
      page.evaluate(
        () =>
          Math.max(
            document.documentElement.scrollWidth,
            document.body.scrollWidth,
          ) <= window.innerWidth,
      ),
    )
    .toBe(true);
}

async function contrastRatio(locator: Locator) {
  return locator.evaluate((element) => {
    const parseColour = (value: string) => {
      const channels = value.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
      if (!channels || channels.length < 3) {
        throw new Error(`Could not parse colour: ${value}`);
      }
      const rgb = channels.slice(0, 3);
      if (value.startsWith("color(srgb")) {
        return rgb.map((channel) => channel * 255);
      }
      if (value.startsWith("oklab")) {
        const [lightness, a, b] = rgb;
        const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
        const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
        const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
        const linearRgb = [
          4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
          -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
          -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
        ];
        return linearRgb.map((channel) => {
          const clamped = Math.min(1, Math.max(0, channel));
          const encoded =
            clamped <= 0.0031308
              ? 12.92 * clamped
              : 1.055 * clamped ** (1 / 2.4) - 0.055;
          return encoded * 255;
        });
      }
      return rgb;
    };

    const luminance = (channels: number[]) => {
      const linear = channels.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
      return (
        0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
      );
    };

    const foreground = luminance(parseColour(getComputedStyle(element).color));
    let backgroundElement: Element | null = element;
    let background = [0, 0, 0];

    while (backgroundElement) {
      const colour = getComputedStyle(backgroundElement).backgroundColor;
      const channels = colour.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
      const alpha = channels?.[3] ?? 1;
      if (channels && alpha > 0.99) {
        background = parseColour(colour);
        break;
      }
      backgroundElement = backgroundElement.parentElement;
    }

    const backgroundLuminance = luminance(background);
    const lighter = Math.max(foreground, backgroundLuminance);
    const darker = Math.min(foreground, backgroundLuminance);
    return (lighter + 0.05) / (darker + 0.05);
  });
}

test.describe("The Logic reference page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "The Logic" }),
    ).toBeVisible();
  });

  test("RealityCore and Fallacy Map anchors remain reachable", async ({
    page,
  }) => {
    for (const anchor of [
      { link: "RealityCore", hash: "#reality-core", heading: "RealityCore" },
      { link: "Fallacy Map", hash: "#fallacy-map", heading: "Fallacy Map" },
    ]) {
      await page.getByRole("link", { name: anchor.link, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${anchor.hash}$`));
      await expect(
        page.getByRole("heading", { level: 2, name: anchor.heading }),
      ).toBeInViewport();
    }

    await assertNoHorizontalDocumentOverflow(page);
  });

  test("checklist and Gate Call content stay contained", async ({ page }) => {
    const table = page.getByRole("table");
    const scroller = table.locator("..");
    await table.scrollIntoViewIfNeeded();
    await expect(table).toBeVisible();

    const tableState = await scroller.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        overflowX: getComputedStyle(element).overflowX,
        canScroll: element.scrollWidth > element.clientWidth,
        contained:
          bounds.left >= 0 && bounds.right <= document.documentElement.clientWidth,
      };
    });

    expect(tableState.contained).toBe(true);
    if (test.info().project.name === "mobile") {
      expect(tableState.overflowX).toBe("auto");
      expect(tableState.canScroll).toBe(true);
      await scroller.evaluate((element) => {
        element.scrollLeft = element.scrollWidth;
      });
      await expect
        .poll(() => scroller.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
    }

    const gateCalls = page.getByText("Gate Call", { exact: true });
    const gateCallCount = await gateCalls.count();
    expect(gateCallCount).toBeGreaterThan(0);
    for (let index = 0; index < gateCallCount; index += 1) {
      const card = gateCalls.nth(index).locator("..");
      await expect(card).toBeVisible();
      const bounds = await card.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
        page.viewportSize()!.width,
      );
    }

    await assertNoHorizontalDocumentOverflow(page);
  });

  test("muted labels and body copy retain readable contrast", async ({
    page,
  }) => {
    const mutedLabel = page.getByText("Practitioner's Note", { exact: true });
    const bodyCopy = page.getByText(
      "Apply these four questions to any claim before the Gate acts on it. A claim that cannot survive all four questions is a story, not a fact, and must be held on the bright side until it earns passage.",
      { exact: true },
    );

    await expect(mutedLabel).toBeVisible();
    await expect(bodyCopy).toBeVisible();
    expect(await contrastRatio(mutedLabel)).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(bodyCopy)).toBeGreaterThanOrEqual(4.5);
  });
});