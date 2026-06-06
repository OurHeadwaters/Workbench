import { PrintNav } from "../components/PrintNav";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

export default function PJStationSetup() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-station-setup.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Top bar */}
        <div style={{ height: 4, background: G, borderRadius: 2, marginBottom: '0.28in' }} />

        {/* Header row fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2in', marginBottom: '0.1in' }}>
          {[
            { label: 'WORKSHOP', wide: true },
            { label: 'LESSON', wide: true },
          ].map((f) => (
            <div key={f.label} style={{ borderBottom: `2px solid ${INK}`, paddingBottom: '0.06in' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: G, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2in' }}>
                {f.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2in', marginBottom: '0.1in' }}>
          {['DATE', 'EQUIPMENT'].map((label) => (
            <div key={label} style={{ borderBottom: `2px solid ${INK}`, paddingBottom: '0.06in' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: G, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2in' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderBottom: `2px solid ${INK}`, paddingBottom: '0.06in', marginBottom: '0.28in' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: G, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2in' }}>
            STATIONS &amp; TASKS <span style={{ fontWeight: 400, color: MUT, fontSize: '0.58rem' }}>(visualize transitions)</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25in' }}>
          <div style={{ flex: 1, height: 1, background: LINE }} />
          <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: INK, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', padding: '0 0.1in' }}>
            Station Set Up
          </h2>
          <div style={{ flex: 1, height: 1, background: LINE }} />
        </div>

        {/* Goals / diagram area / Tips */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.7in 1fr 0.7in', gap: '0.15in', marginBottom: '0.25in', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: G, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.1in' }}>GOALS:</div>
          </div>
          {/* Large diagram box */}
          <div
            style={{
              border: `2px solid ${INK}`,
              borderRadius: 6,
              height: '3.2in',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center', color: '#CCCCCC' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="4" width="32" height="32" rx="4" stroke="#CCCCCC" strokeWidth="1.5" strokeDasharray="4 3"/>
                <line x1="4" y1="20" x2="36" y2="20" stroke="#CCCCCC" strokeWidth="1" strokeDasharray="4 3"/>
                <line x1="20" y1="4" x2="20" y2="36" stroke="#CCCCCC" strokeWidth="1" strokeDasharray="4 3"/>
              </svg>
              <div style={{ fontSize: '0.6rem', marginTop: '0.1in', letterSpacing: '0.1em', textTransform: 'uppercase' }}>sketch your layout</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: A, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.1in' }}>TIPS:</div>
          </div>
        </div>

        {/* Note Outcomes */}
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.78rem', color: G, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15in' }}>
            Note Outcomes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32in' }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${LINE}` }} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: '0.12in', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.18in' }}>
          <span style={{ fontSize: '0.6rem', color: '#AAAAAA', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Parr's Jars · parrsjars.ca</span>
          <div style={{ display: 'flex', gap: '0.15in' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: G }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
