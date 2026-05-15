import { PrintNav } from "../components/PrintNav";
import { CodetryPacketCoverSheet } from "../components/CodetryPacketCoverSheet";
import { CodetryIntroLetterPage } from "./CodetryIntroLetter";
import { CodetryOnePagerPage } from "./CodetryOnePager";
import { CodetryFundingBriefPage } from "./CodetryFundingBrief";

const COMMUNITY = "Northern Ontario Food Systems Network";
const DATE = "May 15, 2026";

const DOCUMENTS = [
  {
    num: "1",
    title: "Introduction Letter",
    desc: "A personal letter from Bobbie Parr introducing Headwaters Development Services and the purpose of this food systems outreach.",
  },
  {
    num: "2",
    title: "Economic Development One-Pager",
    desc: "An overview of what Headwaters builds, how we work, and the communities we serve across the north.",
  },
  {
    num: "3",
    title: "Partnership & Funding Brief",
    desc: "A detailed brief on the Codetry model, the Working Constellation team structure, and how the partnership is structured for northern food-systems projects.",
  },
];

export default function CodetryPacketFoodSystems() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-food-systems-outreach-packet.pdf"
      />
      <div
        id="pdf-target"
        style={{
          background: "#d8d2c8",
          padding: "2rem 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <CodetryPacketCoverSheet
          community={COMMUNITY}
          date={DATE}
          subtitle="Food Systems Planning — Outreach Packet"
          documents={DOCUMENTS}
        />
        <CodetryIntroLetterPage community={COMMUNITY} />
        <CodetryOnePagerPage />
        <CodetryFundingBriefPage />
      </div>
    </>
  );
}
