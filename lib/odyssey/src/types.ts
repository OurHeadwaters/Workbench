export type ZoneId = "Z1" | "Z2" | "Z3" | "Z4";

export type CostTier = "free" | "$" | "$$" | "$$$";

export interface TrailSign {
  id: string;
  toolName: string;
  problemStatement: string;
  costTier: CostTier;
  actionUrl: string;
  actionLabel: string;
  communityProof?: string;
  zoneTags: ("any" | ZoneId)[];
  topicTags: string[];
}

export interface SponsorIntakePayload {
  toolName: string;
  problemStatement: string;
  costTier: CostTier;
  actionUrl: string;
  actionLabel?: string;
  communityProof?: string;
  zoneTags: string[];
  topicTags: string[];
  submitterName: string;
  submitterEmail: string;
  submitterNote?: string;
}
