import { Link } from "wouter";

export function PrivacyPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[42rem] px-6 sm:px-8 py-16 sm:py-24">
        <header className="space-y-4">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            headwaters
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            Privacy
          </h1>
          <p
            className="font-sans text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Last updated May 2026
          </p>
        </header>

        <div className="mt-12 space-y-10 font-sans text-base leading-relaxed">

          {/* --- intro --- */}
          <section>
            <p>
              This page explains what personal information Headwaters collects,
              why we collect it, who can see it, and how long we keep it. We've
              written it in plain language so you don't need a legal background
              to understand it.
            </p>
            <p className="mt-4">
              Headwaters is a small practice based in northern Ontario. We run a
              set of tools to support community food-systems work — a public
              sign-on list, a community intake form, a bookkeeping ledger, a
              research library, and a vocabulary tool. Each of these collects a
              small amount of information to do its job.
            </p>
          </section>

          <hr style={{ borderColor: "hsl(var(--card-border))" }} />

          {/* --- what we collect --- */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl tracking-tight">What we collect and why</h2>

            <div className="space-y-6">
              <div
                className="rounded-sm border p-5 space-y-2"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wide" style={{ color: "hsl(var(--accent))" }}>
                  Ship Manifest — sign-on list
                </h3>
                <p>
                  When you fill out the sign-on form at{" "}
                  <Link href="/sign-on" className="underline underline-offset-4 hover:opacity-80">
                    headwaters sign-on
                  </Link>
                  , we save your name and email so we can write back when there
                  is something concrete to share. Org, role, and the two open
                  questions are optional — they help us understand who's
                  interested. We also record your IP address and browser type
                  to limit automated spam submissions.
                </p>
              </div>

              <div
                className="rounded-sm border p-5 space-y-2"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wide" style={{ color: "hsl(var(--accent))" }}>
                  Community Intake form
                </h3>
                <p>
                  The intake form on the homepage asks for your name, email,
                  community, and what you need. We use this to understand who
                  is reaching out and to follow up directly. We also record your
                  IP address and browser type on submission to limit spam.
                </p>
              </div>

              <div
                className="rounded-sm border p-5 space-y-2"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wide" style={{ color: "hsl(var(--accent))" }}>
                  Subcontractor submissions
                </h3>
                <p>
                  Subcontractors log time and expenses through a
                  passphrase-protected form. We collect your name, project,
                  dates, hours, rates, and expense details to produce an
                  accurate record for billing and audit.
                </p>
              </div>

              <div
                className="rounded-sm border p-5 space-y-2"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wide" style={{ color: "hsl(var(--accent))" }}>
                  Library contributor registration
                </h3>
                <p>
                  The Northern Food Systems Research Library tracks the people
                  who contribute entries. Curators add contributors by name,
                  organization, and email. This information is used to send
                  share links and to credit contributors internally. Contributors
                  are added by library curators, not through a public sign-up
                  form.
                </p>
              </div>

              <div
                className="rounded-sm border p-5 space-y-2"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wide" style={{ color: "hsl(var(--accent))" }}>
                  Bookkeeper accounts
                </h3>
                <p>
                  People who use the Headwaters Books application sign in
                  through Clerk (an authentication service). We store your name,
                  email, and role. Food handlers can submit receipts; bookkeepers
                  and owners can post transactions. All actions are recorded in
                  an audit log visible to the account owner.
                </p>
              </div>

              <div
                className="rounded-sm border p-5 space-y-2"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wide" style={{ color: "hsl(var(--accent))" }}>
                  Wordpile accounts
                </h3>
                <p>
                  Wordpile is a vocabulary tool for practitioners. You sign in
                  through Clerk and your piles of words are stored against your
                  account. Only you can see your piles. If you create a share
                  link, anyone with that link can read the pile's contents until
                  you revoke the link.
                </p>
              </div>
            </div>
          </section>

          <hr style={{ borderColor: "hsl(var(--card-border))" }} />

          {/* --- third parties --- */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl tracking-tight">Who else sees your information</h2>
            <p>
              We use a small number of third-party services to run this project.
              Here is what each one receives:
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wide mt-0.5 shrink-0 w-24" style={{ color: "hsl(var(--accent))" }}>Clerk</span>
                <span>
                  Handles sign-in for Headwaters Books and Wordpile. Clerk
                  receives your email address when you create an account or sign
                  in. Clerk's privacy policy is at{" "}
                  <a
                    href="https://clerk.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:opacity-80"
                  >
                    clerk.com/privacy
                  </a>
                  .
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wide mt-0.5 shrink-0 w-24" style={{ color: "hsl(var(--accent))" }}>Resend</span>
                <span>
                  Sends confirmation emails to people who sign onto the manifest
                  or fill out the community intake form, and sends notification
                  emails to the operator. Resend receives the name and email
                  address needed to deliver that message. Resend's privacy
                  policy is at{" "}
                  <a
                    href="https://resend.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:opacity-80"
                  >
                    resend.com/privacy
                  </a>
                  .
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wide mt-0.5 shrink-0 w-24" style={{ color: "hsl(var(--accent))" }}>Google Cloud Storage</span>
                <span>
                  Stores receipt images uploaded by food handlers in Headwaters
                  Books, and file uploads in the Research Library. Files are
                  stored under an opaque reference and are not publicly
                  accessible. Google's privacy policy is at{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:opacity-80"
                  >
                    policies.google.com/privacy
                  </a>
                  .
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wide mt-0.5 shrink-0 w-24" style={{ color: "hsl(var(--accent))" }}>Anthropic</span>
                <span>
                  Powers AI-assisted features in this project. Text you submit
                  to those features is sent to Anthropic's API. We recommend
                  not including sensitive personal information in AI prompts.
                  Anthropic's privacy policy is at{" "}
                  <a
                    href="https://www.anthropic.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:opacity-80"
                  >
                    anthropic.com/privacy
                  </a>
                  .
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wide mt-0.5 shrink-0 w-24" style={{ color: "hsl(var(--accent))" }}>Replit</span>
                <span>
                  The application is hosted on Replit's platform. All data
                  passes through and is stored on Replit's infrastructure, with
                  servers in the United States and Canada. Replit's privacy
                  policy is at{" "}
                  <a
                    href="https://replit.com/site/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:opacity-80"
                  >
                    replit.com/site/privacy
                  </a>
                  .
                </span>
              </li>
            </ul>
            <p className="mt-4">
              We do not sell your information. We do not share it with anyone
              else for marketing purposes.
            </p>
          </section>

          <hr style={{ borderColor: "hsl(var(--card-border))" }} />

          {/* --- IP / user-agent --- */}
          <section className="space-y-3">
            <h2 className="font-serif text-2xl tracking-tight">IP address and browser type</h2>
            <p>
              When you submit a public form (the sign-on list or the community
              intake form), we record the IP address and browser type of the
              request. We use this information only to limit automated spam
              submissions. It is not used for tracking, advertising, or shared
              with any analytics service.
            </p>
          </section>

          <hr style={{ borderColor: "hsl(var(--card-border))" }} />

          {/* --- cookies --- */}
          <section className="space-y-3">
            <h2 className="font-serif text-2xl tracking-tight">Cookies and tracking</h2>
            <p>
              We do not set advertising or analytics cookies. Authenticated
              parts of the application (Headwaters Books, Wordpile, the
              Research Library) use session tokens stored in your browser to
              keep you signed in. These are necessary for the applications to
              function and are not used for tracking.
            </p>
          </section>

          <hr style={{ borderColor: "hsl(var(--card-border))" }} />

          {/* --- retention --- */}
          <section className="space-y-3">
            <h2 className="font-serif text-2xl tracking-tight">How long we keep your information</h2>
            <p>
              Sign-on and community intake submissions are kept until the
              operator manually deletes them. Financial records (bookkeeper
              transactions, submissions, audit log) are kept for seven years to
              meet Canada Revenue Agency requirements. Wordpile piles are kept
              until you delete them or your account is removed. Share links are
              kept until you revoke them.
            </p>
          </section>

          <hr style={{ borderColor: "hsl(var(--card-border))" }} />

          {/* --- deletion --- */}
          <section className="space-y-3">
            <h2 className="font-serif text-2xl tracking-tight">Asking us to delete your data</h2>
            <p>
              If you want your information removed from any part of this project,
              email us at{" "}
              <a
                href="mailto:bobbie@ourheadwaters.ca"
                className="underline underline-offset-4 hover:opacity-80"
              >
                bobbie@ourheadwaters.ca
              </a>{" "}
              and describe what you'd like deleted. We will carry out the deletion
              manually and confirm it within 30 days. There is no automated
              deletion portal at this time.
            </p>
          </section>

          <hr style={{ borderColor: "hsl(var(--card-border))" }} />

          {/* --- contact --- */}
          <section className="space-y-3">
            <h2 className="font-serif text-2xl tracking-tight">Questions</h2>
            <p>
              If you have questions about how your information is handled, write
              to us at{" "}
              <a
                href="mailto:bobbie@ourheadwaters.ca"
                className="underline underline-offset-4 hover:opacity-80"
              >
                bobbie@ourheadwaters.ca
              </a>
              .
            </p>
          </section>
        </div>

        {/* footer */}
        <footer
          className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">headwaters · {new Date().getFullYear()}</p>
          <Link
            href="/sign-on"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            ← back to sign-on
          </Link>
        </footer>
      </div>
    </main>
  );
}
