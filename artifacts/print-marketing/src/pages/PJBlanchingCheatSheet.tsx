import { PrintNav } from "../components/PrintNav";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

const vegetables = [
  { food: 'Asparagus', blanch: '3 mins' },
  { food: 'Beet Greens', blanch: '2 mins' },
  { food: 'Broccoli', blanch: '3 mins' },
  { food: 'Brussel Sprouts', blanch: '5 mins' },
  { food: 'Carrots', blanch: '3 mins' },
  { food: 'Cauliflower', blanch: '5 mins' },
  { food: 'Green Beans', blanch: '3 mins' },
  { food: 'Greens', blanch: '2 mins' },
  { food: 'Mushrooms', blanch: '4 mins' },
  { food: 'Parsnips', blanch: '3 mins' },
  { food: 'Peas', blanch: '2 mins' },
  { food: 'Turnips', blanch: '2 mins' },
  { food: 'Wax Beans', blanch: '3 mins' },
];

export default function PJBlanchingCheatSheet() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-blanching-cheat-sheet.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3in' }}>
          <div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: A, marginBottom: 4, fontWeight: 600 }}>
              Parr's Jars · Principles to Preservation
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: A, lineHeight: 1, letterSpacing: '-0.02em' }}>
              Blanching<br />
              <span style={{ fontSize: '1.6rem', color: INK }}>Cheat Sheet</span>
            </h1>
          </div>
          <div style={{ background: AL, border: `2px solid ${A}`, borderRadius: 8, padding: '0.15in 0.2in', maxWidth: '2.4in', textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: A, marginBottom: 4 }}>Timing Note</div>
            <div style={{ fontSize: '0.7rem', color: INK, lineHeight: 1.4 }}>
              Timing depends on size of vegetable. These are average sizes, sliced or processed to 1″
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ border: `2px solid ${A}`, borderRadius: 8, overflow: 'hidden', marginBottom: '0.28in' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr', background: A }}>
            <div style={{ padding: '0.1in 0.15in', fontWeight: 800, fontSize: '0.82rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Food</div>
            <div style={{ padding: '0.1in 0.1in', fontWeight: 800, fontSize: '0.82rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Blanch</div>
            <div style={{ padding: '0.1in 0.15in', fontWeight: 800, fontSize: '0.82rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em', borderLeft: `1px solid rgba(255,255,255,0.3)` }}>Add Your Own</div>
            <div style={{ padding: '0.1in 0.1in', fontWeight: 800, fontSize: '0.82rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Blanch</div>
          </div>
          {/* Rows */}
          {vegetables.map((v, i) => (
            <div
              key={v.food}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 2fr 1fr',
                background: i % 2 === 0 ? 'white' : GL,
                borderTop: `1px solid ${LINE}`,
              }}
            >
              <div style={{ padding: '0.07in 0.15in', fontWeight: 600, fontSize: '0.8rem' }}>{v.food}</div>
              <div style={{ padding: '0.07in 0.1in', fontSize: '0.8rem', color: A, fontWeight: 700, textAlign: 'center' }}>{v.blanch}</div>
              <div style={{ padding: '0.07in 0.15in', borderLeft: `1px solid ${LINE}` }} />
              <div style={{ padding: '0.07in 0.1in', textAlign: 'center' }} />
            </div>
          ))}
        </div>

        {/* After blanching + callout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2in', marginBottom: '0.2in' }}>
          <div style={{ background: GL, border: `2px solid ${G}`, borderRadius: 8, padding: '0.18in 0.2in' }}>
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: G, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.1in' }}>
              After Blanching / Cooling
            </div>
            {['Dry off veg', 'Dehydrate or flash freeze on cookie sheets', 'Bag &amp; store'].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start', marginBottom: '0.06in' }}>
                <div style={{ fontWeight: 800, color: G, fontSize: '0.8rem', flexShrink: 0 }}>{i + 1}.</div>
                <span style={{ fontSize: '0.8rem', lineHeight: 1.35 }} dangerouslySetInnerHTML={{ __html: step }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15in' }}>
            <div style={{ background: AL, border: `2px solid ${A}`, borderRadius: 8, padding: '0.15in 0.18in' }}>
              <div style={{ fontWeight: 700, fontSize: '0.75rem', color: A, marginBottom: 4 }}>Cold Shock</div>
              <div style={{ fontSize: '0.73rem', color: INK, lineHeight: 1.4 }}>
                Submerge in ice water immediately when vegetable is brightly coloured — stops cooking instantly.
              </div>
            </div>
            <div style={{ background: INK, borderRadius: 8, padding: '0.15in 0.18in' }}>
              <div style={{ fontSize: '0.73rem', color: 'white', lineHeight: 1.45, fontWeight: 500 }}>
                Blanching stops enzymic activity so your foods don't deteriorate in the next storage phase.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: '0.12in', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#AAAAAA', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Parr's Jars · parrsjars.ca</span>
          <span style={{ fontSize: '0.6rem', color: '#AAAAAA' }}>Principles to Preservation Workshop</span>
        </div>
      </div>
    </>
  );
}
