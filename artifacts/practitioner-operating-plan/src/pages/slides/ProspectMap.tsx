type Grade = "Floor" | "Highway" | "Long game";
type Stance = "Respects" | "Threatens";

type Prospect = {
  name: string;
  bucket: string;
  grade: Grade;
  stance: Stance;
  note: string;
};

const prospects: Prospect[] = [
  {
    name: "807 Food",
    bucket: "Existing engagement",
    grade: "Floor",
    stance: "Respects",
    note: "The base. Procurement, aggregation, the depot. Pays for itself, builds the team. Not the bet — the runway the bet flies off.",
  },
  {
    name: "Parr's Jars",
    bucket: "Salt line",
    grade: "Floor",
    stance: "Respects",
    note: "Stays as a depot revenue line under Headwaters. Capped at the runbook. Not allowed to grow into the founder's hands again.",
  },
  {
    name: "Bright Side",
    bucket: "The bet",
    grade: "Highway",
    stance: "Respects",
    note: "Community / Enthusiast / Facility. The mission line. Every other prospect is graded against whether it advances or starves this.",
  },
  {
    name: "Headwaters Finance — Credit Union",
    bucket: "Adjacent product",
    grade: "Long game",
    stance: "Respects",
    note: "Named-target only when warm. Not built. Not pitched. Watched for the one introduction that makes it worth opening.",
  },
  {
    name: "Headwaters Finance — Enthusiast tier",
    bucket: "Tier of Bright Side",
    grade: "Highway",
    stance: "Respects",
    note: "Lives inside Bright Side's Enthusiast tier. Not a separate product. Same codebase, same launch, same conference.",
  },
  {
    name: "Headwaters Finance — IG (Investment Group)",
    bucket: "Adjacent product",
    grade: "Long game",
    stance: "Respects",
    note: "Personal-portfolio rail. Interesting, not now. If pursued, it's a Year 3 conversation — after Bright Side has paying Facility contracts.",
  },
  {
    name: "Headwaters Governance",
    bucket: "Adjacent service",
    grade: "Long game",
    stance: "Respects",
    note: "Council-governance consulting under the Headwaters parent. Natural fit with the Bright Side Facility tier. Wait until Pilot #2 is signed.",
  },
  {
    name: "Start9 + Privacy Phones",
    bucket: "Reseller / referral",
    grade: "Long game",
    stance: "Threatens",
    note: "Margin is thin, support load is heavy, takes work-block hours from the bet. Reseller relationship only — no in-house support, no inventory.",
  },
];

const gradeStyle: Record<Grade, { bg: string; fg: string }> = {
  Floor: { bg: "rgba(31,61,46,0.08)", fg: "var(--slide-primary)" },
  Highway: { bg: "var(--slide-accent)", fg: "var(--slide-bg)" },
  "Long game": { bg: "rgba(184,90,62,0.12)", fg: "var(--slide-accent)" },
};

const stanceStyle: Record<Stance, string> = {
  Respects: "var(--slide-primary)",
  Threatens: "var(--slide-accent)",
};

export default function ProspectMap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              IV · 02 — Prospect map
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Eight lines.
              <span className="italic font-normal text-accent"> Graded against the non-negotiables.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            <span className="font-semibold text-primary">Floor</span>: pays the bills.{" "}
            <span className="font-semibold text-accent">Highway</span>: the bet.{" "}
            <span className="font-semibold" style={{ color: "var(--slide-accent)" }}>
              Long game
            </span>
            : named, not yet pursued. Tagged by whether the line respects
            or threatens the non-negotiables.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1vw] gap-y-[1vh] min-h-0 content-start">
          {prospects.map((p) => (
            <ProspectRow key={p.name} p={p} />
          ))}
        </div>

        <div
          className="mt-[1.8vh] pt-[1.2vh] border-t font-display italic text-[1.2vw] text-muted leading-[1.4] max-w-[82vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          The map is read top to bottom in priority order. Anything not on
          this map doesn't get pursued. Adding a row is a quarterly
          conversation, not a Tuesday-afternoon decision.
        </div>
      </div>
    </div>
  );
}

function ProspectRow({ p }: { p: Prospect }) {
  const grade = gradeStyle[p.grade];
  return (
    <div
      className="rounded-[0.4vw] p-[1.1vw] flex gap-[1vw] items-start"
      style={{ background: "var(--slide-paper)" }}
    >
      <div
        className="shrink-0 rounded-[0.25vw] px-[0.7vw] py-[0.35vh] font-mono uppercase tracking-[0.18em] text-[0.72vw] font-semibold"
        style={{ background: grade.bg, color: grade.fg }}
      >
        {p.grade}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-[1vw] mb-[0.3vh]">
          <div className="font-display text-[1.15vw] text-primary font-medium leading-tight">
            {p.name}
          </div>
          <div
            className="font-mono uppercase tracking-[0.2em] text-[0.7vw] shrink-0"
            style={{ color: stanceStyle[p.stance] }}
          >
            {p.stance} non-negotiables
          </div>
        </div>
        <div className="font-mono uppercase tracking-[0.2em] text-[0.72vw] text-muted mb-[0.4vh]">
          {p.bucket}
        </div>
        <div className="font-body text-[0.88vw] text-text leading-[1.45]">
          {p.note}
        </div>
      </div>
    </div>
  );
}
