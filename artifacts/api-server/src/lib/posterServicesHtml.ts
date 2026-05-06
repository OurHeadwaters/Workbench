const QR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 27 27" shape-rendering="crispEdges"><path fill="#ffffff" d="M0 0h27v27H0z"/><path stroke="#1f3d2e" d="M1 1.5h7m4 0h2m1 0h1m1 0h1m1 0h7M1 2.5h1m5 0h1m2 0h1m1 0h1m2 0h3m1 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m1 0h2m1 0h1m3 0h1m2 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m1 0h4m1 0h3m2 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m1 0h1m1 0h3m3 0h1m1 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m1 0h1m1 0h2m2 0h3m1 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 8.5h2m4 0h1m1 0h1M1 9.5h1m1 0h5m2 0h3m1 0h4m1 0h5M1 10.5h1m1 0h2m1 0h1m1 0h1m1 0h4m1 0h1m1 0h2m1 0h1m3 0h1M2 11.5h6m1 0h1m1 0h1m2 0h1m1 0h1m1 0h5m1 0h2M1 12.5h1m1 0h1m1 0h2m5 0h2m2 0h6m3 0h1M1 13.5h1m1 0h1m1 0h1m1 0h2m2 0h2m1 0h3m1 0h2m1 0h1m1 0h3M1 14.5h4m3 0h1m2 0h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h1m1 0h1M1 15.5h1m3 0h3m2 0h2m2 0h1m1 0h2m1 0h4m1 0h2M1 16.5h1m1 0h3m4 0h2m1 0h1m1 0h2m3 0h2m3 0h1M1 17.5h1m2 0h4m5 0h2m1 0h6m1 0h1M9 18.5h1m4 0h1m1 0h2m3 0h2M1 19.5h7m2 0h6m1 0h1m1 0h1m1 0h1m1 0h3M1 20.5h1m5 0h1m1 0h1m2 0h1m4 0h1m3 0h2m2 0h1M1 21.5h1m1 0h3m1 0h1m1 0h1m2 0h10m1 0h1M1 22.5h1m1 0h3m1 0h1m1 0h3m1 0h1m4 0h2m1 0h5M1 23.5h1m1 0h3m1 0h1m1 0h1m4 0h1m7 0h2m1 0h1M1 24.5h1m5 0h1m2 0h2m1 0h1m1 0h3m2 0h3m2 0h1M1 25.5h7m1 0h3m1 0h3m3 0h7"/></svg>`;

