export function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-4 space-y-8 text-base leading-relaxed">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-1">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated May 2026</p>
      </div>

      <p className="text-foreground">
        This page explains what personal information Headwaters collects, why we collect it,
        who can see it, and how long we keep it. Written in plain language — no legal background
        required.
      </p>

      <hr className="border-border" />

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-foreground">What we collect and why</h2>
        <div className="space-y-4">
          {[
            {
              label: "Ship Manifest — sign-on list",
              text: "Public sign-on form: name and email to write back when there's something to share. IP address and browser type recorded to limit spam.",
            },
            {
              label: "Community Intake form",
              text: "Name, email, community, and what you need — to understand who's reaching out and follow up. IP address and browser type recorded on submission.",
            },
            {
              label: "Subcontractor submissions",
              text: "Name, project, dates, hours, rates, and expenses — passphrase-protected, for billing and audit records.",
            },
            {
              label: "Library contributor registration",
              text: "Name, organization, and email of people who contribute to the Research Library. Added by curators, not a public form.",
            },
            {
              label: "Bookkeeper and Wordpile accounts",
              text: "Name, email, and role via Clerk authentication. Bookkeeper actions are logged in an immutable audit trail.",
            },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-card p-4 space-y-1">
              <h3 className="font-semibold text-sm text-primary">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-foreground">Third-party services</h2>
        <ul className="space-y-3">
          {[
            { name: "Clerk", desc: "Authentication for Headwaters Books and Wordpile." },
            { name: "Resend", desc: "Sends confirmation and notification emails." },
            { name: "Google Cloud Storage", desc: "Stores receipt images and library file uploads." },
            { name: "Anthropic", desc: "Powers AI-assisted features in this project." },
            { name: "Replit", desc: "Application hosting — servers in the US and Canada." },
          ].map((p) => (
            <li key={p.name} className="flex gap-3 text-sm">
              <span className="font-medium w-40 shrink-0 text-foreground">{p.name}</span>
              <span className="text-muted-foreground">{p.desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">We do not sell your information or share it for marketing.</p>
      </section>

      <hr className="border-border" />

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold text-foreground">IP address and browser type</h2>
        <p className="text-sm text-muted-foreground">
          Public form submissions record IP address and browser type to limit spam only —
          not used for tracking or analytics.
        </p>
      </section>

      <hr className="border-border" />

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold text-foreground">Retention</h2>
        <p className="text-sm text-muted-foreground">
          Sign-on and intake submissions are kept until manually deleted. Financial records are kept
          for seven years (CRA requirement). Wordpile data is kept until deleted by the user or when
          their account is removed.
        </p>
      </section>

      <hr className="border-border" />

      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold text-foreground">Data deletion requests</h2>
        <p className="text-sm text-muted-foreground">
          Email{" "}
          <a
            href="mailto:bobbie@ourheadwaters.ca"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            bobbie@ourheadwaters.ca
          </a>{" "}
          to request deletion of your data. We'll confirm within 30 days.
        </p>
      </section>

      <div className="pt-8 border-t border-border text-xs text-muted-foreground">
        Headwaters · Practitioner's Guide · {new Date().getFullYear()}
      </div>
    </div>
  );
}
