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

export default function PJDehydratingProcess() {
  const dryTests = [
    { food: 'Vegetables', sign: 'Brittle, some may get leathery. Should spring back if folded. Edges will be sharp. Most should be chip-like and form a loose powder when ground.' },
    { food: 'Fruits', sign: 'Moisture cannot be squeezed from them. Tough like chips or pliable like leather. Fruit leathers may be slightly sticky but should separate easily from parchment.' },
    { food: 'Meat', sign: 'Dried when dark-coloured and fibrous and forms sharp points when broken.' },
    { food: 'Herbs & Greens', sign: 'Dried when brittle. Leaves shatter when rubbed together.' },
  ];

  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-dehydrating-process.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Header */}
        <div style={{ marginBottom: '0.25in' }}>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: A, marginBottom: 4, fontWeight: 600 }}>
            Parr's Jars · Lesson: Blanching, Freezing, Dehydrating
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: A, lineHeight: 1, letterSpacing: '-0.02em' }}>
              Dehydrating<br />
              <span style={{ fontSize: '1.3rem', color: INK, fontWeight: 700 }}>Process Flow</span>
            </h1>
            <div style={{ background: AL, border: `2px solid ${A}`, borderRadius: 8, padding: '0.1in 0.15in', textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: A }}>Equipment</div>
              <div style={{ fontSize: '0.68rem', color: INK, lineHeight: 1.5, marginTop: 3 }}>
                Dehydrator, oven, or ventilated air drying place<br />
                Parchment paper · Grinder (optional)<br />
                Packaging: ziplocs / vacuum seal bags / jars<br />
                Timer/alarms — check frequently
              </div>
            </div>
          </div>
        </div>

        {/* 4-step process */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.15in', marginBottom: '0.25in' }}>
          {[
            { num: 1, label: 'START', detail: 'Lay evenly on parchment-lined tray, be sure not to overlap. Gauge thickness/moisture content for timing.', color: A, bg: AL },
            { num: 2, label: 'WATCH & WAIT', detail: 'Check appropriate temperature and timing for your item; set alarms and start. Check frequently (can take hours–days to complete).', color: G, bg: GL },
            { num: 3, label: 'IS IT DRY?', detail: 'See the "Is It Dry?" tests below. When in doubt, continue drying 15–30 minutes more. Allow to cool before testing.', color: A, bg: AL },
            { num: 4, label: 'PACKAGE & STORE', detail: 'When moisture free, package in glass jars, food-grade plastic, or airtight bags. Remove air, label, store in cool dark place.', color: G, bg: GL },
          ].map((s) => (
            <div
              key={s.num}
              style={{ background: s.bg, border: `2px solid ${s.color}`, borderRadius: 8, padding: '0.14in 0.16in', display: 'flex', gap: '0.5rem' }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: s.color,
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {s.num}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.8rem', color: s.color, marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: '0.73rem', color: INK, lineHeight: 1.35 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Watch For box */}
        <div style={{ border: `2px solid ${A}`, borderRadius: 8, padding: '0.16in 0.2in', marginBottom: '0.22in' }}>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: A, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.1in' }}>
            Watch For
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.12in' }}>
            {[
              { issue: 'Microbial Growth', cause: 'Temp started too low' },
              { issue: 'Case Hardening', cause: 'Temp started too high' },
              { issue: 'Scorching', cause: 'Temp finished too high' },
            ].map((w) => (
              <div key={w.issue} style={{ background: '#FFF5EE', borderLeft: `3px solid ${A}`, padding: '0.1in 0.12in' }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: A, marginBottom: 2 }}>{w.issue}</div>
                <div style={{ fontSize: '0.68rem', color: MUT }}>{w.cause}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Is It Dry? */}
        <div style={{ border: `2px solid ${G}`, borderRadius: 8, overflow: 'hidden', marginBottom: '0.2in' }}>
          <div style={{ background: G, padding: '0.1in 0.18in' }}>
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Is It Dry? — Signs by Food Type
            </div>
          </div>
          {dryTests.map((t, i) => (
            <div
              key={t.food}
              style={{ display: 'grid', gridTemplateColumns: '1in auto', borderTop: i > 0 ? `1px solid ${LINE}` : 'none', background: i % 2 === 0 ? 'white' : GL }}
            >
              <div style={{ padding: '0.09in 0.15in', fontWeight: 700, fontSize: '0.77rem', color: G, borderRight: `1px solid ${LINE}`, display: 'flex', alignItems: 'center' }}>{t.food}</div>
              <div style={{ padding: '0.09in 0.15in', fontSize: '0.72rem', color: INK, lineHeight: 1.4 }}>{t.sign}</div>
            </div>
          ))}
        </div>

        {/* Storage callout */}
        <div style={{ background: INK, borderRadius: 8, padding: '0.12in 0.18in', marginBottom: '0.18in' }}>
          <div style={{ fontSize: '0.75rem', color: 'white', lineHeight: 1.45 }}>
            <strong style={{ color: A }}>Storage:</strong> Store dried foods in a cool, dark, dry area — basement or cellar. Exposure to humidity, light, or air decreases shelf life. The lower the temperature, the better. Freeze items if unsure.
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '0.1in' }}>
          <div style={{ fontWeight: 700, fontSize: '0.72rem', color: A, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.12in' }}>My Notes</div>
          <NoteLines count={3} />
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: '0.12in', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.12in' }}>
          <span style={{ fontSize: '0.6rem', color: '#AAAAAA', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Parr's Jars · parrsjars.ca</span>
          <span style={{ fontSize: '0.6rem', color: '#AAAAAA' }}>Principles to Preservation Workshop</span>
        </div>
      </div>
    </>
  );
}
