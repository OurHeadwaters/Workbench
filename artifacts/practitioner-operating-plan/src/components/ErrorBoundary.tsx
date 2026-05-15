import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[SlideError]", this.props.label ?? "slide", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex items-center justify-center bg-bg">
          <div className="text-center px-12">
            <div
              className="font-mono uppercase tracking-widest text-[0.9vw] mb-[2vh]"
              style={{ color: "var(--slide-accent)" }}
            >
              Slide error{this.props.label ? ` — ${this.props.label}` : ""}
            </div>
            <div className="font-body text-paper opacity-60 text-[1.1vw] leading-relaxed max-w-[40vw]">
              {this.state.error?.message ?? "An unexpected error occurred rendering this slide."}
            </div>
            <button
              className="mt-[3vh] font-mono text-[0.85vw] uppercase tracking-widest text-paper/50 border border-paper/20 px-4 py-2 rounded hover:text-paper/80 hover:border-paper/40 transition-colors"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
