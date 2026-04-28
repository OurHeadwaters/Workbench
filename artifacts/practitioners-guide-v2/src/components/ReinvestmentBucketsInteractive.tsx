import { useMemo, useState } from "react";
import {
  REINVESTMENT_BUCKETS,
  REINVESTMENT_TOTAL_YEAR1,
  formatBucketAmount,
  type ReinvestmentBucketId,
} from "@workspace/headwaters-pricing";
import { SectionCard } from "@/components/SectionCard";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/format";

const SLIDER_BUCKETS: ReinvestmentBucketId[] = [
  "techCapex",
  "toolingSubs",
  "trainingRnD",
];

const RESERVE_BUCKET: ReinvestmentBucketId = "pilotReserve";

const SLIDER_STEP = 1_000;

const BUCKET_BY_ID = Object.fromEntries(
  REINVESTMENT_BUCKETS.map((b) => [b.id, b]),
) as Record<ReinvestmentBucketId, (typeof REINVESTMENT_BUCKETS)[number]>;

const DEFAULTS: Record<ReinvestmentBucketId, number> = REINVESTMENT_BUCKETS.reduce(
  (acc, b) => {
    acc[b.id] = b.year1Amount;
    return acc;
  },
  {} as Record<ReinvestmentBucketId, number>,
);

const ZERO_CONSEQUENCE: Record<ReinvestmentBucketId, string> = {
  techCapex:
    "We stop owning the kit. Servers, secure phones, work laptops, and the network gear all move to rented or borrowed equipment, which means recurring rental fees, no control over the data, and a hard stop the day a vendor changes terms.",
  toolingSubs:
    "We lose the tools we run the work on — open-records dashboard hosting, mapping, secure messaging, the project tracker, and payroll. The team falls back to email, spreadsheets, and personal phones, and the audit trail goes with it.",
  trainingRnD:
    "We stop training and we stop writing the guide. Indigenous-services certifications lapse, conferences are skipped, and the written playbook for running the store doesn't get built — every new community has to start from scratch.",
  pilotReserve:
    "Nothing is set aside for the next reserve. The next community has to wait for a fresh grant cycle to start, instead of getting going on capital that's already in its own account.",
};

const ABOVE_DEFAULT: Record<ReinvestmentBucketId, string> = {
  techCapex:
    "Buys spare servers, redundant phones, and earlier laptop refreshes — the kit takes one less hit when something fails.",
  toolingSubs:
    "Buys upgraded plans, more seats, and room to add tools mid-year without a procurement fight.",
  trainingRnD:
    "Buys deeper certifications, more conferences, and dedicated time to write the guide instead of fitting it around delivery.",
  pilotReserve:
    "Front-loads the next reserve so it can stand up faster — a larger starting balance means less time waiting on the next grant cycle.",
};

interface ReinvestmentBucketsInteractiveProps {
  accent: string;
  accentInk: string;
}

