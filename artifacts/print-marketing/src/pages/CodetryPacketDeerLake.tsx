import { PrintNav } from "../components/PrintNav";
import { CodetryPacketCoverSheet } from "../components/CodetryPacketCoverSheet";
import { DeerLakeFirstEnginePage } from "./DeerLakeFirstEngine";
import { CodetryIntroLetterDeerLakePage } from "./CodetryIntroLetterDeerLake";
import { DeerLakeWhyNowPage } from "./DeerLakeWhyNow";
import { EngineOnePagerPage } from "./EngineOnePager";
import { CodetryFundingBriefDeerLakePage } from "./CodetryFundingBriefDeerLake";
import { CodetryPilotProposalDeerLakePage } from "./CodetryPilotProposalDeerLake";

const COMMUNITY = "Deer Lake First Nation";
const DATE = "May 2026";

const DOCUMENTS = [
  {
    num: "1",
    title: "The Founding Community",
    desc: "A declaration of why Deer Lake First Nation is being invited to be the first community to run the Headwaters Economic Engine — and what that means.",
  },
  {
    num: "2",
    title: "Introduction Letter",
    desc: "A personal letter from Bobbie Parr introducing Headwaters Development Services and the purpose of this outreach.",
  },
  {
    num: "3",
    title: "Why Deer Lake. Why Now.",
    desc: "A one-page case for why Deer Lake is the right community for this model — the existing assets, the 807 supply chain story, and the January 2027 winter road window.",
  },
  {
    num: "4",
    title: "The Economic Engine",
    desc: "What one engine eliminates: eight systemic problems that hold communities in dependency — and the system built to replace each one. Community-owned. No licensing. Handover is the exit.",
  },
  {
    num: "5",
    title: "Partnership & Funding Brief",
    desc: `A brief on the Codetry model, the Working Constellation team structure, the 807 connection, and the Phase 1 fee — prepared specifically for ${COMMUNITY}.`,
  },
  {
    num: "6",
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
        paginate={true}
      />
      <div
        id="pdf-target"
        style={{
          background: "#1a2820",
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
          subtitle="Codetry Community Store — Founding Community Packet"
          documents={DOCUMENTS}
        />
        <DeerLakeFirstEnginePage />
        <CodetryIntroLetterDeerLakePage />
        <DeerLakeWhyNowPage />
        <EngineOnePagerPage />
        <CodetryFundingBriefDeerLakePage />
        <CodetryPilotProposalDeerLakePage />
      </div>
    </>
  );
}
