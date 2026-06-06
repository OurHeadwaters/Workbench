import { PrintNav } from "../components/PrintNav";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

const chapters = [
  { num: 1, title: 'Plastic Purge', sub: 'Transitioning from Tupperware to Jars' },
  { num: 2, title: 'Sourcing Food', sub: 'Embracing Local and DIY' },
  { num: 3, title: 'Whole Food Prep', sub: 'Meal Planning and Jar Storage' },
  { num: 4, title: 'Dry Storage', sub: 'Bulk Buying and Seasonal Preservation' },
  { num: 5, title: 'Freezer System', sub: 'Maximizing the Potential of Your Freezer' },
  { num: 6, title: 'Preservation', sub: 'Techniques for Long-Term Storage' },
  { num: 7, title: 'Jar Kitchen Hacks', sub: 'Innovative Tools and Techniques' },
  { num: 8, title: 'Taking Action', sub: 'Practical Steps to Begin Your Jarista Journey' },
];

function JarIllustration() {
  return (
    <svg width="120" height="150" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="36" y="12" width="48" height="9" rx="3" fill="none" stroke={G} strokeWidth="2"/>
      <rect x="28" y="21" width="64" height="6" rx="2" fill={GL} stroke={G} strokeWidth="2"/>
      <path d="M 32,27 Q 18,29 15,46 L 11,120 Q 10,134 22,136 L 98,136 Q 110,134 109,120 L 105,46 Q 102,29 88,27 Z" fill="white" stroke={G} strokeWidth="2"/>
      <path d="M 32,27 Q 18,29 15,46 L 11,120 Q 10,134 22,136 L 98,136 Q 110,134 109,120 L 105,46 Q 102,29 88,27 Z" fill={GL} opacity="0.25"/>
      <text x="60" y="75" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill={G}>How to</text>
      <text x="60" y="90" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill={G}>Become a</text>
      <text x="60" y="108" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fontWeight="900" fill={A}>Jarista</text>
      <path d="M 38,112 Q 60,118 82,112" stroke={A} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 55,6 Q 60,0 65,6" stroke={G} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="60" y1="0" x2="60" y2="12" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="60" cy="0" r="2" fill={G}/>
      <path d="M 50,138 Q 60,144 70,138" stroke={G} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

export default function PJJaristaLeadMagnet() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-jarista-guide.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ fontFamily: 'var(--font-sans)', color: INK, overflow: 'hidden' }}
      >
        {/* Cover section */}
        <div style={{ background: G, padding: '0.6in 0.65in 0.45in', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circle */}
          <div style={{ position: 'absolute', top: '-1in', right: '-0.8in', width: '4in', height: '4in', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '0.12in', fontWeight: 600 }}>
                Parr's Jars · Free Guide
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '0.08in' }}>
                How to Become<br />a Jarista
              </h1>
              <div style={{ height: 3, width: '2in', background: A, borderRadius: 2, marginBottom: '0.15in' }} />
              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.55, maxWidth: '4.2in', marginBottom: '0.18in' }}>
                Everything You Need to Start Living Seasonally with a Jar Kitchen System
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Plastic-Free Kitchen', 'Local Sourcing', 'Seasonal Preservation', 'Real Food Systems'].map((tag) => (
                  <div key={tag} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 4, padding: '0.03in 0.1in', fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.04em' }}>
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginLeft: '0.3in', flexShrink: 0 }}>
              <JarIllustration />
            </div>
          </div>
        </div>

        {/* Content section */}
        <div style={{ padding: '0.35in 0.65in 0.4in' }}>

          {/* Intro */}
          <div style={{ borderLeft: `4px solid ${A}`, paddingLeft: '0.2in', marginBottom: '0.28in' }}>
            <p style={{ fontSize: '0.82rem', color: INK, lineHeight: 1.65, fontStyle: 'italic' }}>
              In a society dominated by convenience and mass production, the concept of living seasonally and cooking with jars may seem unconventional at first. Through this guide, you will discover the benefits and joys that come with embracing a jar kitchen system — one shelf, one Sunday, one season at a time.
            </p>
          </div>

          {/* Table of Contents */}
          <div style={{ marginBottom: '0.28in' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.18in' }}>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: G, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Table of Contents</div>
              <div style={{ flex: 1, height: 1, background: LINE }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.12in 0.3in' }}>
              {chapters.map((ch) => (
                <div key={ch.num} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', borderBottom: `1px solid ${LINE}`, paddingBottom: '0.08in' }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: ch.num % 2 === 0 ? A : G,
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {ch.num}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: INK, lineHeight: 1.2 }}>{ch.title}</div>
                    <div style={{ fontSize: '0.65rem', color: MUT, lineHeight: 1.3, marginTop: 2 }}>{ch.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses to build */}
          <div style={{ background: GL, border: `2px solid ${G}`, borderRadius: 8, padding: '0.16in 0.2in', marginBottom: '0.2in' }}>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: G, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.1in' }}>
              Next Steps — Learning Path
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.12in' }}>
              {[
                { num: 1, label: 'Food Preservation & Canning', current: true },
                { num: 2, label: 'Advanced Preparedness Storage Systems', current: false },
                { num: 3, label: 'Building Community & Food Systems', current: false },
              ].map((c) => (
                <div key={c.num} style={{ background: c.current ? G : 'white', borderRadius: 6, padding: '0.1in 0.12in', border: `1.5px solid ${c.current ? G : LINE}` }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: c.current ? A : MUT, marginBottom: 3 }}>Course {c.num}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: c.current ? 700 : 400, color: c.current ? 'white' : INK, lineHeight: 1.35 }}>{c.label}</div>
                  {c.current && <div style={{ marginTop: 4, fontSize: '0.6rem', color: A, fontWeight: 700 }}>↑ You are here</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: '0.12in', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6rem', color: '#AAAAAA', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Parr's Jars · parrsjars.ca</span>
            <span style={{ fontSize: '0.6rem', color: '#AAAAAA' }}>Free guide — share freely</span>
          </div>
        </div>
      </div>
    </>
  );
}
