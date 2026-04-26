import { useEffect, useMemo, useState, type ChangeEvent, type KeyboardEvent } from "react";

import {
  resolveCost,
  getLiveCostValue,
  CROSS_RESERVE_INSTALL_WEEKS,
  CROSS_RESERVE_ONSITE_DAYS,
  CROSS_RESERVE_REMOTE_DAYS,
} from "@workspace/practitioner-operating-plan/budgetMath";
import { useAppState } from "@workspace/practitioner-operating-plan/storage";
import type { AppState } from "@workspace/practitioner-operating-plan/storage";

// Same liveDerived helper pattern as PathToScale / ThreeRevenueLayers:
// any id we read from getLiveCostValue here is meant to be live-bound,
// so a null result means budgetMath drifted away from the registry —
// fail loudly in dev instead of silently rendering a zero.
function liveDerived(state: AppState, id: string): number {
  const v = getLiveCostValue(state, id);
  if (v == null) {
    throw new Error(
      `FirstReserveThenTheNext: no live derivation for cost id "${id}". ` +
        `Add a case in the practitioner-operating-plan budgetMath.ts:` +
        `getLiveCostValue or remove the binding.`,
    );
  }
  return v;
}

// 12-week / 30-on-site / 24-remote install shape is the single source
// of truth in the shared `@workspace/cross-reserve-corridor` package
// (`CORRIDOR_INSTALL_SHAPE.{installWeeks, onsiteDays, remoteDays}`),
// re-exported through the practitioner-operating-plan budgetMath
// module the registry uses. Holding it constant in the calculator
// keeps the scope of this corridor panel exactly the receiving-reserve
// travel inputs (flight / lodging / food per-diem) — the install
// length is a scoping decision, not a corridor variable a chief
// would tune. Sourcing the numbers from the shared package means the
// body copy below ("12-week install (~30 on-site + ~24 remote)"),
// the calculator's initial values, and the registry derivations
// cannot drift apart. The drift-prevention story for the *tunable*
// corridor values (day rates, retainer, install fee, travel per-diem
// defaults) is even stronger: the `useAppState`-backed reads below
// pick up live edits from the Practitioner Operating Plan's
// cost-review modal, so the cost registry — which itself imports
// from `@workspace/cross-reserve-corridor` — is the single source of
// truth at runtime, not just at build time.
// `scripts/check-corridor-defaults.ts` runs as part of `pnpm check`
// and refuses to ship if this file regresses away from the
// live-binding pattern.
const INSTALL_WEEKS = CROSS_RESERVE_INSTALL_WEEKS;
const ON_SITE_DAYS = CROSS_RESERVE_ONSITE_DAYS;
const REMOTE_DAYS = CROSS_RESERVE_REMOTE_DAYS;

// Per-field maxes mirror the bounds the CalcInput component clamps to. They
// also bound what we'll accept from the URL querystring before falling back
// to defaults.
const FIELD_MAX = {
  flight: 20_000,
  lodging: 5_000,
  food: 2_000,
  weeks: 52,
  days: 365,
} as const;

// Querystring keys used for the share-link encoding. Kept short on purpose so
// the URL a chief copy-pastes into an email stays readable.
const QS_KEYS = {
  flight: "flight",
  lodging: "lodging",
  food: "food",
  weeks: "weeks",
  days: "days",
} as const;

function parseQsNumber(raw: string | null, fallback: number, max: number): number {
  if (raw === null || raw === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  if (parsed < 0) return fallback;
  if (parsed > max) return max;
  return parsed;
}

interface CorridorInputs {
  flight: number;
  lodging: number;
  food: number;
  installWeeks: number;
  onsiteDays: number;
}

// Read the corridor from the URL querystring at mount, falling back to the
// live registry defaults passed in by the parent. Bad / out-of-range values
// also fall back to the registry defaults (or get clamped to FIELD_MAX).
// Defaults flow in from the cost registry (via resolveCost in the parent
// component) so a chief opening a stale link picks up whatever the current
// canonical numbers are, not a stale build-time literal.
function readCorridorFromUrl(defaults: CorridorInputs): CorridorInputs {
  if (typeof window === "undefined") {
    return defaults;
  }
  const params = new URLSearchParams(window.location.search);
  return {
    flight: parseQsNumber(params.get(QS_KEYS.flight), defaults.flight, FIELD_MAX.flight),
    lodging: parseQsNumber(params.get(QS_KEYS.lodging), defaults.lodging, FIELD_MAX.lodging),
    food: parseQsNumber(params.get(QS_KEYS.food), defaults.food, FIELD_MAX.food),
    installWeeks: parseQsNumber(params.get(QS_KEYS.weeks), defaults.installWeeks, FIELD_MAX.weeks),
    onsiteDays: parseQsNumber(params.get(QS_KEYS.days), defaults.onsiteDays, FIELD_MAX.days),
  };
}

function roundToNearest(value: number, step: number) {
  return Math.round(value / step) * step;
}

function formatMoney(value: number, step = 500) {
  const rounded = roundToNearest(value, step);
  return `$${rounded.toLocaleString("en-CA")}`;
}

function formatMoneyShort(value: number) {
  // ~$22.5k style for the body summary line.
  const rounded = roundToNearest(value, 500);
  if (Math.abs(rounded) >= 1000) {
    const k = rounded / 1000;
    const formatted = Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1);
    return `~$${formatted}k`;
  }
  return `$${rounded.toLocaleString("en-CA")}`;
}

