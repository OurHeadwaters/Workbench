import { expect, test } from "@playwright/test";
import { PUBLIC_EXAMPLE_DESTINATIONS } from "../src/data/publicExampleDestinations";

const CHECK_TIMEOUT_MS = 20_000;

const destinations = [
  { name: "807 Food Co-op", ...PUBLIC_EXAMPLE_DESTINATIONS.coop },
  { name: "care continuity pilot", ...PUBLIC_EXAMPLE_DESTINATIONS.care },
  { name: "Parr's Jars", ...PUBLIC_EXAMPLE_DESTINATIONS.business },
];

test("public example destinations respond successfully without submitting visitor data", async ({
  request,
  baseURL,
}) => {
  if (!baseURL) {
    throw new Error("The public example link check requires a configured application base URL.");
  }

  for (const destination of destinations) {
    const url = new URL(destination.href, baseURL).toString();
    let response;

    try {
      // A direct GET only reads the public landing page; it does not click through
      // or submit any visitor-facing form.
      response = await request.get(url, {
        failOnStatusCode: false,
        maxRedirects: 5,
        timeout: CHECK_TIMEOUT_MS,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      expect.fail(
        `Public example "${destination.name}" is unreachable at ${url}: ${message}`,
      );
    }

    expect(
      response.ok(),
      `Public example "${destination.name}" at ${url} returned HTTP ${response.status()} ${response.statusText()}`,
    ).toBe(true);
  }
});