import { PrintNav } from "../components/PrintNav";
import { CodetryPacketCoverSheet } from "../components/CodetryPacketCoverSheet";
import { CodetryIntroLetterDeerLakePage } from "./CodetryIntroLetterDeerLake";
import { DeerLakeWhyNowPage } from "./DeerLakeWhyNow";
import { CodetryFundingBriefDeerLakePage } from "./CodetryFundingBriefDeerLake";
import { CodetryPilotProposalDeerLakePage } from "./CodetryPilotProposalDeerLake";

const COMMUNITY = "Deer Lake First Nation";
const DATE = "May 2026";

const DOCUMENTS = [
  {
    num: "1",
    title: "Introduction Letter",
    desc: "A personal letter from Bobbie Parr introducing Headwaters Development Services and the purpose of this outreach.",
  },
  {
    num: "2",
    title: "Why Deer Lake. Why Now.",
    desc: "A one-page case for why Deer Lake is the right community for this model — the existing assets, the 807 supply chain story, and the January 2027 winter road window.",
  },
  {
    num: "3",
    title: "Partnership & Funding Brief",
    desc: `A brief on the Codetry model, the Working Constellation team structure, the 807 connection, and the Phase 1 fee — prepared specifically for ${COMMUNITY}.`,
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
        paginate={true}
      />
      <div id="pdf-target" style={{ background: "#d8d2c8", padding: "2rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <CodetryPacketCoverSheet
          community={COMMUNITY}
          date={DATE}
          documents={DOCUMENTS}
        />
        <CodetryIntroLetterDeerLakePage />
        <DeerLakeWhyNowPage />
        <CodetryFundingBriefDeerLakePage />
        <CodetryPilotProposalDeerLakePage />
      </div>
    </>
  );
}
