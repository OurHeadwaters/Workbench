import { PrintNav } from "../components/PrintNav";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

function NoteLines({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3in' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${LINE}` }} />
      ))}
    </div>
  );
}

export default function PJSafePractices() {
  const methods = [
    {
      label: 'BLANCHING',
      color: G,
      bg: GL,
      safeties: ['Use oven mitts', 'Watch for steam'],
      rule: 'Have first aid handy',
    },
    {
      label: 'FREEZING',
      color: '#1A5C8A',
      bg: '#EAF3FB',
      safeties: ['Completely dry foods for shelf stability', ''],
      rule: 'Use gloves to retrieve flash-frozen pans',
    },
    {
      label: 'DEHYDRATING',
      color: A,
      bg: AL,
      safeties: ['Use safe temps', ''],
      rule: 'Remove air/seal when packaging',
    },
  ];

  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-safe-practices.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Header bar */}
        <div style={{ background: G, borderRadius: 6, padding: '0.18in 0.28in', marginBottom: '0.35in', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>
              Parr's Jars · Principles to Preservation
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'white', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              Introduction &amp; Safe Practices
            </h1>
          </div>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <path d="M24 10 L24 24 L32 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="24" r="3" fill={A}/>
          </svg>
        </div>

        {/* 3 method pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.2in', marginBottom: '0.3in' }}>
          {methods.map((m) => (
            <div key={m.label} style={{ border: `2.5px solid ${m.color}`, borderRadius: 10, overflow: 'hidden' }}>
              {/* Circle header */}
              <div style={{ background: m.color, padding: '0.22in 0.15in', textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: '1rem', color: 'white', letterSpacing: '0.05em' }}>{m.label}</div>
              </div>
              <div style={{ background: m.bg, padding: '0.18in 0.15in' }}>
                {m.safeties.filter(Boolean).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.35rem', alignItems: 'flex-start', marginBottom: '0.1in' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, marginTop: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.78rem', lineHeight: 1.35 }}>{s}</span>
                  </div>
                ))}
              </div>
              {/* Safety rule banner */}
              <div style={{ background: m.color, padding: '0.12in 0.15in', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', lineHeight: 1.3 }}>{m.rule}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Temperature guide */}
        <div style={{ border: `2px solid ${LINE}`, borderRadius: 8, padding: '0.2in 0.25in', marginBottom: '0.28in', background: '#FAFAFA' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: G, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.12in' }}>
            Dehydrating Temperature Guide
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.15in' }}>
            {[
              { cat: 'Fruits', temp: '125–135°F' },
              { cat: 'Vegetables', temp: '115–130°F' },
              { cat: 'Meat/Jerky', temp: '155°F' },
              { cat: 'Herbs/Greens', temp: '95–105°F' },
            ].map((t) => (
              <div key={t.cat} style={{ textAlign: 'center', borderLeft: `3px solid ${A}`, paddingLeft: '0.12in' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: A, marginBottom: 2 }}>{t.cat}</div>
                <div style={{ fontSize: '0.82rem', color: INK }}>{t.temp}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '0.12in', fontSize: '0.73rem', color: MUT, lineHeight: 1.4 }}>
            Timing depends on the amount of food dried, its moisture content, room temperature, humidity level, and air circulation. Can be hours to days for a finished product.
            Interrupting or prolonging drying at lower temperatures may result in spoilage.
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '0.15in' }}>
          <div style={{ fontWeight: 700, fontSize: '0.75rem', color: G, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15in' }}>
            My Notes
          </div>
          <NoteLines count={6} />
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: '0.12in', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.15in' }}>
          <span style={{ fontSize: '0.6rem', color: '#AAAAAA', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Parr's Jars · parrsjars.ca</span>
          <span style={{ fontSize: '0.6rem', color: '#AAAAAA' }}>Principles to Preservation Workshop</span>
        </div>
      </div>
    </>
  );
}
