import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  slideTitle: string;
  slidePosition: number;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Per-slide error boundary so a runtime crash inside one slide
 * (e.g. a cross-package data binding that disappears, an asset that
 * 404s during render, a component import that explodes) shows an
 * inline "this slide failed to load" card on that one slide instead
 * of taking the whole deck down with a blank/white page.
 *
 * Mirrors `artifacts/deer-lake-store-plan/src/SlideErrorBoundary.tsx`
 * — same fallback structure, same dev-console surfacing — so both
 * sibling decks fail in the same recognisable way.
 *
 * Navigation (arrow keys, click/tap, the parent SlideViewer iframe
 * postMessage flow) keeps working because the error is contained here:
 * the App component above us still renders all slides into hidden
 * `<div>`s and just toggles which one is visible — only the broken
 * slide's subtree is replaced with this fallback.
 */
export class SlideErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface the failure in the dev console so we can see exactly
    // which slide tripped and why, without hijacking the user's view.
    console.error(
      `[practitioner-operating-plan] Slide ${this.props.slidePosition} ` +
        `("${this.props.slideTitle}") failed to render:`,
      error,
      info.componentStack,
    );
  }

  componentDidUpdate(prevProps: Props) {
    // Reset the error state when the boundary is reused for a different
    // slide (defensive — App keeps a per-slide key, so this shouldn't
    // normally happen).
    if (
      this.state.error !== null &&
      (prevProps.slidePosition !== this.props.slidePosition ||
        prevProps.slideTitle !== this.props.slideTitle)
    ) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="relative w-screen h-screen overflow-hidden bg-bg text-text flex items-center justify-center"
          data-testid={`slide-error-${this.props.slidePosition}`}
        >
          <div className="max-w-[60vw] px-[6vw] py-[6vh] text-center">
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1.5vh]">
              Slide {this.props.slidePosition} · couldn't load
            </div>
            <h2 className="font-display text-[2.4vw] leading-[1.15] tracking-tight text-primary font-medium mb-[2vh]">
              "{this.props.slideTitle}"
            </h2>
            <p className="font-body text-[1.05vw] leading-[1.5] text-muted mb-[2.5vh]">
              This slide hit an error while rendering. The rest of the deck is
              still working — use the arrow keys, swipe, or the slide picker to
              keep moving through the plan.
            </p>
            <details className="text-left text-[0.85vw] text-muted/80 leading-[1.4]">
              <summary className="cursor-pointer mb-[1vh]">
                Technical details
              </summary>
              <pre className="whitespace-pre-wrap break-words font-mono text-[0.8vw]">
                {this.state.error.message || String(this.state.error)}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
