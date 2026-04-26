import { useEffect, useMemo, useState, type ChangeEvent, type KeyboardEvent } from "react";

// Defaults mirror the cross-reserve travel pass-through entries in
// artifacts/practitioner-operating-plan/src/data/costRegistry.ts
// (`crossReserve.travel.flightPerWeek`, `crossReserve.travel.lodgingPerNight`,
// `crossReserve.travel.foodPerOnsiteDay`, plus the implicit 12-week / 30-day
// install shape used to derive `crossReserve.travel.totalPerInstall` and
// `crossReserve.year1.stickerPrice`). The receiving-reserve calculator below
// reads these as starting values; user edits stay local to this slide and do
// not mutate the registry.
const DEFAULTS = {
  flightPerReturn: 1000,
  lodgingPerNight: 250,
  foodPerDay: 100,
  installWeeks: 12,
  onsiteDays: 30,
} as const;

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

function readCorridorFromUrl(): CorridorInputs {
  if (typeof window === "undefined") {
    return {
      flight: DEFAULTS.flightPerReturn,
      lodging: DEFAULTS.lodgingPerNight,
      food: DEFAULTS.foodPerDay,
      installWeeks: DEFAULTS.installWeeks,
      onsiteDays: DEFAULTS.onsiteDays,
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    flight: parseQsNumber(params.get(QS_KEYS.flight), DEFAULTS.flightPerReturn, FIELD_MAX.flight),
    lodging: parseQsNumber(params.get(QS_KEYS.lodging), DEFAULTS.lodgingPerNight, FIELD_MAX.lodging),
    food: parseQsNumber(params.get(QS_KEYS.food), DEFAULTS.foodPerDay, FIELD_MAX.food),
    installWeeks: parseQsNumber(params.get(QS_KEYS.weeks), DEFAULTS.installWeeks, FIELD_MAX.weeks),
    onsiteDays: parseQsNumber(params.get(QS_KEYS.days), DEFAULTS.onsiteDays, FIELD_MAX.days),
  };
}

// These two stay constant in the calculator — the task scope is the
// receiving-reserve travel corridor, not the practitioner fee structure.
// They mirror `crossReserve.installRevenue.perReserve` (rounded to the
// $148.5k planning number used elsewhere in the slide) and
// `crossReserve.retainer.annual`.
const INSTALL_FEE = 148_500;
const Y1_RETAINER = 30_000;

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

function ReserveTwoCalculator() {
  // Lazy initializers so we read the share-link querystring exactly once on
  // mount. Bad / out-of-range values fall back to the cost-registry defaults
  // (or get clamped to FIELD_MAX) inside readCorridorFromUrl.
  const initial = useMemo(readCorridorFromUrl, []);
  const [flight, setFlight] = useState<number>(initial.flight);
  const [lodging, setLodging] = useState<number>(initial.lodging);
  const [food, setFood] = useState<number>(initial.food);
  const [installWeeks, setInstallWeeks] = useState<number>(initial.installWeeks);
  const [onsiteDays, setOnsiteDays] = useState<number>(initial.onsiteDays);

  const travelTotal = useMemo(
    () => flight * installWeeks + lodging * onsiteDays + food * onsiteDays,
    [flight, lodging, food, installWeeks, onsiteDays],
  );

  const y1AllIn = INSTALL_FEE + travelTotal + Y1_RETAINER;

  const isDefault =
    flight === DEFAULTS.flightPerReturn &&
    lodging === DEFAULTS.lodgingPerNight &&
    food === DEFAULTS.foodPerDay &&
    installWeeks === DEFAULTS.installWeeks &&
    onsiteDays === DEFAULTS.onsiteDays;

  // Sync corridor state -> URL querystring so the chief can copy the URL and
  // forward "here's our corridor's math" to a band manager. We only write the
  // params that diverge from the cost-registry defaults — the URL stays clean
  // when nothing has been customized, and Reset clears it back to no params.
  // history.replaceState (instead of pushState) keeps the back button useful
  // for slide navigation, and only mutating the search portion leaves the
  // pathname untouched so wouter's slide route doesn't rematch.
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
    writeOrDelete(QS_KEYS.flight, flight, DEFAULTS.flightPerReturn);
    writeOrDelete(QS_KEYS.lodging, lodging, DEFAULTS.lodgingPerNight);
    writeOrDelete(QS_KEYS.food, food, DEFAULTS.foodPerDay);
    writeOrDelete(QS_KEYS.weeks, installWeeks, DEFAULTS.installWeeks);
    writeOrDelete(QS_KEYS.days, onsiteDays, DEFAULTS.onsiteDays);

    const search = params.toString();
    const nextSearch = search ? `?${search}` : "";
    if (nextSearch !== window.location.search) {
      const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [flight, lodging, food, installWeeks, onsiteDays]);

  const reset = () => {
    setFlight(DEFAULTS.flightPerReturn);
    setLodging(DEFAULTS.lodgingPerNight);
    setFood(DEFAULTS.foodPerDay);
    setInstallWeeks(DEFAULTS.installWeeks);
    setOnsiteDays(DEFAULTS.onsiteDays);
  };

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
        <span className="font-semibold">$148.5k install</span> +{" "}
        <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatMoneyShort(travelTotal)} travel pass-through
        </span>{" "}
        + <span className="font-semibold">$30k Y1 retainer</span>.
      </div>

      <div
        className="flex items-baseline justify-between mb-[0.35vh] gap-[0.6vw]"
        style={{ color: "#e9c8a8" }}
      >
        <div className="font-mono uppercase tracking-[0.2em] text-[0.65vw] whitespace-nowrap">
          Your corridor · edits stay on this slide
        </div>
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
              <span className="font-semibold">Software is reusable; the install is paid premium.</span> Receiving reserve pays <span className="font-semibold">$3,500/on-site day · $1,800/remote day · $30k/yr retainer</span>. A 12-week install (~30 on-site + ~24 remote) lands at <span className="font-semibold">~$148.5k per reserve</span>, plus the recurring retainer. <span className="text-muted">Travel, lodging, food are passed through at cost — not in the fee. Try your own corridor's numbers in the panel on the right.</span>
            </div>
          </div>

          <ReserveTwoCalculator />
        </div>
      </div>
    </div>
  );
}
