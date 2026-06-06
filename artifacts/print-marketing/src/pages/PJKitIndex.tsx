import { Link } from "wouter";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

const base = import.meta.env.BASE_URL;

const sections = [
  {
    group: 'Process Flows',
    color: G,
    pages: [
      { label: 'Introduction & Safe Practices', href: '/pj-kit/safe-practices', desc: 'Blanching, freezing, dehydrating safety + temp guide' },
      { label: 'Blanching Process', href: '/pj-kit/blanching-process', desc: 'Step-by-step blanching flow diagram' },
      { label: 'Dehydrating Process', href: '/pj-kit/dehydrating-process', desc: 'Dehydrating flow, watch-fors, is-it-dry tests' },
    ],
  },
  {
    group: 'Cheat Sheets',
    color: A,
    pages: [
      { label: 'Blanching Cheat Sheet', href: '/pj-kit/blanching-cheat-sheet', desc: 'Vegetable blanch times + after-blanching steps' },
      { label: 'Freezing or Drying Cheat Sheet', href: '/pj-kit/freezing-drying-cheat-sheet', desc: 'Prep method by food type, use cases' },
    ],
  },
  {
    group: 'Learning Sheets',
    color: G,
    pages: [
      { label: 'Process the Process', href: '/pj-kit/process-the-process', desc: 'Enzymic activity, oxygen, humidity science' },
      { label: 'Blanching, Freezing & Dehydrating Uses', href: '/pj-kit/blanching-uses', desc: 'Meals, powders, snacks — think with the end in mind' },
    ],
  },
  {
    group: 'Worksheets',
    color: A,
    pages: [
      { label: 'Stages & Stations', href: '/pj-kit/stages-stations', desc: 'Equipment, stage diagrams, my setup plan' },
      { label: 'Station Set Up', href: '/pj-kit/station-setup', desc: 'Blank layout planner for your home kitchen' },
      { label: 'Objective Outcomes', href: '/pj-kit/objective-outcomes', desc: 'Initiate, eliminate, replicate, reflect' },
    ],
  },
  {
    group: 'Email & Reference',
    color: G,
    pages: [
      { label: 'Northern Pantry Printable', href: '/suite/northern-pantry', desc: '3-layer northern pantry worksheet — Parr\'s Jars system' },
      { label: 'Email Drip Sequence', href: '/suite/parrs-jars-email-sequence', desc: '8-email campaign from signup through kit pitch' },
      { label: 'How to Become a Jarista', href: '/pj-kit/jarista-guide', desc: 'Lead magnet e-book: 8 chapters, jar kitchen system' },
    ],
  },
];

export default function PJKitIndex() {
  return (
    <div style={{ minHeight: '100vh', background: INK, fontFamily: 'var(--font-sans)', color: 'white' }}>
      {/* Hero */}
      <div style={{ background: G, padding: '0.6in 0.65in 0.5in', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-1.5in', right: '-1in', width: '5in', height: '5in', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '0.12in', fontWeight: 600 }}>
            Parr's Jars · Local Food Zone
          </div>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: 'white', lineHeight: 1.02, letterSpacing: '-0.03em', marginBottom: '0.1in' }}>
            PJ Solutions Kit
          </h1>
          <div style={{ height: 4, width: '2.2in', background: A, borderRadius: 2, marginBottom: '0.18in' }} />
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxWidth: '5in' }}>
            All workshop handouts, cheat sheets, worksheets, and reference guides for the Principles to Preservation workshop — one clean print suite.
          </p>
        </div>
      </div>

      {/* Nav back */}
      <div style={{ padding: '0.25in 0.65in', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Back to print suite</Link>
      </div>

      {/* Sections */}
      <div style={{ padding: '0.4in 0.65in 0.6in' }}>
        {sections.map((section) => (
          <div key={section.group} style={{ marginBottom: '0.4in' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.18in' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: section.color }} />
              <div style={{ fontWeight: 800, fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                {section.group}
              </div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.15in' }}>
              {section.pages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid rgba(255,255,255,0.1)`,
                      borderRadius: 8,
                      padding: '0.18in 0.2in',
                      cursor: 'pointer',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = `${section.color}22`;
                      (e.currentTarget as HTMLDivElement).style.borderColor = section.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white', marginBottom: 5, lineHeight: 1.3 }}>
                      {page.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                      {page.desc}
                    </div>
                    <div style={{ marginTop: '0.1in', fontSize: '0.65rem', color: section.color, fontWeight: 600 }}>
                      Open →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '0.25in 0.65in', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Parr's Jars · parrsjars.ca</span>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>Principles to Preservation · $97 kit</span>
      </div>
    </div>
  );
}
