import { PrintNav } from "../components/PrintNav";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

export default function PJFreezingDryingCheatSheet() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-freezing-drying-cheat-sheet.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Header */}
        <div style={{ marginBottom: '0.25in' }}>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: MUT, marginBottom: 4, fontWeight: 600 }}>
            Parr's Jars · Principles to Preservation
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 6 }}>
            <div style={{ height: 4, width: '1.5in', background: G, borderRadius: 2 }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: G, lineHeight: 1, letterSpacing: '-0.02em' }}>FREEZING</h1>
            <div style={{ background: INK, borderRadius: 4, padding: '0.04in 0.12in' }}>
              <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'white' }}>or</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: A, lineHeight: 1, letterSpacing: '-0.02em' }}>DRYING</h1>
            <div style={{ flex: 1, height: 4, background: A, borderRadius: 2 }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginBottom: 4 }}>Cheat Sheet</div>
          <div style={{ fontSize: '0.8rem', color: MUT, fontStyle: 'italic' }}>
            Best results for beginners — but experimenting is encouraged.
          </div>
        </div>

        {/* 3 prep categories */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.18in', marginBottom: '0.25in' }}>
          {[
            {
              label: 'CUBE / ROAST FIRST',
              color: A,
              bg: AL,
              items: ['Winter squash', 'Root vegetables (beets, sweet potato)', 'Potatoes', 'Firm mushrooms'],
              note: 'Cook or roast before freezing or drying for best texture.',
            },
            {
              label: 'BLANCHE FIRST',
              color: G,
              bg: GL,
              items: ['Green beans', 'Broccoli & cauliflower', 'Carrots', 'Asparagus', 'Greens & kale', 'Peas'],
              note: 'Halts enzymic activity before freezing or drying.',
            },
            {
              label: 'PREP & GO',
              color: '#1A5C8A',
              bg: '#EAF3FB',
              items: ['Peppers & corn', 'Green onions', 'Tomatoes (slice)', 'Berries & fruit', 'Herbs', 'Jerky/meat strips'],
              note: 'Wash, slice, and freeze or dry directly — no cooking needed.',
            },
          ].map((cat) => (
            <div key={cat.label} style={{ border: `2.5px solid ${cat.color}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: cat.color, padding: '0.1in 0.14in' }}>
                <div style={{ fontWeight: 900, fontSize: '0.77rem', color: 'white', letterSpacing: '0.04em', textAlign: 'center' }}>{cat.label}</div>
              </div>
              <div style={{ background: cat.bg, padding: '0.14in 0.14in', flex: 1 }}>
                {cat.items.map((item) => (
                  <div key={item} style={{ display: 'flex', gap: '0.35rem', alignItems: 'flex-start', marginBottom: '0.06in' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, marginTop: 4, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', padding: '0.09in 0.14in', borderTop: `1px solid ${LINE}` }}>
                <div style={{ fontSize: '0.68rem', color: MUT, fontStyle: 'italic', lineHeight: 1.35 }}>{cat.note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* How to use + experience callout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.18in', marginBottom: '0.22in' }}>
          <div style={{ border: `2px solid ${LINE}`, borderRadius: 8, padding: '0.16in 0.18in' }}>
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: INK, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.12in' }}>
              How Are You Going to Use It?
            </div>
            <div style={{ marginBottom: '0.1in' }}>
              {[
                { use: 'Snacks', examples: 'Jerky, fruit leather, banana chips, veggie chips, cheese chips, sundried tomato' },
                { use: 'Powders', examples: 'Add to smoothies, soups, stews, sauces, spice blends' },
                { use: 'Meals', examples: 'Just-add-water sides, freezer packs, dried onions, enhanced nutrition adds' },
              ].map((u) => (
                <div key={u.use} style={{ marginBottom: '0.09in', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: A, color: 'white', fontWeight: 800, fontSize: '0.65rem', borderRadius: 4, padding: '0.02in 0.07in', flexShrink: 0, marginTop: 2 }}>
                    {u.use}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: MUT, lineHeight: 1.35 }}>{u.examples}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: '0.1in', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2 Q 6 7 6 11 A 4 4 0 0 0 14 11 Q 14 7 10 2 Z" fill={GL} stroke={G} strokeWidth="1.5"/>
                <line x1="10" y1="15" x2="10" y2="18" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="7" y1="18" x2="13" y2="18" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div style={{ fontSize: '0.68rem', color: G, fontWeight: 600 }}>Think with the end in mind</div>
            </div>
          </div>

          <div style={{ background: G, borderRadius: 8, padding: '0.18in 0.2in', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: A, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.1in' }}>
                Experience Is the Best Teacher
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
                Judging when food is dry requires experience. It is better to overdry than underdry. When in doubt, continue drying for an additional 15–30 minutes. Check for doneness. Allow the product to cool before testing.
              </div>
            </div>
            <div style={{ marginTop: '0.12in', background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '0.1in' }}>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                When freezing: package next day, reduce air inside bag, and store labelled with contents + date.
              </div>
            </div>
          </div>
        </div>

        {/* Notes strip */}
        <div style={{ borderTop: `2px solid ${LINE}`, paddingTop: '0.15in' }}>
          <div style={{ fontWeight: 700, fontSize: '0.72rem', color: MUT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15in' }}>My Notes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25in' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ borderBottom: `1px solid ${LINE}` }} />
            ))}
          </div>
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
