import { Link } from "wouter";

export function CapCeremonyPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">

      {/* ── hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#1a1a18", color: "#f0eade" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 60%, rgba(180,120,40,0.08) 0%, transparent 70%), " +
              "radial-gradient(ellipse at 75% 20%, rgba(100,140,100,0.07) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[44rem] px-6 sm:px-10 pt-14 pb-16">
          <p
            className="font-mono text-[10.5px] uppercase tracking-[0.26em] mb-5"
            style={{ color: "rgba(210,160,40,0.75)" }}
          >
            codetry · the systems · cap ceremony
          </p>
          <h1
            className="font-serif leading-[1.1] tracking-tight mb-5"
            style={{ fontSize: "clamp(1.8rem, 5.5vw, 2.75rem)" }}
          >
            The screen is the seal.
            <br />
            <span style={{ color: "#b85a3e" }}>Not the form.</span>
          </h1>
          <p className="font-serif text-[17px] sm:text-xl leading-relaxed" style={{ color: "rgba(240,234,222,0.72)" }}>
            A cap is conferred once. The wallet confirmation is the final beat
            of that act — the moment identity, posture, and cryptographic
            authority become one gesture. This document specifies how the
            screen holds that weight.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[44rem] px-6 sm:px-10 pt-12 pb-20">

        {/* ── Language anchor ── */}
        <section className="mb-14 border-l-2 pl-6 sm:pl-8" style={{ borderColor: "hsl(var(--accent))" }}>
          <p
            className="font-mono text-[10.5px] uppercase tracking-[0.22em] mb-3"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Two terms · one moment
          </p>
          <p className="font-serif text-lg sm:text-xl leading-relaxed mb-4">
            <strong>Cap</strong> is the community-facing term. It is lived, named,
            and worn inside Bright Side. The person receiving a cap hears that
            word in the room, from the people who know them.
          </p>
          <p className="font-serif text-lg sm:text-xl leading-relaxed">
            <strong>Warrant</strong> is the chain record. It is the immutable
            inscription of the event on the ledger. No one in the room uses
            this word during the ceremony — it belongs to the audit log, the
            compliance layer, the archive.
          </p>
          <p className="mt-5 font-serif text-base leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            The community-facing screen shows <em>cap</em>. The chain record
            and any audit-facing view show <em>warrant</em>. These are the
            same event. They are not the same word.
          </p>
        </section>

        <hr className="rule mb-14" />

        {/* ── Ceremony sequence ── */}
        <section className="mb-14">
          <p
            className="font-mono text-[10.5px] uppercase tracking-[0.22em] mb-8"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            The full sequence
          </p>

          <div className="space-y-0">
            <Beat
              phase="Before the screen"
              label="01 · Naming"
              accent="#b85a3e"
            >
              The gathering is called. The community names the person. The
              conferring authority speaks the cap aloud — its title, what it
              recognises, what it authorises. The person receiving it is
              present: body or voice.
            </Beat>

            <Beat
              phase="Before the screen"
              label="02 · Witness"
              accent="#b85a3e"
            >
              At least one other member of the community witnesses the
              naming. In an in-person ceremony, this is the room. In a
              remote ceremony, this is the roll call — each witness
              confirms their presence before the screen opens.
            </Beat>

            <Beat
              phase="Before the screen"
              label="03 · Pre-flight"
              accent="#b85a3e"
            >
              All decisions are made before the ceremony moment begins.
              Cap type, conferring authority, recipient address, and any
              attached rights are locked and reviewed outside the room.
              Nothing is editable once the ceremony opens. If a correction
              is needed, the ceremony closes and resets — no edits mid-flow.
            </Beat>

            <Beat
              phase="The screen opens"
              label="04 · The seal"
              accent="hsl(var(--accent))"
              highlight
            >
              The wallet confirmation appears. It shows exactly four things:
              who is receiving the cap, what cap it is, who is conferring it,
              and a single confirm action. No fields. No dropdowns. No back
              button. The screen is a statement, not a question.
            </Beat>

            <Beat
              phase="After the screen"
              label="05 · The record"
              accent="#4e7c59"
            >
              The confirm gesture closes the ceremony. The warrant is written
              to the chain. The community-facing confirmation — a cap slip,
              a display card, a spoken acknowledgement — follows immediately.
              The moment is sealed.
            </Beat>

            <Beat
              phase="After the screen"
              label="06 · Rest"
              accent="#4e7c59"
            >
              The ceremony ends. The wallet closes. No next step is prompted.
              The record exists. The community holds it.
            </Beat>
          </div>
        </section>

        <hr className="rule mb-14" />

        {/* ── The screen itself ── */}
        <section className="mb-14">
          <p
            className="font-mono text-[10.5px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            What the screen shows
          </p>
          <p className="font-serif text-base sm:text-lg leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            The confirmation screen is a read-only document. Its purpose is
            display and commitment — not data entry.
          </p>

          <div
            className="rounded-sm border px-7 sm:px-10 py-8 sm:py-10 space-y-7"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          >
            <ScreenField label="Receiving" value="[Member's full name or chosen name]" />
            <ScreenField label="Cap" value="[Cap title — e.g. 'Guide', 'Keeper', 'Steward']" />
            <ScreenField label="Conferred by" value="[Authority name and role]" />
            <ScreenField label="Witnesses" value="[Names, or 'The gathering' for in-person]" />
            <ScreenField label="Recorded as" value="Warrant — chain record only, not displayed in ceremony view" note />
            <div className="pt-3 border-t" style={{ borderColor: "hsl(var(--card-border))" }}>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Single action
              </p>
              <div
                className="inline-block rounded-sm px-8 py-3 font-mono text-[12px] uppercase tracking-[0.2em]"
                style={{ background: "#1a1a18", color: "#f0eade" }}
              >
                Confer the cap
              </div>
              <p className="mt-3 font-serif text-[13px] leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                One button. One gesture. No confirmation dialog on top of the
                confirmation. The act is final when the button is pressed.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-14" />

        {/* ── Single-gesture principle ── */}
        <section className="mb-14">
          <p
            className="font-mono text-[10.5px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            The single-gesture principle
          </p>
          <p className="font-serif text-lg sm:text-xl leading-snug mb-6">
            One gesture closes the ceremony.
          </p>
          <div className="space-y-4 font-serif text-base sm:text-[17px] leading-relaxed">
            <p>
              Any multi-step confirmation — reviewing the cap, confirming the
              recipient, approving the authority — must be completed
              <strong> before the ceremony moment begins</strong>, not during
              it. The ceremony moment is the room. The wallet prompt is the
              final beat of that room. It does not ask questions. It does not
              introduce doubt. It receives the gesture that closes the
              ceremony.
            </p>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>
              If a multi-step confirmation must happen, it happens in a
              pre-ceremony review screen that is distinct in visual register
              from the ceremony screen itself — plainer, more administrative.
              The ceremony screen is visually clean, text-heavy, and
              intentional. It does not look like the review step.
            </p>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>
              If the ceremony screen presents an error — wallet unreachable,
              address mismatch, network failure — the ceremony is paused, not
              aborted. The room holds. The error is resolved outside the
              ceremony moment, and the screen is reopened fresh.
            </p>
          </div>
        </section>

        <hr className="rule mb-14" />

        {/* ── In-person vs. remote ── */}
        <section className="mb-14">
          <p
            className="font-mono text-[10.5px] uppercase tracking-[0.22em] mb-8"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            In-person vs. remote
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <VariantCard title="In-person ceremony" marker="gathered">
              <p>
                The community is in the same room. The screen is held or
                displayed by the conferring authority. The recipient does not
                hold the device — the gesture of confirmation belongs to the
                person doing the conferring.
              </p>
              <p className="mt-3">
                Witnesses are the room. The warrant records{" "}
                <em>"In-person gathering"</em> as the witness field, plus a
                location token if the community chooses to attach one.
              </p>
              <p className="mt-3">
                After the gesture, the cap slip — a physical or displayed
                card with the recipient's name, cap title, and date — is
                shown or handed to the recipient. This is the community-facing
                artifact. The warrant is the chain artifact.
              </p>
            </VariantCard>

            <VariantCard title="Remote ceremony" marker="distributed">
              <p>
                The community is gathered across distance. A roll call opens
                the ceremony: each witness joins a shared session and confirms
                their presence. The ceremony does not open until the required
                witnesses are present.
              </p>
              <p className="mt-3">
                The screen is visible to all participants simultaneously —
                shared screen or broadcast view. The recipient sees the same
                read-only document as everyone else. The conferring authority
                holds the confirm gesture.
              </p>
              <p className="mt-3">
                Witnesses are named individually on the warrant. A remote
                ceremony with fewer than two confirmed witnesses does not
                close — it holds until quorum is met.
              </p>
            </VariantCard>
          </div>
        </section>

        <hr className="rule mb-14" />

        {/* ── Language table ── */}
        <section className="mb-14">
          <p
            className="font-mono text-[10.5px] uppercase tracking-[0.22em] mb-6"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Language on screen · which word, where
          </p>

          <div className="rounded-sm border overflow-hidden" style={{ borderColor: "hsl(var(--card-border))" }}>
            <div
              className="grid grid-cols-3 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
            >
              <span>Context</span>
              <span>Term used</span>
              <span>Reason</span>
            </div>
            {[
              ["Ceremony screen", "Cap", "The community's word. Warm, lived, present."],
              ["Cap slip (physical / displayed)", "Cap", "The recipient holds their cap, not their warrant."],
              ["Wallet confirmation button", "Confer the cap", "The act is conferring, in the community's language."],
              ["Post-ceremony confirmation toast", "Cap conferred", "Same register as the room."],
              ["Chain record (warrant)", "Warrant", "The ledger is an institutional artifact. Precision required."],
              ["Audit-facing view", "Warrant", "Compliance and archival contexts use the chain term."],
              ["Developer / API response", "Warrant", "Downstream systems read the chain term."],
              ["Error messages during ceremony", "Cap", "The person experiencing an error is in the ceremony, not a ledger audit."],
            ].map(([ctx, term, reason], i) => (
              <div
                key={i}
                className="grid grid-cols-3 px-5 py-3 border-t text-[13px] sm:text-[14px]"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <span className="font-serif text-foreground/70">{ctx}</span>
                <span className="font-mono font-semibold" style={{ color: "hsl(var(--accent))" }}>{term}</span>
                <span className="font-serif text-foreground/60 leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule mb-14" />

        {/* ── Design principles summary ── */}
        <section className="mb-14 rounded-sm border px-6 sm:px-8 py-8 sm:py-10 space-y-5"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}>
          <p
            className="font-mono text-[10.5px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            Design rules
          </p>
          <ul className="space-y-4">
            {[
              "The ceremony screen is read-only. No editable fields appear after the ceremony opens.",
              "One confirm action. The screen does not ask 'are you sure?' — that question was answered in the pre-flight.",
              "The word 'cap' appears everywhere the community sees. The word 'warrant' appears only where the chain record is shown.",
              "Errors pause the ceremony — they do not cancel it. The room holds.",
              "Remote ceremonies require quorum of witnesses before the screen opens. The confirm gesture is unavailable until quorum is met.",
              "The cap slip is the community artifact. The warrant is the chain artifact. Both are generated from the same event. Neither substitutes for the other.",
            ].map((rule, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="font-mono text-[11px] font-bold shrink-0 mt-0.5 w-5 text-right"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  {i + 1}
                </span>
                <p className="font-serif text-base leading-relaxed text-foreground/80">{rule}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── nav ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/economy/wallet"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--accent))" }}
          >
            ← Wallet
          </Link>
          <Link
            href="/economy"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--accent))" }}
          >
            Community Economy →
          </Link>
        </div>

        <footer
          className="mt-12 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">headwaters · codetry · the systems · {new Date().getFullYear()}</p>
        </footer>

      </div>
    </main>
  );
}

