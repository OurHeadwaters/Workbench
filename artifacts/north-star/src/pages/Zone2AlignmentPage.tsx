import { useState, useEffect } from "react";
import { Link } from "wouter";

const SECTIONS = [
  { id: "inventory", label: "Feature Inventory" },
  { id: "mapping", label: "Zone 2 Mapping" },
  { id: "buzz", label: "Buzz-Layer Alignment" },
  { id: "steps", label: "Implementation Steps" },
  { id: "benefits", label: "Benefits Summary" },
  { id: "missing", label: "Missing Information" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const TIER_COLOR = {
  1: { bg: "#0D2010", border: "#1A4020", text: "#4ADE80", dot: "#22C55E", label: "Tier 1 — Safe now" },
  2: { bg: "#1A1200", border: "#3A2800", text: "#FCD34D", dot: "#F59E0B", label: "Tier 2 — Needs system npub" },
  3: { bg: "#130A1E", border: "#2A1040", text: "#C4B5FD", dot: "#A78BFA", label: "Tier 3 — Needs VC schema lock" },
};

function Tag({ tier }: { tier: 1 | 2 | 3 }) {
  const c = TIER_COLOR[tier];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide border flex-shrink-0"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
    >
      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

function SectionNav({ active, onSelect }: { active: SectionId; onSelect: (id: SectionId) => void }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className="px-3 py-1.5 rounded text-[11px] font-medium tracking-wide transition-all border"
          style={
            active === s.id
              ? { background: "#1E2A4A", borderColor: "#3B5998", color: "#93B4FF" }
              : { background: "#0F0D0B", borderColor: "#251E18", color: "#5C5046" }
          }
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded border-l-2 px-4 py-3 my-3 text-[12px] leading-relaxed"
      style={{ background: "#0F0C09", borderColor: "#3B5998", color: "#8C9AAD" }}
    >
      {children}
    </div>
  );
}

function Flag({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded border-l-2 px-4 py-3 my-3 text-[12px] leading-relaxed"
      style={{ background: "#140A0A", borderColor: "#8B3A3A", color: "#B07070" }}
    >
      <span className="font-bold text-[#DC2626]">⚑ Flag: </span>
      {children}
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[17px] font-serif tracking-wide mt-8 mb-3" style={{ color: "#EAE4DB" }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[12px] uppercase tracking-[0.15em] font-bold mt-6 mb-2" style={{ color: "#6B7AAD" }}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#C5B6A5" }}>
      {children}
    </p>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-[13px] leading-relaxed mb-1 ml-4 flex gap-2" style={{ color: "#C5B6A5" }}>
      <span className="flex-shrink-0 mt-0.5" style={{ color: "#5C5046" }}>·</span>
      <span>{children}</span>
    </li>
  );
}

// ─── Z2 npub readout ──────────────────────────────────────────────────────────

type NpubState =
  | { status: "loading" }
  | { status: "ok"; npub: string }
  | { status: "token_not_configured" }
  | { status: "unconfigured" }
  | { status: "error"; message: string };

export function Z2NpubReadout() {
  const [state, setState] = useState<NpubState>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const token =
      window.localStorage.getItem("library.ownerToken") ||
      window.localStorage.getItem("ownerToken") ||
      "";
    const headers: Record<string, string> = token
      ? { "x-library-owner-token": token }
      : {};
    fetch("/api/z2/npub", { headers })
      .then(async (res) => {
        if (cancelled) return;
        // 412 = LIBRARY_OWNER_TOKEN env var not set on the server
        if (res.status === 412) {
          setState({ status: "token_not_configured" });
          return;
        }
        // 503 = Z2_HOUSEHOLD_SEED env var not set on the server
        if (res.status === 503) {
          setState({ status: "unconfigured" });
          return;
        }
        if (res.status === 401) {
          setState({ status: "error", message: "Access denied — check that the owner token in your browser matches LIBRARY_OWNER_TOKEN on the API server." });
          return;
        }
        if (!res.ok) {
          setState({ status: "error", message: `Unexpected response: ${res.status}` });
          return;
        }
        const data = await res.json();
        setState({ status: "ok", npub: data.npub });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", message: err.message ?? "Fetch failed" });
      });
    return () => { cancelled = true; };
  }, []);

  function handleCopy() {
    if (state.status !== "ok") return;
    navigator.clipboard.writeText(state.npub).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="rounded border my-4 px-4 py-4"
      style={{ background: "#08100E", borderColor: "#1A3830" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] uppercase tracking-[0.15em] font-bold"
          style={{ color: "#2D7A60" }}
        >
          System Z2 npub
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded border font-mono"
          style={{ background: "#0B1A16", borderColor: "#1A3830", color: "#4A6A60" }}
        >
          live
        </span>
      </div>

      {state.status === "loading" && (
        <div className="text-[12px]" style={{ color: "#3A5A50" }}>
          Fetching…
        </div>
      )}

      {state.status === "token_not_configured" && (
        <div
          className="rounded border-l-2 px-3 py-2 text-[12px] leading-relaxed"
          style={{ background: "#0E0E14", borderColor: "#3A3A8B", color: "#8B8BB0" }}
        >
          <span className="font-bold" style={{ color: "#8B8BDC" }}>Owner token not set — </span>
          add <code className="text-[11px] px-1 rounded" style={{ background: "#12121A", color: "#C4B5FD" }}>LIBRARY_OWNER_TOKEN</code> to the API server environment to protect and expose this endpoint.
        </div>
      )}

      {state.status === "unconfigured" && (
        <div
          className="rounded border-l-2 px-3 py-2 text-[12px] leading-relaxed"
          style={{ background: "#140A0A", borderColor: "#8B3A3A", color: "#B07070" }}
        >
          <span className="font-bold" style={{ color: "#DC2626" }}>Not configured — </span>
          set <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>Z2_HOUSEHOLD_SEED</code> on the API server to derive this instance's Z2 npub.
        </div>
      )}

      {state.status === "error" && (
        <div
          className="rounded border-l-2 px-3 py-2 text-[12px] leading-relaxed"
          style={{ background: "#140A0A", borderColor: "#8B3A3A", color: "#B07070" }}
        >
          <span className="font-bold" style={{ color: "#DC2626" }}>Error: </span>
          {state.message}
        </div>
      )}

      {state.status === "ok" && (
        <div className="flex items-center gap-2">
          <code
            className="flex-1 min-w-0 text-[11px] font-mono break-all leading-relaxed px-3 py-2 rounded border"
            style={{ background: "#0A1A14", borderColor: "#1A3830", color: "#4ADE80" }}
          >
            {state.npub}
          </code>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 text-[11px] font-medium px-3 py-2 rounded border transition-all"
            style={
              copied
                ? { background: "#0D2010", borderColor: "#1A4020", color: "#22C55E" }
                : { background: "#0B1A16", borderColor: "#1A3830", color: "#4A6A60" }
            }
            title="Copy to clipboard"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      <div className="mt-3 text-[10px] leading-relaxed" style={{ color: "#2D4A40" }}>
        Read-only · Z2-scoped only · No Z1 identity material returned
      </div>
    </div>
  );
}

// ─── Section renderers ────────────────────────────────────────────────────────

function InventorySection() {
  const features = [
    {
      name: "Constellation / Zone Picker",
      benefit: "You always know what hat you're wearing. Store work, household planning, and council obligations stay in separate, named contexts — none bleeding into the others.",
    },
    {
      name: "Daily Picks / Morning Triage",
      benefit: "Single-screen daily focus. One morning commitment, acknowledged guardrails, zone-hour tracking at close of day. Reduces decision fatigue.",
    },
    {
      name: "Contracts",
      benefit: "Weekly hour targets per constellation. Turns informal commitments into trackable, reviewable records — good for board reporting and grant applications.",
    },
    {
      name: "Kitchen Table / River Smith Briefings",
      benefit: "AI-facilitated nightly strategic review across seven dimensions (Physical, Biological, Psychological, Quantum, Soul, Collective, Future). The river runs at 11:45 PM; the briefing waits at dawn.",
    },
    {
      name: "Task Autopilot",
      benefit: "Cross-constellation backlog triage. GREEN tasks auto-approve; AMBER tasks become binary decisions; RED tasks go to a council seat deliberation. Turns overwhelm into a manageable daily triage.",
    },
    {
      name: "Helping Hands",
      benefit: "Community labour exchange. Post tasks, claim them, complete them, settle via XRP/IOU. No bank account, no invoice, no chasing.",
    },
    {
      name: "HH Badges / Skill Credentials",
      benefit: "Verifiable skill progression (watching → doing → teaching) issued as XRPL DIDs. The badge is yours — it follows you across communities and platforms.",
    },
    {
      name: "Inbox / Gmail Archive Mining",
      benefit: "Surfaces email archives as triage-ready items tagged by zone and content type. Ten years of email becomes a reusable knowledge asset.",
    },
    {
      name: "Content Bank",
      benefit: "Structured store of repurposable community knowledge (course-material, email-sequence, case-study, voice-sample). Stops the same knowledge getting rediscovered every season.",
    },
    {
      name: "Captures",
      benefit: "Quick-capture for text and blobs mid-session. Nothing falls out of the day.",
    },
    {
      name: "Workbench Plan",
      benefit: "Burst-window scheduling — phase, minutes, windows, notes. Makes deep work visible so the day can be built around it rather than interrupted by it.",
    },
    {
      name: "Weekly / Seasonal Reviews",
      benefit: "Shipped / stalled / next-intention cadence weekly; what-changed / zones-shifted / statement-reflection seasonally. Prevents the quarterly 'where did the time go' spiral.",
    },
    {
      name: "Backup / Export",
      benefit: "Full JSON export of AppState. Complete data sovereignty — download everything, take it anywhere, restore from it. No lock-in.",
    },
    {
      name: "Zone Gate UI (ZoneGate.tsx)",
      benefit: "Visible consent moment at Z1→Z2 and Z2→Z3 crossings. You always know which boundary you are crossing and what it means for your identity and data.",
    },
  ];

  return (
    <div>
      <H2>1 · North Star Feature Inventory</H2>
      <P>Every core feature with its real-world benefit to a rural or small business operator.</P>
      <div className="mt-4 space-y-3">
        {features.map((f) => (
          <div key={f.name} className="rounded border p-4" style={{ background: "#0F0D0B", borderColor: "#1E1A14" }}>
            <div className="text-[13px] font-semibold mb-1" style={{ color: "#EAE4DB" }}>{f.name}</div>
            <div className="text-[12px] leading-relaxed" style={{ color: "#8C7B6D" }}>{f.benefit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MappingSection() {
  const mappings = [
    {
      feature: "Constellation → Nostr channel / label",
      z2reason: "Operational work — not private enough for Z1 (shareable with collaborators), not public enough for Z3 (carries household attribution).",
      buzz: "A Z2 npub (derived from household seed, scoped to Z2, non-reversible) acts as the Workbench identity. Each constellation maps to a Nostr label/channel namespace under that npub. Work-status events publish without revealing Z1 household identity.",
      changes: ["Add actor_type: 'human' | 'agent' to constellation-level events (not to the Constellation record itself).", "Gate event-publishing to Z2 npub — only the household that owns a constellation may publish under its channel.", "Queries enumerating a household's constellations must stay human-only (they traverse the Z1→Z2 gate)."],
      flag: "linkedFamilyId and linkedShareToken on Constellation are Eave Rule subjects. Neither may be read by agents.",
      tier: 1 as const,
    },
    {
      feature: "Daily Picks → agent-readable task manifest",
      z2reason: "Daily picks reference active constellations (Z2) and track zone hours (privacy-safe aggregate) — no personal identity.",
      buzz: "Morning triage output becomes a machine-readable 'morning manifest': zone-annotated JSON published to the Z2 relay channel each morning. Agents read the manifest, respond with intent events, and attach completed-work proofs. The acknowledgedGuardrails field becomes a machine-checkable consent record.",
      changes: ["Add actor_type: 'human' | 'agent' to DailyPick (Tier 1).", "Emit a structured morning manifest JSON — no Z1 fields, signed by the Z2 npub.", "Include acknowledgedGuardrails in the manifest so agents have the same consent record as the human."],
      flag: null,
      tier: 1 as const,
    },
    {
      feature: "Contracts → programmable payment trigger",
      z2reason: "A contract is a practitioner-to-work-context agreement — operational, not personal.",
      buzz: "When a contract milestone is met (attested by an agent or peer via signed completion event), an XRPL escrow releases automatically — no manual settlement. The Z3 wallet address appears at the crossing (audit event) but is not persisted inside the Contract record.",
      changes: ["Define a structured contract-milestone event envelope with actor_type.", "Add a verification step: North Star confirms attestation signature before triggering escrow.", "endsOn on Contract maps naturally to escrow-expiry date."],
      flag: "Z3 wallet address in the settlement event must not be persisted in the Contract record (giraffe constraint).",
      tier: 2 as const,
    },
    {
      feature: "Kitchen Table / River Smith → named Buzz agent",
      z2reason: "The Kitchen Table operates in the practitioner layer — strategic review of work, not personal identity.",
      buzz: "River Smith becomes a named npub with its own key pair. It posts structured briefing events (signed, timestamped) to the Z2 relay channel. The seven-dimension framework maps to a structured event schema. Other agents or human collaborators can subscribe and reply.",
      changes: ["River Smith needs a key pair (Tier 2 prerequisite).", "Define a river_briefing Nostr event envelope wrapping the existing markdown output.", "Briefing events carry the Z2 npub, not a Z1 identifier.", "Replies from other agents must be human-reviewable before influencing any operational decision."],
      flag: "River Smith's scheduler identity needs a key pair before it can participate as a named Buzz agent.",
      tier: 2 as const,
    },
    {
      feature: "Task Autopilot → agent-compatible triage",
      z2reason: "Task triage is operational — it acts on work items across constellations, not personal identity.",
      buzz: "Agents with delegated npub access can propose tasks (POST a new task event via Nostr), receive triage classification, and act on GREEN approvals without human intervention. AMBER items remain human-gated. RED items always require a council seat deliberation. Every approval is a signed consent event.",
      changes: ["Add actor_type: 'human' | 'agent' to task records (Tier 1).", "Agent task-posting must use a signed Nostr event with a delegated npub; North Star verifies signature before inserting (Tier 2).", "RED deliberation always routes to a human council seat — agents cannot self-approve RED items."],
      flag: null,
      tier: 1 as const,
    },
    {
      feature: "Helping Hands → fully agent-compatible labour market",
      z2reason: "HH tasks are community work — above the household (Z1), below the fully public market (Z3). The Workbench is the right home.",
      buzz: "Full task lifecycle maps to Buzz events: Create → Claim → Complete → Confirm → Settle. Agents may post tasks, claim tasks, and trigger XRPL settlement via signed completion events. Badge progression stays human-gated at the 'teaching' tier.",
      changes: ["Add actor_type: 'human' | 'agent' to HH Task records (Tier 1).", "Define machine-readable event envelopes for all five lifecycle stages (Tier 2).", "The 'teaching' badge tier must have a hard human_required: true flag in its attestation schema (Tier 3, VC schema lock)."],
      flag: null,
      tier: 1 as const,
    },
    {
      feature: "HH Badges → Nostr VC attestation",
      z2reason: "Skill credentials are practitioner-layer identity — what a person can do in community work, not who they are at home.",
      buzz: "XRPL DIDs already exist for HH badges. Add a Nostr-signed W3C VC wrapper so any Buzz participant can verify a badge by querying a relay — no XRPL node access required. The credential contains the Z2 npub (not household name), skill tier, and attesting npub(s).",
      changes: ["Wrap XRPL DID badges in Nostr-signed VC envelope (Tier 3).", "Build agent-readable badge verification endpoint: given a npub, return VCs (Tier 3).", "The 'teaching' attestation must include at least one human co-signer npub."],
      flag: "Tier 3 is blocked on VC schema lock. Do not build the VC wrapper until the schema is finalised.",
      tier: 3 as const,
    },
    {
      feature: "Inbox / Archive Mining → agent ingestion surface",
      z2reason: "Archive mining processes raw material (email) into reusable knowledge assets — operational work, not personal identity.",
      buzz: "Agents receive a scoped read token (not a Gmail credential) for pre-fetched archive batches. The agent reads the batch, posts tagging suggestions as Nostr events to the Z2 channel. Human reviews and approves before Content Bank insertion. The raw Gmail credential never leaves Z1.",
      changes: ["Define a scoped read token protocol: human grants token, agent receives pre-fetched batch, agent posts suggestions, human approves (Tier 3).", "Token must not expose: Gmail address, full name, or any Z1 identity field from GmailAccount.", "hatLabels may be visible to agents for tagging context but must not be used to infer Z1 identity."],
      flag: null,
      tier: 3 as const,
    },
    {
      feature: "Workbench Plan → agent scheduling signal",
      z2reason: "Burst-window scheduling is operational — how a practitioner allocates time for work, not who they are.",
      buzz: "Published as a structured Nostr event so agents know when burst windows are active and can queue or defer work accordingly. burstMinutes and windows fields map to a scheduling event with active_from, active_until, and phase.",
      changes: ["Emit a Workbench Plan event from the plan save action (Tier 1 stub, Tier 2 relay).", "Agents treat the plan as a scheduling signal only — not an identity disclosure."],
      flag: null,
      tier: 1 as const,
    },
    {
      feature: "Content Bank → agent-readable knowledge asset store",
      z2reason: "Structured knowledge assets tagged by zone and content type. Zone-tagged Z2 items are Workbench knowledge — appropriate for agent access. Z1-tagged items are permanently excluded.",
      buzz: "Agents can query Z2-tagged Content Bank items matching their current task context. A zone-scoped read API returns relevant assets without exposing Z1-tagged items. The zone field on ContentBankItem becomes the access-control boundary.",
      changes: ["Zone-scoped read API for Content Bank — agents may only query their delegated zone.", "Z1-tagged items must be permanently excluded from agent queries — the zone field is the hard gate."],
      flag: null,
      tier: 1 as const,
    },
    {
      feature: "Captures → agent ingestion surface (limited)",
      z2reason: "Captures may contain Z1 content (personal notes) or Z2 content (operational observations). Zone-tagging at capture time determines agent access.",
      buzz: "An agent with a processing delegation can read Captures that have been explicitly zone-tagged Z2 or above (never Z1), and propose Content Bank entries from them. The human approves before promotion to the Content Bank.",
      changes: ["Add a zone field to Capture (currently absent — has text and blobId only).", "Zone must default to Z1 (private) until the human explicitly promotes it. Agents may not read Z1 Captures."],
      flag: null,
      tier: 1 as const,
    },
    {
      feature: "Weekly / Seasonal Reviews → agent-readable cadence signal",
      z2reason: "Reviews are operational reflection — they track whether work is progressing, not who the person is. The zonesShifted field on SeasonalReview is a Z2 structural signal.",
      buzz: "Published as a structured event at review time. Agents subscribed to the Z2 channel receive the cadence signal and can adjust their scheduling (e.g., after a zone shift, agents re-calibrate which constellation channels to monitor). The statementReflection field must be excluded — it may contain Z1 personal content.",
      changes: ["Emit a weekly-review and seasonal-review event from the review save actions (Tier 1 stub).", "Exclude statementReflection from agent-visible events."],
      flag: null,
      tier: 1 as const,
    },
    {
      feature: "Backup / Export → sovereignty layer (agent-excluded)",
      z2reason: "The backup export contains full AppState including Z1-sensitive content (statement fields: who, why, noFly). This feature is human-only.",
      buzz: "None. This feature is intentionally outside the agent layer. No agent may trigger, read, or transmit a backup export.",
      changes: ["Add a hard human_only: true guard to the export action — no signed agent event may trigger it.", "The backup JSON must be treated as a Z1 document in any future encryption or storage scheme."],
      flag: "Backup export is human-only. No Buzz leverage is appropriate here.",
      tier: 1 as const,
    },
    {
      feature: "Zone Gate UI → machine-checkable gate event",
      z2reason: "The gate is the literal boundary marker — the visible consent moment at zone crossings.",
      buzz: "Each human crossing produces a signed gate-crossing event (Nostr custom kind, TBD): crossing direction + Z2 npub + timestamp. No Z1 data. Agents observe gate-crossing events to understand current operating context. Crossing is a human act — agents may never emit gate-crossing events.",
      changes: ["Emit a gate-crossing event from ZoneGate.tsx on each render of a crossing (Tier 2, requires relay).", "Payload: crossing direction and Z2 npub only — zero Z1 fields.", "Agents observe; never emit."],
      flag: null,
      tier: 2 as const,
    },
  ];

  return (
    <div>
      <H2>2 · Zone 2 Mapping (per feature)</H2>
      <P>For each feature: why Z2 is the right home, what Nostr/XRPL/Buzz leverage looks like, and what changes are needed for human/agent compatibility.</P>
      <div className="mt-4 space-y-4">
        {mappings.map((m) => (
          <div key={m.feature} className="rounded border" style={{ background: "#0F0D0B", borderColor: "#1E1A14" }}>
            <div className="flex items-start justify-between gap-3 px-4 py-3 border-b" style={{ borderColor: "#1E1A14" }}>
              <div className="text-[13px] font-semibold" style={{ color: "#EAE4DB" }}>{m.feature}</div>
              <Tag tier={m.tier} />
            </div>
            <div className="px-4 py-3 space-y-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.12em] mb-1 font-bold" style={{ color: "#4A6272" }}>Why Z2</div>
                <div className="text-[12px] leading-relaxed" style={{ color: "#8C7B6D" }}>{m.z2reason}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.12em] mb-1 font-bold" style={{ color: "#4A6272" }}>Buzz leverage</div>
                <div className="text-[12px] leading-relaxed" style={{ color: "#8C7B6D" }}>{m.buzz}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.12em] mb-1 font-bold" style={{ color: "#4A6272" }}>Changes needed</div>
                <ul className="space-y-1">
                  {m.changes.map((c, i) => (
                    <li key={i} className="text-[12px] leading-relaxed flex gap-2" style={{ color: "#8C7B6D" }}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: "#3D3228" }}>·</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {m.flag && (
                <div
                  className="rounded border-l-2 px-3 py-2 text-[11px] leading-relaxed"
                  style={{ background: "#140A0A", borderColor: "#8B3A3A", color: "#B07070" }}
                >
                  <span className="font-bold" style={{ color: "#DC2626" }}>⚑ </span>{m.flag}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuzzSection() {
  return (
    <div>
      <H2>3 · Buzz-Layer Alignment</H2>

      <H3>Architecture</H3>
      <P>North Star is the <strong className="text-[#EAE4DB]">business-operating surface</strong>. Buzz (a Nostr-based open collaboration layer) wraps it as the <strong className="text-[#EAE4DB]">communication and coordination fabric</strong>.</P>
      <div
        className="rounded border px-4 py-4 my-4 font-mono text-[11px] leading-relaxed"
        style={{ background: "#0A0806", borderColor: "#1E1A14", color: "#5C5046" }}
      >
        <div style={{ color: "#6B7AAD" }}>Buzz / Nostr Relay (Z2 pseudonymous identity — npub, not household name)</div>
        <div className="mt-2 ml-4" style={{ color: "#4A6272" }}>
          <div>North Star (business operating surface — Z2 Workbench)</div>
          <div className="ml-4" style={{ color: "#3D3228" }}>Constellations · Daily Picks · Contracts</div>
          <div className="ml-4" style={{ color: "#3D3228" }}>Kitchen Table · Task Autopilot · Helping Hands</div>
          <div className="ml-4" style={{ color: "#3D3228" }}>Content Bank · Workbench Plan · Reviews</div>
        </div>
        <div className="mt-2 ml-4" style={{ color: "#3D3228" }}>↕ events</div>
        <div className="mt-1 ml-4 flex gap-6">
          <span style={{ color: "#4A8A7C" }}>River Smith (Z2 npub)</span>
          <span style={{ color: "#8A6A4A" }}>HH Agents (delegated)</span>
          <span style={{ color: "#6B7AAD" }}>Peer npubs (community)</span>
        </div>
        <div className="mt-3" style={{ color: "#3D3228" }}>↕ (Z2→Z3 gate only — settlement events)</div>
        <div className="mt-1" style={{ color: "#7C4E8A" }}>XRPL — Z3 Settlement (wallet addresses, escrow, DIDs, IOUs)</div>
        <div className="mt-2 text-[10px] italic" style={{ color: "#3D3228" }}>Z1 household identity is never in this diagram.</div>
      </div>

      <H3>Z2 npub Identity and the Eave Rule</H3>
      <P>The Z2 npub is derived from the household's existing seed, scoped to Z2, and non-reversible to Z1.</P>
      <ul>
        <Li><strong className="text-[#EAE4DB]">Derivation:</strong> HKDF(household_seed, "zone:Z2", length=32) — one-way. Given the npub, the household seed cannot be recovered.</Li>
        <Li><strong className="text-[#EAE4DB]">Scope:</strong> Used exclusively for Workbench-layer events. Not the household's personal public key.</Li>
        <Li><strong className="text-[#EAE4DB]">Relay topology:</strong> Subscribes to a Headwaters Nostr relay. Visible to other Z2 participants; the relay stores no Z1 identity.</Li>
        <Li><strong className="text-[#EAE4DB]">Eave Rule compliance:</strong> Given a Z2 npub, no relay query can recover the household name or passphrase.</Li>
      </ul>

      <Z2NpubReadout />

      <H3>Task Lifecycle on Buzz</H3>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid #251E18" }}>
              {["Stage", "Actor", "Event", "Notes"].map((h) => (
                <th key={h} className="text-left py-2 px-3 font-bold text-[10px] uppercase tracking-[0.12em]" style={{ color: "#4A6272" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Create", "Human or agent", "Task description, zone, skills, XRP offer", "Zone must be Z2 or Z3; no Z1 fields"],
              ["Claim", "Agent or human", "Intent event with actor_type (signed npub)", "Claim is an intent, not a lock"],
              ["Complete", "Agent", "Proof event: completion hash, duration, output reference", "Auditable but not personally identifying"],
              ["Confirm", "Human or oracle", "Verification event — signs the proof event's hash", "Human-gated for all HH tasks"],
              ["Settle", "XRPL (automatic)", "Escrow release on confirmed completion event", "Z3 event — wallet addresses appear here only"],
            ].map(([stage, actor, event, notes]) => (
              <tr key={stage} style={{ borderBottom: "1px solid #1A1510" }}>
                <td className="py-2 px-3 font-semibold" style={{ color: "#EAE4DB" }}>{stage}</td>
                <td className="py-2 px-3" style={{ color: "#8C7B6D" }}>{actor}</td>
                <td className="py-2 px-3" style={{ color: "#8C7B6D" }}>{event}</td>
                <td className="py-2 px-3 text-[11px]" style={{ color: "#5C5046" }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Rule>Confirm always requires a human (or a human-designated oracle with a time-limited grant). Settle is automatic once Confirm is present. The Z3 wallet address appears only in the Settle event and escrow record — it does not persist in any Z2 task record.</Rule>

      <H3>Permission Model</H3>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid #251E18" }}>
              {["Action", "Default", "Needs delegation", "Permanently out of scope"].map((h) => (
                <th key={h} className="text-left py-2 px-3 font-bold text-[10px] uppercase tracking-[0.12em]" style={{ color: "#4A6272" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Read Z2-tagged Content Bank items", "✅", "—", "—"],
              ["Read morning manifest", "✅", "—", "—"],
              ["Read gate-crossing events", "✅", "—", "—"],
              ["Post task (Create)", "—", "✅ Signed grant from human npub", "—"],
              ["Claim task", "—", "✅ Delegated npub with claim scope", "—"],
              ["Post completion proof", "—", "✅ Task-scoped grant", "—"],
              ["Read Z1-tagged items (any)", "—", "—", "❌ Permanent prohibition"],
              ["Trigger backup export", "—", "—", "❌ Human-only"],
              ["Emit gate-crossing events", "—", "—", "❌ Human act only"],
              ["Enumerate household's constellations", "—", "—", "❌ Traverses Z1→Z2 gate"],
              ["Read linkedFamilyId / linkedShareToken", "—", "—", "❌ Eave Rule subjects"],
              ["Access statement fields (who/why/noFly)", "—", "—", "❌ Z1 personal identity"],
              ["Attain 'teaching' badge tier autonomously", "—", "—", "❌ Human co-attestation required"],
            ].map(([action, def, del, perm]) => (
              <tr key={action} style={{ borderBottom: "1px solid #1A1510" }}>
                <td className="py-2 px-3" style={{ color: "#8C7B6D" }}>{action}</td>
                <td className="py-2 px-3 text-center" style={{ color: def === "✅" ? "#22C55E" : "#3D3228" }}>{def}</td>
                <td className="py-2 px-3 text-[11px]" style={{ color: "#6B7AAD" }}>{del}</td>
                <td className="py-2 px-3 text-[11px]" style={{ color: "#DC2626" }}>{perm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3>Audit Trail and the Giraffe Constraint</H3>
      <P>Every event in the Buzz layer is signed, timestamped, and stored on the relay. The audit trail covers: gate crossings, task lifecycle steps, payment settlement, badge attestations, and delegation grants.</P>
      <Rule>
        <strong>The giraffe constraint:</strong> A regulator can query the relay and see "On this date, this Z2 npub posted this task, claimed by this agent npub, completed with this proof, confirmed by this human npub, settled to this wallet address." They cannot query: "Which household is behind this Z2 npub?" The giraffe sees over the fence — it cannot see through the eave.
      </Rule>

      <H3>acknowledgedGuardrails as Machine-Checkable Consent</H3>
      <P>The <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>acknowledgedGuardrails</code> field on <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>DailyPick</code> is already the right shape for a Buzz consent record. The morning manifest event includes the list of acknowledged guardrail IDs. Agents check this list before acting on delegated tasks — if a required guardrail has not been acknowledged for the current day, the agent defers and notifies rather than proceeds. The acknowledgement is signed by the Z2 npub.</P>

      <H3>Agent Role Registry</H3>
      <P>Each agent has a named <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>AgentRole</code> carried on relay events and <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>DailyPick</code> (when <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>actor_type</code> is <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>"agent"</code>). The role makes events attributable to a specific persona without exposing Z1 identity. New Helping Hands agents register here first.</P>
      <div className="mt-3 space-y-2">
        {[
          {
            role: "river-smith",
            name: "River Smith",
            description: "Nightly strategic review across the seven dimensions. Posts BRIEFING_ENVELOPE events (kind 1001).",
            status: "active" as const,
          },
          {
            role: "critical-challenger",
            name: "Critical Challenger",
            description: "Surfaces counter-arguments, blind spots, and risk flags on proposed plans or decisions.",
            status: "planned" as const,
          },
          {
            role: "r-and-d",
            name: "R&D Lead",
            description: "Research, discovery, and prototype proposals. Synthesises external information against the current constellation context.",
            status: "planned" as const,
          },
          {
            role: "ops",
            name: "Stability & Operations",
            description: "Monitors burst windows, flags stalled work, and keeps the operational scheduling layer running smoothly.",
            status: "planned" as const,
          },
        ].map((entry) => (
          <div
            key={entry.role}
            className="rounded border flex items-start gap-3 px-4 py-3"
            style={{ background: "#0F0D0B", borderColor: "#1E1A14" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-semibold" style={{ color: "#EAE4DB" }}>{entry.name}</span>
                <code
                  className="text-[10px] px-1.5 py-0.5 rounded border font-mono"
                  style={{ background: "#0A0806", borderColor: "#251E18", color: "#5C5046" }}
                >
                  {entry.role}
                </code>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded border font-mono"
                  style={
                    entry.status === "active"
                      ? { background: "#0D2010", borderColor: "#1A4020", color: "#4ADE80" }
                      : { background: "#0F0C09", borderColor: "#251E18", color: "#5C5046" }
                  }
                >
                  {entry.status}
                </span>
              </div>
              <div className="text-[12px] leading-relaxed" style={{ color: "#8C7B6D" }}>{entry.description}</div>
            </div>
          </div>
        ))}
      </div>
      <Rule>Role values are string literals defined in <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>AgentRole</code> (types.ts). Every relay payload interface and <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>DailyPick</code> carry an optional <code className="text-[11px] px-1 rounded" style={{ background: "#1A1510", color: "#C4B5FD" }}>agent_role</code> field — omitted for human-authored events. Model selection per role is external config, not in-app logic.</Rule>
    </div>
  );
}

function StepsSection() {
  return (
    <div>
      <H2>4 · Concrete Implementation Steps (prioritised)</H2>

      <div className="flex items-center gap-2 my-4 flex-wrap">
        <Tag tier={1} /> <span className="text-[12px]" style={{ color: "#5C5046" }}>No external dependencies</span>
        <span className="mx-2" style={{ color: "#3D3228" }}>·</span>
        <Tag tier={2} /> <span className="text-[12px]" style={{ color: "#5C5046" }}>Needs system npub + relay URL</span>
        <span className="mx-2" style={{ color: "#3D3228" }}>·</span>
        <Tag tier={3} /> <span className="text-[12px]" style={{ color: "#5C5046" }}>Needs VC schema lock</span>
      </div>

      <H3>Tier 1 — Safe to build now</H3>
      {[
        {
          n: 1,
          title: "Add actor_type discriminator to HH Task and DailyPick records",
          detail: "Add actor_type: \"human\" | \"agent\" to the DailyPick type in types.ts. Add the same field to HH Task when the HH schema is formalised. Default: \"human\" — no existing behaviour changes.",
          eave: "Z2-scoped, no identity information.",
        },
        {
          n: 2,
          title: "Define Z2 npub generation utility in lib/zone-identity",
          detail: "Create lib/zone-identity/src/index.ts with deriveZ2Npub(householdSeed: Uint8Array): string using HKDF-SHA256 with domain separator \"headwaters:zone:Z2:npub\". One-way only — no inverse function. Unit test: same seed → same npub; different seeds → different npubs.",
          eave: "Non-reversible by construction.",
        },
        {
          n: 3,
          title: "Add publishToRelay(event) stub in North Star",
          detail: "Create artifacts/north-star/src/lib/relay-stub.ts. Currently writes to localStorage under \"ns:relay:events\" with event envelope: { kind, payload, z2npub, timestamp, signature: \"stub\" }. Interface matches the real Nostr relay so Tier 2 wiring is a drop-in replacement.",
          eave: "Event envelope has no Z1 fields by design.",
        },
        {
          n: 4,
          title: "Emit structured 'morning manifest' JSON from Daily Picks",
          detail: "On daily picks save, generate a MorningManifest: { date, constellation_ids: string[], acknowledged_guardrails: string[], burst_windows: WorkbenchPlan | null, zone_ranking: ZoneId[] }. No Z1 fields. No household name. Call publishToRelay (writes to localStorage stub in Tier 1).",
          eave: "Manifest contains Z2 constellation IDs and zone metadata only.",
        },
        {
          n: 5,
          title: "Add river_briefings Nostr event envelope",
          detail: "After generating a River Smith briefing, also emit a structured event: { kind: TBD, generated_at: ISO, triggered_by: \"human\" | \"scheduler\", markdown_hash: string, structured_payload: { dimensions: [...] } }. The rawMarkdown field is not included in the event payload — the structured payload is the machine-readable summary.",
          eave: "Event contains operational metadata only.",
        },
        {
          n: 6,
          title: "Add zone field to Capture",
          detail: "Add zone?: ZoneId to the Capture type, defaulting to undefined (treated as Z1/private). Agents may not read Captures where zone is undefined or \"Z1\".",
          eave: "Zone field is a classification marker, not an identity field.",
        },
      ].map((step) => (
        <div key={step.n} className="rounded border mb-3" style={{ background: "#0A100A", borderColor: "#1A4020" }}>
          <div className="flex items-start gap-3 px-4 py-3">
            <span className="text-[11px] font-mono font-bold flex-shrink-0 mt-0.5" style={{ color: "#22C55E" }}>#{step.n}</span>
            <div>
              <div className="text-[13px] font-semibold mb-1" style={{ color: "#EAE4DB" }}>{step.title}</div>
              <div className="text-[12px] leading-relaxed mb-2" style={{ color: "#7C8C7C" }}>{step.detail}</div>
              <div className="text-[11px]" style={{ color: "#4A6A4A" }}>Eave check: ✅ {step.eave}</div>
            </div>
          </div>
        </div>
      ))}

      <H3>Tier 2 — Requires system npub first</H3>
      <Rule>Prerequisite: Register North Star's Z2 npub on a Headwaters Nostr relay. Configure NOSTR_RELAY_URL and NOSTR_SYSTEM_NPUB in environment.</Rule>
      {[
        {
          n: 7,
          title: "Wire publishToRelay stub to real relay connection",
          detail: "Replace localStorage write in relay-stub.ts with a WebSocket connection to the configured relay. Add NIP-01 signing using the Z2 npub's private key (stored in env, never in client state). The stub interface is unchanged — Tier 1 callers automatically gain real relay publishing.",
        },
        {
          n: 8,
          title: "Implement Helping Hands agent task-posting",
          detail: "An agent with a granted npub posts a new HH task via a signed Nostr event. North Star's API verifies the signature and the grant before inserting the task. Grant verification: valid delegation grant exists for the agent npub, scoped to the target constellation, not expired.",
        },
        {
          n: 9,
          title: "Implement agent task-completion event",
          detail: "A signed Nostr event from an agent's npub triggers the XRPL escrow release path. Completion event must reference the task ID, include a completion proof hash, and be signed by the delegated npub. North Star verifies: (a) valid signature, (b) agent holds completion-scope grant for this task, (c) a human Confirm event is present before escrow release fires.",
        },
      ].map((step) => (
        <div key={step.n} className="rounded border mb-3" style={{ background: "#100C00", borderColor: "#3A2800" }}>
          <div className="flex items-start gap-3 px-4 py-3">
            <span className="text-[11px] font-mono font-bold flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }}>#{step.n}</span>
            <div>
              <div className="text-[13px] font-semibold mb-1" style={{ color: "#EAE4DB" }}>{step.title}</div>
              <div className="text-[12px] leading-relaxed" style={{ color: "#8C7A5C" }}>{step.detail}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Step 10 — complete */}
      <div className="rounded border mb-3" style={{ background: "#0A100A", borderColor: "#1A4020" }}>
        <div className="flex items-start gap-3 px-4 py-3">
          <span className="text-[11px] font-mono font-bold flex-shrink-0 mt-0.5" style={{ color: "#22C55E" }}>#10</span>
          <div>
            <div className="text-[13px] font-semibold mb-1" style={{ color: "#EAE4DB" }}>Publish zone-gate crossing events from ZoneGate.tsx</div>
            <div className="text-[12px] leading-relaxed mb-2" style={{ color: "#7C8C7C" }}>{"On render of a gate crossing, emit a crossing event via publishToRelay. Payload: { crossing: \"Z1→Z2\" | \"Z2→Z3\", z2npub: string, crossed_at: ISO }. No Z1 data. No constellation list. Agents observe, never emit."}</div>
            <div className="text-[11px]" style={{ color: "#4A6A4A" }}>Eave check: ✅ Payload carries crossing direction and crossed_at only — no Z1 identity fields. NoZ1Fields&lt;T&gt; constraint enforced at compile time.</div>
          </div>
        </div>
      </div>

      <H3>Tier 3 — Wait for VC schema lock</H3>
      {[
        {
          n: 11,
          title: "Wrap XRPL DID badges in Nostr-signed VC envelope",
          detail: "Given a locked W3C VC schema, produce a VC for each HH badge: { @context, type: [\"VerifiableCredential\", \"HHSkillBadge\"], issuer: system_npub, credentialSubject: { id: z2npub, skill, tier }, proof: { type: \"NostrSignature\" } }. The 'teaching' tier VC must include a human_co_attested_by field.",
        },
        {
          n: 12,
          title: "Build agent-readable badge verification endpoint",
          detail: "GET /api/badges/verify?npub=<z2npub> returns a list of VCs for that npub. No XRPL query required by the caller — the endpoint resolves the DID internally. Returns only VCs for the requested npub; no enumeration of all badge holders.",
        },
        {
          n: 13,
          title: "Implement scoped agent read-token for Inbox/Archive Mining",
          detail: "Human grants a time-limited read token (not a Gmail credential) for a specific email batch. Agent reads batch, posts tagging suggestions as Nostr events to the Z2 channel. Human reviews and approves before Content Bank insertion. Token must not expose: Gmail address, full name, or any Z1 identity field from GmailAccount.",
        },
        {
          n: 14,
          title: "Implement programmable contract milestone → escrow release",
          detail: "A structured attestation event (human or agent) triggers XRPL escrow release. Attestation event: { kind: TBD_MILESTONE, contract_id, milestone_description, completed_hours, attested_by: z2npub, actor_type: \"human\" | \"agent\", timestamp }. Escrow release fires only after a human Confirm event.",
        },
      ].map((step) => (
        <div key={step.n} className="rounded border mb-3" style={{ background: "#0E0A18", borderColor: "#2A1040" }}>
          <div className="flex items-start gap-3 px-4 py-3">
            <span className="text-[11px] font-mono font-bold flex-shrink-0 mt-0.5" style={{ color: "#A78BFA" }}>#{step.n}</span>
            <div>
              <div className="text-[13px] font-semibold mb-1" style={{ color: "#EAE4DB" }}>{step.title}</div>
              <div className="text-[12px] leading-relaxed" style={{ color: "#7C6C9C" }}>{step.detail}</div>
            </div>
          </div>
        </div>
      ))}

      <H3>Flags requiring explicit review before Tier 2</H3>
      <Flag>linkedFamilyId and linkedShareToken on Constellation must be reviewed before any Buzz-layer feature touches them. Both are Eave Rule subjects. Neither is currently safe for agent read access. Any Tier 2 feature querying constellation records must explicitly exclude these fields.</Flag>
      <Flag>The zone_bindings table described in schema-notes.md does not yet exist. Tier 2 work assumes it is built first, with the direction lock enforced: household_id → wallet_address only, never the reverse.</Flag>
      <Flag>River Smith's existing scheduler identity needs a key pair before it can participate as a named Buzz agent. This is a prerequisite for Step 7 (Tier 2).</Flag>
      <Flag>The statement fields on AppState (who, why, noFly) are Z1 personal identity. They must be permanently excluded from all agent-readable event envelopes and relay queries.</Flag>
    </div>
  );
}

function BenefitsSection() {
  const items = [
    {
      headline: "Your work stays private to your household.",
      body: "The app already keeps your household life in one pile and your community business in another. That separation is built into the structure — not just a setting you can accidentally turn off. When you open North Star to plan your store's week, your household details stay invisible. The store work and the household work share the same tool but never the same room.",
    },
    {
      headline: "Your reputation travels with you without your name.",
      body: "If you earn a skill badge — say, for completing cold-storage logistics work — that badge is yours. It's a record that says 'the person who holds this key completed this skill to this standard, verified by the community.' If the platform ever closes, the badge still exists. If you move to another community using the same system, the badge follows. Your name is never attached to it unless you choose to attach it yourself.",
    },
    {
      headline: "Payments for community work settle automatically — no chasing anyone.",
      body: "When you post a task in the community labour exchange, you can attach a payment to it upfront — held in escrow. When the work is done, and a community member confirms it, the payment releases automatically. No invoice. No waiting. No awkward 'hey, did you send that yet?' conversation. This works for anything from 'I need someone to haul feed this Friday' to a week-long construction project.",
    },
    {
      headline: "The AI assistant that already helps you plan your week can now take real tasks off your plate — and show you proof.",
      body: "River Smith already reads the week's priorities every night and gives you a briefing in the morning. The next step is that River Smith — and other small AI helpers — can actually do tasks, not just describe them. They post their completed work as a record you can verify. You confirm it before anything is finalized. You stay in the decision seat; they do the legwork.",
    },
    {
      headline: "Your skills are recognised in a way that follows you.",
      body: "The community labour exchange isn't just a job board. Every task you complete adds to a skill record — one that any participating community can read without needing to call Headwaters and ask. New projects, new partners, new opportunities: your track record is already there, readable by anyone you choose to share it with.",
    },
    {
      headline: "None of this requires a bank account, a credit check, or a platform middleman.",
      body: "The payment layer runs on a shared ledger — the same one that a growing number of rural and First Nations communities are building on for exactly this reason. You need a wallet address, not a bank account. Headwaters runs the relay; you hold the keys. If Headwaters steps back, the system keeps running.",
    },
  ];

  return (
    <div>
      <H2>5 · Benefits Summary</H2>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#6B7AAD" }}>Plain language — for a skeptical rural business owner. No protocol names unless explained.</p>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.headline} className="rounded border p-4" style={{ background: "#0F0D0B", borderColor: "#1E1A14" }}>
            <div className="text-[14px] font-semibold mb-2 leading-snug" style={{ color: "#EAE4DB" }}>{item.headline}</div>
            <div className="text-[13px] leading-relaxed" style={{ color: "#8C7B6D" }}>{item.body}</div>
          </div>
        ))}
        <div
          className="rounded border-l-2 px-4 py-3 mt-4"
          style={{ background: "#0F0C09", borderColor: "#5C4A1A", color: "#8C7A4A" }}
        >
          <div className="text-[12px] font-semibold mb-1" style={{ color: "#C5A96A" }}>One honest word of caution.</div>
          <div className="text-[12px] leading-relaxed">This is a roadmap, not a product you can use today. The pieces that are ready — the zone separation, the daily planning, the backlog triage — those work now. The agent participation and automatic payment settlement are 6–18 months away, depending on how the community validation goes. We are building this in public and in order.</div>
        </div>
      </div>
    </div>
  );
}

function MissingSection() {
  const items = [
    {
      n: 1,
      item: "System npub / Headwaters Nostr relay URL",
      detail: "Does a Headwaters Nostr relay already exist? Is there an established system npub for North Star?",
      blocks: "All Tier 2 steps",
      who: "Founder / infrastructure owner",
    },
    {
      n: 2,
      item: "River Smith key pair",
      detail: "Does the River Smith scheduler service have a dedicated key pair, or does it run under a shared system key?",
      blocks: "Step 7 (Tier 2 live participation)",
      who: "Server-side configuration",
    },
    {
      n: 3,
      item: "VC schema version target",
      detail: "What is the intended W3C VC schema version, and is there a lock date?",
      blocks: "All Tier 3 steps",
      who: "Protocol team / schema author",
    },
    {
      n: 4,
      item: "HH schema formalisation",
      detail: "lib/db/src/schema/helpingHands.ts is referenced in the spec but does not exist in the current monorepo. The full HH task lifecycle cannot be fully specified without it.",
      blocks: "Steps 8, 9, and 14",
      who: "DB schema owner",
    },
    {
      n: 5,
      item: "zone_bindings table",
      detail: "Does not yet exist (noted in schema-notes.md). Tier 2 assumes it is built with the direction lock enforced.",
      blocks: "Steps 8 and 14",
      who: "DB schema owner",
    },
    {
      n: 6,
      item: "XRPL escrow path stub",
      detail: "The spec references 'the XRPL escrow release path already stubbed in the HH settlement flow.' This stub was not found in the current codebase. Confirm whether it exists in a branch or needs to be written from scratch.",
      blocks: "Steps 9 and 14",
      who: "Developer",
    },
    {
      n: 7,
      item: "Nostr event kind assignments",
      detail: "Custom event kinds (TBD_GATE_CROSSING, TBD_GRANT, TBD_MILESTONE, etc.) need assigned kind numbers that do not conflict with existing NIPs.",
      blocks: "All Tier 2+ event definitions",
      who: "Protocol team",
    },
    {
      n: 8,
      item: "Household seed storage",
      detail: "Where is the household seed currently stored (localStorage, server-side, hardware wallet)? The Z2 npub derivation in Step 2 must be consistent with the existing seed storage model.",
      blocks: "Step 2 implementation",
      who: "Developer / founder",
    },
  ];

  return (
    <div>
      <H2>6 · Missing Information</H2>
      <P>The following items could not be determined from the codebase alone and require external confirmation before the implementation roadmap can be fully executed.</P>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.n} className="rounded border" style={{ background: "#0F0D0B", borderColor: "#1E1A14" }}>
            <div className="flex items-start gap-3 px-4 py-3">
              <span className="text-[11px] font-mono font-bold flex-shrink-0 mt-0.5" style={{ color: "#5C5046" }}>#{item.n}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold mb-1" style={{ color: "#EAE4DB" }}>{item.item}</div>
                <div className="text-[12px] leading-relaxed mb-2" style={{ color: "#8C7B6D" }}>{item.detail}</div>
                <div className="flex flex-wrap gap-3 text-[11px]">
                  <span>
                    <span style={{ color: "#4A3D33" }}>Blocks: </span>
                    <span style={{ color: "#DC2626" }}>{item.blocks}</span>
                  </span>
                  <span>
                    <span style={{ color: "#4A3D33" }}>Who can answer: </span>
                    <span style={{ color: "#6B7AAD" }}>{item.who}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="mt-6 rounded border px-4 py-3 text-[12px] leading-relaxed"
        style={{ background: "#0A0806", borderColor: "#251E18", color: "#5C5046" }}
      >
        Document maintained alongside <code style={{ color: "#8C7B6D" }}>docs/zones-gates-reference.md</code> and <code style={{ color: "#8C7B6D" }}>artifacts/north-star/src/schema-notes.md</code>. Any proposed change to this roadmap must pass the Eave Rule test in schema-notes.md § "How to test a proposed change against the Eave Rule" before being actioned.
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function Zone2AlignmentPage() {
  const [active, setActive] = useState<SectionId>("inventory");

  return (
    <div
      className="min-h-screen pb-32"
      style={{ background: "#0B0905" }}
    >
      {/* Header */}
      <div className="border-b px-5 pt-8 pb-5" style={{ borderColor: "#1E1A14" }}>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/sprint" className="text-[11px] tracking-wide hover:opacity-70 transition-opacity" style={{ color: "#4A3D33" }}>
            ← Sprint
          </Link>
        </div>
        <h1 className="text-[22px] font-serif tracking-wide mb-1" style={{ color: "#EAE4DB" }}>
          Zone 2 / Buzz Alignment
        </h1>
        <p className="text-[12px]" style={{ color: "#5C5046" }}>
          North Star feature inventory · Zone 2 mapping · Buzz architecture · Implementation roadmap · Benefits summary
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          <span className="text-[10px] uppercase tracking-[0.12em] font-bold" style={{ color: "#4A3D33" }}>Governing constraint:</span>
          <span className="text-[10px]" style={{ color: "#5C5046" }}>Eave Rule · Z1–Z3 absolute prohibition · Two-gate constitutional model</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pt-6 max-w-3xl">
        <SectionNav active={active} onSelect={setActive} />

        {active === "inventory" && <InventorySection />}
        {active === "mapping" && <MappingSection />}
        {active === "buzz" && <BuzzSection />}
        {active === "steps" && <StepsSection />}
        {active === "benefits" && <BenefitsSection />}
        {active === "missing" && <MissingSection />}
      </div>
    </div>
  );
}
