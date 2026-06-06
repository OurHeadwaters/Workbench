import { PrintNav } from "../components/PrintNav";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

export default function PJObjectiveOutcomes() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-objective-outcomes.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Header */}
        <div style={{ background: G, borderRadius: 8, padding: '0.2in 0.28in', marginBottom: '0.28in', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>
              Parr's Jars · Principles to Preservation
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'white', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              Objective Outcomes
            </h1>
          </div>
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <circle cx="21" cy="21" r="18" stroke={A} strokeWidth="2"/>
            <circle cx="21" cy="21" r="10" stroke={A} strokeWidth="1.5"/>
            <circle cx="21" cy="21" r="3" fill={A}/>
            <line x1="21" y1="3" x2="21" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="21" y1="34" x2="21" y2="39" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Header fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2in', marginBottom: '0.1in' }}>
          {['WORKSHOP', 'LESSON'].map((label) => (
            <div key={label} style={{ borderBottom: `2px solid ${INK}`, paddingBottom: '0.06in' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: G, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2in' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2in', marginBottom: '0.1in' }}>
          {['DATE', 'OBJECTIVES'].map((label) => (
            <div key={label} style={{ borderBottom: `2px solid ${INK}`, paddingBottom: '0.06in' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: G, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2in' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: LINE, margin: '0.2in 0' }} />

        {/* 4-quadrant boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2in', marginBottom: '0.25in' }}>
          {[
            { label: 'INITIATE', color: G, bg: GL, sub: 'What I\'m starting or trying for the first time' },
            { label: 'ELIMINATE', color: '#9E1C1C', bg: '#FAEAEA', sub: 'What I\'m stopping, simplifying, or letting go' },
            { label: 'REPLICATE', color: A, bg: AL, sub: 'What worked — and I\'ll do it again' },
            { label: 'OTHER', color: MUT, bg: '#F5F5F5', sub: 'Anything else worth noting' },
          ].map((q) => (
            <div
              key={q.label}
              style={{
                border: `2px solid ${q.color}`,
                borderRadius: 8,
                overflow: 'hidden',
                height: '2.1in',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ background: q.bg, padding: '0.1in 0.15in', borderBottom: `1px solid ${q.color}` }}>
                <div style={{ fontWeight: 900, fontSize: '0.8rem', color: q.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{q.label}</div>
                <div style={{ fontSize: '0.62rem', color: MUT, marginTop: 2, fontStyle: 'italic' }}>{q.sub}</div>
              </div>
              <div style={{ flex: 1, padding: '0.1in 0.12in', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${LINE}` }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Final thoughts */}
        <div style={{ marginBottom: '0.1in' }}>
          <div style={{ fontWeight: 800, fontSize: '0.78rem', color: G, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15in' }}>
            Final Thoughts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3in' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${LINE}` }} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: '0.12in', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.18in' }}>
          <span style={{ fontSize: '0.6rem', color: '#AAAAAA', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Parr's Jars · parrsjars.ca</span>
          <div style={{ display: 'flex', gap: '0.15in' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: A }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
