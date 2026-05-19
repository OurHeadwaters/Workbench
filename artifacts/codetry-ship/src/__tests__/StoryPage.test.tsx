/**
 * StoryPage.test.tsx
 *
 * Automated tests for the Youth Odyssey story-generation flow.
 *
 * Scenarios covered:
 *   Station cards     — expand on click, collapse on second click, one open at a time
 *   Age track         — selector renders all three tracks, switching changes prompts
 *   Prompt form       — textarea renders with correct placeholder, accepts typed input
 *   Submit button     — disabled when prompts are empty, enabled when all answered
 *   Loading state     — button shows "Writing your story…" while fetch is pending
 *   Success state     — generated story is rendered; "Write another →" button appears
 *   Error state       — error message shown; retrying re-calls the API
 *   Reset ("Write another →") — clears story and answers, returns to idle form
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoryPage } from "@/pages/StoryPage";

/* ── Mock child components that aren't under test ──────────────────────────── */

vi.mock("@/components/TrailArtGallery", () => ({
  TrailArtGallery: () => <div data-testid="trail-art-gallery" />,
}));

vi.mock("@/components/YouthTrailMap", () => ({
  YouthTrailMap: () => <div data-testid="youth-trail-map" />,
}));

/* ── Helpers ────────────────────────────────────────────────────────────────── */

/**
 * Expand station 1 (The Watcher) — the default "tween" track has 4 prompts.
 */
async function expandStation1(user: ReturnType<typeof userEvent.setup>) {
  const card = screen.getByTestId("youth-station-1");
  const header = within(card).getByRole("button");
  await user.click(header);
  return card;
}

/**
 * Fill every visible textarea inside a card.
 */
async function fillAllPrompts(user: ReturnType<typeof userEvent.setup>, card: HTMLElement, text = "test answer") {
  const textareas = within(card).getAllByRole("textbox");
  for (const ta of textareas) {
    await user.clear(ta);
    await user.type(ta, text);
  }
}

/* ── Tests ──────────────────────────────────────────────────────────────────── */

describe("StoryPage — station card expand/collapse", () => {
  it("renders all 8 station cards collapsed by default", () => {
    render(<StoryPage />);
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByTestId(`youth-station-${i}`)).toBeInTheDocument();
    }
    expect(screen.queryByText("Choose your age track")).not.toBeInTheDocument();
  });

  it("expands a station card when its header is clicked", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    await expandStation1(user);
    expect(screen.getByText("Choose your age track")).toBeInTheDocument();
  });

  it("collapses an open card when its header is clicked again", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);
    const header = within(card).getByRole("button", { name: /station/i });
    await user.click(header);
    expect(screen.queryByText("Choose your age track")).not.toBeInTheDocument();
  });

  it("only one station is open at a time — opening a second closes the first", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();

    await expandStation1(user);
    expect(screen.getByText("Choose your age track")).toBeInTheDocument();

    const card2 = screen.getByTestId("youth-station-2");
    const header2 = within(card2).getByRole("button");
    await user.click(header2);

    const ageTrackLabels = screen.getAllByText("Choose your age track");
    expect(ageTrackLabels).toHaveLength(1);
  });

  it("sets aria-expanded correctly on the header button", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = screen.getByTestId("youth-station-1");
    const header = within(card).getByRole("button");

    expect(header).toHaveAttribute("aria-expanded", "false");
    await user.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
  });
});

describe("StoryPage — age track selector", () => {
  it("renders all three age track buttons when a station is expanded", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    await expandStation1(user);

    expect(screen.getByRole("button", { name: /young/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tween/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /older/i })).toBeInTheDocument();
  });

  it("defaults to the 'tween' track (4 prompts for station 1)", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);
    expect(within(card).getAllByRole("textbox")).toHaveLength(4);
  });

  it("switches to 'young' track and shows 3 prompts for station 1", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await user.click(within(card).getByRole("button", { name: /young/i }));
    expect(within(card).getAllByRole("textbox")).toHaveLength(3);
  });

  it("switches to 'older' track and shows 4 prompts for station 1", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await user.click(within(card).getByRole("button", { name: /older/i }));
    expect(within(card).getAllByRole("textbox")).toHaveLength(4);
  });

  it("persists answers for shared prompt IDs when the age track is switched", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    const [firstTextarea] = within(card).getAllByRole("textbox");
    await user.type(firstTextarea, "my answer");
    expect(firstTextarea).toHaveValue("my answer");

    await user.click(within(card).getByRole("button", { name: /young/i }));
    const [newFirst] = within(card).getAllByRole("textbox");
    expect(newFirst).toHaveValue("my answer");
  });

  it("shows fewer prompts when switching from tween to young (3 vs 4 for station 1)", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    expect(within(card).getAllByRole("textbox")).toHaveLength(4);
    await user.click(within(card).getByRole("button", { name: /young/i }));
    expect(within(card).getAllByRole("textbox")).toHaveLength(3);
  });
});

