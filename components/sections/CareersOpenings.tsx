"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  Headphones,
  LayoutPanelTop,
  MapPin,
  Megaphone,
  Send,
  TrendingUp,
  Upload,
} from "lucide-react";
import { FormDropdown } from "@/components/ui/FormDropdown";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

type RoleMeta = {
  title: string;
  description: string;
  icon: typeof Briefcase;
};

const ROLE_META: Record<string, RoleMeta> = {
  "Digital Marketing": {
    title: "Digital Marketing",
    description: "Shape campaigns, content and growth for travel businesses.",
    icon: Megaphone,
  },
  "Business Development": {
    title: "Business Development",
    description: "Build relationships and bring Flysync to more travel teams.",
    icon: TrendingUp,
  },
  "UI/UX Design": {
    title: "UI/UX Design",
    description: "Design clear, thoughtful experiences for complex travel work.",
    icon: LayoutPanelTop,
  },
  "Software Development": {
    title: "Software Development",
    description: "Build reliable tools that power modern travel operations.",
    icon: Code2,
  },
  "Customer Success": {
    title: "Customer Success",
    description: "Help customers adopt Flysync and achieve more with it.",
    icon: Briefcase,
  },
  "Technical Support": {
    title: "Technical Support",
    description: "Solve product questions with empathy, clarity and care.",
    icon: Headphones,
  },
};

const inputClass =
  "career-input form-field field-ring px-3 py-2.5 text-sm";
const labelClass = "career-label form-label text-xs";

type CareerSelectName =
  | "graduationYear"
  | "gender"
  | "experienceYears"
  | "currentCtc"
  | "expectedCtc"
  | "noticePeriod"
  | "preferredLocation"
  | "source";

type CareerSelectState = Record<CareerSelectName, string>;

const initialCareerSelects: CareerSelectState = {
  graduationYear: "",
  gender: "",
  experienceYears: "",
  currentCtc: "",
  expectedCtc: "",
  noticePeriod: "",
  preferredLocation: "",
  source: "",
};

const graduationYears = Array.from({ length: 16 }, (_, index) =>
  String(2026 - index),
);

const genderOptions = ["Prefer not to say", "Female", "Male", "Non-binary"];
const experienceOptions = [
  "Fresher",
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "6+ years",
];
const ctcOptions = [
  "Not applicable",
  "0-3 LPA",
  "3-6 LPA",
  "6-10 LPA",
  "10+ LPA",
];
const noticePeriodOptions = [
  "Immediate",
  "15 days",
  "30 days",
  "60 days",
  "90 days",
];
const preferredLocationOptions = [
  "Chennai, Tamil Nadu",
  "Remote / Hybrid",
  "Open to relocate",
];
const sourceOptions = [
  "Flysync careers page",
  "LinkedIn",
  "Employee referral",
  "Job board",
  "Social media",
  "Other",
];

const requiredCareerSelects: Array<{
  name: CareerSelectName;
  controlId: string;
  message: string;
}> = [
  {
    name: "graduationYear",
    controlId: "career-graduation-year",
    message: "Select year.",
  },
  {
    name: "gender",
    controlId: "career-gender",
    message: "Select gender.",
  },
  {
    name: "experienceYears",
    controlId: "career-experience-years",
    message: "Select experience.",
  },
  {
    name: "noticePeriod",
    controlId: "career-notice-period",
    message: "Select notice period.",
  },
  {
    name: "preferredLocation",
    controlId: "career-preferred-location",
    message: "Select preferred location.",
  },
  {
    name: "source",
    controlId: "career-source",
    message: "Select source.",
  },
];

