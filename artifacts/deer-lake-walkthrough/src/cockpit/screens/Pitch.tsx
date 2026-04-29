import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/paths";
import { useRoute } from "@/lib/route";
import { COCKPIT_PROMISES } from "../copy";

/**
 * The cockpit landing. This is the first thing the contractor sees when
 * he opens the link on his phone tonight, sitting across from the chief.
 *
 * Glance-readable in five seconds. Three lines of promise — one for the
 * band, one for the contractor, one for the next two years. Big serif,
 * almost no body copy. The four cockpit screens sit underneath as proof
 * that the system being promised is real.
 *
 * Mobile-first by design: single column on phones, three-up only at lg+.
 */

interface PromiseStyle {
  bg: string;
  ink: string;
  tagInk: string;
  subInk: string;
}

const PROMISE_STYLES: Record<string, PromiseStyle> = {
  band: {
    bg: "#ebe2d0",
    ink: "#1f3d2e",
    tagInk: "#6b7665",
    subInk: "#3d4a3f",
  },
  contractor: {
    bg: "#1f3d2e",
    ink: "#f4ede0",
    tagInk: "#e9c8a8",
    subInk: "rgba(244,237,224,0.82)",
  },
  handover: {
    bg: "#b85a3e",
    ink: "#f4ede0",
    tagInk: "#fbe7e2",
    subInk: "rgba(244,237,224,0.85)",
  },
};

const STACK = [
  { name: "Square", role: "till + sales" },
  { name: "QuickBooks", role: "books + bank" },
  { name: "Local Line", role: "producer cycle · 807" },
  { name: "Headwaters", role: "the operator layer" },
];

const REQUIRES = [
  "Translation between band, contractor, and producers",
  "An operating manual that survives the retirement",
  "A two-year, on-purpose handover plan",
];

