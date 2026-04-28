import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";

import { SlideErrorBoundary } from "@/SlideErrorBoundary";
import {
  slides,
  lifestyleSlides,
  operatingSlides,
  getOperatingPhaseOpener,
  type LoadedSlide,
} from "@/slideLoader";
import OnePager from "@/pages/OnePager";
import BrandOnePager from "@/pages/BrandOnePager";
import Checklist from "@/pages/Checklist";
import HoursByPillar from "@/pages/HoursByPillar";
import Codetry from "@/pages/Codetry";
import CodetryTest from "@/pages/CodetryTest";
import CodetryVsLiterate from "@/pages/CodetryVsLiterate";
import NamingDiff from "@/pages/NamingDiff";
import LeaseTooling from "@/pages/LeaseTooling";
import PaybackMemo from "@/pages/PaybackMemo";
import SaltCoA from "@/pages/SaltCoA";
import SaltMonthlyClose from "@/pages/SaltMonthlyClose";
import StudioWindDown from "@/pages/StudioWindDown";
import InquiryTriage from "@/pages/InquiryTriage";
import Today from "@/pages/Today";
import Week from "@/pages/Week";
import WeekCloseOut from "@/pages/WeekCloseOut";
import Year from "@/pages/Year";
import CheckIn from "@/pages/CheckIn";
import CheckInNewSnapshot from "@/pages/CheckInNewSnapshot";
import CheckInHistory from "@/pages/CheckInHistory";
import { AppLayout } from "@/components/AppLayout";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { ToastProvider } from "@/components/Toast";
import { useAppState } from "@/lib/storage";

type SlideView = "operating" | "lifestyle";

// Path layout for the deck:
//   /plan                  → operating SlideViewer (default front door)
//   /lifestyle             → Lifestyle Design Philosophy SlideViewer
//   /slide{N}              → operating-order editor for slide N
//   /lifestyle/slide{N}    → lifestyle-order editor for slide N
//
// `viewFromPath` decides which ordered list the editor (and the parent
// SlideViewer iframe message bridge) should use for prev/next.
function viewFromPath(pathname: string): SlideView {
  return pathname.startsWith("/lifestyle") ? "lifestyle" : "operating";
}

function getSlideIndex(pathname: string, list: LoadedSlide[]): number {
  const match = pathname.match(/\/slide(\d+)$/);
  if (!match) return -1;
  const position = parseInt(match[1], 10);
  return list.findIndex((s) => s.position === position);
}

