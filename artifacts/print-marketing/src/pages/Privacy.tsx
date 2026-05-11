export default function Privacy() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream, #f8f4ed)", fontFamily: "var(--font-sans, sans-serif)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "4rem 1.5rem 3rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <a
            href="/print-marketing/"
            style={{ fontSize: "0.85rem", color: "var(--muted, #666)", textDecoration: "underline", textUnderlineOffset: 2 }}
          >
            ← Back to marketing suite
          </a>
        </div>

        <h1 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--ink, #1a1a1a)", marginBottom: "0.5rem" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--muted, #888)", marginBottom: "3rem" }}>Last updated May 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--ink, #1a1a1a)", lineHeight: 1.7 }}>

          <p>
            This page explains what personal information Headwaters collects, why we collect it,
            who can see it, and how long we keep it. Written in plain language.
          </p>

          <hr style={{ borderColor: "rgba(31,61,46,0.15)" }} />

          <section>
            <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>What we collect and why</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Ship Manifest — sign-on list", text: "Name and email to write back when there's something to share. IP address and browser type recorded to limit spam." },
                { label: "Community Intake form", text: "Name, email, community, and what you need — to understand who's reaching out. IP address and browser type recorded on submission." },
                { label: "Subcontractor submissions", text: "Name, project, dates, hours, rates, and expense details for billing and audit. Passphrase-protected form." },
                { label: "Library contributor registration", text: "Name, organization, and email of people who contribute to the Research Library. Added by curators, not a public form." },
                { label: "Bookkeeper and Wordpile accounts", text: "Name, email, and role via Clerk authentication. Bookkeeper actions are logged in an immutable audit trail." },
              ].map((item) => (
                <div key={item.label} style={{ border: "1px solid rgba(31,61,46,0.14)", borderRadius: 6, padding: "1rem 1.25rem", background: "white" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--evergreen, #1f3d2e)", marginBottom: "0.4rem" }}>{item.label}</p>
                  <p style={{ fontSize: "0.9rem", color: "var(--muted, #555)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <hr style={{ borderColor: "rgba(31,61,46,0.15)" }} />

          <section>
            <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>Third-party services</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
              {[
                { name: "Clerk", desc: "Authentication for Headwaters Books and Wordpile." },
                { name: "Resend", desc: "Sends confirmation and notification emails." },
                { name: "Google Cloud Storage", desc: "Stores receipt images and library file uploads." },
                { name: "Anthropic", desc: "Powers AI-assisted features." },
                { name: "Replit", desc: "Application hosting — servers in the US and Canada." },
              ].map((p) => (
                <div key={p.name} style={{ display: "flex", gap: "1rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--evergreen, #1f3d2e)", minWidth: 160 }}>{p.name}</span>
                  <span style={{ color: "var(--muted, #555)" }}>{p.desc}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--muted, #555)" }}>We do not sell your information or share it for marketing.</p>
          </section>

          <hr style={{ borderColor: "rgba(31,61,46,0.15)" }} />

          <section>
            <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>IP address and browser type</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--muted, #555)" }}>
              Public form submissions record your IP address and browser type to limit spam only —
              not used for tracking, advertising, or analytics.
            </p>
          </section>

          <hr style={{ borderColor: "rgba(31,61,46,0.15)" }} />

          <section>
            <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>Retention</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--muted, #555)" }}>
              Sign-on and intake submissions are kept until manually deleted. Financial records are kept for
              seven years (CRA requirement). Wordpile data is kept until deleted by the user.
            </p>
          </section>

          <hr style={{ borderColor: "rgba(31,61,46,0.15)" }} />

          <section>
            <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>Data deletion requests</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--muted, #555)" }}>
              Email{" "}
              <a href="mailto:bobbie@ourheadwaters.ca" style={{ color: "var(--evergreen, #1f3d2e)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                bobbie@ourheadwaters.ca
              </a>{" "}
              to request deletion. We'll confirm within 30 days.
            </p>
          </section>

          <div style={{ paddingTop: "2rem", borderTop: "1px solid rgba(31,61,46,0.15)", fontSize: "0.8rem", color: "var(--muted, #888)" }}>
            Headwaters Development Services · {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
