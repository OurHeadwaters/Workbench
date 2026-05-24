import { MoneyMachineDiagram } from "@/components/MoneyMachineDiagram";

export function MoneyMachinePage() {
  return (
    <div className="min-h-dvh bg-[#FAFAF9] pb-10">
      <div className="px-5 py-6 max-w-lg mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3D2E]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            How the Money Machine Works
          </h1>
          <p className="text-sm text-[#6B5744] mt-1 leading-relaxed">
            Four buckets. Fill them in order. The overflow is the only part you give away.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E5E4] p-4">
          <MoneyMachineDiagram />
        </div>

        <div className="space-y-2 text-sm text-[#44403C] leading-relaxed">
          <p>
            <strong>One rule:</strong> each bucket fills before the next one opens. The Bills Bucket's
            float valve closes the inlet when it's full — no over-filling, no leaking forward.
          </p>
          <p>
            The <strong>bypass valve</strong> on the Oh No Bucket is the Reserve draw.
            Tap it to see what happens when you spend your safety net before the machine is sound.
          </p>
          <p>
            The <strong>rain shower</strong> isn't one stream — it spreads. Every dollar of reinvestment
            is meant to land in multiple places, not one line item.
          </p>
          <p>
            The <strong>giving well</strong> only fills from overflow. Giving from a broken bucket
            isn't generosity — it's a leak.
          </p>
        </div>

        <a
          href="/north-star/guide"
          className="inline-block text-sm text-[#1F3D2E] underline underline-offset-2 hover:text-[#2D5440]"
        >
          ← Back to Guide
        </a>
      </div>
    </div>
  );
}
