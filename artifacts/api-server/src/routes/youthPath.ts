// Youth Odyssey — story generation endpoint.
//
// POST /youth-path/generate-story
//   Body: { stationName, ageTrack, instruction, answeredPrompts }
//   Returns: { story }
//
// The client passes everything needed: the station name (for context),
// the age track, the story instruction from the data file, and the
// child's answered prompts as { question, answer } pairs.
//
// The AI returns 2-5 paragraphs of plain-prose story in second person,
// using the child's specific nouns. No generics. No lessons bolted on.

import { Router } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router = Router();

type AgeTrack = "young" | "tween" | "older";

const SYSTEM_PROMPT = `You are a storyteller working in the tradition of the oral narrative. You write in plain, unadorned prose — no purple language, no metaphors that aren't earned, no inspirational padding. Short sentences where they carry weight. Concrete nouns. Specific places.

You write in second person ('you'). You write the specific child's story using the words and names they gave you — their actual people, their actual places, their actual things. You do not generalize. You do not moralize. You do not resolve what the person did not resolve.

The story should feel like something that already happened, because it did.

Rules:
- Never use the word 'journey' or 'journey of self-discovery'
- Never use the phrase 'it's okay to feel'
- Never add a lesson the person didn't earn in the prompts
- Never invent details not in the answers
- Always end with a landing, not a lesson
- Never write more than 5 paragraphs`;

const AGE_MODIFIERS: Record<AgeTrack, string> = {
  young:
    "Write for a child aged 6-10. The story should feel close — a kitchen, a yard, a creek bank. 2 short paragraphs. Simple, complete sentences. A trusted adult could read this aloud to the child.",
  tween:
    "Write for an independent reader aged 10-14. 3 paragraphs. Carry complexity but not abstraction. Specific textures and sensory details. The story should feel a little private — the kind of thing you'd read twice.",
  older:
    "Write for someone aged 14-18 who can hold nuance and isn't afraid of a hard truth. 4 paragraphs. Don't soften the edges. Write it like something the person might read again at thirty and still recognize themselves in.",
};

router.post("/generate-story", async (req, res) => {
  try {
    const body = req.body as {
      stationName?: string;
      ageTrack?: AgeTrack;
      instruction?: string;
      answeredPrompts?: { question: string; answer: string }[];
    };

    const { stationName, ageTrack, instruction, answeredPrompts } = body;

    if (!ageTrack || !instruction || !answeredPrompts?.length) {
      res.status(400).json({ error: "ageTrack, instruction, and answeredPrompts are required" });
      return;
    }

    const validTracks: AgeTrack[] = ["young", "tween", "older"];
    if (!validTracks.includes(ageTrack)) {
      res.status(400).json({ error: "Invalid age track" });
      return;
    }

    const answersText = answeredPrompts
      .filter((p) => p.answer && p.answer.trim() !== "")
      .map((p) => `${p.question}\n→ ${p.answer.trim()}`)
      .join("\n\n");

    if (!answersText) {
      res.status(400).json({ error: "No answers provided" });
      return;
    }

    const ageModifier = AGE_MODIFIERS[ageTrack];

    const userMessage = `Here are the child's answers${stationName ? ` for the station "${stationName}"` : ""}:

${answersText}

Story instruction: ${instruction}

${ageModifier}

Write the story now.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const block = message.content[0];
    const story = block.type === "text" ? block.text.trim() : "";

    if (!story) {
      res.status(500).json({ error: "Story generation produced no content" });
      return;
    }

    res.json({ story });
  } catch (err) {
    console.error("[youth-path] story generation failed:", err);
    res.status(500).json({ error: "Story generation failed" });
  }
});

export default router;
