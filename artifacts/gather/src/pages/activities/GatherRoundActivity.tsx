import { useGatherStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

export function GatherRoundActivity() {
  const { readiness, updateGatherRoundMessage } = useGatherStore();
  const msg = readiness.gatherRoundMessage;
  const [copied, setCopied] = useState(false);

  const fullMessage = [
    msg.whatWeHave && `What we have: ${msg.whatWeHave}`,
    msg.whatWeNeed && `What we need: ${msg.whatWeNeed}`,
    msg.whatWeCanOffer && `What we can offer: ${msg.whatWeCanOffer}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  function handleCopy() {
    if (!fullMessage) return;
    navigator.clipboard.writeText(fullMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-md mx-auto pb-24">
      <PageHeader title="Gather Round" back="/activities" />

      <div className="px-4 pt-4 space-y-5">
        <div className="rounded-xl bg-[#F0E9DF] border border-[#E4D9CC] p-4">
          <p className="text-sm font-medium text-[#4A3F38] mb-1">What this is</p>
          <p className="text-sm text-[#7A6B60]">
            This is a message your household can share with your village — what you have, what you
            need, and what you can offer. You write it here, then share it yourself when the time is
            right. Nothing posts automatically.
          </p>
        </div>

        <section>
          <label className="block text-base text-[#2E2620] mb-1.5">What we have</label>
          <textarea
            value={msg.whatWeHave}
            onChange={(e) => updateGatherRoundMessage({ whatWeHave: e.target.value })}
            rows={3}
            placeholder="e.g. A working wood stove, 3 weeks of dry goods, a generator that runs on propane..."
            className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-sm resize-none"
          />
        </section>

        <section>
          <label className="block text-base text-[#2E2620] mb-1.5">What we need</label>
          <textarea
            value={msg.whatWeNeed}
            onChange={(e) => updateGatherRoundMessage({ whatWeNeed: e.target.value })}
            rows={3}
            placeholder="e.g. Extra propane if the outage runs past 3 days, someone who knows well water systems..."
            className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-sm resize-none"
          />
        </section>

        <section>
          <label className="block text-base text-[#2E2620] mb-1.5">What we can offer</label>
          <textarea
            value={msg.whatWeCanOffer}
            onChange={(e) => updateGatherRoundMessage({ whatWeCanOffer: e.target.value })}
            rows={3}
            placeholder="e.g. Cooking for up to 8, charging station, a warm dry place for one person..."
            className="w-full px-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-[#2E2620] placeholder-[#B0A090] focus:outline-none focus:border-[#C7613B] text-sm resize-none"
          />
        </section>

        {fullMessage && (
          <div className="rounded-xl bg-white border border-[#E4D9CC] p-4 space-y-3">
            <p className="text-xs font-medium text-[#4A3F38]">Your message preview</p>
            <pre className="text-sm text-[#2E2620] whitespace-pre-wrap font-sans leading-relaxed">
              {fullMessage}
            </pre>
            {msg.lastDraftedAt && (
              <p className="text-xs text-[#7A6B60]">Last drafted: {formatDate(msg.lastDraftedAt)}</p>
            )}
            <Button variant="secondary" className="w-full" onClick={handleCopy}>
              {copied ? (
                <><Check size={14} className="mr-2" /> Copied</>
              ) : (
                <><Copy size={14} className="mr-2" /> Copy to share</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
