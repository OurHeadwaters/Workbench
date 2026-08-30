import { useState, type ChangeEvent, type FormEvent } from "react";
import { ApiError, postQuoteIntake, type QuoteIntakePayload } from "@/lib/api";

const BASE = import.meta.env.BASE_URL;

type FormState = QuoteIntakePayload;
type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  contactName: "",
  email: "",
  role: "",
  legalOrganizationName: "",
  organizationType: "co-op/not-for-profit",
  organizationAddress: "",
  projectTitle: "",
  fundingProgram: "",
  desiredTiming: "",
  selectedOffer: "initial implementation",
  projectDescription: "",
  desiredOutcome: "",
  intendedUsers: "",
  approximateScale: "",
  currentSystems: "",
  accessibilityConnectivityNeeds: "",
  integrationNeeded: "not sure",
  sensitiveDataInvolved: "not sure",
  specialRequirements: "",
  website: "",
};

const OFFERS = [
  {
    value: "initial implementation" as const,
    title: "Initial implementation",
    copy: "A grounded first system, configured with your people and ready to be handed off.",
  },
  {
    value: "additional standard tool" as const,
    title: "Additional standard tool",
    copy: "One more practical tool for a community that already has a working foundation.",
  },
  {
    value: "needs custom review" as const,
    title: "Needs custom review",
    copy: "For expanded, unusual, or still-forming work that deserves a human look first.",
  },
];

const REQUIRED_BY_STEP: Record<number, (keyof FormState)[]> = {
  1: ["contactName", "email", "legalOrganizationName", "organizationAddress"],
  2: ["projectTitle", "fundingProgram", "desiredTiming", "projectDescription", "desiredOutcome"],
};

function clean(value: string) {
  return value.trim();
}

function validateStep(step: number, form: FormState): FormErrors {
  const errors: FormErrors = {};
  REQUIRED_BY_STEP[step].forEach((key) => {
    if (!clean(String(form[key]))) errors[key] = "This helps us prepare a useful response.";
  });
  if (step === 1 && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter an email address we can reach.";
  }
  return errors;
}

function displayValue(value: string) {
  return value || "Not provided";
}