// Planning round-UP to the nearest $500 then a kibi label — mirrors the
// ThreeRevenueLayers slide so "$148.5k install" stays visually identical
// across the two decks for a reader holding both side-by-side.
function formatPlanningK(value: number) {
  const rounded = Math.ceil(value / 500) * 500;
  const k = rounded / 1000;
  const formatted = Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1);
  return `$${formatted}k`;
}

// `$30k` — round-nearest-1k for the recurring retainer label.
function formatCompactK(value: number) {
  const k = Math.round(value / 1000);
  return `$${k}k`;
}

// `$3,500` — exact dollars for the bottom-left card's day-rate / retainer
// quote. Mirrors the formatDollars used on ThreeRevenueLayers so the two
// decks read with the same precision.
function formatDollars(value: number) {
  return "$" + Math.round(value).toLocaleString("en-CA");
}

interface CalcInputProps {
  label: string;
  value: number;
  onChange: (next: number) => void;
  prefix?: string;
  suffix?: string;
  max: number;
  ariaLabel: string;
}

function CalcInput({ label, value, onChange, prefix, suffix, max, ariaLabel }: CalcInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (raw === "") {
      onChange(0);
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    if (parsed < 0) {
      onChange(0);
      return;
    }
    if (parsed > max) {
      onChange(max);
      return;
    }
    onChange(parsed);
  };

  // Stop arrow / space keys from bubbling up to the slide-level navigation
  // handler in src/App.tsx — otherwise typing in the field would advance the
  // slide.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <label className="flex items-center gap-[0.4vw] leading-[1.2]">
      <span className="text-[0.78vw] whitespace-nowrap" style={{ color: "#e9c8a8" }}>
        {label}
      </span>
      <span
        className="inline-flex items-center rounded-[0.2vw] px-[0.35vw] py-[0.1vh]"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          border: "0.05vw solid rgba(233, 200, 168, 0.35)",
        }}
      >
        {prefix ? (
          <span className="font-mono text-[0.75vw] mr-[0.15vw]" style={{ color: "#e9c8a8" }}>
            {prefix}
          </span>
        ) : null}
        <input
          aria-label={ariaLabel}
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={(event) => event.stopPropagation()}
          className="bg-transparent border-0 outline-none text-[0.85vw] font-semibold w-[2.6vw] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ color: "var(--slide-bg)", fontVariantNumeric: "tabular-nums" }}
        />
        {suffix ? (
          <span className="font-mono text-[0.75vw] ml-[0.15vw]" style={{ color: "#e9c8a8" }}>
            {suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}

interface ReserveTwoCalculatorProps {
  flightPerWeekDefault: number;
  lodgingPerNightDefault: number;
  foodPerDayDefault: number;
  installFee: number;
  y1Retainer: number;
}

function ReserveTwoCalculator({
  flightPerWeekDefault,
  lodgingPerNightDefault,
  foodPerDayDefault,
  installFee,
  y1Retainer,
}: ReserveTwoCalculatorProps) {
  // Lazy initializers so we read the share-link querystring exactly once on
  // mount, falling back to the live registry defaults that the parent
  // resolved via resolveCost. Bad / out-of-range URL values fall back to the
  // same registry defaults (or get clamped to FIELD_MAX) inside
  // readCorridorFromUrl.
  const initial = useMemo(
    () =>
      readCorridorFromUrl({
        flight: flightPerWeekDefault,
        lodging: lodgingPerNightDefault,
        food: foodPerDayDefault,
        installWeeks: INSTALL_WEEKS,
        onsiteDays: ON_SITE_DAYS,
      }),
    // We intentionally read defaults once at mount; live registry edits made
    // afterward update the Reset target / isDefault check below, but they
    // don't blow away values the user explicitly typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [flight, setFlight] = useState<number>(initial.flight);
  const [lodging, setLodging] = useState<number>(initial.lodging);
  const [food, setFood] = useState<number>(initial.food);
  const [installWeeks, setInstallWeeks] = useState<number>(initial.installWeeks);
  const [onsiteDays, setOnsiteDays] = useState<number>(initial.onsiteDays);
  // "idle" | "copied" | "error" — drives the brief confirmation text on the
  // share-link button. We reset back to "idle" after ~2s so the button label
  // returns to its default state.
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const travelTotal = useMemo(
    () => flight * installWeeks + lodging * onsiteDays + food * onsiteDays,
    [flight, lodging, food, installWeeks, onsiteDays],
  );

  const y1AllIn = installFee + travelTotal + y1Retainer;

  // "Default" = matches the live registry defaults at this moment. If
  // the registry moves underneath us (a council edit in the cost-review
  // modal), the locally-typed corridor stays where the user put it but
  // the Reset button starts pointing at the new registry values, so a
  // single click brings the calculator back in sync.
  const isDefault =
    flight === flightPerWeekDefault &&
    lodging === lodgingPerNightDefault &&
    food === foodPerDayDefault &&
    installWeeks === INSTALL_WEEKS &&
    onsiteDays === ON_SITE_DAYS;

  // Sync corridor state -> URL querystring so the chief can copy the URL and
  // forward "here's our corridor's math" to a band manager. We only write the
  // params that diverge from the live registry defaults — the URL stays clean
  // when the user matches whatever the current canonical numbers are, and
  // Reset clears it back to no params. history.replaceState (instead of
  // pushState) keeps the back button useful for slide navigation, and only
  // mutating the search portion leaves the pathname untouched so wouter's
  // slide route doesn't rematch.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const writeOrDelete = (key: string, value: number, dflt: number) => {
      if (value === dflt) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    };
    writeOrDelete(QS_KEYS.flight, flight, flightPerWeekDefault);
    writeOrDelete(QS_KEYS.lodging, lodging, lodgingPerNightDefault);
    writeOrDelete(QS_KEYS.food, food, foodPerDayDefault);
    writeOrDelete(QS_KEYS.weeks, installWeeks, INSTALL_WEEKS);
    writeOrDelete(QS_KEYS.days, onsiteDays, ON_SITE_DAYS);

    const search = params.toString();
    const nextSearch = search ? `?${search}` : "";
    if (nextSearch !== window.location.search) {
      const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [
    flight,
    lodging,
    food,
    installWeeks,
    onsiteDays,
    flightPerWeekDefault,
    lodgingPerNightDefault,
    foodPerDayDefault,
  ]);

  const reset = () => {
    setFlight(flightPerWeekDefault);
    setLodging(lodgingPerNightDefault);
    setFood(foodPerDayDefault);
    setInstallWeeks(INSTALL_WEEKS);
    setOnsiteDays(ON_SITE_DAYS);
  };

  // Auto-clear the "Copied!" / "Copy failed" confirmation after ~2s so the
  // button settles back to its default label. Cleanup cancels the timer if
  // the user clicks again before it fires.
  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const copyShareLink = async () => {
    if (typeof window === "undefined") return;
    // Build a share URL that opens the wrapped SlideViewer (deck chrome:
    // slide selector, prev/next nav, progress) and pre-selects this slide,
    // forwarding the corridor querystring through to the iframe so the
    // calculator hydrates with the same numbers. The bare /slide12 page
    // remains a working fallback for direct visits.
    //
    // Same-origin trick: this slide and the SlideViewer are served from the
    // same artifact origin, so window.location.origin is the right host
    // whether we're standalone at /slide12 or nested inside SlideViewer.
    // window.location.pathname always carries the artifact base + /slide{N},
    // so we can recover this slide's position without hardcoding it.
    const positionMatch = window.location.pathname.match(/\/slide(\d+)(?:\/|$)/);
    const position = positionMatch ? positionMatch[1] : "12";
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");

    const sourceParams = new URLSearchParams(window.location.search);
    sourceParams.delete("slide");
    const shareParams = new URLSearchParams();
    shareParams.set("slide", position);
    for (const [key, value] of sourceParams) {
      shareParams.set(key, value);
    }

    const url = `${window.location.origin}${base}/?${shareParams.toString()}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopyState("copied");
        return;
      }
      throw new Error("Clipboard API unavailable");
    } catch {
      // Fallback for older browsers / non-secure contexts where
      // navigator.clipboard isn't available: a hidden textarea + execCommand.
      try {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopyState(ok ? "copied" : "error");
      } catch {
        setCopyState("error");
      }
    }
  };

  const copyLabel =
    copyState === "copied" ? "✓ Copied!" : copyState === "error" ? "Copy failed" : "⧉ Copy share link";

  return (
    <div
      className="col-span-5 rounded-[0.4vw] px-[1.2vw] py-[1vh] flex flex-col"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="flex items-baseline justify-between mb-[0.3vh]"
        style={{ color: "#e9c8a8" }}
      >
        <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw]">
          Reserve #2 · Y1 all-in
        </div>
        <div
          className="font-display text-[1.6vw] font-medium"
          style={{ color: "var(--slide-bg)", fontVariantNumeric: "tabular-nums" }}
          aria-live="polite"
        >
          ~{formatMoney(y1AllIn, 500)}
        </div>
      </div>
      <div
        className="font-body text-[0.9vw] leading-[1.3] mb-[0.5vh]"
        style={{ color: "var(--slide-bg)" }}
      >
        <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatPlanningK(installFee)} install
        </span>{" "}
        +{" "}
        <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatMoneyShort(travelTotal)} travel pass-through
        </span>{" "}
        +{" "}
        <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatCompactK(y1Retainer)} Y1 retainer
        </span>
        .
      </div>

      <div
        className="flex items-baseline justify-between mb-[0.35vh] gap-[0.6vw]"
        style={{ color: "#e9c8a8" }}
      >
        <div className="font-mono uppercase tracking-[0.2em] text-[0.65vw] whitespace-nowrap">
          Your corridor · edits stay on this slide
        </div>
        <div className="flex items-center gap-[0.35vw]">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              void copyShareLink();
            }}
            className="font-mono uppercase tracking-[0.16em] text-[0.6vw] rounded-[0.2vw] px-[0.4vw] py-[0.15vh] transition-opacity cursor-pointer whitespace-nowrap"
            style={{
              color: "#e9c8a8",
              border: "0.05vw solid rgba(233, 200, 168, 0.5)",
              background: "rgba(255, 255, 255, 0.04)",
            }}
            aria-label="Copy a share link with the current corridor inputs to the clipboard"
            aria-live="polite"
          >
            {copyLabel}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              reset();
            }}
            disabled={isDefault}
            className="font-mono uppercase tracking-[0.16em] text-[0.6vw] rounded-[0.2vw] px-[0.4vw] py-[0.15vh] transition-opacity disabled:opacity-40 disabled:cursor-default cursor-pointer whitespace-nowrap"
            style={{
              color: "#e9c8a8",
              border: "0.05vw solid rgba(233, 200, 168, 0.5)",
              background: "rgba(255, 255, 255, 0.04)",
            }}
            aria-label="Reset corridor inputs to Deer Lake defaults"
          >
            ↻ Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-[0.6vw] gap-y-[0.35vh] mb-[0.5vh]">
        <CalcInput
          label="Flight"
          prefix="$"
          suffix="/return"
          value={flight}
          onChange={setFlight}
          max={20000}
          ariaLabel="Round-trip flight cost in dollars"
        />
        <CalcInput
          label="Lodging"
          prefix="$"
          suffix="/night"
          value={lodging}
          onChange={setLodging}
          max={5000}
          ariaLabel="Lodging cost per on-site night in dollars"
        />
        <CalcInput
          label="Food"
          prefix="$"
          suffix="/day"
          value={food}
          onChange={setFood}
          max={2000}
          ariaLabel="Food cost per on-site day in dollars"
        />
        <CalcInput
          label="Install"
          value={installWeeks}
          onChange={setInstallWeeks}
          suffix="wks"
          max={52}
          ariaLabel="Install length in weeks (one return flight per week)"
        />
        <CalcInput
          label="On-site"
          value={onsiteDays}
          onChange={setOnsiteDays}
          suffix="days"
          max={365}
          ariaLabel="Number of on-site days (also nights of lodging)"
        />
        <div
          className="font-mono text-[0.7vw] leading-[1.2] self-center text-right whitespace-nowrap"
          style={{ color: "#e9c8a8", fontVariantNumeric: "tabular-nums" }}
        >
          travel = {formatMoney(travelTotal, 100)}
        </div>
      </div>

      <div className="font-body text-[0.7vw] leading-[1.3]" style={{ color: "#e9c8a8" }}>
        Planning estimate ·{" "}
        {isDefault ? "Deer Lake corridor defaults" : "your corridor"} · weeks × flight + days × (lodging + food).
      </div>
    </div>
  );
}

export default function FirstReserveThenTheNext() {
  // One subscription to the same live state the practitioner deck uses.
  // The cost-review modal lives in @workspace/practitioner-operating-plan
  // and writes through the same storage module — within a tab a fresh
  // page load picks up the latest values, and across tabs the existing
  // `storage` event listener in storage.ts fans changes out live so this
  // slide and the Three Revenue Layers slide never drift apart.
  const state = useAppState();

  const onsiteDayRate = resolveCost(state, "crossReserve.dayRate.onsite");
  const remoteDayRate = resolveCost(state, "crossReserve.dayRate.remote");
  const retainerAnnual = resolveCost(state, "crossReserve.retainer.annual");
  const installPerReserve = liveDerived(
    state,
    "crossReserve.installRevenue.perReserve",
  );
  const flightPerWeek = resolveCost(state, "crossReserve.travel.flightPerWeek");
  const lodgingPerNight = resolveCost(
    state,
    "crossReserve.travel.lodgingPerNight",
  );
  const foodPerOnsiteDay = resolveCost(
    state,
    "crossReserve.travel.foodPerOnsiteDay",
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            What this is the start of
          </div>
          <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
            First reserve.
            <span className="italic font-normal text-accent"> Then the next.</span>
          </h2>
        </div>

        <div
          className="rounded-[0.4vw] p-[2.4vw] mb-[2.5vh]"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div
            className="font-mono uppercase tracking-[0.22em] text-[1.05vw] mb-[1.2vh]"
            style={{ color: "#e9c8a8" }}
          >
            The premise
          </div>
          <div className="font-display italic text-[2.1vw] leading-[1.25]">
            Northern reserves need infrastructure as materially good as anything in the south, built on the foundation that's actually there, with materials and methods that fit it.
            <span className="not-italic font-medium"> Not less. Different.</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.6vw] min-h-0 mb-[2vh]">
          <div className="rounded-[0.4vw] p-[1.8vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">THE SOFTWARE</div>
            <div className="font-display text-[1.65vw] leading-tight text-primary font-medium mb-[1vh]">
              Built once. Owned by the band that bought it. Reusable on the next reserve.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              The till, the price dashboard, the household lookup, the offline-first stack, the bookkeeping pipeline. Source code and data sit with the band that ordered it. The next community gets a working system on day one — not a slide deck.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.8vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">THE TRAINING</div>
            <div className="font-display text-[1.65vw] leading-tight text-primary font-medium mb-[1vh]">
              The practitioner travels reserve to reserve. Deer Lake grads steward Deer Lake.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              The practitioner is the cross-reserve discipline-keeper — the one who shows up at reserve #2, #3, #4 to install Codetry until it's the norm there. Deer Lake graduates are the local stewards of <em>their own</em> store's discipline; they don't get sent on the road. An Indigenous education partner co-runs every install. The next reserve doesn't start from scratch — they start from what worked here, adapted to who they are.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.8vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1vw] text-accent font-semibold mb-[1vh]">THE TRANSPARENCY STACK</div>
            <div className="font-display text-[1.65vw] leading-tight text-primary font-medium mb-[1vh]">
              The patterns travel. The audit clause travels.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              Public price dashboard, household lookup, year-end value-delivered audit with the forward-credit clause. The shape of "you can see what we charged and what we delivered" is the part the next council can hold us to from day one.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-[1.2vw]">
          <div
            className="col-span-7 rounded-[0.4vw] px-[1.6vw] py-[1.3vh]"
            style={{ background: "var(--slide-paper)", borderLeft: "0.4vw solid var(--slide-accent)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent mb-[0.5vh]">
              Practitioner revenue · per install
            </div>
            <div className="font-body text-[1vw] text-primary leading-[1.4]">
              <span className="font-semibold">Software is reusable; the install is paid premium.</span> Receiving reserve pays{" "}
              <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatDollars(onsiteDayRate)}/on-site day · {formatDollars(remoteDayRate)}/remote day · {formatCompactK(retainerAnnual)}/yr retainer
              </span>
              . A {INSTALL_WEEKS}-week install (~{ON_SITE_DAYS} on-site + ~{REMOTE_DAYS} remote) lands at{" "}
              <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
                ~{formatPlanningK(installPerReserve)} per reserve
              </span>
              , plus the recurring retainer. <span className="text-muted">Travel, lodging, food are passed through at cost — not in the fee. Try your own corridor's numbers in the panel on the right.</span>
            </div>
          </div>

          <ReserveTwoCalculator
            flightPerWeekDefault={flightPerWeek}
            lodgingPerNightDefault={lodgingPerNight}
            foodPerDayDefault={foodPerOnsiteDay}
            installFee={installPerReserve}
            y1Retainer={retainerAnnual}
          />
        </div>
      </div>
    </div>
  );
}
