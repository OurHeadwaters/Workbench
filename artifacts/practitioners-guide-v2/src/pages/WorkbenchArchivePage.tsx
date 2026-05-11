import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { triageGates, routeDescriptors } from "@/data/inquiryTriage";
import { windDownActions } from "@/data/studioWindDown";
import { leaseToolingActions } from "@/data/leaseToolingActions";
import { namingActions } from "@/data/namingActions";
import {
  triggerConditions,
  reframedPitch,
  outreachCircles,
} from "@/data/planB";
import {
  TRIAL_HEADLINE,
  TRIAL_FRAMING_LINE,
  TRIAL_TIMELINE,
  TRIAL_ACCEPTANCE_CRITERIA,
  TRIAL_REFUND_INVOCATION_DAYS,
} from "@workspace/headwaters-pricing";

const sectionHeader = "text-2xl font-semibold tracking-tight mb-2";
const sectionLead = "text-sm text-muted-foreground mb-6 max-w-3xl";

export function WorkbenchArchivePage() {
  return (
    <div className="space-y-12 max-w-5xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>
      <header className="space-y-3 border-b pb-6" style={{ borderColor: "hsl(var(--card-border))" }}>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Field tools · archive
        </p>
        <h1
          className="text-3xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Workbench
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl">
          One-off operational tooling that previously lived in the
          Practitioner Operating Plan deck. Migrated here as static
          reference so nothing of substance is lost. The interactive
          deck/planner has been retired; the artefacts below remain
          source-of-truth for the field work they describe.
        </p>
      </header>

      {/* ---------------------------- 8-week trial ---------------------------- */}
      <section data-testid="archive-trial">
        <h2 className={sectionHeader}>8-week trial · timeline & acceptance</h2>
        <p className={sectionLead}>
          {TRIAL_FRAMING_LINE}
        </p>
        <p className="text-sm font-medium mb-4">{TRIAL_HEADLINE}</p>
        <div className="overflow-x-auto rounded-md border" style={{ borderColor: "hsl(var(--card-border))" }}>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left p-2 w-16">Week</th>
                <th className="text-left p-2">Headline</th>
                <th className="text-left p-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {TRIAL_TIMELINE.map((w) => (
                <tr key={w.week} className="border-t" style={{ borderColor: "hsl(var(--card-border))" }}>
                  <td className="p-2 align-top font-medium">{w.week}</td>
                  <td className="p-2 align-top">{w.focus}</td>
                  <td className="p-2 align-top text-muted-foreground">{w.deliverables}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="mt-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">Acceptance criteria</h3>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
          {TRIAL_ACCEPTANCE_CRITERIA.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          §7 also requires the contractor to invoke any refund{" "}
          <em>in writing</em> within {TRIAL_REFUND_INVOCATION_DAYS}{" "}
          calendar days of the week-eight review.{" "}
          <Link
            href="/refund-invocation-letter"
            className="underline font-medium"
            data-testid="link-refund-invocation-letter"
          >
            Open the printable refund-invocation letter →
          </Link>
        </p>
      </section>

      {/* ---------------------------- inquiry triage ---------------------------- */}
      <section data-testid="archive-triage">
        <h2 className={sectionHeader}>Inquiry triage · five-gate rubric</h2>
        <p className={sectionLead}>
          A new inbound lead is only a Carve-out A lead if it clears all
          five gates. Otherwise it routes to park (candidate-reserve),
          decline, or unknown.
        </p>
        <ol className="space-y-4">
          {triageGates.map((g) => (
            <li key={g.key} className="rounded-md border p-4" style={{ borderColor: "hsl(var(--card-border))" }}>
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-mono text-muted-foreground">Gate {g.num}</span>
                <span className="font-medium">{g.short}</span>
              </div>
              <p className="mt-2 text-sm">{g.question}</p>
              <p className="mt-2 text-xs text-muted-foreground"><span className="font-medium text-foreground">Yes means:</span> {g.yesMeans}</p>
              <p className="mt-1 text-xs text-muted-foreground"><span className="font-medium text-foreground">No means:</span> {g.noMeans}</p>
            </li>
          ))}
        </ol>
        <h3 className="mt-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">Routes</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {Object.values(routeDescriptors).map((r) => (
            <li key={r.route} className="rounded-md border p-3" style={{ borderColor: "hsl(var(--card-border))", borderLeftWidth: "4px", borderLeftColor: r.accent }}>
              <p className="font-medium">{r.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------- studio wind-down ---------------------------- */}
      <section data-testid="archive-winddown">
        <div className="flex items-baseline gap-3 flex-wrap mb-2">
          <h2 className={sectionHeader} style={{ margin: 0 }}>Studio wind-down · checklist</h2>
          <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700">
            Archived · May 2026
          </span>
        </div>
        <p className={sectionLead}>
          Closing the bobbieparr.studio funnel without taking the
          portfolio site down. Each item names what gets touched and the
          window for it. "Today" and "This week" references below are historical — this checklist records the state of the studio wind-down as of May 2026, not current action items.
        </p>
        <ol className="space-y-2 text-sm">
          {windDownActions.map((a) => (
            <li key={a.num} className="rounded-md border p-3" style={{ borderColor: "hsl(var(--card-border))" }}>
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="font-medium">{a.num} · {a.title}</p>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{a.category} · {a.when}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{a.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------- lease tooling ---------------------------- */}
      <section data-testid="archive-lease">
        <h2 className={sectionHeader}>Lease tooling · related-party rent</h2>
        <p className={sectionLead}>
          Setting up the warehouse-rent arrangement so it stands up to
          CRA / contractor scrutiny. Each step is a free or near-free
          action.
        </p>
        <ol className="space-y-2 text-sm">
          {leaseToolingActions.map((a) => (
            <li key={a.num} className="rounded-md border p-3" style={{ borderColor: "hsl(var(--card-border))" }}>
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="font-medium">{a.num} · {a.title}</p>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{a.when} · {a.cost}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{a.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------- naming ---------------------------- */}
      <section data-testid="archive-naming">
        <div className="flex items-baseline gap-3 flex-wrap mb-2">
          <h2 className={sectionHeader} style={{ margin: 0 }}>Naming · domains & trademark</h2>
          <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700">
            Archived · May 2026
          </span>
        </div>
        <p className={sectionLead}>
          Defensive registrations and CIPO trademark steps for
          <span className="font-medium"> Headwaters</span> and
          <span className="font-medium"> Watershed</span>. "Today" and "This week" references below are historical — this checklist records the state of naming and domain actions as of May 2026, not current action items.
        </p>
        <ol className="space-y-2 text-sm">
          {namingActions.map((a) => (
            <li key={a.num} className="rounded-md border p-3" style={{ borderColor: "hsl(var(--card-border))" }}>
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="font-medium">{a.num} · {a.title}</p>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{a.when} · {a.cost}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{a.detail}</p>
              {a.link ? (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs underline text-primary"
                >
                  {a.linkLabel ?? a.link}
                </a>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------- plan b ---------------------------- */}
      <section data-testid="archive-planb">
        <h2 className={sectionHeader}>Plan B · contingency</h2>
        <p className={sectionLead}>
          Triggers that flip the practitioner from a Deer-Lake-anchored
          Plan A onto a multi-community store-in-a-box pitch. Reframed
          pitch, then concentric outreach circles.
        </p>

        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Triggers</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {triggerConditions.map((t) => (
            <li key={t.label} className="rounded-md border p-3" style={{ borderColor: "hsl(var(--card-border))" }}>
              <p className="font-medium">{t.label}</p>
              <p className="text-xs text-muted-foreground mt-1"><span className="font-medium text-foreground">Signal:</span> {t.signal}</p>
              <p className="text-xs text-muted-foreground mt-1"><span className="font-medium text-foreground">Decision date:</span> {t.decisionDate}</p>
              <p className="text-xs text-muted-foreground mt-1"><span className="font-medium text-foreground">Then:</span> {t.thenDo}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">Reframed pitch — store-in-a-box</h3>
        <div className="mt-2 space-y-3 text-sm">
          {reframedPitch.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">Outreach circles</h3>
        <ol className="mt-2 space-y-2 text-sm">
          {outreachCircles.map((c) => (
            <li key={c.id} className="rounded-md border p-3" style={{ borderColor: "hsl(var(--card-border))" }}>
              <p className="font-medium">{c.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