export function QuotePage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof postQuoteIntake>> | null>(null);

  const updateField = (key: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitError(null);
  };

  const nextStep = () => {
    const nextErrors = validateStep(step, form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(3, current + 1));
    window.setTimeout(() => {
      document.querySelector<HTMLElement>(".quote-form-card")?.focus();
    }, 0);
  };

  const previousStep = () => {
    setErrors({});
    setSubmitError(null);
    setStep((current) => Math.max(1, current - 1));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const allErrors = {
      ...validateStep(1, form),
      ...validateStep(2, form),
    };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setStep(Object.keys(validateStep(1, form)).length > 0 ? 1 : 2);
      return;
    }
    if (form.website) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await postQuoteIntake({
        ...form,
        contactName: clean(form.contactName),
        email: clean(form.email),
        role: clean(form.role),
        legalOrganizationName: clean(form.legalOrganizationName),
        organizationAddress: clean(form.organizationAddress),
        projectTitle: clean(form.projectTitle),
        fundingProgram: clean(form.fundingProgram),
        desiredTiming: clean(form.desiredTiming),
        projectDescription: clean(form.projectDescription),
        desiredOutcome: clean(form.desiredOutcome),
        intendedUsers: clean(form.intendedUsers),
        approximateScale: clean(form.approximateScale),
        currentSystems: clean(form.currentSystems),
        accessibilityConnectivityNeeds: clean(form.accessibilityConnectivityNeeds),
        specialRequirements: clean(form.specialRequirements),
      });
      setResult(response);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "We could not send this just now. Your work is still here — please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="quote-page">
      <div className="quote-shell">
        <header className="quote-intro">
          <a
            href={BASE}
            className="quote-mark"
            aria-label="Return to Headwaters"
            data-testid="quote-home-link"
          >
            Headwaters
          </a>
          <h1>Build Capacity That Survives Change.</h1>
          <p className="quote-lede">
            Operating systems that root knowledge, human authority and practical
            tools for where you live.
          </p>
          <p className="quote-invitation">
            <strong>The invitation</strong>
            Start where you are. Use what you have. We’ll do what we can.
          </p>
        </header>

        <section
          className="quote-form-card"
          aria-labelledby="quote-form-title"
          tabIndex={-1}
        >
          {result ? (
            <SuccessState result={result} />
          ) : (
            <>
              <div className="quote-form-top">
                <div>
                  <h2 id="quote-form-title">Let’s find the right first step.</h2>
                  <p>
                    A few particulars help us understand the ground you’re
                    standing on. No pitch deck required.
                  </p>
                </div>
                <div className="quote-progress" aria-label={`Step ${step} of 3`}>
                  <strong>0{step}</strong>
                  of 03
                </div>
              </div>

              <form onSubmit={submit} noValidate>
                <div className="quote-honeypot" aria-hidden="true">
                  <label htmlFor="quote-website">Website</label>
                  <input
                    id="quote-website"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    value={form.website}
                    onChange={updateField("website")}
                  />
                </div>

                {step === 1 && (
                  <div className="quote-step" key="step-one">
                    <p className="quote-section-label">Your organization</p>
                    <div className="quote-form-grid">
                      <Field
                        id="contactName"
                        label="Contact name"
                        required
                        value={form.contactName}
                        error={errors.contactName}
                        onChange={updateField("contactName")}
                        placeholder="The person we should speak with"
                        autoComplete="name"
                      />
                      <Field
                        id="email"
                        label="Email"
                        required
                        type="email"
                        value={form.email}
                        error={errors.email}
                        onChange={updateField("email")}
                        placeholder="name@organization.ca"
                        autoComplete="email"
                      />
                      <Field
                        id="role"
                        label="Role"
                        hint="Optional"
                        value={form.role}
                        onChange={updateField("role")}
                        placeholder="Your role in the work"
                        autoComplete="organization-title"
                      />
                      <Field
                        id="legalOrganizationName"
                        label="Legal organization name"
                        required
                        value={form.legalOrganizationName}
                        error={errors.legalOrganizationName}
                        onChange={updateField("legalOrganizationName")}
                        placeholder="As it appears on a grant application"
                        autoComplete="organization"
                      />
                      <div className="quote-field quote-field--full">
                        <label htmlFor="organizationType">Organization type</label>
                        <select
                          id="organizationType"
                          value={form.organizationType}
                          onChange={updateField("organizationType")}
                        >
                          <option value="co-op/not-for-profit">Co-op / not-for-profit</option>
                          <option value="community organization">Community organization</option>
                          <option value="commercial/institutional">Commercial / institutional</option>
                          <option value="other">Other</option>
                        </select>
                        <p className="quote-hint">
                          Eligibility is self-attested here and confirmed during scope review.
                        </p>
                      </div>
                      <Field
                        id="organizationAddress"
                        label="Organization address"
                        required
                        full
                        value={form.organizationAddress}
                        error={errors.organizationAddress}
                        onChange={updateField("organizationAddress")}
                        placeholder="Street, community, province, postal code"
                        autoComplete="street-address"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="quote-step" key="step-two">
                    <p className="quote-section-label">The work in front of you</p>
                    <div className="quote-form-grid">
                      <Field
                        id="projectTitle"
                        label="Project title"
                        required
                        full
                        value={form.projectTitle}
                        error={errors.projectTitle}
                        onChange={updateField("projectTitle")}
                        placeholder="A short name for this piece of work"
                      />
                      <Field
                        id="fundingProgram"
                        label="Funding program"
                        required
                        value={form.fundingProgram}
                        error={errors.fundingProgram}
                        onChange={updateField("fundingProgram")}
                        placeholder="Known, pending, or not yet chosen"
                      />
                      <Field
                        id="desiredTiming"
                        label="Desired timing"
                        required
                        value={form.desiredTiming}
                        error={errors.desiredTiming}
                        onChange={updateField("desiredTiming")}
                        placeholder="For example, fall 2025"
                      />
                      <div className="quote-field quote-field--full">
                        <label id="offer-label">What are you looking for?</label>
                        <div className="quote-options" role="radiogroup" aria-labelledby="offer-label">
                          {OFFERS.map((offer) => (
                            <label className="quote-option" key={offer.value}>
                              <input
                                type="radio"
                                name="selectedOffer"
                                value={offer.value}
                                checked={form.selectedOffer === offer.value}
                                onChange={updateField("selectedOffer")}
                              />
                              <span className="quote-option-body">
                                <span className="quote-option-dot" aria-hidden="true" />
                                <span>
                                  <span className="quote-option-title">{offer.title}</span>
                                  <span className="quote-option-copy">{offer.copy}</span>
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                        {form.selectedOffer === "needs custom review" && (
                          <p className="quote-review-note" role="status">
                            <strong>Custom review</strong>
                            This choice does not produce an automatic price. We’ll
                            read the full request and come back with a considered
                            scope before anything is committed.
                          </p>
                        )}
                      </div>
                      <Field
                        id="projectDescription"
                        label="Project description"
                        required
                        full
                        textarea
                        value={form.projectDescription}
                        error={errors.projectDescription}
                        onChange={updateField("projectDescription")}
                        placeholder="What are you trying to make easier, clearer, or more durable?"
                      />
                      <Field
                        id="desiredOutcome"
                        label="Desired outcome"
                        required
                        full
                        textarea
                        value={form.desiredOutcome}
                        error={errors.desiredOutcome}
                        onChange={updateField("desiredOutcome")}
                        placeholder="What should be working better when this first engagement is complete?"
                      />
                      <Field
                        id="intendedUsers"
                        label="Who would use this?"
                        hint="Optional"
                        value={form.intendedUsers}
                        onChange={updateField("intendedUsers")}
                        placeholder="Board, staff, volunteers, members, or other users"
                      />
                      <Field
                        id="approximateScale"
                        label="Approximate scale"
                        hint="Optional"
                        value={form.approximateScale}
                        onChange={updateField("approximateScale")}
                        placeholder="For example, 8 operators and 120 members"
                      />
                      <Field
                        id="currentSystems"
                        label="Current systems"
                        hint="Optional"
                        full
                        value={form.currentSystems}
                        onChange={updateField("currentSystems")}
                        placeholder="Spreadsheets, email, a portal, or other tools"
                      />
                      <Field
                        id="accessibilityConnectivityNeeds"
                        label="Accessibility or connectivity needs"
                        hint="Optional"
                        full
                        value={form.accessibilityConnectivityNeeds}
                        onChange={updateField("accessibilityConnectivityNeeds")}
                        placeholder="Low bandwidth, mobile access, language, or other needs"
                      />
                      <SelectField
                        id="integrationNeeded"
                        label="Will this need an integration?"
                        value={form.integrationNeeded}
                        onChange={updateField("integrationNeeded")}
                        options={[["no", "No"], ["yes", "Yes"], ["not sure", "Not sure"]]}
                      />
                      <SelectField
                        id="sensitiveDataInvolved"
                        label="Will sensitive data be involved?"
                        value={form.sensitiveDataInvolved}
                        onChange={updateField("sensitiveDataInvolved")}
                        options={[["no", "No"], ["yes", "Yes"], ["not sure", "Not sure"]]}
                      />
                      <Field
                        id="specialRequirements"
                        label="Special requirements or notes"
                        hint="Optional"
                        full
                        textarea
                        value={form.specialRequirements}
                        onChange={updateField("specialRequirements")}
                        placeholder="Anything else? Please do not include client, patient, resident, child, care, credential, or confidential records."
                      />
                    </div>
                    <p className="quote-privacy-note">
                      Keep this form at a high level. Do not submit names of care recipients,
                      patient or client details, child information, credentials, or confidential records.
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div className="quote-step" key="step-three">
                    <p className="quote-section-label">Read it back before sending</p>
                    <p className="quote-hint">
                      This is the information we’ll use to prepare your response.
                      You can go back and change anything.
                    </p>
                    <div className="quote-review">
                      <ReviewRow label="Contact" value={`${displayValue(form.contactName)} · ${displayValue(form.email)}`} />
                      <ReviewRow label="Organization" value={displayValue(form.legalOrganizationName)} />
                      <ReviewRow label="Type" value={form.organizationType} />
                      <ReviewRow label="Address" value={displayValue(form.organizationAddress)} />
                      <ReviewRow label="Project" value={displayValue(form.projectTitle)} />
                      <ReviewRow label="Funding" value={displayValue(form.fundingProgram)} />
                      <ReviewRow label="Timing" value={displayValue(form.desiredTiming)} />
                      <ReviewRow
                        label="Offer"
                        value={OFFERS.find((offer) => offer.value === form.selectedOffer)?.title ?? form.selectedOffer}
                      />
                      <ReviewRow label="Description" value={displayValue(form.projectDescription)} />
                      <ReviewRow label="Desired outcome" value={displayValue(form.desiredOutcome)} />
                      <ReviewRow label="Intended users" value={displayValue(form.intendedUsers)} />
                      <ReviewRow label="Scale" value={displayValue(form.approximateScale)} />
                      <ReviewRow label="Current systems" value={displayValue(form.currentSystems)} />
                      <ReviewRow label="Accessibility/connectivity" value={displayValue(form.accessibilityConnectivityNeeds)} />
                      <ReviewRow label="Integration" value={form.integrationNeeded} />
                      <ReviewRow label="Sensitive data" value={form.sensitiveDataInvolved} />
                      {form.specialRequirements && (
                        <ReviewRow label="Notes" value={form.specialRequirements} />
                      )}
                    </div>
                    {form.selectedOffer === "needs custom review" ? (
                      <p className="quote-review-note" role="status">
                        <strong>One clear acknowledgement</strong>
                        You’re asking for a custom review. Sending this request
                        starts a conversation; it does not accept a contract or
                        create a final quote.
                      </p>
                    ) : (
                      <p className="quote-hint" style={{ marginTop: "1.1rem" }}>
                        For standard work, Headwaters will prepare the applicable
                        starting quote for your organization type. It is a starting
                        point for conversation, not a promise of funding.
                      </p>
                    )}
                  </div>
                )}

                {submitError && (
                  <p className="quote-error" role="alert">
                    {submitError}
                  </p>
                )}

                <div className="quote-actions">
                  {step > 1 ? (
                    <button
                      type="button"
                      className="quote-button quote-button--quiet"
                      onClick={previousStep}
                      disabled={submitting}
                    >
                      Back
                    </button>
                  ) : (
                    <span className="quote-hint">Fields marked required help us start well.</span>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      className="quote-button quote-button--primary"
                      onClick={nextStep}
                    >
                      Continue <span aria-hidden="true">→</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="quote-button quote-button--primary"
                      disabled={submitting}
                      aria-busy={submitting}
                    >
                      {submitting ? "Sending your request…" : "Send this request"}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  full = false,
  textarea = false,
  type = "text",
  autoComplete,
}: {
  id: keyof FormState;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  full?: boolean;
  textarea?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className={`quote-field${full ? " quote-field--full" : ""}`}>
      <label htmlFor={id}>
        {label} {required ? <span aria-hidden="true">*</span> : <span>{hint ?? "Optional"}</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
          rows={4}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
          autoComplete={autoComplete}
        />
      )}
      {error && <p className="quote-hint" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: keyof FormState;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options: [string, string][];
}) {
  return (
    <div className="quote-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={onChange}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="quote-review-row">
      <div className="quote-review-key">{label}</div>
      <div className="quote-review-value">{value}</div>
    </div>
  );
}

function SuccessState({
  result,
}: {
  result: { ok: true; mode: "standard" | "custom"; quoteNumber?: string; pdfUrl?: string; name: string };
}) {
  const custom = result.mode === "custom";
  return (
    <div className="quote-success" data-testid="quote-success">
      <div>
        <div className="quote-success-mark" aria-hidden="true">OK</div>
        <h2>Received, {result.name}.</h2>
        {custom ? (
          <p>
            We have the shape of what you’re working toward. This one needs a
            human review, so we’ll follow up with a considered response rather
            than an automatic price.
          </p>
        ) : (
          <p>
            Your request is in. We’ll prepare the starting quote and send it to
            the email address you provided.
          </p>
        )}
        {result.quoteNumber && (
          <p className="quote-success-number">Reference {result.quoteNumber}</p>
        )}
        {result.pdfUrl && (
          <a className="quote-success-link" href={result.pdfUrl} target="_blank" rel="noreferrer">
            Open your quote <span aria-hidden="true">→</span>
          </a>
        )}
        <a className="quote-success-link" href={BASE}>Return to Headwaters</a>
      </div>
    </div>
  );
}

export default QuotePage;