describe("StoryPage — prompt textarea input", () => {
  it("renders textareas with the correct placeholder text", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    await expandStation1(user);

    expect(screen.getByPlaceholderText("Their name")).toBeInTheDocument();
  });

  it("accepts typed input in a textarea", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    const [first] = within(card).getAllByRole("textbox");
    await user.type(first, "Grandma Elsie");
    expect(first).toHaveValue("Grandma Elsie");
  });

  it("preserves independent answer state per station", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();

    const card1 = await expandStation1(user);
    const [s1Input] = within(card1).getAllByRole("textbox");
    await user.type(s1Input, "answer for station 1");

    const card2 = screen.getByTestId("youth-station-2");
    await user.click(within(card2).getByRole("button"));

    const [s2Input] = within(card2).getAllByRole("textbox");
    expect(s2Input).toHaveValue("");
  });
});

describe("StoryPage — Write my story button enabled/disabled state", () => {
  it("is disabled when no prompts are answered", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    await expandStation1(user);

    const btn = screen.getByRole("button", { name: /write my story/i });
    expect(btn).toBeDisabled();
  });

  it("is still disabled if only some prompts are answered (tween has 4)", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    const textareas = within(card).getAllByRole("textbox");
    await user.type(textareas[0], "partial");
    await user.type(textareas[1], "partial");

    const btn = within(card).getByRole("button", { name: /write my story/i });
    expect(btn).toBeDisabled();
  });

  it("becomes enabled when all prompts are answered", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "an answer");

    const btn = within(card).getByRole("button", { name: /write my story/i });
    expect(btn).not.toBeDisabled();
  });

  it("shows the hint text when prompts are unanswered", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    await expandStation1(user);

    expect(screen.getByText(/answer all the prompts above to unlock/i)).toBeInTheDocument();
  });

  it("hides the hint text once all prompts are answered", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled");
    expect(screen.queryByText(/answer all the prompts above to unlock/i)).not.toBeInTheDocument();
  });
});

describe("StoryPage — loading state", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => { /* never resolves — keeps the loading state active */ })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows 'Writing your story…' while the fetch is in flight", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "ready");

    const btn = within(card).getByRole("button", { name: /write my story/i });
    await user.click(btn);

    expect(screen.getByRole("button", { name: /writing your story/i })).toBeInTheDocument();
  });

  it("disables the submit button while loading", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "ready");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    const loadingBtn = screen.getByRole("button", { name: /writing your story/i });
    expect(loadingBtn).toBeDisabled();
  });
});

describe("StoryPage — success state", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ story: "Paragraph one.\n\nParagraph two." }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the generated story text after a successful API response", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled answer");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    await waitFor(() => {
      expect(screen.getByText("Paragraph one.")).toBeInTheDocument();
      expect(screen.getByText("Paragraph two.")).toBeInTheDocument();
    });
  });

  it("shows the station name in the story header", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled answer");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    await waitFor(() => {
      expect(screen.getByText(/the watcher · your story/i)).toBeInTheDocument();
    });
  });

  it("shows the 'Write another →' button after success", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled answer");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /write another/i })).toBeInTheDocument();
    });
  });

  it("hides the prompt form and submit button after success", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled answer");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /write my story/i })).not.toBeInTheDocument();
      expect(screen.queryByText("Choose your age track")).not.toBeInTheDocument();
    });
  });
});

describe("StoryPage — error state", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: "API key missing." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the error message when the API returns a non-ok response", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    await waitFor(() => {
      expect(screen.getByText("API key missing.")).toBeInTheDocument();
    });
  });

  it("keeps the prompt form visible so the user can retry", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    await waitFor(() => {
      expect(within(card).getByRole("button", { name: /write my story/i })).toBeInTheDocument();
    });
  });

  it("calls the API again when the user retries after an error", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled");

    const submitBtn = within(card).getByRole("button", { name: /write my story/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("API key missing.")).toBeInTheDocument();
    });

    const retryBtn = within(card).getByRole("button", { name: /write my story/i });
    await user.click(retryBtn);

    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
  });
});

describe("StoryPage — network error state", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network failure"))),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a connection error message on fetch rejection", async () => {
    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/couldn't reach the server/i),
      ).toBeInTheDocument();
    });
  });
});

describe("StoryPage — Write another → reset", () => {
  it("returns to the idle prompt form after clicking 'Write another →'", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ story: "A generated story." }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );

    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "filled");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /write another/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /write another/i }));

    expect(screen.queryByText("A generated story.")).not.toBeInTheDocument();
    expect(screen.getByText("Choose your age track")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it("clears all answers after reset so the button is disabled again", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ story: "Story text." }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );

    render(<StoryPage />);
    const user = userEvent.setup();
    const card = await expandStation1(user);

    await fillAllPrompts(user, card, "answer");
    await user.click(within(card).getByRole("button", { name: /write my story/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /write another/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /write another/i }));

    const textareas = within(card).getAllByRole("textbox");
    for (const ta of textareas) {
      expect(ta).toHaveValue("");
    }

    expect(within(card).getByRole("button", { name: /write my story/i })).toBeDisabled();

    vi.unstubAllGlobals();
  });
});
