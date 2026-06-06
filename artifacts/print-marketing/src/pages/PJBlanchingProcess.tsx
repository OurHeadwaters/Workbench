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

export default function PJBlanchingProcess() {
  const steps = [
    { id: 'A', label: 'START', detail: 'Assign stations, wash vegetables while boiling water / prepare steamer', position: 'top' },
    { id: 'B', label: 'TIP & TAIL', detail: 'Chop to desired size, separate good/bad ends', position: 'right' },
    { id: 'C', label: 'SUBMERGE', detail: 'Submerge in boiling water or steam for appropriate time (see blanching cheat sheet)', position: 'bottom' },
    { id: 'D', label: 'DRY & SPREAD', detail: 'Dry off, spread evenly on baking sheet OR dehydrating tray & freeze/dehydrate', position: 'left' },
  ];

  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-blanching-process.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Header */}
        <div style={{ marginBottom: '0.28in' }}>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: G, marginBottom: 4, fontWeight: 600 }}>
            Parr's Jars · Lesson: Blanching, Freezing, Dehydrating
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: G, lineHeight: 1, letterSpacing: '-0.02em' }}>
              Blanching<br />
              <span style={{ fontSize: '1.3rem', color: INK, fontWeight: 700 }}>Process Flow</span>
            </h1>
            <div style={{ background: GL, border: `2px solid ${G}`, borderRadius: 8, padding: '0.1in 0.15in', textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: G }}>Equipment</div>
              <div style={{ fontSize: '0.68rem', color: INK, lineHeight: 1.5, marginTop: 3 }}>
                Vegetable scrubbers<br />Large pot OR steamer<br />Cold water bath · Strainer<br />Baking sheets · Oven mitts<br />Packaging: ziplocs / vacuum seal bags / jars
              </div>
            </div>
          </div>
        </div>

        {/* Process diagram */}
        <div style={{ position: 'relative', width: '100%', marginBottom: '0.28in' }}>
          {/* Center pentagon */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.1in' }}>
            <svg width="320" height="280" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Pentagon */}
              <polygon points="160,30 290,115 245,245 75,245 30,115" fill={GL} stroke={G} strokeWidth="2.5"/>
              <text x="160" y="110" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="14" fontWeight="900" fill={G}>TEAMWORK</text>
              <text x="160" y="130" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="14" fontWeight="900" fill={G}>MAKES THE</text>
              <text x="160" y="150" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="14" fontWeight="900" fill={G}>DREAM WORK</text>
              {/* Arrows */}
              <path d="M 160,30 L 160,10" stroke={G} strokeWidth="2" strokeLinecap="round" markerEnd="url(#arrowG)"/>
              <path d="M 290,115 L 310,105" stroke={G} strokeWidth="2" strokeLinecap="round" markerEnd="url(#arrowG)"/>
              <path d="M 245,245 L 255,265" stroke={G} strokeWidth="2" strokeLinecap="round" markerEnd="url(#arrowG)"/>
              <path d="M 75,245 L 65,265" stroke={G} strokeWidth="2" strokeLinecap="round" markerEnd="url(#arrowG)"/>
              <defs>
                <marker id="arrowG" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <path d="M 0,0 L 8,4 L 0,8 Z" fill={G}/>
                </marker>
              </defs>
            </svg>
          </div>

          {/* Step cards around the diagram — laid out in a grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.15in', marginTop: '-0.1in' }}>
            {steps.map((s, i) => (
              <div
                key={s.id}
                style={{
                  background: i % 2 === 0 ? GL : AL,
                  border: `2px solid ${i % 2 === 0 ? G : A}`,
                  borderRadius: 8,
                  padding: '0.12in 0.15in',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: i % 2 === 0 ? G : A,
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', color: i % 2 === 0 ? G : A, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: '0.73rem', color: INK, lineHeight: 1.35 }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next day callout */}
        <div style={{ background: INK, borderRadius: 8, padding: '0.14in 0.2in', marginBottom: '0.25in', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" stroke={A} strokeWidth="2"/>
            <path d="M14 8 L14 14 L18 17" stroke={A} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: '0.8rem', color: 'white', lineHeight: 1.4 }}>
            <strong style={{ color: A }}>Next day:</strong> Package, reduce air inside bag &amp; freeze. Label with contents + date.
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '0.1in' }}>
          <div style={{ fontWeight: 700, fontSize: '0.72rem', color: G, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15in' }}>My Notes</div>
          <NoteLines count={4} />
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
