export default function BrandOnePager() {
  return (
    <div className="onepager-screen">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[12pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt]">
              Brand reference · One Page
            </div>
            <h1 className="font-display text-[22pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold">
              Headwaters.
            </h1>
            <div className="font-display italic text-[10pt] text-[#1f3d2e] mt-[3pt] leading-[1.3]">
              We've always known how to fix it, now we can.
            </div>
            <div className="font-display italic text-[11pt] text-[#2a2520] mt-[2pt] max-w-[5in] leading-[1.35]">
              The parent agency. Watershed lives inside it; Deer Lake is the
              first engagement; future reserves are the rest.
            </div>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
            For designer / trademark agent / lawyer
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              v1 · Spring 2026
            </div>
          </div>
        </div>

        <div className="text-[9.5pt] leading-[1.45] text-[#2a2520] mb-[12pt]">
          <span className="font-semibold">One sentence:</span> Headwaters has
          the open trademark lanes in Class 36 (financial services) and Class 9
          (consumer software); Watershed has the contested ones, so Watershed
          ships as the household-finance product inside Headwaters rather than
          as the parent brand.
        </div>

        <div className="mb-[12pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]">
            Brand structure — parent · product · clients
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[10pt] bg-[#f7f1e2]">
            <BrandStructureDiagram />
            <div className="grid grid-cols-3 gap-[10pt] mt-[8pt] text-[8.5pt] text-[#2a2520] leading-[1.35]">
              <div>
                <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] mb-[2pt]">
                  Watershed — product
                </div>
                Household finance software shipped under the Watershed wordmark,
                wholly owned by Headwaters. Keeps Watershed in market without
                making it the entity name.
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] mb-[2pt]">
                  Deer Lake — pilot
                </div>
                The inaugural community-development engagement. The reference
                client. The proof the model travels.
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] mb-[2pt]">
                  Future reserves — pipeline
                </div>
                Pilot #2 onward. Each one slots into the same parent so the
                contracts, payroll, and IP all sit under Headwaters.
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[12pt] mb-[12pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]">
              Trademark classes that matter
            </div>
            <table
              className="w-full text-[9pt] border-collapse"
              style={{ tableLayout: "fixed" }}
            >
              <thead>
                <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold">
                  <th className="py-[3pt] pr-[4pt] w-[22%]">Class</th>
                  <th className="py-[3pt] pr-[4pt] w-[44%]">Covers</th>
                  <th className="py-[3pt] w-[34%]">Why we file</th>
                </tr>
              </thead>
              <tbody className="text-[#2a2520] align-top">
                <tr className="border-b border-[#e3dac4]">
                  <td className="py-[3pt] pr-[4pt] font-semibold">Class 36</td>
                  <td className="py-[3pt] pr-[4pt]">
                    Insurance & financial services — advisory, agency, community
                    finance
                  </td>
                  <td className="py-[3pt]">
                    The agency itself. No active Headwaters mark found in this
                    class.
                  </td>
                </tr>
                <tr className="border-b border-[#e3dac4]">
                  <td className="py-[3pt] pr-[4pt] font-semibold">Class 9</td>
                  <td className="py-[3pt] pr-[4pt]">
                    Electrical / scientific / teaching apparatus and downloadable
                    software
                  </td>
                  <td className="py-[3pt]">
                    The Watershed product. No active Headwaters mark found here
                    either.
                  </td>
                </tr>
                <tr>
                  <td className="py-[3pt] pr-[4pt] font-semibold">
                    Class 42 (watch)
                  </td>
                  <td className="py-[3pt] pr-[4pt]">SaaS / hosted software</td>
                  <td className="py-[3pt]">
                    Confirm with the agent — Watershed Technology Inc. overlaps
                    here.
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-[8pt] text-[#6b7665] mt-[4pt] leading-[1.4]">
              Trademark counts from the indicative US/global index — directional,
              not legal opinion. Specifically ask the agent about{" "}
              <span className="font-semibold">Watershed Asset Management</span>{" "}
              (Class 36, institutional) and{" "}
              <span className="font-semibold">Watershed Technology Inc.</span>{" "}
              (Class 9 / 42) before any filing.
            </div>
          </div>

          <div>
            <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]">
              Domains — acquire & defend
            </div>
            <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] bg-[#f7f1e2] mb-[6pt]">
              <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] mb-[3pt]">
                Acquire — primary
              </div>
              <div className="font-mono text-[9pt] text-[#1f3d2e] leading-[1.55]">
                <span className="font-semibold">headwaters.ca</span> ·{" "}
                <span className="font-semibold">watershed.ca</span>
              </div>
            </div>
            <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] bg-[#f7f1e2] mb-[6pt]">
              <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] mb-[3pt]">
                Defensive — register if budget allows
              </div>
              <div className="font-mono text-[9pt] text-[#1f3d2e] leading-[1.55]">
                watershedhq.ca · watershedmoney.ca · watershedbudget.ca ·
                headwatersmoney.com · watershed.app · headwaters.app
              </div>
            </div>
            <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] bg-[#efe6cf]">
              <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] mb-[3pt]">
                Already taken — do not pursue
              </div>
              <div className="font-mono text-[8.5pt] text-[#2a2520] leading-[1.5]">
                watershed.com (Watershed Technology Inc.) · headwaters.com
                (privately held since 1995) · getwatershed.com (parked) ·
                watershed.cash · watershed.money · headwaters.cash ·
                headwaters.money
              </div>
            </div>
            <div className="text-[8pt] text-[#6b7665] mt-[4pt] leading-[1.4]">
              Cloudflare Registrar — at-cost renewals, no upsells. WHOIS
              confirmed Apr 2026.
            </div>
          </div>
        </div>

        <div className="mb-[12pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[5pt]">
            Sequence — what locks you in, and in what order
          </div>
          <div className="text-[9pt] text-[#2a2520] leading-[1.45]">
            <span className="font-semibold">1.</span> Buy headwaters.ca and
            watershed.ca today (~$15 CAD each). &nbsp;
            <span className="font-semibold">2.</span> Set up{" "}
            <span className="font-mono">you@headwaters.ca</span> on Google
            Workspace (~$8 CAD/mo). &nbsp;
            <span className="font-semibold">3.</span> Run the free CIPO direct
            search on "Headwaters" and "Watershed" in Class 36 and Class 9. &nbsp;
            <span className="font-semibold">4.</span> Engage a Canadian
            trademark agent (IPIC directory) for a paid clearance opinion ($300–500). &nbsp;
            <span className="font-semibold">5.</span> NUANS name search
            (~$15) before incorporation. &nbsp;
            <span className="font-semibold">6.</span> Then incorporate, then
            file the marks.
          </div>
          <div className="text-[8.5pt] italic text-[#6b7665] mt-[4pt] leading-[1.4]">
            Buying domains doesn't lock you in. Filing a trademark does. Don't
            sequence those backwards.
          </div>
        </div>

        <div className="border-t border-[#c8bfa7] pt-[8pt] grid grid-cols-3 gap-[10pt] text-[9pt] text-[#2a2520]">
          <div>
            <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#6b7665] mb-[2pt]">
              Wordmark brief
            </div>
            <div className="leading-[1.4]">
              Display face: <span className="font-semibold">Fraunces</span>{" "}
              (medium / 500). Body: IBM Plex Sans. Mono: IBM Plex Mono. Lock the
              "Headwaters." period — it's part of the mark.
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#6b7665] mb-[2pt]">
              Palette
            </div>
            <div className="leading-[1.4] flex flex-col gap-[2pt]">
              <SwatchLine name="Boreal" hex="#1f3d2e" />
              <SwatchLine name="Ember" hex="#b85a3e" />
              <SwatchLine name="Cream" hex="#f4ede0" />
              <SwatchLine name="Birch" hex="#e9c8a8" />
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#6b7665] mb-[2pt]">
              Contact
            </div>
            <div className="leading-[1.4]">
              Founder · Headwaters
              <div className="font-display italic text-[8pt] text-[#1f3d2e] mt-[1pt] leading-[1.3]">
                We've always known how to fix it, now we can.
              </div>
              <div className="font-mono text-[9pt] text-[#1f3d2e] font-semibold mt-[2pt]">
                you@headwaters.ca
              </div>
              <div className="text-[8pt] text-[#6b7665] italic mt-[1pt]">
                (live once Workspace is provisioned)
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#c8bfa7] mt-[10pt] pt-[6pt] flex items-center justify-between text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
          <div>
            Headwaters has the open lanes; Watershed has the contested ones.
          </div>
          <div className="text-[#1f3d2e] font-semibold">
            Brand reference · v1
          </div>
        </div>
      </div>
    </div>
  );
}

