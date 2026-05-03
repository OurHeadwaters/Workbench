import { Reveal } from "../../../communityStore/plannerReveal";
import { Card, HonestyNote, PageFrame } from "../components/PageFrame";

export default function Index({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <PageFrame
      eyebrow="00 · The pattern, named"
      title="You've already seen this movie."
      italic="The hotel is mid-reel."
      standfirst={
        <>
          A contractor installs an operator couple, hands them Square and
          QuickBooks, and hangs the whole operation on two people. It works —
          until those two people burn out, walk, or lose the contract. Every
          community has a version of this story. It ends the same way every time.
        </>
      }
    >
      <Card
        tag="The hotel · in-community example"
        head="The same shape, one building over"
        body="A couple is running the hotel for the band today, on Square and QuickBooks. It works because they keep showing up. Nothing in the operation works without them showing up."
      />
      <Card
        tag="The store · about to be built the same way"
        head="If we don't change the design, we hire a couple, give them the till, and wait"
        body="The proposal in front of council right now would install a second couple, in a second building, on the same two pieces of software, with the same single point of failure. One year, maybe two — then the slab cracks the same way."
      />
      <Card
        tag="The alternative ending"
        head="The slab cracks. The grassland holds."
        body="A slab is one slab. When it cracks, the whole thing fails. A grassland has a thousand small things doing the same job — when one dies back, the others carry it. The playbook is how we build the store and migrate the hotel onto a grassland design instead."
      />

      <Reveal label="Why this is the playbook, not another deck">
        <p>
          The pitch decks already exist. The cockpit shows the operator surface in
          five seconds. The walkthrough sells the engagement to the chief.
        </p>
        <p>
          This document is the thing the band, the chief, the contractor, and
          the operator couples open every quarter to keep the promise. It's
          short, it lives on a phone, and every page has a single job.
        </p>
      </Reveal>

      <Reveal label="What's in scope · what isn't">
        <p>
          <span className="font-semibold">In scope:</span> the store and the
          hotel, run from one model. Roles, bench depth, year-by-year handover,
          burnout protocol, renewal mechanics, tooling continuity, leading
          indicators.
        </p>
        <p>
          <span className="font-semibold">Out of scope:</span> changes to the
          existing cockpit, live data from Square or QuickBooks, decisions
          about specific named individuals, replication to a second community,
          and a "why northern stores fail" rewrite — that prose lives in the
          walkthrough already.
        </p>
      </Reveal>

      <HonestyNote>
        The playbook treats the hotel honestly. We don't know the exact hours
        the current couple is working, the exact contract terms with the band,
        or the exact replacement bench. Where the page asks for that, the page
        says so out loud and leaves the field for the band to fill in.
      </HonestyNote>
    </PageFrame>
  );
}
