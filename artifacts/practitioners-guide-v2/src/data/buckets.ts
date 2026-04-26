export type BucketId = "salts" | "contracts" | "brightside";

export interface BucketIdentity {
  id: BucketId;
  name: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
}

export const BUCKETS: Record<BucketId, BucketIdentity> = {
  salts: {
    id: "salts",
    name: "Salts",
    tagline: "Parr's Jars",
    accent: "#B27319",
    accentSoft: "#FBEFD8",
    accentInk: "#5A3A0F",
  },
  contracts: {
    id: "contracts",
    name: "Community Contracts",
    tagline: "807 CDP + Agency aspiration",
    accent: "#1F5446",
    accentSoft: "#E0EAE6",
    accentInk: "#0F2C25",
  },
  brightside: {
    id: "brightside",
    name: "Software, Hardware & Training",
    tagline: "Brightside RT-LTC",
    accent: "#1F5A7C",
    accentSoft: "#DDE8F1",
    accentInk: "#0F2D3F",
  },
};

export const BUCKET_ORDER: BucketId[] = ["salts", "contracts", "brightside"];
