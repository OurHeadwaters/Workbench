export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <a
            href="/library/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            ← Back to library
          </a>
        </div>

        <h1 className="font-serif text-4xl font-bold text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated May 2026</p>

        <div className="space-y-8 text-base leading-relaxed text-foreground">

          <p>
            This page explains what personal information Headwaters collects,
            why we collect it, who can see it, and how long we keep it. We've
            written it in plain language so you don't need a legal background
            to understand it.
          </p>

          <hr className="border-border" />

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-primary">What we collect and why</h2>

            <div className="space-y-4">
              {[
                {
                  label: "Ship Manifest — sign-on list",
                  text: "When you fill out the public sign-on form, we save your name and email so we can write back when there is something concrete to share. Org, role, and the two open questions are optional. We also record your IP address and browser type to limit automated spam submissions.",
                },
                {
                  label: "Community Intake form",
                  text: "The community intake form asks for your name, email, community, and what you need. We use this to understand who is reaching out and to follow up directly. We also record your IP address and browser type on submission to limit spam.",
                },
                {
                  label: "Subcontractor submissions",
                  text: "Subcontractors log time and expenses through a passphrase-protected form. We collect name, project, dates, hours, rates, and expense details to produce an accurate record for billing and audit.",
                },
                {
                  label: "Library contributor registration",
                  text: "The Northern Food Systems Research Library tracks the people who contribute entries. Curators add contributors by name, organization, and email. This information is used to send share links and to credit contributors internally. Contributors are added by library curators, not through a public sign-up form.",
                },
                {
                  label: "Bookkeeper accounts",
                  text: "People who use the Headwaters Books application sign in through Clerk. We store your name, email, and role. All actions are recorded in an audit log visible to the account owner.",
                },
                {
                  label: "Wordpile accounts",
                  text: "Wordpile is a vocabulary tool for practitioners. You sign in through Clerk and your piles of words are stored against your account. Only you can see your piles unless you create a share link.",
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
            <h2 className="font-serif text-2xl font-semibold text-primary">Who else sees your information</h2>
            <p className="text-muted-foreground">We use a small number of third-party services:</p>
            <ul className="space-y-3">
              {[
                { name: "Clerk", desc: "Handles sign-in for Headwaters Books and Wordpile. Receives your email on account creation. clerk.com/privacy" },
                { name: "Resend", desc: "Sends confirmation and notification emails. Receives name and email needed to deliver the message. resend.com/privacy" },
                { name: "Google Cloud Storage", desc: "Stores receipt images and library file uploads. Files stored under an opaque reference, not publicly accessible. policies.google.com/privacy" },
                { name: "Anthropic", desc: "Powers AI-assisted features. Text submitted to those features is sent to Anthropic's API. anthropic.com/privacy" },
                { name: "Replit", desc: "Application hosting platform. All data passes through Replit's infrastructure, with servers in the United States and Canada. replit.com/site/privacy" },
              ].map((p) => (
                <li key={p.name} className="flex gap-3">
                  <span className="font-medium text-sm w-40 shrink-0 text-primary">{p.name}</span>
                  <span className="text-muted-foreground text-sm">{p.desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground">
              We do not sell your information or share it for marketing purposes.
            </p>
          </section>

          <hr className="border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-primary">IP address and browser type</h2>
            <p className="text-muted-foreground">
              When you submit a public form (the sign-on list or the community intake form), we
              record your IP address and browser type. This is used only to limit automated spam
              submissions — not for tracking, advertising, or analytics.
            </p>
          </section>

          <hr className="border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-primary">Cookies and tracking</h2>
            <p className="text-muted-foreground">
              We do not set advertising or analytics cookies. Authenticated parts of the application
              use session tokens stored in your browser to keep you signed in. These are necessary
              for the applications to function and are not used for tracking.
            </p>
          </section>

          <hr className="border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-primary">How long we keep your information</h2>
            <p className="text-muted-foreground">
              Sign-on and community intake submissions are kept until the operator manually deletes
              them. Financial records are kept for seven years to meet Canada Revenue Agency
              requirements. Wordpile piles are kept until you delete them or your account is removed.
              Share links are kept until you revoke them.
            </p>
          </section>

          <hr className="border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-primary">Asking us to delete your data</h2>
            <p className="text-muted-foreground">
              If you want your information removed, email{" "}
              <a href="mailto:bobbie@ourheadwaters.ca" className="underline underline-offset-2 hover:text-foreground transition-colors">
                bobbie@ourheadwaters.ca
              </a>
              . We will carry out the deletion manually and confirm it within 30 days.
            </p>
          </section>

          <hr className="border-border" />

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-primary">Questions</h2>
            <p className="text-muted-foreground">
              Questions about how your information is handled?{" "}
              <a href="mailto:bobbie@ourheadwaters.ca" className="underline underline-offset-2 hover:text-foreground transition-colors">
                bobbie@ourheadwaters.ca
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-xs text-muted-foreground">
          Headwaters · Northern Food Systems Research Library · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
