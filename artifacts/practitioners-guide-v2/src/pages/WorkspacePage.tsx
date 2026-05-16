import { Link } from "wouter";
import { ArrowUpRight, Layers } from "lucide-react";

const EVERGREEN = "#1f3d2e";

interface WorkspaceTool {
  label: string;
  job: string;
  whenToOpen: string;
  openWhen: string[];
  notWhen: string[];
  href: string;
  internal: boolean;
  accent: string;
  accentSoft: string;
}

const TOOLS: WorkspaceTool[] = [
  {
    label: "Daily Bench",
    job: "Practitioner's Operating Plan",
    whenToOpen: "Every morning. What am I doing today?",
    openWhen: [
      "Starting a work day and need a task",
      "Looking for the AI prompt for a specific deliverable",
      "Closing out a week",
      "Running a Salt monthly close",
    ],
    notWhen: [
      "Checking the money picture",
      "Thinking about strategy or contracts",
      "Showing someone what you do",
    ],
    href: "/practitioner-operating-plan/",
    internal: false,
    accent: "#7A4E2D",
    accentSoft: "rgba(122,78,45,0.07)",
  },
  {
    label: "Financial Cockpit",
    job: "Practitioner's Guide",
    whenToOpen: "When you need the money picture.",
    openWhen: [
      "Checking contract status or rates",
      "Running a scenario (what if the contract moves?)",
      "Reviewing debt attack progress",
      "Thinking about what's next strategically",
    ],
    notWhen: [
      "Looking for today's tasks (go to Daily Bench)",
      "Showing a client what you do (go to The Window)",
    ],
    href: "/",
    internal: true,
    accent: EVERGREEN,
    accentSoft: "rgba(31,61,46,0.07)",
  },
  {
    label: "The Window",
    job: "Codetry Ship",
    whenToOpen: "When someone asks what you do.",
    openWhen: [
      "Onboarding a new client",
      "Sharing your services or SOW",
      "Sending someone the public view of Headwaters",
      "Reviewing how you present from the outside",
    ],
    notWhen: [
      "Internal work — this is the shop front, not the back office",
    ],
    href: "/codetry-ship/",
    internal: false,
    accent: "#1A5FA8",
    accentSoft: "rgba(26,95,168,0.07)",
  },
];

export function WorkspacePage() {
  return (
    <div className="space-y-8" data-testid="page-workspace">

      <header>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="h-8 w-8 rounded-md grid place-items-center"
            style={{ backgroundColor: "rgba(31,61,46,0.1)", color: EVERGREEN }}
          >
            <Layers className="h-4 w-4" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Headwaters Workspace
          </p>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Three tools. Three jobs.
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">
          Each tool has one job. Opening the wrong one for the wrong question is the
          most common source of drift. Use this page to orient before you start.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <div
            key={tool.label}
            className="rounded-xl border bg-card overflow-hidden flex flex-col"
            style={{ borderTopColor: tool.accent, borderTopWidth: "4px" }}
          >
            <div className="p-5 flex-1">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: tool.accent }}
              >
                {tool.label}
              </p>
              <p
                className="text-lg font-semibold leading-snug mb-1"
                style={{ fontFamily: "var(--app-font-serif)" }}
              >
                {tool.job}
              </p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {tool.whenToOpen}
              </p>

              <div className="space-y-3">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-1.5"
                    style={{ color: tool.accent }}
                  >
                    Open when
                  </p>
                  <ul className="space-y-1">
                    {tool.openWhen.map((w, i) => (
                      <li key={i} className="flex gap-2 text-xs text-foreground leading-relaxed">
                        <span style={{ color: tool.accent }} className="font-bold flex-shrink-0">
                          ✓
                        </span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {tool.notWhen.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      Not when
                    </p>
                    <ul className="space-y-1">
                      {tool.notWhen.map((w, i) => (
                        <li key={i} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                          <span className="flex-shrink-0">○</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div
              className="border-t px-5 py-3"
              style={{ borderColor: "hsl(var(--card-border))" }}
            >
              {tool.internal ? (
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: tool.accent }}
                >
                  Open {tool.job}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: tool.accent }}
                >
                  Open {tool.job}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl border border-card-border bg-muted/40 p-5"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          How they stay unified
        </p>
        <div className="grid gap-3 sm:grid-cols-3 text-xs text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground mb-0.5">Conceptual glue</p>
            <p className="leading-relaxed">
              The constellation — zone definitions, design principles, worked examples — is one
              file shared across all tools. A change there ripples everywhere.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-0.5">Rate source of truth</p>
            <p className="leading-relaxed">
              Lead ($175/hr) and support ($70/hr) rates live in the shared strategic ledger.
              Both the Daily Bench and this cockpit read from there — one change updates both.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-0.5">What still drifts</p>
            <p className="leading-relaxed">
              The Operating Plan's deeper budget math (cost basis, capital recovery) is still
              self-contained. Connecting it is a future task — change rates in the ledger first,
              then check the plan manually until that connection is built.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