function Beat({
  label,
  phase,
  accent,
  highlight = false,
  children,
}: {
  label: string;
  phase: string;
  accent: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex gap-0 border-l-2"
      style={{
        borderColor: accent,
        background: highlight ? "hsl(var(--card))" : "transparent",
        marginLeft: 0,
        paddingLeft: 0,
      }}
    >
      <div className="pl-6 sm:pl-8 pr-2 py-6 sm:py-7 border-b w-full" style={{ borderColor: "hsl(var(--card-border))" }}>
        <div className="flex flex-wrap items-baseline gap-3 mb-2">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            {label}
          </span>
          <span
            className="font-mono text-[9.5px] uppercase tracking-[0.16em]"
            style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}
          >
            {phase}
          </span>
        </div>
        <p className="font-serif text-base sm:text-[17px] leading-relaxed text-foreground/80">
          {children}
        </p>
      </div>
    </div>
  );
}

function ScreenField({
  label,
  value,
  note = false,
}: {
  label: string;
  value: string;
  note?: boolean;
}) {
  return (
    <div>
      <p
        className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {label}
      </p>
      <p
        className="font-serif text-base"
        style={{ color: note ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))", fontStyle: note ? "italic" : "normal" }}
      >
        {value}
      </p>
    </div>
  );
}

function VariantCard({
  title,
  marker,
  children,
}: {
  title: string;
  marker: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-sm border p-6 sm:p-7 space-y-0"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
    >
      <p
        className="font-mono text-[9.5px] uppercase tracking-[0.2em] mb-3"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {marker}
      </p>
      <p className="font-serif font-semibold text-[16px] mb-4">{title}</p>
      <div className="font-serif text-[14px] sm:text-[15px] leading-relaxed text-foreground/75 space-y-0">
        {children}
      </div>
    </div>
  );
}
