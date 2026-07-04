import { MoneyMachineDiagram } from "@/components/MoneyMachineDiagram";
import { BG, SURFACE, BORDER, TEXT, TEXT_2, FONT_DISPLAY, AMBER } from "@/lib/theme";

export function MoneyMachinePage() {
  return (
    <div className="min-h-dvh pb-10" style={{ backgroundColor: BG }}>
      <div className="px-5 py-6 max-w-lg mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
            How the Money Machine Works
          </h1>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: TEXT_2 }}>
            Four buckets. Fill them in order. The overflow is the only part you give away.
          </p>
        </div>

        <div className="rounded-xl border p-4" style={{ backgroundColor: SURFACE, borderColor: BORDER }}>
          <MoneyMachineDiagram />
        </div>

        <div className="space-y-2 text-sm leading-relaxed" style={{ color: TEXT }}>
          <p>
            <strong style={{ color: AMBER }}>One rule:</strong> each bucket fills before the next one opens. The Bills Bucket's
            float valve closes the inlet when it's full — no over-filling, no leaking forward.
          </p>
          <p>
            The <strong style={{ color: AMBER }}>bypass valve</strong> on the Oh No Bucket is the Reserve draw.
            Tap it to see what happens when you spend your safety net before the machine is sound.
          </p>
          <p>
            The <strong style={{ color: AMBER }}>rain shower</strong> isn't one stream — it spreads. Every dollar of reinvestment
            is meant to land in multiple places, not one line item.
          </p>
          <p>
            The <strong style={{ color: AMBER }}>giving well</strong> only fills from overflow. Giving from a broken bucket
            isn't generosity — it's a leak.
          </p>
        </div>

        <a
          href="/north-star/guide"
          className="inline-block text-sm underline underline-offset-2"
          style={{ color: AMBER }}
        >
          ← Back to Guide
        </a>
      </div>
    </div>
  );
}
