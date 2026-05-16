import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Clock, ArrowRight, BookOpen } from "lucide-react";
import { PageAnchor } from "@/components/PageAnchor";

const SESSION_DATE = "May 16, 2026";

const LANDED = [
  {
    label: "Zone 4 = Community Hall",
    detail: "Arc retired. Voluntary formation layer, not a single-producer transition track. Abattoir pilot is one Zone 4 expression, not the definition.",
  },
  {
    label: "Lodge confirmed — Zone 1 identity layer",
    detail: "Rename test held against Membership, Profile, and Household ID. All three cracked. Lodge is load-bearing. §5.9 closed.",
  },
  {
    label: "Watershed belongs to Zone 1",
    detail: "Diversified income streams — flow, not restriction. Zone 5's watershed.replit.app is infrastructure legacy only, no conceptual weight.",
  },
  {
    label: "Z5→Z1 direct feed documented",
    detail: "Massive Zone 5 public attention can feed the household watershed directly. Ideal standby: Z2-3-4 engine as the floor, Z5 direct feed as the layer above. Both running simultaneously.",
  },
  {
    label: "Mama Support Hub Phase 1 shipped",
    detail: "Every member-facing surface renamed. Tasks→Needs, Slots→Moments, Claim→I've got it. Impact section gone. Push copy updated.",
  },
  {
    label: "Sandbox circle pulse shipped",
    detail: "calendarToken bridge confirmed. Count-only pulse, no names, no content. Deliberate opt-in each time. One ping per household per week.",
  },
  {
    label: "Mama Support Hub Phase 2 shipped — dissolution built",
    detail: "Archived ≠ dissolved. Two-step DissolveDialog with export-first flow. Cascade delete on dissolution. First name retained, surname + all PII cleared. Past circles appear as a quiet greyed strip — name and dates only. Zone 1 care circle design principles recorded in the constellation.",
  },
];

const IN_FLIGHT = [
  {
    label: "Mama Support Hub — Phase 3 ready",
    what: "Direct ask flow — anyone in the circle surfaces an urgent need without organizer scaffolding first. One step, no project, no slots. 'I need Thursday covered — who's got it?' goes to the circle immediately.",
    when: "Phase 2 is shipped. Phase 3 is next when you're ready to send the prompt.",
    isNext: true,
  },
  {
    label: "Eave governance document",
    what: "What the Eave means, who consented, how zone-crossing is permitted. Needed before Rootstock goes to external pilots.",
    when: "Before Rootstock pilots.",
    isNext: false,
  },
];

export function SessionHandoffPage() {
  return (
    <div className="space-y-8" data-testid="page-session-handoff">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      <PageAnchor
        storageKey="session-handoff"
        whenToBeHere="You're starting a new session and need to know exactly where things landed and what's waiting."
        theOneThing="Phase 3 is next — the direct ask flow for Mama Support Hub. Send the Phase 3 prompt when you're ready. Zone 1 dissolution principles are already in the constellation."
        accentColor="#1f3d2e"
      />

      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Session handoff · {SESSION_DATE}
        </p>
        <h1
          className="mt-2 text-3xl sm:text-4xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Where things landed
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">
          What was resolved today, what's still in flight, and your first move when you return.
        </p>
      </header>

      {/* First move banner */}
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 flex items-center gap-1.5 mb-2">
          <ArrowRight className="h-3.5 w-3.5" />
          Your first move when you return
        </p>
        <p className="text-sm text-emerald-900 leading-relaxed font-medium">
          Phase 2 is shipped. Phase 3 is ready — the direct ask flow for Mama Support Hub.
          Send the Phase 3 prompt when you're ready to continue.
        </p>
        <p className="mt-2 text-xs text-emerald-700 leading-relaxed">
          Zone 1 care circle design principles (dissolution model, language principles, privacy posture)
          are now recorded in the constellation — they'll carry forward into any future Zone 1 tool
          that gets built in this constellation.
        </p>
      </div>

      {/* What landed */}
      <section>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          What landed today
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Decisions confirmed, written into the handbook and constellation. Nothing here needs revisiting.
        </p>
        <div className="space-y-2">
          {LANDED.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-card-border bg-card p-4"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* In flight */}
      <section>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Still in flight
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Active threads. One is waiting on you; the others are queued behind it.
        </p>
        <div className="space-y-3">
          {IN_FLIGHT.map((item, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                item.isNext
                  ? "border-amber-200 bg-amber-50"
                  : "border-card-border bg-card"
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                <Clock
                  className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                    item.isNext ? "text-amber-600" : "text-muted-foreground"
                  }`}
                />
                <p
                  className={`text-sm font-semibold leading-snug ${
                    item.isNext ? "text-amber-900" : "text-foreground"
                  }`}
                >
                  {item.label}
                </p>
              </div>
              <p className="ml-6 text-xs text-muted-foreground leading-relaxed mb-1">
                {item.what}
              </p>
              <p
                className={`ml-6 text-xs font-medium leading-relaxed ${
                  item.isNext ? "text-amber-700" : "text-muted-foreground"
                }`}
              >
                {item.when}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Link to infographic */}
      <div className="rounded-lg border border-card-border bg-muted/40 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Full session infographic</p>
            <p className="text-xs text-muted-foreground">
              Print-ready reference — all decisions, open items, and constellation notes.
            </p>
          </div>
        </div>
        <a
          href="/print-marketing/constellation-session-may16"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-card border border-card-border hover:bg-muted/60 transition-colors flex-shrink-0"
        >
          Open
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
