import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import {
  ApiError,
  postQuoteIntake,
  type QuoteIntakePayload,
  type QuoteIntakeResult,
  type QuoteOrganizationType,
  type QuoteOffer,
} from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";
import { applyPageMetadata } from "@/lib/seo";

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

function selectedOfferFromUrl(): QuoteOffer {
  if (typeof window === "undefined") return "initial implementation";
  const value = new URLSearchParams(window.location.search).get("offer");
  if (
    value === "initial implementation" ||
    value === "additional standard tool" ||
    value === "needs custom review"
  ) {
    return value as QuoteOffer;
  }
  return "initial implementation";
}

const OFFERS = [
  {
    value: "needs custom review" as const,
    title: "CodeTry Build",
    copy: "For expanded, unusual, or still-forming work that deserves a human look first.",
  },
  {
    value: "initial implementation" as const,
    title: "Initial Tool",
    copy: "A grounded first system, configured with your people and ready to be handed off.",
  },
  {
    value: "additional standard tool" as const,
    title: "Add-on Tools",
    copy: "One more practical tool for a community that already has a working foundation.",
  },
];

function getOfferPricing(offer: string, orgType: string) {
  const isCommunity = orgType === "co-op/not-for-profit" || orgType === "community organization";
  if (offer === "initial implementation") {
    return isCommunity ? "Starting at $20,000 CAD" : "Starting at $28,000 CAD";
  }
  if (offer === "additional standard tool") {
    return isCommunity ? "Starting at $8,000 CAD" : "Starting at $12,000 CAD";
  }
  return "Priced after review";
}

const REQUIRED_BY_STEP: Record<number, (keyof FormState)[]> = {
  1: ["projectTitle", "projectDescription", "desiredOutcome"],
  2: ["desiredTiming", "fundingProgram", "organizationType"],
  3: [],
  4: ["selectedOffer"],
  5: ["contactName", "email", "legalOrganizationName", "organizationAddress"],
};

function clean(value: string) {
  return value.trim();
}

function validateStep(step: number, form: FormState): FormErrors {
  const errors: FormErrors = {};
  const req = REQUIRED_BY_STEP[step] || [];
  req.forEach((key) => {
    if (!clean(String(form[key]))) {
      errors[key] = "This helps us prepare a useful response.";
    }
  });
  if (step === 5 && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter an email address we can reach.";
  }
  return errors;
}

const motionProps = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

