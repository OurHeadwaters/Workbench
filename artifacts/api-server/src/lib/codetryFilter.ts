/**
 * codetryFilter — runs a kit draft through the Codetry doctrine lens.
 *
 * Categories checked:
 *   1. Doctrine alignment  — does the kit align with Headwaters / Codetry values?
 *   2. Gate compliance     — does it respect the Eave Entry gate posture?
 *   3. Eave Entry posture  — soft guide vs. directive framing?
 *   4. Structural framing  — structural vs. moral/shame framing?
 *
 * Returns a structured result the founder can read and accept before publishing.
 * Flags are informational — the founder can publish anyway.
 */

import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "./logger";

export interface CodetryFlag {
  category: "doctrine" | "gate" | "eave_entry" | "framing";
  flag: string;
  reason: string;
}

export interface CodetryResult {
  passed: boolean;
  flags: CodetryFlag[];
  checkedAt: string;
  summary: string;
}

interface KitDraft {
  title: string;
  description?: string;
  intendedAudience?: string;
  contentOutline?: Record<string, unknown>;
  priceCents?: number;
}

const CODETRY_SYSTEM = `You are the Codetry filter — a doctrine review assistant for Headwaters Kit creation.

You check kit drafts against four lenses:
1. Doctrine alignment: Does the kit align with Headwaters/Codetry values? (self-reliance, community sovereignty, zone-based thinking, non-extractive economics)
2. Gate compliance: Does it respect the Eave Entry gate posture? (soft-guide, not directive; lets people in at their own pace)
3. Eave Entry posture: Is the framing invitational rather than prescriptive?
4. Structural vs. moral framing: Does it use structural/systemic explanations rather than shame or blame?

Respond ONLY with valid JSON in this exact shape:
{
  "passed": boolean,
  "flags": [
    {
      "category": "doctrine" | "gate" | "eave_entry" | "framing",
      "flag": "short flag title",
      "reason": "explanation of what triggered the flag and why"
    }
  ],
  "summary": "1-2 sentence plain language summary for the founder"
}

If there are no flags, return passed: true with an empty flags array.
Be a soft guide — note concerns clearly but never be preachy. The founder can publish anyway.`;

export async function runCodetryFilter(draft: KitDraft): Promise<CodetryResult> {
  const draftText = JSON.stringify({
    title: draft.title,
    description: draft.description ?? "",
    intended_audience: draft.intendedAudience ?? "",
    content_outline: draft.contentOutline ?? {},
    price_cents: draft.priceCents ?? 0,
  }, null, 2);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: CODETRY_SYSTEM,
      messages: [
        {
          role: "user",
          content: `Please run the Codetry filter on this kit draft:\n\n${draftText}`,
        },
      ],
    });

    const block = response.content[0];
    if (!block || block.type !== "text") {
      throw new Error("No text response from Codetry filter");
    }

    const raw = block.text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in Codetry response");

    const parsed = JSON.parse(jsonMatch[0]) as {
      passed?: boolean;
      flags?: Array<{ category: string; flag: string; reason: string }>;
      summary?: string;
    };

    const flags: CodetryFlag[] = (parsed.flags ?? []).map((f) => ({
      category: (["doctrine", "gate", "eave_entry", "framing"].includes(f.category)
        ? f.category
        : "doctrine") as CodetryFlag["category"],
      flag: f.flag ?? "Unknown flag",
      reason: f.reason ?? "",
    }));

    return {
      passed: parsed.passed ?? flags.length === 0,
      flags,
      checkedAt: new Date().toISOString(),
      summary: parsed.summary ?? "Codetry filter ran successfully.",
    };
  } catch (err) {
    logger.error({ err }, "codetryFilter: failed");
    return {
      passed: true,
      flags: [],
      checkedAt: new Date().toISOString(),
      summary: "Codetry filter could not run — proceeding with caution.",
    };
  }
}