function SwatchLine({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex items-center gap-[5pt]">
      <span
        className="inline-block"
        style={{
          width: "10pt",
          height: "10pt",
          background: hex,
          border: "0.5pt solid #c8bfa7",
          borderRadius: "1pt",
        }}
      />
      <span className="font-semibold text-[#1f3d2e]">{name}</span>
      <span className="font-mono text-[8pt] text-[#6b7665]">{hex}</span>
    </div>
  );
}

function BrandStructureDiagram() {
  return (
    <svg
      viewBox="0 0 600 180"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "120pt" }}
      role="img"
      aria-label="Brand structure: Headwaters parent agency, with Watershed product, Deer Lake pilot, and future reserves as children"
    >
      <defs>
        <marker
          id="brand-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#b85a3e" />
        </marker>
      </defs>

      <path
        d="M 300 70 L 300 95 L 100 95 L 100 120"
        stroke="#b85a3e"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="4 4"
        opacity="0.65"
        markerEnd="url(#brand-arrow)"
      />
      <path
        d="M 300 70 L 300 120"
        stroke="#b85a3e"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="4 4"
        opacity="0.65"
        markerEnd="url(#brand-arrow)"
      />
      <path
        d="M 300 70 L 300 95 L 500 95 L 500 120"
        stroke="#b85a3e"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="4 4"
        opacity="0.65"
        markerEnd="url(#brand-arrow)"
      />

      <g>
        <rect
          x="220"
          y="14"
          width="160"
          height="56"
          rx="3"
          fill="#1f3d2e"
        />
        <text
          x="300"
          y="30"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="8"
          letterSpacing="2"
          fill="#e9c8a8"
        >
          PARENT AGENCY
        </text>
        <text
          x="300"
          y="46"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="16"
          fontWeight="600"
          fill="#f4ede0"
        >
          Headwaters
        </text>
        <text
          x="300"
          y="61"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="7"
          fontStyle="italic"
          fill="#e9c8a8"
          opacity="0.9"
        >
          We've always known how to fix it, now we can.
        </text>
      </g>

      <g>
        <rect
          x="30"
          y="120"
          width="140"
          height="50"
          rx="3"
          fill="#f4ede0"
          stroke="#1f3d2e"
          strokeWidth="0.8"
        />
        <text
          x="100"
          y="138"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="7"
          letterSpacing="2"
          fill="#b85a3e"
        >
          PRODUCT
        </text>
        <text
          x="100"
          y="154"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="14"
          fontWeight="500"
          fill="#1f3d2e"
        >
          Watershed
        </text>
        <text
          x="100"
          y="166"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="8"
          fontStyle="italic"
          fill="#2a2520"
          opacity="0.7"
        >
          household finance
        </text>
      </g>

      <g>
        <rect
          x="230"
          y="120"
          width="140"
          height="50"
          rx="3"
          fill="#f4ede0"
          stroke="#1f3d2e"
          strokeWidth="0.8"
        />
        <text
          x="300"
          y="138"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="7"
          letterSpacing="2"
          fill="#b85a3e"
        >
          PILOT — FIRST CLIENT
        </text>
        <text
          x="300"
          y="154"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="14"
          fontWeight="500"
          fill="#1f3d2e"
        >
          Deer Lake
        </text>
        <text
          x="300"
          y="166"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="8"
          fontStyle="italic"
          fill="#2a2520"
          opacity="0.7"
        >
          inaugural engagement
        </text>
      </g>

      <g>
        <rect
          x="430"
          y="120"
          width="140"
          height="50"
          rx="3"
          fill="#f4ede0"
          stroke="#1f3d2e"
          strokeWidth="0.8"
          strokeDasharray="3 3"
          opacity="0.85"
        />
        <text
          x="500"
          y="138"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="7"
          letterSpacing="2"
          fill="#b85a3e"
        >
          NEXT CLIENTS
        </text>
        <text
          x="500"
          y="154"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="14"
          fontWeight="500"
          fill="#1f3d2e"
        >
          Future reserves
        </text>
        <text
          x="500"
          y="166"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="8"
          fontStyle="italic"
          fill="#2a2520"
          opacity="0.7"
        >
          pilot #2 onward
        </text>
      </g>
    </svg>
  );
}
