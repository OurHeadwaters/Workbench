import { PrintNav } from "../components/PrintNav";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

function NoteLines({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28in' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${LINE}` }} />
      ))}
    </div>
  );
}

export default function PJBlanchingUses() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-blanching-uses.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Header */}
        <div style={{ marginBottom: '0.28in' }}>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: MUT, marginBottom: 4, fontWeight: 600 }}>
            Parr's Jars · Principles to Preservation
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: INK, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Blanching, Freezing, Dehydrating
          </h1>
          <div style={{ height: 4, background: `linear-gradient(to right, ${G}, ${A})`, borderRadius: 2, marginTop: '0.1in', maxWidth: '4in' }} />
        </div>

        {/* 3 use columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.2in', marginBottom: '0.28in' }}>
          {[
            {
              label: 'MEALS',
              color: G,
              bg: GL,
              items: [
                'Make "just add water" side dishes like wild rice & chanterelle pilaf',
                'Save meal prep time with freezer packs of blanched vegetables',
                'Dried onions or sliced & frozen',
                'Add powders to any meal for enhanced nutrition',
              ],
            },
            {
              label: 'POWDERS',
              color: A,
              bg: AL,
              items: [
                'Add to smoothies',
                'Add to soups & stews',
                'Add to sauces & dips',
                'Add to spice blends',
              ],
            },
            {
              label: 'SNACKS',
              color: '#1A5C8A',
              bg: '#EAF3FB',
              items: [
                'Dehydrated meat (jerky)',
                'Fruit leather',
                'Banana or strawberry chips',
                'Vegetable chips (like zucchini or sweet potato)',
                'Cheese chips (like smoked gouda)',
                'Sundried tomato & cheese',
              ],
            },
          ].map((col) => (
            <div key={col.label} style={{ border: `2.5px solid ${col.color}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: col.color, padding: '0.1in 0.15in', textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: 'white', letterSpacing: '0.06em' }}>{col.label}</div>
              </div>
              <div style={{ background: col.bg, padding: '0.14in 0.14in' }}>
                {col.items.map((item) => (
                  <div key={item} style={{ display: 'flex', gap: '0.35rem', alignItems: 'flex-start', marginBottom: '0.09in' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: col.color, marginTop: 4, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.74rem', lineHeight: 1.35 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Triangle + quote */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2in', marginBottom: '0.25in' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="100,8 192,152 8,152" fill={GL} stroke={G} strokeWidth="2.5"/>
              <text x="100" y="80" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="900" fill={G}>THINK</text>
              <text x="100" y="98" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="900" fill={G}>WITH THE</text>
              <text x="100" y="116" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="900" fill={G}>END IN MIND</text>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ border: `2px solid ${LINE}`, borderRadius: 8, padding: '0.18in 0.2in', background: '#FAFAFA' }}>
              <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: INK, lineHeight: 1.6, marginBottom: '0.1in' }}>
                "A thriving household depends on the use of seasonal produce and the application of common sense."
              </div>
              <div style={{ fontSize: '0.7rem', color: MUT, fontWeight: 600 }}>
                — Olivier de Serres (1539–1619)
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.72rem', color: MUT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.12in' }}>My Notes</div>
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
