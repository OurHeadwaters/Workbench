const QR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 27 27" shape-rendering="crispEdges"><path fill="#ffffff" d="M0 0h27v27H0z"/><path stroke="#1f3d2e" d="M1 1.5h7m4 0h2m1 0h1m1 0h1m1 0h7M1 2.5h1m5 0h1m2 0h1m1 0h1m2 0h3m1 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m1 0h2m1 0h1m3 0h1m2 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m1 0h4m1 0h3m2 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m1 0h1m1 0h3m3 0h1m1 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m1 0h1m1 0h2m2 0h3m1 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 8.5h2m4 0h1m1 0h1M1 9.5h1m1 0h5m2 0h3m1 0h4m1 0h5M1 10.5h1m1 0h2m1 0h1m1 0h1m1 0h4m1 0h1m1 0h2m1 0h1m3 0h1M2 11.5h6m1 0h1m1 0h1m2 0h1m1 0h1m1 0h5m1 0h2M1 12.5h1m1 0h1m1 0h2m5 0h2m2 0h6m3 0h1M1 13.5h1m1 0h1m1 0h1m1 0h2m2 0h2m1 0h3m1 0h2m1 0h1m1 0h3M1 14.5h4m3 0h1m2 0h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h1m1 0h1M1 15.5h1m3 0h3m2 0h2m2 0h1m1 0h2m1 0h4m1 0h2M1 16.5h1m1 0h3m4 0h2m1 0h1m1 0h2m3 0h2m3 0h1M1 17.5h1m2 0h4m5 0h2m1 0h6m1 0h1M9 18.5h1m4 0h1m1 0h2m3 0h2M1 19.5h7m2 0h6m1 0h1m1 0h1m1 0h1m1 0h3M1 20.5h1m5 0h1m1 0h1m2 0h1m4 0h1m3 0h2m2 0h1M1 21.5h1m1 0h3m1 0h1m1 0h1m2 0h10m1 0h1M1 22.5h1m1 0h3m1 0h1m1 0h3m1 0h1m4 0h2m1 0h5M1 23.5h1m1 0h3m1 0h1m1 0h1m4 0h1m7 0h2m1 0h1M1 24.5h1m5 0h1m2 0h2m1 0h1m1 0h3m2 0h3m2 0h1M1 25.5h7m1 0h3m1 0h3m3 0h7"/></svg>`;

export function generateCapabilityStatementHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Headwaters Capability Statement</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --cream: #f4ede0;
      --evergreen: #1f3d2e;
      --rust: #b85a3e;
      --ink: #2b2116;
      --muted: #6b7665;
      --font-serif: 'Fraunces', 'Iowan Old Style', Georgia, serif;
      --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 8.5in;
      height: 11in;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 8.5in;
      height: 11in;
      background: var(--cream);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    /* Header */
    .header {
      background: var(--evergreen);
      padding: 0.5in 0.65in 0.4in;
      flex-shrink: 0;
    }
    .header-eyebrow {
      font-family: var(--font-sans);
      font-size: 0.6rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(244,237,224,0.6);
      margin-bottom: 0.15rem;
    }
    .header-h1 {
      font-family: var(--font-serif);
      font-size: 2.8rem;
      font-weight: 900;
      color: var(--cream);
      line-height: 1.05;
      margin-bottom: 0.15rem;
      letter-spacing: -0.02em;
    }
    .header-rule {
      width: 1.5in;
      height: 2px;
      background: var(--rust);
      margin: 0.2rem 0 0.3rem;
    }
    .header-sub {
      font-family: var(--font-serif);
      font-size: 0.9rem;
      font-style: italic;
      color: rgba(244,237,224,0.8);
      line-height: 1.5;
      max-width: 5in;
    }

    /* Body */
    .body {
      flex: 1;
      padding: 0.38in 0.65in 0.25in;
      display: flex;
      flex-direction: column;
      gap: 0.28in;
    }

    /* Who we are */
    .section-label {
      font-family: var(--font-sans);
      font-size: 0.62rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--rust);
      margin-bottom: 0.12rem;
    }
    .who-text {
      font-family: var(--font-serif);
      font-size: 0.83rem;
      color: var(--ink);
      line-height: 1.6;
    }

    /* Services grid */
    .services-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.25in;
    }
    .service-card {
      border-top: 2px solid var(--rust);
      padding-top: 0.18in;
    }
    .service-num {
      font-family: var(--font-serif);
      font-size: 1rem;
      font-weight: 700;
      color: var(--rust);
      margin-bottom: 0.05rem;
    }
    .service-title {
      font-family: var(--font-serif);
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--evergreen);
      margin-bottom: 0.1rem;
    }
    .service-desc {
      font-family: var(--font-sans);
      font-size: 0.73rem;
      color: var(--muted);
      line-height: 1.55;
    }

    /* Case studies */
    .cases-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.22in;
    }
    .case-card {
      background: white;
      border: 1px solid rgba(31,61,46,0.12);
      border-radius: 5px;
      padding: 0.18in 0.2in;
    }
    .case-type {
      font-family: var(--font-sans);
      font-size: 0.58rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 0.06rem;
    }
    .case-title {
      font-family: var(--font-serif);
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--evergreen);
      margin-bottom: 0.1rem;
    }
    .case-text {
      font-family: var(--font-sans);
      font-size: 0.71rem;
      color: var(--muted);
      line-height: 1.5;
      margin-bottom: 0.08rem;
    }
    .case-text strong {
      color: var(--ink);
    }

    /* Rate callout */
    .rate-block {
      background: var(--rust);
      border-radius: 5px;
      padding: 0.22in 0.3in;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1rem;
      align-items: center;
    }
    .rate-eyebrow {
      font-family: var(--font-sans);
      font-size: 0.6rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.72);
      margin-bottom: 0.06rem;
    }
    .rate-h3 {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.1rem;
    }
    .rate-desc {
      font-family: var(--font-sans);
      font-size: 0.74rem;
      color: rgba(255,255,255,0.85);
      line-height: 1.5;
    }
    .rate-note {
      font-family: var(--font-sans);
      font-size: 0.62rem;
      color: rgba(255,255,255,0.6);
      margin-top: 0.06rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .rate-amount {
      text-align: center;
      flex-shrink: 0;
    }
    .rate-number {
      font-family: var(--font-serif);
      font-size: 1.9rem;
      font-weight: 900;
      color: white;
      line-height: 1;
    }
    .rate-unit {
      font-family: var(--font-sans);
      font-size: 0.58rem;
      color: rgba(255,255,255,0.7);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    /* Footer */
    .footer {
      padding: 0.25in 0.65in 0.35in;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(31,61,46,0.12);
    }
    .footer-name {
      font-family: var(--font-serif);
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--evergreen);
      margin-bottom: 0.04rem;
    }
    .footer-sub {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      color: var(--muted);
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }
    .footer-contact {
      text-align: right;
    }
    .footer-email {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      color: var(--muted);
    }
    .footer-url {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      color: var(--muted);
    }
    .qr-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.18rem;
      flex-shrink: 0;
    }
    .qr-bg {
      background: white;
      padding: 4px;
      border-radius: 4px;
      line-height: 0;
    }
    .qr-label {
      font-family: var(--font-sans);
      font-size: 0.52rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted);
      text-align: center;
    }
  </style>
