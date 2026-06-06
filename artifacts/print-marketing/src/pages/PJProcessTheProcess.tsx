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

export default function PJProcessTheProcess() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-process-the-process.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Header */}
        <div style={{ background: INK, borderRadius: 8, padding: '0.18in 0.25in', marginBottom: '0.28in', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              Parr's Jars · Principles to Preservation
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'white', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              Process the Process
            </h1>
          </div>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" stroke={A} strokeWidth="2" fill="none"/>
            <path d="M14 22 Q18 14 22 22 Q26 30 30 22" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="22" cy="22" r="3" fill={A}/>
          </svg>
        </div>

        {/* Benefits: Freezing vs Dehydrating */}
        <div style={{ marginBottom: '0.22in' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: INK, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.12in' }}>
            Benefits
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.18in' }}>
            <div style={{ background: GL, border: `2px solid ${G}`, borderRadius: 8, padding: '0.14in 0.18in' }}>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: G, marginBottom: '0.08in', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Freezing</div>
              <div style={{ fontSize: '0.75rem', color: INK, lineHeight: 1.5 }}>
                When stored properly, food can closely resemble its fresh counterpart. Nutrients remain high when blanched and frozen as the food's enzymic activity has been halted.
              </div>
            </div>
            <div style={{ background: AL, border: `2px solid ${A}`, borderRadius: 8, padding: '0.14in 0.18in' }}>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: A, marginBottom: '0.08in', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dehydrating</div>
              <div style={{ fontSize: '0.75rem', color: INK, lineHeight: 1.5 }}>
                Molds, yeast and bacteria need water to grow. Sufficiently dehydrated, microorganisms cannot grow and foods will not spoil. Dried fruits and vegetables may be used as snacks, added to soups or stews.
              </div>
            </div>
          </div>
        </div>

        {/* Enzymic Activity */}
        <div style={{ border: `2px solid ${LINE}`, borderRadius: 8, padding: '0.14in 0.18in', marginBottom: '0.2in', background: '#FAFAFA' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: INK, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.08in' }}>
            Enzymic Activity
          </div>
          <div style={{ fontSize: '0.77rem', color: INK, lineHeight: 1.5, marginBottom: '0.08in' }}>
            The purpose of blanching and freezing is to halt enzymatic activity which leads to food degradation.
          </div>
          <div style={{ fontSize: '0.75rem', color: MUT, lineHeight: 1.5 }}>
            Blanching not only halts enzymatic activity, it also sterilizes bacteria. Freezing also halts bacteria growth in and of itself, but some vegetables are only palatable if blanched first.
          </div>
        </div>

        {/* Humidity & Air Circulation */}
        <div style={{ border: `2px solid ${G}`, borderRadius: 8, padding: '0.14in 0.18in', marginBottom: '0.2in', background: GL }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: G, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.08in' }}>
            The Role of Humidity &amp; Air Circulation During Dehydration
          </div>
          <div style={{ fontSize: '0.77rem', color: INK, lineHeight: 1.5 }}>
            Air temperature and circulation must be controlled during the drying process. If the temperature is too low or the humidity too high (resulting in poor circulation of moist air), the food will dry more slowly than it should and microbial growth can occur.
          </div>
        </div>

        {/* Role of Oxygen During Storage */}
        <div style={{ marginBottom: '0.22in' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: INK, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.12in' }}>
            The Role of Oxygen During Storage
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.15in' }}>
            <div style={{ background: GL, border: `2px solid ${G}`, borderRadius: 8, padding: '0.14in 0.18in' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.08in' }}>
                <div style={{ background: G, borderRadius: 4, padding: '0.03in 0.1in' }}>
                  <span style={{ fontWeight: 900, fontSize: '0.72rem', color: 'white' }}>FROZEN</span>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: INK, lineHeight: 1.45 }}>
                Causes food degradation — affecting flavor, color, smell and texture. Known as <em>"freezer burn."</em>
              </div>
            </div>
            <div style={{ background: AL, border: `2px solid ${A}`, borderRadius: 8, padding: '0.14in 0.18in' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.08in' }}>
                <div style={{ background: A, borderRadius: 4, padding: '0.03in 0.1in' }}>
                  <span style={{ fontWeight: 900, fontSize: '0.72rem', color: 'white' }}>DRIED</span>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: INK, lineHeight: 1.45 }}>
                Loss of nutrients, color &amp; overall quality. Remove as much air as possible when packaging dried goods.
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
