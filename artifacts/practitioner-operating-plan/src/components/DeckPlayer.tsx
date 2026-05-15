import { useEffect, useCallback, ComponentType } from "react";
import { useLocation, Link } from "wouter";
import { ErrorBoundary } from "./ErrorBoundary";
import manifest from "../data/slides-manifest.json";

import Prologue from "../pages/slides/Prologue";
import Cover from "../pages/slides/Cover";
import SlabVsGrassland from "../pages/slides/SlabVsGrassland";
import Budget from "../pages/slides/Budget";
import CaseForRate from "../pages/slides/CaseForRate";
import CashFlow from "../pages/slides/CashFlow";
import BridgeFunding from "../pages/slides/BridgeFunding";
import SecondAnchorScenarios from "../pages/slides/SecondAnchorScenarios";
import PathToScale from "../pages/slides/PathToScale";
import Closing from "../pages/slides/Closing";
import HiringHandyman from "../pages/slides/HiringHandyman";
import HiringBookkeeper from "../pages/slides/HiringBookkeeper";
import HiringOpsManager from "../pages/slides/HiringOpsManager";
import PaperworkVSC from "../pages/slides/PaperworkVSC";
import PaperworkNDA from "../pages/slides/PaperworkNDA";
import PaperworkContractor from "../pages/slides/PaperworkContractor";
import PaperworkPaidTrial from "../pages/slides/PaperworkPaidTrial";
import SaltKlaviyo from "../pages/slides/SaltKlaviyo";
import SaltOpsNote from "../pages/slides/SaltOpsNote";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const COMPONENTS: ComponentType[] = [
  Prologue,
  Cover,
  SlabVsGrassland,
  Budget,
  CaseForRate,
  CashFlow,
  BridgeFunding,
  SecondAnchorScenarios,
  PathToScale,
  Closing,
  HiringHandyman,
  HiringBookkeeper,
  HiringOpsManager,
  PaperworkVSC,
  PaperworkNDA,
  PaperworkContractor,
  PaperworkPaidTrial,
  SaltKlaviyo,
  SaltOpsNote,
];

const SORTED = [...manifest].sort((a, b) => a.position - b.position);
const TOTAL = SORTED.length;

if (import.meta.env.DEV && COMPONENTS.length !== TOTAL) {
  throw new Error(
    `[DeckPlayer] COMPONENTS array (${COMPONENTS.length}) is out of sync with slides-manifest.json (${TOTAL} slides). ` +
    `Add or remove entries in COMPONENTS to match the manifest.`,
  );
}

function slidePath(idx: number) {
  return `${BASE}/slide${idx + 1}`;
}

function currentIndex(location: string): number {
  for (let i = 0; i < TOTAL; i++) {
    const p = slidePath(i);
    if (location === p || location.startsWith(p + "/")) return i;
  }
  return -1;
}

export default function DeckPlayer() {
  const [location, navigate] = useLocation();

  const idx = currentIndex(location);
  const isOnSlide = idx !== -1;

  useEffect(() => {
    if (!isOnSlide) {
      navigate(slidePath(0), { replace: true });
    }
  }, [isOnSlide, navigate]);

  const goTo = useCallback(
    (next: number) => {
      if (next >= 0 && next < TOTAL) navigate(slidePath(next));
    },
    [navigate],
  );

  useEffect(() => {
    if (!isOnSlide) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(idx + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(idx - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOnSlide, idx, goTo]);

  if (!isOnSlide) return null;

  const SlideComponent = COMPONENTS[idx];
  const slideTitle = SORTED[idx]?.title ?? `Slide ${idx + 1}`;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      <ErrorBoundary key={idx} label={slideTitle}>
        <SlideComponent />
      </ErrorBoundary>

      {/* Left / right hit-zones + arrow buttons */}
      <button
        aria-label="Previous slide"
        onClick={() => goTo(idx - 1)}
        disabled={idx === 0}
        className="absolute left-0 top-0 h-full w-[10vw] z-50 flex items-center justify-start pl-[2vw] group focus:outline-none"
        style={{ background: "transparent" }}
      >
        <span
          className={[
            "flex items-center justify-center w-[2.8vw] h-[2.8vw] rounded-full border transition-all duration-150",
            idx === 0
              ? "opacity-0 pointer-events-none"
              : "opacity-0 group-hover:opacity-100 border-paper/30 bg-bg/60 text-paper/80 hover:bg-bg/90 hover:border-paper/60",
          ].join(" ")}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-[1.1vw] h-[1.1vw]">
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      <button
        aria-label="Next slide"
        onClick={() => goTo(idx + 1)}
        disabled={idx === TOTAL - 1}
        className="absolute right-0 top-0 h-full w-[10vw] z-50 flex items-center justify-end pr-[2vw] group focus:outline-none"
        style={{ background: "transparent" }}
      >
        <span
          className={[
            "flex items-center justify-center w-[2.8vw] h-[2.8vw] rounded-full border transition-all duration-150",
            idx === TOTAL - 1
              ? "opacity-0 pointer-events-none"
              : "opacity-0 group-hover:opacity-100 border-paper/30 bg-bg/60 text-paper/80 hover:bg-bg/90 hover:border-paper/60",
          ].join(" ")}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-[1.1vw] h-[1.1vw]">
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {/* Bottom HUD: thumbnail strip + counter */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 flex items-end justify-between px-[3vw] pb-[1.8vh] pt-[3vh]"
        style={{
          background:
            "linear-gradient(to top, rgba(31,61,46,0.82) 0%, rgba(31,61,46,0.0) 100%)",
        }}
      >
        {/* Thumbnail strip */}
        <div className="flex items-center gap-[0.5vw]">
          {SORTED.map((slide, i) => (
            <button
              key={slide.id}
              aria-label={`Go to slide ${i + 1}: ${slide.title}`}
              onClick={() => goTo(i)}
              className="group flex flex-col items-center gap-[0.3vh] focus:outline-none"
            >
              <div
                className={[
                  "h-[0.35vh] rounded-full transition-all duration-200",
                  i === idx
                    ? "w-[3.5vw]"
                    : "w-[1.8vw] group-hover:w-[2.4vw]",
                ].join(" ")}
                style={{
                  background:
                    i === idx
                      ? "var(--slide-accent)"
                      : i < idx
                      ? "rgba(244,237,224,0.55)"
                      : "rgba(244,237,224,0.22)",
                }}
              />
              <span
                className={[
                  "font-mono uppercase tracking-widest transition-all duration-150 leading-none",
                  i === idx
                    ? "text-paper opacity-90"
                    : "text-paper opacity-30 group-hover:opacity-60",
                ].join(" ")}
                style={{ fontSize: "0.62vw" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>

        {/* Right side: slide counter + tools link */}
        <div className="flex items-center gap-[1.4vw]">
          <Link
            href={`${BASE}/tools`}
            className="font-mono uppercase tracking-[0.18em] text-paper/45 hover:text-paper/80 transition-colors duration-150"
            style={{ fontSize: "0.72vw", textDecoration: "none" }}
          >
            Tools ↗
          </Link>
          <div className="flex items-center gap-[0.6vw] font-mono text-paper/60" style={{ fontSize: "0.9vw" }}>
            <span style={{ color: "var(--slide-accent)" }}>{idx + 1}</span>
            <span className="opacity-30">/</span>
            <span>{TOTAL}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
