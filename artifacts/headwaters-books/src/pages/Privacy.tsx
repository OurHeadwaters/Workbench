export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <a
            href="/headwaters-books/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            ← Back
          </a>
        </div>

        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated May 2026</p>

        <div className="space-y-8 text-base leading-relaxed">

          <p className="text-foreground">
            This page explains what personal information Headwaters collects,
            why we collect it, who can see it, and how long we keep it.
          </p>

          <hr className="border-border" />

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">What we collect and why</h2>
            <div className="space-y-4">
              {[
                {
                  label: "Ship Manifest — sign-on list",
                  text: "When you fill out the public sign-on form, we save your name and email so we can write back when there is something concrete to share. We also record your IP address and browser type to limit automated spam submissions.",
                },
                {
                  label: "Community Intake form",
                  text: "The community intake form asks for your name, email, community, and what you need. We also record your IP address and browser type on submission to limit spam.",
                },
                {
                  label: "Subcontractor submissions",
                  text: "Subcontractors log time and expenses through a passphrase-protected form. We collect name, project, dates, hours, rates, and expense details for billing and audit.",
                },
                {
                  label: "Library contributor registration",
                  text: "The Research Library tracks people who contribute entries by name, organization, and email. This is used to send share links and credit contributors internally.",
                },
                {
                  label: "Bookkeeper and Wordpile accounts",
                  text: "Users of Headwaters Books and Wordpile sign in through Clerk. We store your name, email, and role. All bookkeeper actions are recorded in an audit log visible to the account owner.",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card p-5 space-y-1.5">
                  <h3 className="font-medium text-sm uppercase tracking-wide text-primary">{item.label}</h3>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-border" />

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Third-party services</h2>
            <ul className="space-y-3">
              {[
                { name: "Clerk", desc: "Authentication for Headwaters Books and Wordpile. Receives your email on sign-in." },
                { name: "Resend", desc: "Sends confirmation and notification emails. Receives name and email to deliver the message." },
                { name: "Google Cloud Storage", desc: "Stores receipt images and library file uploads under opaque, non-public references." },
                { name: "Anthropic", desc: "Powers AI-assisted features. Text you submit is sent to Anthropic's API." },
                { name: "Replit", desc: "Application hosting. Servers in the United States and Canada." },
              ].map((p) => (
                <li key={p.name} className="flex gap-3 text-sm">
                  <span className="font-medium w-36 shrink-0 text-foreground">{p.name}</span>
                  <span className="text-muted-foreground">{p.desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm">We do not sell your information or share it for marketing purposes.</p>
          </section>

          <hr className="border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-foreground">IP address and browser type</h2>
            <p className="text-muted-foreground">
              Public form submissions (sign-on, intake) record your IP address and browser type
              to limit spam. Not used for tracking, advertising, or analytics.
            </p>
          </section>

          <hr className="border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Retention</h2>
            <p className="text-muted-foreground">
              Sign-on and intake submissions are kept until manually deleted. Financial records
              are kept for seven years (CRA requirement). Wordpile data is kept until you delete
              it or your account is removed.
            </p>
          </section>

          <hr className="border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Data deletion requests</h2>
            <p className="text-muted-foreground">
              Email{" "}
              <a href="mailto:bobbie@ourheadwaters.ca" className="underline underline-offset-2 hover:text-foreground transition-colors">
                bobbie@ourheadwaters.ca
              </a>{" "}
              to request deletion. We'll confirm within 30 days.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-xs text-muted-foreground">
          Headwaters Food Systems Agency · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
