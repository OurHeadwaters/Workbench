import { PrintNav } from "../components/PrintNav";

const G = '#2B5F2B';
const GL = '#EDF4E8';
const A = '#C17D3C';
const AL = '#FEF3E2';
const INK = '#1A1A1A';
const MUT = '#6B6B6B';
const LINE = '#D0D0D0';

function JarSVG() {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="8" width="36" height="6" rx="2" fill="none" stroke={G} strokeWidth="2"/>
      <rect x="18" y="14" width="44" height="4" rx="1" fill={GL} stroke={G} strokeWidth="1.5"/>
      <path d="M 20,18 Q 12,19 10,30 L 8,80 Q 8,90 16,92 L 64,92 Q 72,90 72,80 L 70,30 Q 68,19 60,18 Z" fill="none" stroke={G} strokeWidth="2"/>
      <path d="M 20,18 Q 12,19 10,30 L 8,80 Q 8,90 16,92 L 64,92 Q 72,90 72,80 L 70,30 Q 68,19 60,18 Z" fill={GL} opacity="0.3"/>
      <text x="40" y="58" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="9" fontWeight="700" fill={G}>parr's</text>
      <text x="40" y="70" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="9" fontWeight="700" fill={G}>jars</text>
      <path d="M 28,73 Q 40,77 52,73" stroke={A} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 36,4 Q 40,0 44,4" stroke={G} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 40,0 L 40,8" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function PJWorkshopOverview() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="pj-workshop-overview.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: '0.5in 0.6in 0.4in', fontFamily: 'var(--font-sans)', color: INK }}
      >
        {/* Top rule */}
        <div style={{ height: 5, background: G, borderRadius: 2, marginBottom: '0.35in' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3in' }}>
          <div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: A, marginBottom: '0.08rem', fontWeight: 600 }}>
              Parr's Jars · Principles to Preservation
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: INK, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              Upon Arrival, Expect:
            </h1>
          </div>
          <JarSVG />
        </div>

        {/* Expectations */}
        <div style={{ marginBottom: '0.35in', paddingLeft: '0.1in' }}>
          {[
            'To sign a liability waiver.',
            'Go over safe food handling practices.',
            'Run through a weekly package on the given topic.',
            'Have fun with hands-on learning.',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', marginBottom: '0.12in' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: A, marginTop: 3, flexShrink: 0 }} />
              <span style={{ fontSize: '0.97rem', lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3in' }}>
          <div style={{ flex: 1, height: 1, background: LINE }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: G, letterSpacing: '-0.01em', textTransform: 'uppercase', whiteSpace: 'nowrap', padding: '0 0.1in' }}>
            A Quick Look at Our Workshop Structure
          </h2>
          <div style={{ flex: 1, height: 1, background: LINE }} />
        </div>

        {/* 3-type grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.2in', marginBottom: '0.35in' }}>
          {[
            {
              label: 'Cheat Sheets',
              sub: 'visual guide',
              color: A,
              bg: AL,
              icon: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="2" width="28" height="32" rx="3" stroke={A} strokeWidth="2" fill={AL}/><line x1="10" y1="10" x2="26" y2="10" stroke={A} strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="15" x2="22" y2="15" stroke={A} strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="20" x2="24" y2="20" stroke={A} strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="25" x2="20" y2="25" stroke={A} strokeWidth="1.5" strokeLinecap="round"/></svg>
              ),
            },
            {
              label: 'Stages & Processes',
              sub: 'a structured look',
              color: G,
              bg: GL,
              icon: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 3 L33 12 L33 24 L18 33 L3 24 L3 12 Z" stroke={G} strokeWidth="2" fill={GL}/><circle cx="18" cy="18" r="5" stroke={G} strokeWidth="1.5" fill="none"/><path d="M18 8 L18 13 M18 23 L18 28 M8 18 L13 18 M23 18 L28 18" stroke={G} strokeWidth="1.5" strokeLinecap="round"/></svg>
              ),
            },
            {
              label: 'Work Sheets',
              sub: 'personalized learning',
              color: A,
              bg: AL,
              icon: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="2" width="28" height="32" rx="3" stroke={A} strokeWidth="2" fill={AL}/><line x1="10" y1="12" x2="26" y2="12" stroke={LINE} strokeWidth="1.5"/><line x1="10" y1="17" x2="26" y2="17" stroke={LINE} strokeWidth="1.5"/><line x1="10" y1="22" x2="26" y2="22" stroke={LINE} strokeWidth="1.5"/><line x1="10" y1="27" x2="22" y2="27" stroke={LINE} strokeWidth="1.5"/><path d="M10 6 Q12 4 14 6" stroke={A} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
              ),
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{ border: `2px solid ${item.color}`, borderRadius: 10, padding: '0.22in 0.2in', textAlign: 'center', background: item.bg }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.12in' }}>{item.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: item.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.05rem' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: MUT, fontStyle: 'italic' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Take Home the Fun */}
        <div style={{ background: GL, border: `2px solid ${G}`, borderRadius: 10, padding: '0.22in 0.28in', marginBottom: '0.3in' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15in' }}>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: G, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Take Home the Fun
            </div>
            <div style={{ flex: 1, height: 1, background: G, opacity: 0.25 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.1in 0.3in' }}>
            {[
              ['Week 1', 'Freezer package of green beans/carrots & salty onion powder'],
              ['Week 2', 'Pickles or Salsa'],
              ['Week 3', 'Beef Sauce or Potatoes two ways (fresh & canned)'],
              ['Week 4', 'Sauerkraut or Kimchi'],
              ['Week 5', 'Vacuum Sealed roasted vegetables and Crock pot pack'],
            ].map(([wk, desc]) => (
              <div key={wk} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 800, color: A, flexShrink: 0, fontSize: '0.78rem', minWidth: '2.2rem' }}>{wk}</span>
                <span style={{ fontSize: '0.78rem', color: INK, lineHeight: 1.35 }}>{desc}</span>
              </div>
            ))}
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
