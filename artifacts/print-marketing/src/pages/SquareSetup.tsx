import { PrintNav } from "../components/PrintNav";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const INK = "#2b2116";

interface FieldProps {
  label: string;
  value: string;
  note?: string;
}

function Field({ label, value, note }: FieldProps) {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(31,61,46,0.1)",
        paddingBottom: "0.9rem",
        marginBottom: "0.9rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.62rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: MUTED,
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1rem",
          fontWeight: 600,
          color: EVERGREEN,
          marginBottom: note ? "0.2rem" : 0,
          lineHeight: 1.3,
        }}
      >
        {value}
      </p>
      {note && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.72rem",
            color: MUTED,
            lineHeight: 1.5,
          }}
        >
          {note}
        </p>
      )}
    </div>
  );
}

interface StepProps {
  n: string;
  title: string;
  body: string;
  sub?: string;
}

function Step({ n, title, body, sub }: StepProps) {
  return (
    <div style={{ display: "flex", gap: "0.9rem", marginBottom: "1.1rem" }}>
      <div
        style={{
          width: 28,
          height: 28,
          background: EVERGREEN,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.65rem",
            fontWeight: 700,
            color: CREAM,
          }}
        >
          {n}
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.92rem",
            fontWeight: 600,
            color: INK,
            marginBottom: "0.18rem",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            color: MUTED,
            lineHeight: 1.6,
          }}
        >
          {body}
        </p>
        {sub && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.72rem",
              color: RUST,
              marginTop: "0.25rem",
              lineHeight: 1.5,
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SquareSetup() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="headwaters-square-setup.pdf" />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{
          background: "#ece6db",
          padding: "2.5rem 1.5rem 4rem",
        }}
      >
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "0.3rem",
            }}
          >
            Headwaters · Square identity
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2rem",
              fontWeight: 700,
              color: EVERGREEN,
              marginBottom: "0.15rem",
            }}
          >
            Square — update from Parr's Jars to Headwaters
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              color: MUTED,
              marginBottom: "2.5rem",
              lineHeight: 1.6,
            }}
          >
            Copy-paste-ready text for every field in Square's business profile.
            Parr's Jars stays as a product line — the receipts, dashboard, and
            customer-facing name all move to Headwaters.
          </p>

          {/* Copy-paste fields */}
          <div
            style={{
              background: "white",
              borderRadius: 10,
              border: "1px solid rgba(31,61,46,0.13)",
              padding: "1.4rem 1.6rem 0.5rem",
              marginBottom: "2rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: RUST,
                marginBottom: "1.1rem",
              }}
            >
              Fields to update in Square → Account &amp; Settings → Business information
            </p>

            <Field
              label="Business name"
              value="Headwaters Development Services"
              note="This replaces 'Parr's Jars' as the top-level account name. Parr's Jars remains as a product category."
            />
            <Field
              label="Business description (Square profile)"
              value="Community tools, food systems, and operational software for northern communities. Northwestern Ontario."
              note="Keep it short — Square truncates long descriptions on receipts."
            />
            <Field
              label="Receipt header / footer name"
              value="Headwaters"
              note="Appears at the top of every digital and printed receipt."
            />
            <Field
              label="Receipt footer message"
              value="Thank you. Questions? bobbie@ourheadwaters.ca"
            />
            <Field
              label="Website field"
              value="ourheadwaters.ca"
            />
            <Field
              label="Support email"
              value="bobbie@ourheadwaters.ca"
            />
            <Field
              label="City / location"
              value="Dryden, Ontario"
            />
            <Field
              label="Profile photo / logo"
              value='Use the dark icon mark from the Logo Formats page — the "H" on evergreen, 64 × 64 px minimum.'
              note="Square accepts JPG or PNG. Export from the Logo Formats page at 300 dpi or use a 500×500 px export for best quality."
            />
          </div>

          {/* Step-by-step */}
          <div
            style={{
              background: "white",
              borderRadius: 10,
              border: "1px solid rgba(31,61,46,0.13)",
              padding: "1.4rem 1.6rem 1rem",
              marginBottom: "2rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: RUST,
                marginBottom: "1.1rem",
              }}
            >
              Step-by-step in Square
            </p>

            <Step
              n="1"
              title="Open Account & Settings"
              body='Sign in to Square Dashboard (squareup.com). Click your business name in the top-left corner → "Account & Settings".'
            />
            <Step
              n="2"
              title="Go to Business Information"
              body='Under the "Business" section, click "Business information". This is where the business name and description live.'
            />
            <Step
              n="3"
              title="Update the business name"
              body={`Change "Parr's Jars" (or whatever currently shows) to "Headwaters Development Services". Save.`}
              sub="Note: This changes the name on all future receipts and the customer-facing dashboard. It does not delete your sales history."
            />
            <Step
              n="4"
              title="Update description, website, email"
              body="Paste the fields from the section above. Save after each section if Square requires it."
            />
            <Step
              n="5"
              title="Update your profile photo"
              body='Go to "Account & Settings" → "Public profile" (or look for a profile photo upload on the business information page). Upload the dark "H" icon mark at 500×500 px.'
            />
            <Step
              n="6"
              title="Update receipt settings"
              body='Under "Account & Settings" → "Receipt" (or "Checkout"), update the receipt name to "Headwaters" and add the footer message.'
            />
            <Step
              n="7"
              title="Keep Parr's Jars as a category"
              body={`In your Square item library, if you have a "Parr's Jars" category for salts and preserves, leave it. The product category name does not need to change — only the top-level business identity.`}
            />
          </div>

          {/* What customers will see */}
          <div
            style={{
              background: EVERGREEN,
              borderRadius: 10,
              padding: "1.2rem 1.5rem",
              marginBottom: "2rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.55)",
                marginBottom: "0.8rem",
              }}
            >
              What customers will see after the update
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { label: "Receipt header", value: "Headwaters" },
                { label: "Receipt footer", value: "Thank you. Questions? bobbie@ourheadwaters.ca" },
                { label: "Google / email", value: "Headwaters Development Services" },
                { label: "Product names", value: "Unchanged — Smoked Salts, Maple Syrup, etc." },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(244,237,224,0.5)",
                      width: "6rem",
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.85rem",
                      color: CREAM,
                      lineHeight: 1.4,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "rgba(184,90,62,0.08)",
              border: `1px solid ${RUST}30`,
              borderRadius: 8,
              padding: "1rem 1.2rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: MUTED,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: RUST }}>Parr's Jars is still yours:</strong> changing the Square business name does not remove or rename any products, categories, or sales history. You are changing the entity name — the umbrella — not the product line underneath it.
          </div>
        </div>
      </div>
    </>
  );
}
