import { z } from "zod";

import { PHASES } from "../lib/phases";

export const SlideEntrySchema = z
  .object({
    id: z.string().trim().min(1, "id is required"),
    position: z.number().int().min(1, "position must be an integer >= 1"),
    filepath: z.string().trim().min(1, "filepath is required"),
    title: z.string().trim().min(1, "title is required"),
    description: z.string().trim().min(1, "description is required"),
    speakerNotes: z.string().trim().optional(),
    // Which deal-flow phase this slide belongs to in the operating plan view.
    phase: z.enum(PHASES),
    // True for the five operating-plan phase openers; these are excluded
    // from the Lifestyle Design Philosophy view, which only shows the
    // original 38 slides in their original order.
    operatingOnly: z.boolean().optional(),
  })
  .strict();

export const SlidesManifestSchema = z.array(SlideEntrySchema);

export type SlideEntry = z.infer<typeof SlideEntrySchema>;

export function safeParseSlidesManifest(input: unknown) {
  return SlidesManifestSchema.safeParse(input);
}

export function parseSlidesManifest(input: unknown): SlideEntry[] {
  const parsed = safeParseSlidesManifest(input);
  if (parsed.success) {
    return parsed.data;
  }

  const firstIssue = parsed.error.issues[0];
  const issuePath = firstIssue?.path.length
    ? firstIssue.path.join(".")
    : "manifest";
  throw new Error(`Invalid manifest at ${issuePath}: ${firstIssue?.message}`);
}