export function generatePosterServicesHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Headwaters Services Poster</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --cream: #f4ede0;
      --evergreen: #1f3d2e;
      --evergreen-mid: #2e5c44;
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
    }
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
      font-size: 3.2rem;
      font-weight: 900;
      color: var(--cream);
      line-height: 1.05;
      margin-bottom: 0.15rem;
      letter-spacing: -0.02em;
    }
    .header-rule {
      width: 2in;
      height: 2px;
      background: var(--rust);
      margin: 0.2rem 0 0.3rem;
    }
    .header-sub {
      font-family: var(--font-serif);
      font-size: 0.95rem;
      font-style: italic;
      color: rgba(244,237,224,0.8);
      line-height: 1.5;
      max-width: 5.5in;
    }
    .services {
      flex: 1;
      padding: 0.4in 0.65in 0.3in;
      display: flex;
      flex-direction: column;
      gap: 0.28in;
    }
    .service-row {
      display: grid;
      grid-template-columns: 0.4in 1fr 1.55in;
      gap: 0.3in;
      align-items: center;
    }
    .service-num {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--rust);
      line-height: 1;
      padding-top: 0.05rem;
      align-self: start;
    }
    .service-h2 {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--evergreen);
      margin-bottom: 0.15rem;
    }
    .service-desc {
      font-family: var(--font-sans);
      font-size: 0.78rem;
      color: var(--muted);
      line-height: 1.55;
      margin-bottom: 0.2rem;
    }
    .bullets {
      display: flex;
      flex-wrap: wrap;
      gap: 0.2rem 0.5rem;
    }
    .bullet {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      color: var(--ink);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .bullet-dot {
      color: var(--rust);
      font-weight: 700;
    }
    .service-img {
      width: 1.55in;
      height: 1.15in;
      opacity: 0.85;
    }
    .callout {
      margin: 0 0.65in;
      background: var(--rust);
      border-radius: 6px;
      padding: 0.3in 0.4in;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1rem;
      align-items: center;
    }
    .callout-eyebrow {
      font-family: var(--font-sans);
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.75);
      margin-bottom: 0.1rem;
    }
    .callout-h3 {
      font-family: var(--font-serif);
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.15rem;
    }
    .callout-desc {
      font-family: var(--font-sans);
      font-size: 0.78rem;
      color: rgba(255,255,255,0.85);
      line-height: 1.5;
    }
    .callout-rate {
      font-family: var(--font-serif);
      font-size: 1.8rem;
      font-weight: 900;
      color: white;
      line-height: 1;
      text-align: center;
    }
    .callout-rate-label {
      font-family: var(--font-sans);
      font-size: 0.62rem;
      color: rgba(255,255,255,0.7);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: center;
    }
    .footer {
      padding: 0.3in 0.65in 0.4in;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-name {
      font-family: var(--font-serif);
      font-size: 1rem;
      font-weight: 700;
      color: var(--evergreen);
      margin-bottom: 0.05rem;
    }
    .footer-url {
      font-family: var(--font-sans);
      font-size: 0.75rem;
      color: var(--muted);
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }
    .footer-email {
      font-family: var(--font-sans);
      font-size: 0.75rem;
      color: var(--muted);
      text-align: right;
    }
    .footer-location {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      color: rgba(107,118,101,0.65);
      text-align: right;
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
    <h1 class="header-h1">Building Capacity<br />in Northern Communities</h1>
    <div class="header-rule"></div>
    <p class="header-sub">We partner with band councils, Indigenous businesses, and northern contractors to design systems, software, and strategies that work — and keep working.</p>
  </div>

  <div class="services">

    <div class="service-row">
      <div class="service-num">01</div>
      <div>
        <h2 class="service-h2">Community Store Planning</h2>
        <p class="service-desc">From feasibility to day-one operations — governance structures, inventory systems, community ownership models, and band-council alignment. We've done it. We can help you do it.</p>
        <div class="bullets">
          <span class="bullet"><span class="bullet-dot">·</span>Feasibility &amp; funding strategy</span>
          <span class="bullet"><span class="bullet-dot">·</span>Store layout &amp; supply chain</span>
          <span class="bullet"><span class="bullet-dot">·</span>Staff hiring &amp; training plans</span>
          <span class="bullet"><span class="bullet-dot">·</span>Point-of-sale &amp; bookkeeping setup</span>
        </div>
      </div>
      <div class="service-img">
        <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect x="20" y="55" width="120" height="65" rx="3" fill="none" stroke="#1f3d2e" stroke-width="2.5"/>
          <rect x="60" y="80" width="40" height="40" rx="2" fill="#b85a3e" opacity="0.18"/>
          <rect x="67" y="87" width="26" height="33" rx="1" fill="#b85a3e" opacity="0.35"/>
          <path d="M10 55 L30 20 L130 20 L150 55" fill="none" stroke="#1f3d2e" stroke-width="2.5" stroke-linejoin="round"/>
          <rect x="30" y="20" width="100" height="35" rx="0" fill="#b85a3e" opacity="0.12"/>
          <rect x="25" y="63" width="28" height="22" rx="2" fill="none" stroke="#1f3d2e" stroke-width="1.8"/>
          <rect x="107" y="63" width="28" height="22" rx="2" fill="none" stroke="#1f3d2e" stroke-width="1.8"/>
          <line x1="80" y1="55" x2="80" y2="20" stroke="#b85a3e" stroke-width="1.5" opacity="0.5"/>
          <circle cx="80" cy="38" r="6" fill="#b85a3e" opacity="0.6"/>
          <line x1="10" y1="120" x2="150" y2="120" stroke="#1f3d2e" stroke-width="2"/>
          <rect x="38" y="30" width="35" height="12" rx="2" fill="#b85a3e" opacity="0.25"/>
          <rect x="87" y="30" width="35" height="12" rx="2" fill="#b85a3e" opacity="0.25"/>
        </svg>
      </div>
    </div>

    <div class="service-row">
      <div class="service-num">02</div>
      <div>
        <h2 class="service-h2">Co-op Membership Platforms</h2>
        <p class="service-desc">Custom web platforms that let communities manage member shares, track equity, and run transparent governance — built for the realities of remote and Indigenous communities.</p>
        <div class="bullets">
          <span class="bullet"><span class="bullet-dot">·</span>Member registration &amp; equity tracking</span>
          <span class="bullet"><span class="bullet-dot">·</span>Governance portals</span>
          <span class="bullet"><span class="bullet-dot">·</span>Plain-language financial reporting</span>
          <span class="bullet"><span class="bullet-dot">·</span>Mobile-friendly, works on slow connections</span>
        </div>
      </div>
      <div class="service-img">
        <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <circle cx="80" cy="65" r="22" fill="none" stroke="#1f3d2e" stroke-width="2.5"/>
          <circle cx="80" cy="65" r="8" fill="#b85a3e" opacity="0.55"/>
          <circle cx="30" cy="30" r="14" fill="none" stroke="#1f3d2e" stroke-width="2"/>
          <circle cx="30" cy="30" r="5" fill="#b85a3e" opacity="0.4"/>
          <circle cx="130" cy="30" r="14" fill="none" stroke="#1f3d2e" stroke-width="2"/>
          <circle cx="130" cy="30" r="5" fill="#b85a3e" opacity="0.4"/>
          <circle cx="30" cy="100" r="14" fill="none" stroke="#1f3d2e" stroke-width="2"/>
          <circle cx="30" cy="100" r="5" fill="#b85a3e" opacity="0.4"/>
          <circle cx="130" cy="100" r="14" fill="none" stroke="#1f3d2e" stroke-width="2"/>
          <circle cx="130" cy="100" r="5" fill="#b85a3e" opacity="0.4"/>
          <line x1="44" y1="36" x2="60" y2="52" stroke="#1f3d2e" stroke-width="1.5" opacity="0.6"/>
          <line x1="116" y1="36" x2="100" y2="52" stroke="#1f3d2e" stroke-width="1.5" opacity="0.6"/>
          <line x1="44" y1="94" x2="60" y2="78" stroke="#1f3d2e" stroke-width="1.5" opacity="0.6"/>
          <line x1="116" y1="94" x2="100" y2="78" stroke="#1f3d2e" stroke-width="1.5" opacity="0.6"/>
          <circle cx="80" cy="20" r="10" fill="none" stroke="#b85a3e" stroke-width="1.8" opacity="0.5"/>
          <circle cx="80" cy="110" r="10" fill="none" stroke="#b85a3e" stroke-width="1.8" opacity="0.5"/>
          <line x1="80" y1="30" x2="80" y2="43" stroke="#b85a3e" stroke-width="1.5" opacity="0.5"/>
          <line x1="80" y1="87" x2="80" y2="100" stroke="#b85a3e" stroke-width="1.5" opacity="0.5"/>
        </svg>
      </div>
    </div>

    <div class="service-row">
      <div class="service-num">03</div>
      <div>
        <h2 class="service-h2">Custom Internal Tools</h2>
        <p class="service-desc">Bespoke software for band councils, health authorities, and community organizations — replacing paper and spreadsheet workflows with systems that actually fit the way your team works.</p>
        <div class="bullets">
          <span class="bullet"><span class="bullet-dot">·</span>Intake &amp; case management systems</span>
          <span class="bullet"><span class="bullet-dot">·</span>Financial reporting dashboards</span>
          <span class="bullet"><span class="bullet-dot">·</span>Document management &amp; workflows</span>
          <span class="bullet"><span class="bullet-dot">·</span>Integration with existing systems</span>
        </div>
      </div>
      <div class="service-img">
        <svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect x="18" y="22" width="124" height="86" rx="6" fill="none" stroke="#1f3d2e" stroke-width="2.5"/>
          <rect x="18" y="22" width="124" height="20" rx="6" fill="#1f3d2e" opacity="0.12"/>
          <circle cx="31" cy="32" r="3.5" fill="#b85a3e" opacity="0.7"/>
          <circle cx="44" cy="32" r="3.5" fill="#b85a3e" opacity="0.4"/>
          <circle cx="57" cy="32" r="3.5" fill="#1f3d2e" opacity="0.35"/>
          <rect x="30" y="55" width="28" height="4" rx="2" fill="#b85a3e" opacity="0.55"/>
          <rect x="30" y="65" width="42" height="4" rx="2" fill="#1f3d2e" opacity="0.4"/>
          <rect x="30" y="75" width="20" height="4" rx="2" fill="#b85a3e" opacity="0.3"/>
          <rect x="30" y="85" width="35" height="4" rx="2" fill="#1f3d2e" opacity="0.4"/>
          <rect x="30" y="95" width="25" height="4" rx="2" fill="#b85a3e" opacity="0.25"/>
          <rect x="90" y="52" width="42" height="48" rx="4" fill="#b85a3e" fill-opacity="0.1" stroke="#b85a3e" stroke-width="1.5" stroke-opacity="0.4"/>
          <rect x="97" y="62" width="28" height="3.5" rx="1.5" fill="#b85a3e" opacity="0.5"/>
          <rect x="97" y="70" width="22" height="3.5" rx="1.5" fill="#1f3d2e" opacity="0.45"/>
          <rect x="97" y="78" width="26" height="3.5" rx="1.5" fill="#b85a3e" opacity="0.35"/>
          <rect x="97" y="86" width="18" height="3.5" rx="1.5" fill="#1f3d2e" opacity="0.4"/>
        </svg>
      </div>
    </div>

  </div>

  <div class="callout">
    <div>
      <p class="callout-eyebrow">Pilot Program</p>
      <h3 class="callout-h3">$25,000 · 6-Week Engagement</h3>
      <p class="callout-desc">Structured six-week engagement to scope, design, and deliver the first phase of your project. No long-term commitment required. Includes discovery, delivery, and a handoff document your team can act on immediately.</p>
    </div>
    <div>
      <p class="callout-rate">$175</p>
      <p class="callout-rate-label">per hour<br />thereafter</p>
    </div>
  </div>

  <div class="footer">
    <div>
      <p class="footer-name">Headwaters Development Services</p>
      <p class="footer-url">ourheadwaters.ca</p>
    </div>
    <div class="footer-right">
      <div>
        <p class="footer-email">bobbie@ourheadwaters.ca</p>
        <p class="footer-location">Dryden, Ontario</p>
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