export function ReinvestmentBucketsInteractive({
  accent,
  accentInk,
}: ReinvestmentBucketsInteractiveProps) {
  const [values, setValues] = useState<Record<ReinvestmentBucketId, number>>(
    () => ({ ...DEFAULTS }),
  );

  const reserveValue = useMemo(() => {
    const sliderTotal = SLIDER_BUCKETS.reduce((s, id) => s + values[id], 0);
    return Math.max(0, REINVESTMENT_TOTAL_YEAR1 - sliderTotal);
  }, [values]);

  // Each slider's max is its current value plus whatever's currently in the
  // reserve bucket — that's how much room exists to grow without breaking
  // the locked $292k total.
  const maxFor = (id: ReinvestmentBucketId) => values[id] + reserveValue;

  const setBucket = (id: ReinvestmentBucketId, next: number) => {
    setValues((prev) => {
      const clamped = Math.min(Math.max(0, next), prev[id] + RESERVE_VALUE(prev));
      return { ...prev, [id]: clamped };
    });
  };

  const reset = () => setValues({ ...DEFAULTS });

  const dirty = SLIDER_BUCKETS.some((id) => values[id] !== DEFAULTS[id]);
  const reserveDelta = reserveValue - DEFAULTS[RESERVE_BUCKET];

  return (
    <SectionCard
      title="What the 35% reinvestment buys — try the trade-offs"
      subtitle={`Total fixed at ${money(REINVESTMENT_TOTAL_YEAR1)}/yr (the ${'$'}24.3k/mo × 12 reinvestment headline). Move three sliders; the "Saved for the next reserve" bucket auto-balances. The consequences below update live so the trade-off is visible, not abstract.`}
      accent={accent}
    >
      <div
        data-testid="reinvestment-buckets"
        className="space-y-5"
      >
        {SLIDER_BUCKETS.map((id) => {
          const bucket = BUCKET_BY_ID[id];
          const value = values[id];
          const defaultValue = DEFAULTS[id];
          const max = maxFor(id);
          const atZero = value === 0;
          const aboveDefault = value > defaultValue;
          const belowDefault = value < defaultValue && value > 0;

          return (
            <div
              key={id}
              data-testid={`bucket-${id}`}
              className="rounded-lg border border-card-border bg-card/60 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h4 className="font-semibold text-foreground">{bucket.label}</h4>
                <div className="flex items-baseline gap-3 text-sm">
                  <span
                    className="num font-semibold tabular-nums"
                    style={{ color: accentInk }}
                    data-testid={`bucket-value-${id}`}
                  >
                    {money(value)}/yr
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    default {formatBucketAmount(defaultValue)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{bucket.shortDescription}</p>
              <Slider
                value={[value]}
                min={0}
                max={max}
                step={SLIDER_STEP}
                onValueChange={(next) => setBucket(id, next[0] ?? 0)}
                aria-label={`${bucket.label} annual amount`}
                data-testid={`bucket-slider-${id}`}
              />
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground tabular-nums">
                <span>{money(0)}</span>
                <span>{money(max)} max (your reserve absorbs the rest)</span>
              </div>
              <ConsequenceLine
                atZero={atZero}
                aboveDefault={aboveDefault}
                belowDefault={belowDefault}
                zeroText={ZERO_CONSEQUENCE[id]}
                aboveText={ABOVE_DEFAULT[id]}
              />
            </div>
          );
        })}

        <div
          data-testid="bucket-reserve"
          className="rounded-lg border-2 border-dashed p-4"
          style={{ borderColor: accent, backgroundColor: `${accent}0A` }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <h4 className="font-semibold text-foreground">
              {BUCKET_BY_ID[RESERVE_BUCKET].label} <span className="text-xs font-normal text-muted-foreground">(auto-balances)</span>
            </h4>
            <div className="flex items-baseline gap-3 text-sm">
              <span
                className="num font-semibold tabular-nums"
                style={{ color: accentInk }}
                data-testid="bucket-value-pilotReserve"
              >
                {money(reserveValue)}/yr
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                default {formatBucketAmount(DEFAULTS[RESERVE_BUCKET])}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {BUCKET_BY_ID[RESERVE_BUCKET].shortDescription}
          </p>
          <p className="mt-2 text-sm" data-testid="reserve-delta-line">
            {reserveDelta === 0 ? (
              <span className="text-muted-foreground">
                Reserve is at the default. Move a slider above to see how much faster (or slower) the next reserve can stand up.
              </span>
            ) : reserveDelta > 0 ? (
              <span style={{ color: accentInk }}>
                <strong>+{money(reserveDelta)}/yr</strong> goes into the next reserve. {ABOVE_DEFAULT[RESERVE_BUCKET]}
              </span>
            ) : (
              <span className="text-destructive">
                <strong>{money(reserveDelta)}/yr</strong> comes out of the next reserve. {reserveValue === 0 ? ZERO_CONSEQUENCE[RESERVE_BUCKET] : "The next community waits longer for the seed capital to land."}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-muted-foreground">
            Total locked at <strong className="text-foreground tabular-nums">{money(REINVESTMENT_TOTAL_YEAR1)}/yr</strong>. The four buckets always sum to this number — when you move one, the reserve absorbs the difference.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={!dirty}
            data-testid="bucket-reset"
          >
            Reset to defaults
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

function RESERVE_VALUE(values: Record<ReinvestmentBucketId, number>): number {
  const sliderTotal = SLIDER_BUCKETS.reduce((s, id) => s + values[id], 0);
  return Math.max(0, REINVESTMENT_TOTAL_YEAR1 - sliderTotal);
}

function ConsequenceLine({
  atZero,
  aboveDefault,
  belowDefault,
  zeroText,
  aboveText,
}: {
  atZero: boolean;
  aboveDefault: boolean;
  belowDefault: boolean;
  zeroText: string;
  aboveText: string;
}) {
  if (atZero) {
    return (
      <p className="mt-3 text-sm text-destructive" data-testid="consequence-zero">
        <strong>At ${'$'}0:</strong> {zeroText}
      </p>
    );
  }
  if (aboveDefault) {
    return (
      <p className="mt-3 text-sm text-muted-foreground" data-testid="consequence-above">
        <strong className="text-foreground">Above default:</strong> {aboveText}
      </p>
    );
  }
  if (belowDefault) {
    return (
      <p className="mt-3 text-sm text-muted-foreground" data-testid="consequence-below">
        <strong className="text-foreground">Below default:</strong> The bucket still ships, just thinner — fewer items, slimmer plans, or slower replacements. Going to ${'$'}0 would mean: {zeroText}
      </p>
    );
  }
  return null;
}
