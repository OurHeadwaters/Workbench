import { PrintNav } from "../components/PrintNav";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

function NoteLines({ count = 8 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3in' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${LINE}` }} />
      ))}
    </div>
  );
}

export default function PJStagesStations() {
  const equipment = [
    {
      label: 'BLANCHING',
      color: G,
      bg: GL,
      items: ['Vegetable scrubber', 'Pot or steamer', 'Oven mitts', 'Cold shock bath', 'Towels/paper towels'],
    },
    {
      label: 'FREEZING',
      color: '#1A5C8A',
      bg: '#EAF3FB',
      items: ['Baking sheets', 'Ziploc baggies or vacuum seal bags', 'Straw or vacuum sealer', 'Freezer'],
    },
    {
      label: 'DEHYDRATING',
      color: A,
      bg: AL,
      items: ['Food racks', 'Parchment paper or silicone mats', 'Dehydrator, oven, or ventilated hanging space', 'Jars or ziploc baggies'],
    },
  ];

  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-stages-stations.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.45in 0.6in 0.35in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Header */}
        <div style={{ marginBottom: '0.22in' }}>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: MUT, marginBottom: 4, fontWeight: 600 }}>
            Parr's Jars · Lesson: Blanching, Freezing, Dehydrating
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: INK, lineHeight: 1, letterSpacing: '-0.02em' }}>
              Stages &amp; Stations
            </h1>
            <div style={{ background: AL, border: `1.5px solid ${A}`, borderRadius: 6, padding: '0.07in 0.12in', fontSize: '0.65rem', color: A, fontWeight: 600 }}>
              For long term: Jars with vacuum sealer or Mylar bags, straw &amp; hot iron
            </div>
          </div>
        </div>

        {/* Equipment circles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.15in', marginBottom: '0.22in' }}>
          {equipment.map((eq) => (
            <div key={eq.label} style={{ border: `2.5px solid ${eq.color}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: eq.color, padding: '0.09in 0.12in', textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: '0.78rem', color: 'white', letterSpacing: '0.05em' }}>{eq.label}</div>
              </div>
              <div style={{ background: eq.bg, padding: '0.12in 0.12in' }}>
                {eq.items.map((item) => (
                  <div key={item} style={{ display: 'flex', gap: '0.3rem', alignItems: 'flex-start', marginBottom: '0.06in' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: eq.color, marginTop: 4, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.72rem', lineHeight: 1.3 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stages diagram */}
        <div style={{ border: `2px solid ${LINE}`, borderRadius: 8, padding: '0.15in 0.2in', marginBottom: '0.2in', background: '#FAFAFA' }}>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: G, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.12in' }}>
            Stages &amp; Stations <span style={{ fontSize: '0.65rem', fontWeight: 400, color: MUT, textTransform: 'none', letterSpacing: 0 }}>(process diagram)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2in' }}>
            {[
              { num: 'Stage 1', label: 'Prepare Blanching', steps: ['A — Wash & Prep', 'B — Chop & Separate', 'C — (station ready)'], color: G },
              { num: 'Stage 2', label: 'Remove Air & Store', steps: ['A — Blanch & Cold Shock', 'B — Dry & Package', 'C — (label & store)'], color: A },
            ].map((stage) => (
              <div key={stage.num} style={{ border: `2px solid ${stage.color}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ background: stage.color, padding: '0.08in 0.12in', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: '0.78rem', color: 'white' }}>{stage.num}</span>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.8)' }}>{stage.label}</span>
                </div>
                <div style={{ padding: '0.1in 0.12in' }}>
                  {stage.steps.map((s) => (
                    <div key={s} style={{ fontSize: '0.72rem', color: INK, lineHeight: 1.5 }}>{s}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worksheet questions + lines */}
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: G, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15in' }}>
            My Setup Plan
          </div>
          {[
            'Where will I set up my stations at home?',
            'Do I want to do it alone or as a team?',
            'Is there any equipment I\'m missing?',
          ].map((q, i) => (
            <div key={i} style={{ marginBottom: '0.18in' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.1in' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: A, flexShrink: 0 }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: INK }}>{q}</div>
              </div>
              <div style={{ borderBottom: `1px solid ${LINE}`, marginBottom: '0.08in' }} />
              <div style={{ borderBottom: `1px solid ${LINE}` }} />
            </div>
          ))}

          <div style={{ fontWeight: 700, fontSize: '0.72rem', color: MUT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.12in', marginTop: '0.05in' }}>
            Additional Notes
          </div>
          <NoteLines count={5} />
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
