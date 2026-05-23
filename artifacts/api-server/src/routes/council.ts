import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";

const router: IRouter = Router();

const ChatSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(20)
    .default([]),
  systemPrompt: z.string().max(16000),
  model: z.string().default("x-ai/grok-4.20"),
});

// POST /council/chat — streams a response from the configured model
router.post("/chat", async (req: Request, res: Response) => {
  const parsed = ChatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    });
    return;
  }

  const { message, history, systemPrompt, model } = parsed.data;
  const baseURL = process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY;

  if (!baseURL || !apiKey) {
    res.status(503).json({ error: "Council AI is not configured on this server." });
    return;
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message },
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  try {
    const upstream = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, max_tokens: 8192, messages, stream: true }),
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => "upstream error");
      res.write(`data: ${JSON.stringify({ error: errText })}\n\n`);
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (raw === "[DONE]") {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          continue;
        }
        try {
          const chunk = JSON.parse(raw) as {
            choices?: { delta?: { content?: string } }[];
          };
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }
  } catch {
    res.write(`data: ${JSON.stringify({ error: "Stream interrupted." })}\n\n`);
  }

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