export function QuotePage() {
  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL_FORM,
    selectedOffer: selectedOfferFromUrl(),
  }));
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof postQuoteIntake>> | null>(null);

  useEffect(() => {
    const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
    return applyPageMetadata({
      title: "Request a budgetary quote | Headwaters",
      description:
        "Choose a Headwaters capacity-building path and request a budgetary, non-binding quote. Initial implementation starts at $20,000 CAD for eligible community work and $28,000 CAD for commercial work.",
      path: `${base}/quote`,
    });
  }, []);

  const updateField = (key: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    setStep((current) => Math.min(5, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previousStep = () => {
    setErrors({});
    setSubmitError(null);
    setStep((current) => Math.max(1, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    let firstErrorStep = -1;
    let allErrors = {};
    for (let s = 1; s <= 5; s++) {
      const errs = validateStep(s, form);
      if (Object.keys(errs).length > 0) {
        allErrors = { ...allErrors, ...errs };
        if (firstErrorStep === -1) firstErrorStep = s;
      }
    }

    if (firstErrorStep !== -1) {
      setErrors(allErrors);
      setStep(firstErrorStep);
      return;
    }

    if (form.website) return;

    submittingRef.current = true;
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
      const funnelData = {
        offer: form.selectedOffer,
        organization_type: form.organizationType,
        quote_mode: response.mode,
      } as const;
      trackEvent("quote_request_submitted", {
        offer: form.selectedOffer,
        mode: response.mode,
      });
      trackEvent("quote_intake_completed", funnelData);
      if (response.mode === "standard") {
        trackEvent("quote_generated", funnelData);
        trackEvent("funding_insert_generated", funnelData);
      } else {
        trackEvent("formal_review_requested", funnelData);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "We could not send this just now. Your work is still here — please try again.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#0F1C18] text-[#F7F7F5] font-sans selection:bg-[#D4A017] selection:text-[#17211C] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_top_right,rgba(47,62,53,0.4),transparent_50%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vh] bg-[radial-gradient(circle_at_bottom_left,rgba(212,160,23,0.05),transparent_60%)] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-6 lg:px-12 py-12 md:py-20 relative z-10 max-w-4xl flex flex-col min-h-[100dvh]">
        <header className="mb-16 md:mb-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] rounded-sm p-1 -ml-1">
            <img src={`${BASE}eagle-mark.svg`} alt="" aria-hidden="true" className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="font-sans font-semibold tracking-wider uppercase text-xs md:text-sm text-[#9CB3A8] group-hover:text-[#F7F7F5] transition-colors">Headwaters</span>
          </Link>

          {!result && (
            <div className="text-xs font-bold tracking-widest uppercase text-[#9CB3A8] flex items-center gap-2">
              Step <span className="text-[#D4A017]">0{step}</span> <span className="opacity-50">/ 05</span>
            </div>
          )}
        </header>

        <div className="flex-grow flex flex-col justify-center">
          {result ? (
            <SuccessState result={result} />
          ) : (
            <form onSubmit={submit} noValidate className="w-full">
              <div className="opacity-0 absolute -z-10 w-0 h-0 overflow-hidden" aria-hidden="true">
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

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" {...motionProps}>
                    <StepHeader title="Tell us what you're facing." subtitle="This is a private space. Let's get the situation out of your head and onto the table." />
                    <Field id="projectTitle" label="What are we calling this work?" required value={form.projectTitle} error={errors.projectTitle} onChange={updateField("projectTitle")} />
                    <Field id="projectDescription" label="What is the situation?" hint="The team, the capacity problem, ideas you already have." textarea required value={form.projectDescription} error={errors.projectDescription} onChange={updateField("projectDescription")} placeholder="Start typing..." />
                    <Field id="desiredOutcome" label="What does better look like?" hint="What you want to improve, and what you want for the future of the organization." textarea required value={form.desiredOutcome} error={errors.desiredOutcome} onChange={updateField("desiredOutcome")} placeholder="Start typing..." />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" {...motionProps}>
                    <StepHeader title="The landscape around the work." subtitle="Give us a sense of the scale and timing." />

                    <div className="grid md:grid-cols-2 gap-x-8">
                      <div className="md:col-span-2">
                        <ToggleGroup
                          label="What type of organization is this?"
                          required
                          options={[
                            { value: "co-op/not-for-profit", label: "Co-op / Not-for-profit" },
                            { value: "community organization", label: "Community organization" },
                            { value: "commercial/institutional", label: "Commercial / Institutional" },
                            { value: "other", label: "Other" }
                          ]}
                          value={form.organizationType}
                          onChange={(val) => setForm(f => ({ ...f, organizationType: val as QuoteOrganizationType }))}
                        />
                      </div>

                      <Field id="desiredTiming" label="When are you hoping to start or finish?" required value={form.desiredTiming} error={errors.desiredTiming} onChange={updateField("desiredTiming")} placeholder="e.g., Fall 2025" />
                      <Field id="fundingProgram" label="How is this being funded?" required value={form.fundingProgram} error={errors.fundingProgram} onChange={updateField("fundingProgram")} placeholder="Known, pending, or not yet chosen" />

                      <div className="md:col-span-2 mt-4 mb-8">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-[#9CB3A8] border-b border-[#2F3E35] pb-4">Context (Optional)</h3>
                      </div>

                      <Field id="intendedUsers" label="Who will use this?" hint="Board, staff, volunteers, etc." value={form.intendedUsers} onChange={updateField("intendedUsers")} placeholder="Optional" />
                      <Field id="approximateScale" label="How big is this?" hint="e.g., 8 operators and 120 members" value={form.approximateScale} onChange={updateField("approximateScale")} placeholder="Optional" />
                      <div className="md:col-span-2">
                        <Field id="currentSystems" label="What systems or tools are you using today?" value={form.currentSystems} onChange={updateField("currentSystems")} placeholder="Optional" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" {...motionProps}>
                    <StepHeader title="Technical & safety boundaries." subtitle="Every system has edges. Where are yours?" />

                    <div className="grid md:grid-cols-2 gap-x-8">
                      <ToggleGroup
                        label="Will this need to integrate with other systems?"
                        options={[ { value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "not sure", label: "Not sure" } ]}
                        value={form.integrationNeeded}
                        onChange={(val) => setForm(f => ({ ...f, integrationNeeded: val }))}
                      />
                      <ToggleGroup
                        label="Will sensitive data be involved?"
                        options={[ { value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "not sure", label: "Not sure" } ]}
                        value={form.sensitiveDataInvolved}
                        onChange={(val) => setForm(f => ({ ...f, sensitiveDataInvolved: val }))}
                      />

                      <div className="md:col-span-2">
                        <Field id="accessibilityConnectivityNeeds" label="Any specific accessibility or connectivity needs?" hint="Low bandwidth, mobile access, language, etc." value={form.accessibilityConnectivityNeeds} onChange={updateField("accessibilityConnectivityNeeds")} placeholder="Optional" />

                        <Field id="specialRequirements" label="Any other special requirements?" textarea value={form.specialRequirements} onChange={updateField("specialRequirements")} placeholder="Optional" />

                        <div className="bg-[#1B2621]/80 border border-[#2F3E35] p-5 rounded-2xl flex gap-4 mt-2 mb-10">
                          <div className="w-6 h-6 rounded-full bg-[#2F3E35] flex items-center justify-center shrink-0 text-[#9CB3A8] text-sm font-bold mt-0.5">!</div>
                          <p className="text-sm text-[#9CB3A8] leading-relaxed">
                            <strong className="text-[#F7F7F5] font-medium">Privacy note:</strong> Keep this form at a high level. Do not submit names of care recipients, patient or client details, child information, credentials, or confidential records.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" {...motionProps}>
                    <StepHeader title="Finding the right shape." subtitle="Let's match your work to the capacity you need." />

                    <div className="bg-[#1B2621]/40 border border-[#2F3E35] rounded-3xl p-8 md:p-10 mb-12">
                      <p className="text-[#9CB3A8] text-sm font-bold tracking-widest uppercase mb-6">Your intention</p>
                      <div className="font-serif text-2xl md:text-3xl text-[#F7F7F5] leading-relaxed italic border-l-2 border-[#D4A017] pl-6 md:pl-8 py-2 mb-6">
                        &ldquo;{form.desiredOutcome || "Find a better way forward."}&rdquo;
                      </div>
                      <p className="text-lg text-[#F7F7F5]/80 font-light">
                        For your work on <strong className="text-[#F7F7F5] font-medium">{form.projectTitle || "this project"}</strong>, here are three ways we can approach it.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {OFFERS.map((offer) => {
                        const isSelected = form.selectedOffer === offer.value;
                        const price = getOfferPricing(offer.value, form.organizationType);

                        return (
                          <label
                            key={offer.value}
                            className={`block w-full text-left p-6 md:p-8 rounded-2xl border transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-[#D4A017] group ${
                              isSelected
                                ? "bg-[#1B2621] border-[#D4A017] shadow-[0_0_30px_rgba(212,160,23,0.12)]"
                                : "bg-[#0F1C18] border-[#2F3E35] hover:border-[#9CB3A8] hover:bg-[#1B2621]/40"
                            }`}
                          >
                            <input
                              type="radio"
                              name="selectedOffer"
                              value={offer.value}
                              checked={isSelected}
                              onChange={(e) => {
                                const offer = e.target.value as QuoteOffer;
                                setForm(f => ({ ...f, selectedOffer: offer }));
                                trackEvent("consulting_offer_selected", {
                                  offer,
                                  location: "quote_form",
                                });
                                trackEvent("offer_selected", {
                                  offer,
                                  location: "quote_form",
                                });
                              }}
                              className="sr-only"
                            />
                            <div className="flex justify-between items-start mb-4">
                              <h3 className={`font-serif text-2xl md:text-3xl transition-colors ${
                                isSelected ? "text-[#D4A017]" : "text-[#F7F7F5] group-hover:text-[#D4A017]"
                              }`}>
                                {offer.title}
                              </h3>
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ml-4 mt-1 transition-colors ${
                                isSelected ? "border-[#D4A017]" : "border-[#2F3E35] group-hover:border-[#9CB3A8]"
                              }`}>
                                {isSelected && <div className="w-3 h-3 bg-[#D4A017] rounded-full" />}
                              </div>
                            </div>
                            <p className="text-[#9CB3A8] text-lg font-light leading-relaxed mb-6 max-w-2xl">{offer.copy}</p>
                            <div
                              className="inline-block bg-[#1B2621] border border-[#2F3E35] text-[#F7F7F5] text-sm font-medium px-4 py-2 rounded-full"
                              data-testid={isSelected ? "quote-selected-offer-price" : undefined}
                            >
                              {price}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="step5" {...motionProps}>
                    <StepHeader title="Where should we send this?" subtitle="A few details to prepare the conversation." />

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                      <div className="md:col-span-2">
                        <Field id="legalOrganizationName" label="Legal organization name" hint="As it appears on a grant application" required value={form.legalOrganizationName} error={errors.legalOrganizationName} onChange={updateField("legalOrganizationName")} />
                      </div>
                      <div className="md:col-span-2">
                        <Field id="organizationAddress" label="Organization address" hint="Street, community, province, postal code" required value={form.organizationAddress} error={errors.organizationAddress} onChange={updateField("organizationAddress")} />
                      </div>

                      <Field id="contactName" label="Your name" required value={form.contactName} error={errors.contactName} onChange={updateField("contactName")} />
                      <Field id="email" type="email" label="Your email" required value={form.email} error={errors.email} onChange={updateField("email")} placeholder="name@organization.ca" />

                      <div className="md:col-span-2">
                        <Field id="role" label="Your role" hint="Your title or relationship to the organization" value={form.role} onChange={updateField("role")} placeholder="Optional" />
                      </div>
                    </div>

                    {submitError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017]" role="alert">
                        {submitError}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-16 flex items-center gap-6 pb-20">
                {step > 1 ? (
                  <button type="button" onClick={previousStep} disabled={submitting} className="text-[#9CB3A8] hover:text-[#F7F7F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] rounded-sm p-2 -ml-2 flex items-center gap-2 text-sm font-bold tracking-widest uppercase disabled:opacity-50">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div className="text-sm text-[#9CB3A8]/50 font-light">Fields marked <span className="text-[#D4A017]">*</span> are required.</div>
                )}

                <div className="flex-grow" />

                {step < 5 ? (
                  <button key="continue" type="button" onClick={nextStep} className="bg-[#D4A017] text-[#17211C] px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#F7F7F5] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F7F5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C18] flex items-center gap-3">
                    Continue <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                ) : (
                  <button key="submit" type="submit" disabled={submitting} className="bg-[#D4A017] text-[#17211C] px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#F7F7F5] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F7F5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C18] flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                    {submitting ? "Sending..." : "Send Request"} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <h2 className="font-serif text-3xl md:text-5xl text-[#F7F7F5] mb-4 leading-tight">{title}</h2>
      <p className="text-lg md:text-xl text-[#9CB3A8] font-light max-w-2xl leading-relaxed">{subtitle}</p>
    </div>
  );
}

function AutoResizeTextarea(
  { error, labelId, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: boolean;
    labelId?: string;
  }
) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [props.value]);

  return (
    <textarea
      ref={ref}
      {...props}
      onChange={(e) => {
        resize();
        props.onChange?.(e);
      }}
      className={`w-full bg-transparent border-b ${
        error ? "border-[#D4A017]" : "border-[#2F3E35] focus:border-[#D4A017]"
      } outline-none py-3 text-lg md:text-xl text-[#F7F7F5] placeholder:text-[#F7F7F5]/20 transition-colors resize-none overflow-hidden`}
      rows={1}
      aria-invalid={error}
      aria-describedby={error ? `${labelId}-error` : undefined}
    />
  );
}

function CleanInput(
  { error, labelId, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean;
    labelId?: string;
  }
) {
  return (
    <input
      {...props}
      className={`w-full bg-transparent border-b ${
        error ? "border-[#D4A017]" : "border-[#2F3E35] focus:border-[#D4A017]"
      } outline-none py-3 text-lg md:text-xl text-[#F7F7F5] placeholder:text-[#F7F7F5]/20 transition-colors`}
      aria-invalid={error}
      aria-describedby={error ? `${labelId}-error` : undefined}
    />
  );
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  value,
  onChange,
  textarea,
  placeholder,
  type = "text",
}: {
  id: keyof FormState;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2 mb-10 group">
      <label htmlFor={id} className="text-sm font-bold tracking-widest uppercase text-[#9CB3A8] transition-colors group-focus-within:text-[#D4A017]">
        {label} {required && <span className="text-[#D4A017] ml-1" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="text-sm text-[#9CB3A8]/70 font-light mb-1">{hint}</p>}

      {textarea ? (
        <AutoResizeTextarea
          id={id}
          labelId={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={!!error}
          required={required}
        />
      ) : (
        <CleanInput
          id={id}
          labelId={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={!!error}
          required={required}
        />
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[#D4A017] mt-1"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

function ToggleGroup({
  label,
  options,
  value,
  onChange,
  hint,
  required
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 mb-10">
      <label className="text-sm font-bold tracking-widest uppercase text-[#9CB3A8]">
        {label} {required && <span className="text-[#D4A017] ml-1" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="text-sm text-[#9CB3A8]/70 font-light mb-2">{hint}</p>}
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C18] ${
                isSelected
                  ? "bg-[#D4A017] text-[#17211C] shadow-[0_0_15px_rgba(212,160,23,0.3)]"
                  : "bg-[#1B2621] text-[#9CB3A8] hover:bg-[#2F3E35] hover:text-[#F7F7F5] border border-[#2F3E35]"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SuccessState({
  result,
}: {
  result: QuoteIntakeResult;
}) {
  const custom = result.mode === "custom";
  return (
    <motion.div {...motionProps} className="flex flex-col items-center justify-center text-center py-12 md:py-24 max-w-2xl mx-auto" data-testid="quote-success">
      <div className="w-16 h-16 rounded-full bg-[#1B2621] border border-[#D4A017]/30 flex items-center justify-center mb-8">
        <Check className="w-8 h-8 text-[#D4A017]" />
      </div>

      <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">Received, {result.name}.</h2>

      {custom ? (
        <p className="text-xl text-[#9CB3A8] font-light leading-relaxed mb-12">
          We have the shape of what you’re working toward. This one needs a
          human review, so we’ll follow up with a considered response rather
          than an automatic price.
        </p>
      ) : (
        <p className="text-xl text-[#9CB3A8] font-light leading-relaxed mb-12">
          Your request is in. We’ll prepare the starting quote and send it to
          the email address you provided.
        </p>
      )}

      {result.quoteNumber && (
        <div className="bg-[#1B2621] border border-[#2F3E35] rounded-xl px-6 py-4 mb-8 flex items-center gap-4">
          <span className="text-sm font-bold tracking-widest uppercase text-[#9CB3A8]">Reference</span>
          <span className="font-mono text-[#D4A017] text-lg">{result.quoteNumber}</span>
        </div>
      )}

      {result.deliveryStatus && result.deliveryStatus !== "sent" && (
        <p className="text-base text-[#D4A017] leading-relaxed mb-8" role="status">
          <strong>Your request is saved.</strong>{" "}
          We could not complete every email delivery. Keep this reference, and
          {result.pdfUrl
            ? " download the quote below while we sort out the email."
            : " the Headwaters team can still review the request."}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {result.pdfUrl && (
          <a
            href={result.pdfUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              trackEvent("quote_downloaded", {
                location: "quote_success",
                quote_mode: result.mode,
              })
            }
            className="bg-[#D4A017] text-[#17211C] px-8 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#F7F7F5] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F7F5] flex items-center gap-3"
          >
            Open your quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        )}
        <Link href="/" className="text-[#9CB3A8] hover:text-[#F7F7F5] transition-colors font-bold tracking-widest uppercase text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] rounded-sm p-2">
          Return to Headwaters
        </Link>
      </div>
    </motion.div>
  );
}

export default QuotePage;