function SlideEditor() {
  const [location, navigate] = useLocation();
  const view = viewFromPath(location);
  const list = view === "lifestyle" ? lifestyleSlides : operatingSlides;
  const currentIndex = getSlideIndex(location, list);

  const slideHrefFor = (s: LoadedSlide) =>
    view === "lifestyle" ? `/lifestyle/slide${s.position}` : `/slide${s.position}`;

  // If the URL points at a position that doesn't exist in this view's
  // list (e.g. /lifestyle/slide39 for an operating-only phase opener),
  // fall back to the first slide in the view rather than rendering blank.
  useEffect(() => {
    if (currentIndex !== -1) return;
    const match = location.match(/\/slide\d+$/);
    if (!match) return;
    const fallback = list[0];
    if (fallback) navigate(slideHrefFor(fallback), { replace: true });
    // slideHrefFor is stable per view; navigate is from wouter and stable enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, location, view]);

  // In the workspace, the slide iframe is nested inside another iframe,
  // so window.parent !== window.parent.parent. In the deployed SlideViewer,
  // the parent is the top-level window, so they're equal. Disable local
  // navigation only in the workspace — the parent owns it there.
  const navigationDisabledRef = useRef(window.parent !== window.parent.parent);
  const touchHandledRefStable = useRef(false);

  useEffect(() => {
    if (currentIndex === -1) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (navigationDisabledRef.current) return;
      if (event.key === " ") {
        event.preventDefault();
      }
      if ((event.key === "ArrowLeft" || event.key === "ArrowUp") && currentIndex > 0) {
        navigate(slideHrefFor(list[currentIndex - 1]));
      }
      if (
        (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") &&
        currentIndex < list.length - 1
      ) {
        navigate(slideHrefFor(list[currentIndex + 1]));
      }
    };

    const INTERACTIVE =
      "a,button,video,audio,input,select,textarea,details,summary,iframe,svg,canvas," +
      '[role="button"],[contenteditable="true"]';

    const isInteractive = (target: EventTarget | null) =>
      (target as HTMLElement | null)?.closest?.(INTERACTIVE);

    const touchHandledRef = touchHandledRefStable;

    const onClick = (event: MouseEvent) => {
      if (touchHandledRef.current) {
        touchHandledRef.current = false;
        return;
      }
      if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
      if (isInteractive(event.target)) return;

      if (navigationDisabledRef.current) {
        window.parent.postMessage({ type: "advanceSlide" }, "*");
        return;
      }

      if (currentIndex < list.length - 1) {
        navigate(slideHrefFor(list[currentIndex + 1]));
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchTarget: EventTarget | null = null;

    const onTouchStart = (event: TouchEvent) => {
      touchHandledRef.current = false;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      touchTarget = event.target;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const dx = event.changedTouches[0].clientX - touchStartX;
      const dy = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) >= 10 || Math.abs(dy) >= 10) return;
      if (isInteractive(touchTarget)) return;
      touchHandledRef.current = true;

      if (navigationDisabledRef.current) {
        window.parent.postMessage({ type: "advanceSlide" }, "*");
        return;
      }

      const fraction = touchStartX / window.innerWidth;
      if (fraction < 0.4 && currentIndex > 0) {
        navigate(slideHrefFor(list[currentIndex - 1]));
      } else if (fraction >= 0.4 && currentIndex < list.length - 1) {
        navigate(slideHrefFor(list[currentIndex + 1]));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentIndex, list, navigate, view]);

  return (
    <div className="select-none">
      {list.map((slide, index) => (
        <div
          key={slide.id}
          style={{ display: index === currentIndex ? "block" : "none" }}
        >
          <SlideErrorBoundary
            slideTitle={slide.title}
            slidePosition={slide.position}
          >
            <slide.Component />
          </SlideErrorBoundary>
        </div>
      ))}
    </div>
  );
}

function AllSlides() {
  return (
    <div className="bg-black">
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="slide relative aspect-video overflow-hidden"
          style={{ width: "1920px", height: "1080px" }}
        >
          <div className="h-full w-full [&_.h-screen]:!h-full [&_.w-screen]:!w-full">
            <SlideErrorBoundary
              slideTitle={slide.title}
              slidePosition={slide.position}
            >
              <slide.Component />
            </SlideErrorBoundary>
          </div>
        </div>
      ))}
    </div>
  );
}

// Full-bleed slide deck viewer. Used by both `/plan` (operating) and
// `/lifestyle` (Lifestyle Design Philosophy).
function SlideViewer({ view }: { view: SlideView }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [dims, setDims] = useState(() => ({
    width: Math.min(window.innerWidth, window.innerHeight * (16 / 9)),
    height: Math.min(window.innerHeight, window.innerWidth * (9 / 16)),
  }));

  const state = useAppState();
  const activePhase = state.currentPhase;

  // Operating view lands at the current phase's opener; lifestyle always
  // starts at slide 1. This is what makes "open the book and you're at
  // the phase you're standing in" work without slide 1 stealing the show.
  const firstSlide = useMemo(() => {
    if (view === "lifestyle") return lifestyleSlides[0];
    const opener = getOperatingPhaseOpener(activePhase);
    return opener ?? operatingSlides[0];
  }, [view, activePhase]);

  useEffect(() => {
    const update = () => {
      setDims({
        width: Math.min(window.innerWidth, window.innerHeight * (16 / 9)),
        height: Math.min(window.innerHeight, window.innerWidth * (9 / 16)),
      });
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== " ") return;
      if (event.key === " ") event.preventDefault();
      iframeRef.current?.contentWindow?.dispatchEvent(
        new KeyboardEvent("keydown", { key: event.key, code: event.code, bubbles: true }),
      );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const firstPosition = firstSlide?.position ?? 1;
  const slidePath =
    view === "lifestyle"
      ? `${base}/lifestyle/slide${firstPosition}`
      : `${base}/slide${firstPosition}`;

  return (
    <div
      className="slide-viewer relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center"
      onClick={() => iframeRef.current?.focus()}
    >
      <iframe
        ref={iframeRef}
        src={slidePath}
        style={{ width: dims.width, height: dims.height, border: "none" }}
        onLoad={() => iframeRef.current?.focus()}
        title={view === "lifestyle" ? "Lifestyle slides" : "Operating plan slides"}
      />
      {/* Floating phase indicator so the practitioner can see and change
          the active phase from inside the deck without having to leave
          the full-bleed view. Click swallowed so the iframe doesn't steal
          focus. */}
      <div
        className="absolute right-4 top-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <PhaseIndicator variant="light" />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="space-y-4 py-8 text-center">
      <p className="text-xs uppercase tracking-widest text-stone-500">
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
        That page isn&rsquo;t part of the plan.
      </h1>
      <p className="text-sm text-stone-600">
        <Link href="/today" className="underline">
          Back to today
        </Link>
      </p>
    </div>
  );
}

export default function App() {
  const [location, navigate] = useLocation();

  // /today is the canonical front door. Bare / redirects there; unknown
  // routes fall through the Switch below to a real 404 instead of being
  // silently rewritten.
  useEffect(() => {
    if (location === "/") {
      navigate("/today", { replace: true });
    }
  }, [location, navigate]);

  // Allow the parent slides preview frame to navigate between slides via
  // postMessage so it can avoid changing the iframe src (which causes a
  // white flash). Required for the slides workspace UI.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "navigateToSlide" &&
        typeof event.data.position === "number" &&
        slides.some((s) => s.position === event.data.position)
      ) {
        // The workspace preview always uses the operating-order URL scheme.
        navigate(`/slide${event.data.position}`);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate]);

  // Slide-editor and all-slides views are full-bleed and rendered without
  // the app chrome — they're consumed by the workspace preview iframe and
  // by the export pipeline respectively.
  if (location === "/allslides") return <AllSlides />;
  if (
    /^\/slide\d+$/.test(location) ||
    /^\/lifestyle\/slide\d+$/.test(location)
  ) {
    return <SlideEditor />;
  }

  // Plan + Lifestyle SlideViewers also render full-bleed (they embed the
  // slides iframe).
  if (location === "/plan") return <SlideViewer view="operating" />;
  if (location === "/lifestyle") return <SlideViewer view="lifestyle" />;

  // OnePager and BrandOnePager keep their own self-contained chrome.
  if (location === "/onepager") return <OnePager />;
  if (location === "/brand") return <BrandOnePager />;

  // Checklist is also a self-contained printable page (no app chrome).
  if (location === "/checklist") return <Checklist />;
  if (location === "/hours") return <HoursByPillar />;
  if (location === "/lease-tooling") return <LeaseTooling />;
  if (location === "/payback-memo") return <PaybackMemo />;
  if (location === "/salt-coa") return <SaltCoA />;
  if (location === "/codetry") return <Codetry />;
  if (location === "/codetry-test") return <CodetryTest />;
  if (location === "/codetry-vs-literate") return <CodetryVsLiterate />;
  // /naming-diff is intentionally NOT routed here — it lives inside
  // AppLayout (the workbench surface) so it picks up the same chrome
  // and nav as Today / Week / Year.
  if (location === "/salt-monthly-close") return <SaltMonthlyClose />;
  if (location === "/studio-wind-down") return <StudioWindDown />;
  if (location === "/inquiry-triage") return <InquiryTriage />;

  return (
    <ToastProvider>
      <AppLayout>
        <Switch>
          <Route path="/today" component={Today} />
          <Route path="/week/close-out" component={WeekCloseOut} />
          <Route path="/week" component={Week} />
          <Route path="/year" component={Year} />
          <Route path="/naming-diff" component={NamingDiff} />
          <Route path="/year/check-in" component={CheckIn} />
          <Route path="/year/check-in/new" component={CheckInNewSnapshot} />
          <Route path="/year/check-in/history" component={CheckInHistory} />
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    </ToastProvider>
  );
}