export function CareersOpenings({
  roles,
  email,
  note,
}: {
  roles: string[];
  email: string;
  note: string;
}) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [careerSelects, setCareerSelects] =
    useState<CareerSelectState>(initialCareerSelects);
  const [careerSelectErrors, setCareerSelectErrors] = useState<
    Partial<Record<CareerSelectName, string>>
  >({});
  const selected = selectedRole ? ROLE_META[selectedRole] : null;
  const selectedRoleTint =
    selectedRole && roles.includes(selectedRole) ? roles.indexOf(selectedRole) % 6 : 0;

  const scrollToOpenings = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById("openings")?.scrollIntoView({ block: "start" });
      });
    });
  };

  const updateCareerSelect = (name: CareerSelectName, value: string) => {
    setCareerSelects((current) => ({ ...current, [name]: value }));
    setCareerSelectErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRole) return;

    const missing = requiredCareerSelects.filter(
      ({ name }) => !careerSelects[name],
    );

    if (missing.length > 0) {
      setCareerSelectErrors(
        Object.fromEntries(
          missing.map(({ name, message }) => [name, message]),
        ) as Partial<Record<CareerSelectName, string>>,
      );
      document.getElementById(missing[0].controlId)?.focus();
      return;
    }

    const data = new FormData(event.currentTarget);
    const resume = data.get("resume") as File | null;
    const body = [
      `Role: ${selectedRole}`,
      `First name: ${data.get("firstName")}`,
      `Last name: ${data.get("lastName")}`,
      `Email: ${data.get("email")}`,
      `Contact: ${data.get("contact")}`,
      `Year of graduation: ${data.get("graduationYear")}`,
      `Gender: ${data.get("gender")}`,
      `Experience in years: ${data.get("experienceYears")}`,
      `Current employer: ${data.get("currentEmployer") || "Not provided"}`,
      `Current CTC: ${data.get("currentCtc") || "Not provided"}`,
      `Expected CTC: ${data.get("expectedCtc") || "Not provided"}`,
      `Notice period: ${data.get("noticePeriod")}`,
      `Skill set: ${data.get("skillSet")}`,
      `How they came across this vacancy: ${data.get("source")}`,
      `Current location: ${data.get("currentLocation")}`,
      `Preferred location: ${data.get("preferredLocation")}`,
      `Resume selected: ${resume?.name || "Not provided"}`,
      "",
      "Please attach the selected resume before sending this email.",
    ].join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      `Application - ${selectedRole}`,
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <section id="openings" className="career-openings-section relative">
      <div className="container-page">
        {!selectedRole ? (
          <>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Open opportunities</p>
              <h2 className="mt-5 text-[length:var(--text-h2)] font-bold leading-[1.04] tracking-[-0.028em] text-fg">
                Find the role where you can make an impact
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-[0.9375rem] leading-[1.65] text-fg-muted sm:text-base">
                Explore our current teams, then share a few details so we can start the right conversation.
              </p>
            </div>

            <StaggerGroup className="is-in mt-[var(--heading-gap)] grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role, index) => {
                const meta = ROLE_META[role] ?? {
                  title: role,
                  description: "Bring your perspective to the Flysync team.",
                  icon: Briefcase,
                };
                const RoleIcon = meta.icon;

                return (
                  <StaggerItem key={role} index={index}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole(role);
                        setSubmitted(false);
                        setCareerSelects(initialCareerSelects);
                        setCareerSelectErrors({});
                      }}
                      className={`career-role-card career-role-card--${index % 6} surface card-hover group relative flex h-full min-h-64 w-full flex-col p-6 text-left`}
                    >
                      <span className="flex items-center justify-between gap-4">
                        <span className="career-icon-shape grid h-10 w-10 place-items-center rounded-control border">
                          <RoleIcon className="h-5 w-5" strokeWidth={1.9} />
                        </span>
                        <span className="career-role-status">Open position</span>
                      </span>
                      <span className="mt-7 text-lg font-semibold tracking-[-0.02em] text-fg">
                        {meta.title}
                      </span>
                      <span className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">
                        {meta.description}
                      </span>
                      <span className="career-role-footer mt-auto flex items-center justify-between gap-3 border-t border-[#e1e5e8] pt-4">
                        <span className="flex items-center gap-2 text-[0.8125rem] font-medium text-fg-muted">
                          <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                          Chennai, Tamil Nadu
                        </span>
                        <span className="career-role-action grid h-8 w-8 shrink-0 place-items-center rounded-full" aria-hidden="true">
                          <ArrowRight className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </button>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>

            <Reveal delay={0.1} className="is-in">
              <p className="mx-auto mt-8 max-w-2xl text-center text-[0.9375rem] leading-relaxed text-fg-muted">
                {note}
              </p>
            </Reveal>
          </>
        ) : (
          <div className="mx-auto max-w-3xl">
            <button
              type="button"
              onClick={() => {
                setSelectedRole(null);
                setSubmitted(false);
                setCareerSelects(initialCareerSelects);
                setCareerSelectErrors({});
                scrollToOpenings();
              }}
              className="group mb-7 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-fg-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:-translate-x-1" />
              Back to roles
            </button>

            <div className={`career-application career-application--${selectedRoleTint} surface rounded-card`}>
              <div className="career-application-header relative overflow-hidden border-b px-6 py-7 sm:px-8">
                <div className="relative flex items-start gap-4">
                  <span className="career-icon-shape grid h-11 w-11 shrink-0 place-items-center rounded-control border">
                    {selected && <selected.icon className="h-5 w-5" strokeWidth={1.9} />}
                  </span>
                  <div>
                    <h2 className="text-[length:var(--text-h3)] font-semibold leading-tight tracking-[-0.03em] text-fg">
                      {selectedRole}
                    </h2>
                    <p className="mt-2 text-[0.9375rem] text-fg-muted">{selected?.description}</p>
                  </div>
                </div>
              </div>

              {submitted ? (
                <div className="career-success px-6 py-12 text-center sm:px-8">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
                    <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-fg">Your application email is ready</h3>
                  <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
                    Please attach your resume in your email client, then send it to our team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="career-form p-6 sm:p-8">
                  <div className="career-form-section">
                    <p className="career-form-section-title text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      Personal details
                    </p>
                    <div className="mt-4 grid gap-5">
                      <div className="grid gap-5">
                        <div>
                          <label className={labelClass} htmlFor="career-first-name">First name *</label>
                          <input id="career-first-name" name="firstName" required autoComplete="given-name" placeholder="Your first name" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="career-last-name">Last name *</label>
                          <input id="career-last-name" name="lastName" required autoComplete="family-name" placeholder="Your last name" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="career-email">Email address *</label>
                        <input id="career-email" name="email" required type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="career-contact">Contact number *</label>
                        <input id="career-contact" name="contact" required type="tel" autoComplete="tel" placeholder="Your contact number" className={inputClass} />
                      </div>
                    </div>
                  </div>

                  <div className="career-form-section mt-8 border-t border-line pt-7">
                    <p className="career-form-section-title text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      Education and skills
                    </p>
                    <div className="mt-4 grid gap-5">
                      <div className="grid gap-5">
                        <div>
                          <label className={labelClass} htmlFor="career-graduation-year">Year of graduation *</label>
                          <FormDropdown
                            id="career-graduation-year"
                            name="graduationYear"
                            required
                            value={careerSelects.graduationYear}
                            placeholder="Select year"
                            options={graduationYears}
                            onChange={(value) => updateCareerSelect("graduationYear", value)}
                            buttonClassName={inputClass}
                            invalid={Boolean(careerSelectErrors.graduationYear)}
                            ariaDescribedBy={
                              careerSelectErrors.graduationYear
                                ? "career-graduation-year-error"
                                : undefined
                            }
                          />
                          {careerSelectErrors.graduationYear ? (
                            <p id="career-graduation-year-error" className="mt-2 text-xs font-medium text-red-600">
                              {careerSelectErrors.graduationYear}
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="career-gender">Gender *</label>
                          <FormDropdown
                            id="career-gender"
                            name="gender"
                            required
                            value={careerSelects.gender}
                            placeholder="Select gender"
                            options={genderOptions}
                            onChange={(value) => updateCareerSelect("gender", value)}
                            buttonClassName={inputClass}
                            invalid={Boolean(careerSelectErrors.gender)}
                            ariaDescribedBy={
                              careerSelectErrors.gender
                                ? "career-gender-error"
                                : undefined
                            }
                          />
                          {careerSelectErrors.gender ? (
                            <p id="career-gender-error" className="mt-2 text-xs font-medium text-red-600">
                              {careerSelectErrors.gender}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="career-experience-years">Experience in years *</label>
                        <FormDropdown
                          id="career-experience-years"
                          name="experienceYears"
                          required
                          value={careerSelects.experienceYears}
                          placeholder="Select experience"
                          options={experienceOptions}
                          onChange={(value) => updateCareerSelect("experienceYears", value)}
                          buttonClassName={inputClass}
                          invalid={Boolean(careerSelectErrors.experienceYears)}
                          ariaDescribedBy={
                            careerSelectErrors.experienceYears
                              ? "career-experience-years-error"
                              : undefined
                          }
                        />
                        {careerSelectErrors.experienceYears ? (
                          <p id="career-experience-years-error" className="mt-2 text-xs font-medium text-red-600">
                            {careerSelectErrors.experienceYears}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="career-skill-set">Skill set *</label>
                        <textarea id="career-skill-set" name="skillSet" required rows={3} placeholder="Share the tools, platforms and skills relevant to this role" className={`${inputClass} form-textarea`} />
                      </div>
                    </div>
                  </div>

                  <div className="career-form-section mt-8 border-t border-line pt-7">
                    <p className="career-form-section-title text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      Employment and compensation
                    </p>
                    <div className="mt-4 grid gap-5">
                      <div>
                        <label className={labelClass} htmlFor="career-current-employer">Current employer</label>
                        <input id="career-current-employer" name="currentEmployer" placeholder="Company name" className={inputClass} />
                      </div>
                      <div className="grid gap-5">
                        <div>
                          <label className={labelClass} htmlFor="career-current-ctc">Current CTC</label>
                          <FormDropdown
                            id="career-current-ctc"
                            name="currentCtc"
                            value={careerSelects.currentCtc}
                            placeholder="Select current CTC"
                            options={ctcOptions}
                            onChange={(value) => updateCareerSelect("currentCtc", value)}
                            buttonClassName={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="career-expected-ctc">Expected CTC</label>
                          <FormDropdown
                            id="career-expected-ctc"
                            name="expectedCtc"
                            value={careerSelects.expectedCtc}
                            placeholder="Select expected CTC"
                            options={ctcOptions}
                            onChange={(value) => updateCareerSelect("expectedCtc", value)}
                            buttonClassName={inputClass}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="career-notice-period">Notice period *</label>
                        <FormDropdown
                          id="career-notice-period"
                          name="noticePeriod"
                          required
                          value={careerSelects.noticePeriod}
                          placeholder="Select notice period"
                          options={noticePeriodOptions}
                          onChange={(value) => updateCareerSelect("noticePeriod", value)}
                          buttonClassName={inputClass}
                          invalid={Boolean(careerSelectErrors.noticePeriod)}
                          ariaDescribedBy={
                            careerSelectErrors.noticePeriod
                              ? "career-notice-period-error"
                              : undefined
                          }
                        />
                        {careerSelectErrors.noticePeriod ? (
                          <p id="career-notice-period-error" className="mt-2 text-xs font-medium text-red-600">
                            {careerSelectErrors.noticePeriod}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="career-form-section mt-8 border-t border-line pt-7">
                    <p className="career-form-section-title text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      Location and source
                    </p>
                    <div className="mt-4 grid gap-5">
                      <div className="grid gap-5">
                        <div>
                          <label className={labelClass} htmlFor="career-current-location">Current location *</label>
                          <input id="career-current-location" name="currentLocation" required autoComplete="address-level2" placeholder="City, State" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass} htmlFor="career-preferred-location">Preferred location *</label>
                          <FormDropdown
                            id="career-preferred-location"
                            name="preferredLocation"
                            required
                            value={careerSelects.preferredLocation}
                            placeholder="Select preferred location"
                            options={preferredLocationOptions}
                            onChange={(value) => updateCareerSelect("preferredLocation", value)}
                            buttonClassName={inputClass}
                            invalid={Boolean(careerSelectErrors.preferredLocation)}
                            ariaDescribedBy={
                              careerSelectErrors.preferredLocation
                                ? "career-preferred-location-error"
                                : undefined
                            }
                          />
                          {careerSelectErrors.preferredLocation ? (
                            <p id="career-preferred-location-error" className="mt-2 text-xs font-medium text-red-600">
                              {careerSelectErrors.preferredLocation}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="career-source">How did you come across this vacancy? *</label>
                        <FormDropdown
                          id="career-source"
                          name="source"
                          required
                          value={careerSelects.source}
                          placeholder="Select source"
                          options={sourceOptions}
                          onChange={(value) => updateCareerSelect("source", value)}
                          buttonClassName={inputClass}
                          invalid={Boolean(careerSelectErrors.source)}
                          ariaDescribedBy={
                            careerSelectErrors.source
                              ? "career-source-error"
                              : undefined
                          }
                        />
                        {careerSelectErrors.source ? (
                          <p id="career-source-error" className="mt-2 text-xs font-medium text-red-600">
                            {careerSelectErrors.source}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="career-form-section mt-8 border-t border-line pt-7">
                    <p className="career-form-section-title text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      Resume
                    </p>
                    <div className="mt-4">
                      <label className={labelClass} htmlFor="career-resume">Resume *</label>
                      <label htmlFor="career-resume" className="career-upload flex cursor-pointer items-center gap-3 rounded-control border border-dashed border-accent-line bg-accent-soft/40 p-4 transition-colors hover:bg-accent-soft">
                        <Upload className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                        <span className="text-[0.8125rem] leading-relaxed text-fg-muted">
                          Choose a PDF, DOC, or DOCX resume. You will attach it to the prepared email before sending.
                        </span>
                      </label>
                      <input id="career-resume" name="resume" required type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" />
                    </div>
                  </div>

                  <button type="submit" className="career-submit btn btn-primary btn-lg group mt-7 w-full sm:w-auto">
                    Submit application
                    <Send className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1" strokeWidth={2.25} />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
