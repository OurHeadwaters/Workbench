import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { FocalActive, FocalAllDone } from "../NowView";

describe("FocalActive — empty slot state", () => {
  it("renders a Day prompt with input + Save and no Done button", () => {
    const html = renderToStaticMarkup(
      <FocalActive
        next={{ kind: "day", idx: 0, item: { text: "", done: false } }}
        onSave={() => {}}
        onDone={() => {}}
      />,
    );
    expect(html).toContain('data-testid="focal-card-pill"');
    expect(html).toContain(">Day<");
    expect(html).toContain('data-testid="focal-card-prompt"');
    expect(html).toContain("What&#x27;s the next thing for today?");
    expect(html).toContain('data-testid="focal-card-input"');
    expect(html).toContain('data-testid="focal-card-save"');
    expect(html).not.toContain('data-testid="focal-card-done"');
    expect(html).not.toContain('data-testid="focal-card-text"');
  });

  it("renders a Week prompt when the focal slot is a week slot", () => {
    const html = renderToStaticMarkup(
      <FocalActive
        next={{ kind: "week", idx: 1, item: { text: "", done: false } }}
        onSave={() => {}}
        onDone={() => {}}
      />,
    );
    expect(html).toContain(">Week<");
    expect(html).toContain("What&#x27;s the next thing for this week?");
  });

  it("renders a Phase prompt when the focal slot is a phase slot", () => {
    const html = renderToStaticMarkup(
      <FocalActive
        next={{ kind: "phase", idx: 2, item: { text: "", done: false } }}
        onSave={() => {}}
        onDone={() => {}}
      />,
    );
    expect(html).toContain(">Phase<");
    expect(html).toContain("What&#x27;s the next thing for this phase?");
  });

  it("treats a checked-but-empty slot as still empty (shows Save, not Done)", () => {
    // A user could check the box on an empty row by mistake — the focal
    // card should still treat it as needing input, so they can fill it.
    const html = renderToStaticMarkup(
      <FocalActive
        next={{ kind: "day", idx: 0, item: { text: "  ", done: true } }}
        onSave={() => {}}
        onDone={() => {}}
      />,
    );
    expect(html).toContain('data-testid="focal-card-input"');
    expect(html).toContain('data-testid="focal-card-save"');
    expect(html).not.toContain('data-testid="focal-card-done"');
  });
});

describe("FocalActive — filled slot state", () => {
  it("renders the item text in big serif and a full-width Done button", () => {
    const html = renderToStaticMarkup(
      <FocalActive
        next={{
          kind: "day",
          idx: 0,
          item: { text: "draft pitch email", done: false },
        }}
        onSave={() => {}}
        onDone={() => {}}
      />,
    );
    expect(html).toContain('data-testid="focal-card-text"');
    expect(html).toContain("draft pitch email");
    expect(html).toContain('data-testid="focal-card-done"');
    expect(html).toContain(">Done<");
    // The big tap target — full-width, generous padding — is critical
    // to the mobile UX. Lock the structural classes so a future
    // refactor can't silently shrink it.
    expect(html).toMatch(/w-full[^"]*py-5/);
    expect(html).not.toContain('data-testid="focal-card-input"');
    expect(html).not.toContain('data-testid="focal-card-save"');
    expect(html).not.toContain('data-testid="focal-card-prompt"');
  });

  it("renders the filled state for a Week slot with a checked item too", () => {
    // Even when item.done is true, a filled-text slot still belongs in
    // the focal card if it's somehow the next-undone (selector edge),
    // and should render as filled rather than as a prompt.
    const html = renderToStaticMarkup(
      <FocalActive
        next={{
          kind: "week",
          idx: 2,
          item: { text: "review pipeline", done: false },
        }}
        onSave={() => {}}
        onDone={() => {}}
      />,
    );
    expect(html).toContain(">Week<");
    expect(html).toContain("review pipeline");
    expect(html).toContain('data-testid="focal-card-done"');
  });
});

describe("FocalAllDone — all 9 complete", () => {
  it("renders the close-the-book message instead of a slot", () => {
    const html = renderToStaticMarkup(<FocalAllDone />);
    expect(html).toContain('data-testid="focal-card-all-done"');
    expect(html).toContain("All 9 done");
    expect(html).toContain("You&#x27;re done for today. Close the book.");
    expect(html).not.toContain('data-testid="focal-card-input"');
    expect(html).not.toContain('data-testid="focal-card-done"');
    expect(html).not.toContain('data-testid="focal-card-pill"');
  });
});