</head>
<body>
<div class="page">

  <div class="header">
    <p class="header-eyebrow">Headwaters Development Services</p>
    <h1 class="header-h1">Capability Statement</h1>
    <div class="header-rule"></div>
    <p class="header-sub">Practitioner-built tools for northern communities. Shipped, not proposed.</p>
  </div>

  <div class="body">

    <section>
      <p class="section-label">Who we are</p>
      <p class="who-text">Headwaters is a Northwestern Ontario practice led by Bobbie Parr — a community development practitioner, founder of Parr's Jars, and founding board member of the 807 Food Co-op. Headwaters builds operational plans, digital platforms, and custom internal tools for band councils and community organizations in northern Ontario. The work is plain-language, dollar-honest, and designed to run without a consultant in the room.</p>
    </section>

    <section>
      <p class="section-label" style="margin-bottom:0.16rem">Core services</p>
      <div class="services-grid">
        <div class="service-card">
          <p class="service-num">01</p>
          <h2 class="service-title">Community Store Planning</h2>
          <p class="service-desc">Full feasibility to day-one operations — governance structures, supply chain, staffing and training, financing, and band-council handoff. Six phases, plain language, open numbers.</p>
        </div>
        <div class="service-card">
          <p class="service-num">02</p>
          <h2 class="service-title">Co-op Membership Platforms</h2>
          <p class="service-desc">Custom web platforms for community-owned co-ops — member registration, producer onboarding, board admin, AGM tools. Governance-first. You own the platform outright.</p>
        </div>
        <div class="service-card">
          <p class="service-num">03</p>
          <h2 class="service-title">Custom Internal Tools</h2>
          <p class="service-desc">Purpose-built software for band councils and community organizations — replacing paper and spreadsheet workflows with tools your team actually uses.</p>
        </div>
      </div>
    </section>

    <section>
      <p class="section-label" style="margin-bottom:0.16rem">Selected work</p>
      <div class="cases-grid">
        <div class="case-card">
          <p class="case-type">Brand identity</p>
          <h3 class="case-title">Parr's Jars — Rebrand</h3>
          <p class="case-text"><strong>Problem:</strong> Original brand couldn't carry both a preserves business and a development consulting practice.</p>
          <p class="case-text"><strong>Outcome:</strong> Dual-identity brand system — wordmarks, colour system, copy architecture, and parrsjars.ca — that works for a market table and a band council office.</p>
        </div>
        <div class="case-card">
          <p class="case-type">Platform delivery · Founding board</p>
          <h3 class="case-title">807 Food Co-op — Membership Platform</h3>
          <p class="case-text"><strong>Problem:</strong> Founding board needed a working platform — member registration, equity tracking, governance tooling — before the co-op could open to members.</p>
          <p class="case-text"><strong>Outcome:</strong> Full member portal, producer onboarding, board admin panel, and AGM tools. Platform ready for June launch. Board owns it outright — no licensing fees.</p>
        </div>
      </div>
    </section>

    <div class="rate-block">
      <div>
        <p class="rate-eyebrow">Engagement terms</p>
        <h3 class="rate-h3">Trial period, not a contract</h3>
        <p class="rate-desc">The usual first step is a six-week bounded scope at $175/hr. Stop at any point. No retainer, no long commitment. If the fit is right, it continues. If not, you leave with something useful.</p>
        <p class="rate-note">All rates CAD · excludes HST</p>
      </div>
      <div class="rate-amount">
        <p class="rate-number">$175</p>
        <p class="rate-unit">per hour</p>
      </div>
    </div>

  </div>

  <div class="footer">
    <div>
      <p class="footer-name">Headwaters Development Services</p>
      <p class="footer-sub">Bobbie Parr · practitioner · Dryden, Ontario</p>
    </div>
    <div class="footer-right">
      <div class="footer-contact">
        <p class="footer-email">bobbie@ourheadwaters.ca</p>
        <p class="footer-url">ourheadwaters.ca</p>
      </div>
      <div class="qr-wrap">
        <div class="qr-bg">${QR_SVG}</div>
        <span class="qr-label">ourheadwaters.ca</span>
      </div>
    </div>
  </div>

</div>
</body>
</html>`;
}
