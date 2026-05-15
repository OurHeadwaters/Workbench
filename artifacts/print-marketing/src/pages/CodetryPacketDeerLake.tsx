import { PrintNav } from "../components/PrintNav";
import { CodetryPacketCoverSheet } from "../components/CodetryPacketCoverSheet";
import { CodetryIntroLetterDeerLakePage } from "./CodetryIntroLetterDeerLake";
import { CodetryOnePagerPage } from "./CodetryOnePager";
import { CodetryFundingBriefPage } from "./CodetryFundingBrief";
import { CodetryPilotProposalDeerLakePage } from "./CodetryPilotProposalDeerLake";

const COMMUNITY = "Deer Lake First Nation";
const DATE = "May 15, 2026";

const DOCUMENTS = [
  {
    num: "1",
    title: "Introduction Letter",
    desc: "A personal letter from Bobbie Parr introducing Headwaters Development Services and the purpose of this outreach.",
  },
  {
    num: "2",
    title: "Economic Development One-Pager",
    desc: "An overview of what Headwaters builds, how we work, and who we work with.",
  },
  {
    num: "3",
    title: "Partnership & Funding Brief",
    desc: "A detailed brief on the Codetry model, the Working Constellation team structure, and the Phase 1 fee.",
  },
  {
    num: "4",
    title: "Pilot Proposal Outline",
    desc: `A four-phase community store pilot proposal prepared specifically for ${COMMUNITY}.`,
  },
];

export default function CodetryPacketDeerLake() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-codetry-packet-deer-lake.pdf"
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <CodetryPacketCoverSheet
          community={COMMUNITY}
          date={DATE}
          documents={DOCUMENTS}
        />
        <CodetryIntroLetterDeerLakePage />
        <CodetryOnePagerPage />
        <CodetryFundingBriefPage />
        <CodetryPilotProposalDeerLakePage />
      </div>
    </>
  );
}