export default function Pitch() {
  const { navigate } = useRoute();

  return (
    <section className="px-5 sm:px-7 py-8 sm:py-10 max-w-[720px] mx-auto">
      <div
        className="text-[10.5px] uppercase tracking-[0.28em] mb-3"
        style={{
          color: "#6b7665",
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        }}
        data-testid="pitch-context-tag"
      >
        For tonight's conversation · Deer Lake
      </div>

      <h1
        className="font-medium tracking-tight"
        style={{
          color: "#1f3d2e",
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(38px, 9vw, 64px)",
          lineHeight: "1.02",
          textWrap: "balance",
        }}
      >
        Your business doesn&rsquo;t
        <br />
        <span style={{ color: "#b85a3e", fontStyle: "italic" }}>
          end with you.
        </span>
      </h1>

      <p
        className="mt-4 sm:mt-5"
        style={{
          color: "#1f3d2e",
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(18px, 4.5vw, 22px)",
          lineHeight: "1.35",
          textWrap: "balance",
        }}
      >
        You retire on purpose. The system stays.
      </p>

      <div className="mt-7 sm:mt-9 flex flex-col gap-3 sm:gap-4">
        {COCKPIT_PROMISES.map((p) => {
          const s = PROMISE_STYLES[p.id];
          return (
            <article
              key={p.id}
              data-testid={`pitch-promise-${p.id}`}
              className="rounded-[14px] p-5 sm:p-6"
              style={{ background: s.bg, color: s.ink }}
            >
              <div
                className="text-[10.5px] uppercase tracking-[0.24em] mb-2"
                style={{
                  color: s.tagInk,
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}
              >
                {p.audience}
              </div>
              <div
                className="font-medium"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "clamp(26px, 6vw, 36px)",
                  lineHeight: "1.05",
                  textWrap: "balance",
                }}
              >
                {p.headline}{" "}
                <span style={{ fontStyle: "italic", opacity: 0.96 }}>
                  {p.italicHeadline}
                </span>
              </div>
              <p
                className="mt-3"
                style={{
                  color: s.subInk,
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontSize: "clamp(14px, 3.6vw, 15.5px)",
                  lineHeight: "1.45",
                }}
              >
                {p.sub}
              </p>
            </article>
          );
        })}
      </div>

      {/* The stack — proof the buyer doesn't inherit a science project */}
      <div
        className="mt-7 sm:mt-9 rounded-[12px] p-5"
        style={{
          background: "#ebe2d0",
          border: "1px solid rgba(31,61,46,0.16)",
        }}
        data-testid="pitch-stack"
      >
        <div
          className="text-[10.5px] uppercase tracking-[0.24em] mb-3"
          style={{
            color: "#6b7665",
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          }}
        >
          The stack underneath
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {STACK.map((s) => (
            <div
              key={s.name}
              className="flex items-baseline gap-2 leading-tight"
            >
              <span
                className="text-[16px] font-semibold"
                style={{
                  color: "#1f3d2e",
                  fontFamily: "'Fraunces', Georgia, serif",
                }}
              >
                {s.name}
              </span>
              <span
                className="text-[10.5px] uppercase tracking-[0.18em]"
                style={{
                  color: "#6b7665",
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}
              >
                {s.role}
              </span>
            </div>
          ))}
        </div>
        <p
          className="mt-3 text-[13px] leading-[1.45]"
          style={{
            color: "#3d4a3f",
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          }}
        >
          All four. The next contractor already uses every one of them.
        </p>
      </div>

      {/* What turns this from idea into asset */}
      <div className="mt-6 sm:mt-7">
        <div
          className="text-[10.5px] uppercase tracking-[0.24em] mb-3"
          style={{
            color: "#6b7665",
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          }}
        >
          What turns this from idea into asset
        </div>
        <ul className="space-y-2" data-testid="pitch-requires">
          {REQUIRES.map((r) => (
            <li
              key={r}
              className="flex items-start gap-2.5 text-[15px] leading-[1.4]"
              style={{
                color: "#1f3d2e",
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: "#b85a3e",
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                  marginTop: "1px",
                }}
              >
                ·
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA — the four screens */}
      <button
        type="button"
        onClick={() => navigate(ROUTES.cockpitFloor)}
        data-testid="pitch-cta-walk"
        className="mt-8 sm:mt-10 w-full rounded-[12px] flex items-center justify-between px-5 py-5 transition-transform hover:-translate-y-[1px] focus:outline-none focus-visible:ring-4"
        style={{
          background: "#1f3d2e",
          color: "#f4ede0",
          outlineColor: "#b85a3e",
        }}
      >
        <span className="text-left">
          <span
            className="block text-[10.5px] uppercase tracking-[0.24em]"
            style={{
              color: "#e9c8a8",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
          >
            Walk the four screens
          </span>
          <span
            className="block mt-1 font-medium"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(20px, 5vw, 24px)",
              lineHeight: "1.1",
            }}
          >
            See the cockpit on the 40&times;80 box.
          </span>
        </span>
        <ArrowRight size={28} strokeWidth={1.6} />
      </button>

      <div
        className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] uppercase tracking-[0.20em]"
        style={{
          color: "#6b7665",
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(ROUTES.cockpitFloor)}
          data-testid="pitch-jump-floor"
          className="px-2.5 py-2 rounded-md text-left transition-colors"
          style={{
            background: "rgba(31,61,46,0.06)",
            border: "1px solid rgba(31,61,46,0.14)",
          }}
        >
          1 · Floor
        </button>
        <button
          type="button"
          onClick={() => navigate(ROUTES.cockpitHome)}
          data-testid="pitch-jump-home"
          className="px-2.5 py-2 rounded-md text-left transition-colors"
          style={{
            background: "rgba(31,61,46,0.06)",
            border: "1px solid rgba(31,61,46,0.14)",
          }}
        >
          2 · Home
        </button>
        <button
          type="button"
          onClick={() => navigate(ROUTES.cockpitTill)}
          data-testid="pitch-jump-till"
          className="px-2.5 py-2 rounded-md text-left transition-colors"
          style={{
            background: "rgba(31,61,46,0.06)",
            border: "1px solid rgba(31,61,46,0.14)",
          }}
        >
          3 · Till
        </button>
        <button
          type="button"
          onClick={() => navigate(ROUTES.cockpitLocks)}
          data-testid="pitch-jump-locks"
          className="px-2.5 py-2 rounded-md text-left transition-colors"
          style={{
            background: "rgba(31,61,46,0.06)",
            border: "1px solid rgba(31,61,46,0.14)",
          }}
        >
          4 · Locks
        </button>
      </div>
    </section>
  );
}
