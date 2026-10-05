"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { demo } from "@/lib/pages";
import { site } from "@/lib/site";

/**
 * Fields mirror "12. DEMO.pdf" exactly.
 *
 * With no backend attached the submission opens WhatsApp pre-filled. Swap the
 * body of handleSubmit for a fetch() to post into a CRM instead.
 */
export function DemoForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    website: "",
    phone: "",
    country: "India",
    product: demo.products[0],
    businessType: demo.businessTypes[0],
    employees: demo.employees[0],
    challenges: "",
    when: "",
  });

  const field = "form-field field-ring";
  const label = "form-label";
  const selectCls = `${field} form-select`;

  /**
   * The morph is feedback, not a delay. WhatsApp is opened synchronously
   * inside the submit handler because a window.open() deferred past the
   * gesture is a popup blocker's textbook case — the confirmation and the
   * handoff happen together rather than one waiting on the other.
   */
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      "Hi Flysync, I'd like to book a demo.",
      "",
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Email: ${form.email}`,
      form.website ? `Website: ${form.website}` : "",
      `Phone: ${form.phone}`,
      `Country: ${form.country}`,
      `Product interested in: ${form.product}`,
      `Business type: ${form.businessType}`,
      `Employees: ${form.employees}`,
      form.when ? `Preferred demo time: ${form.when}` : "",
      form.challenges ? `\nCurrent challenges:\n${form.challenges}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(body)}`,
      "_blank",
      "noopener,noreferrer",
    );

    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="form-card p-6 sm:p-9">
      <div className="flex flex-col gap-4">
        <div>
          <label className={label} htmlFor="d-name">
            Full Name *
          </label>
          <input
            id="d-name"
            required
            autoComplete="name"
            placeholder="Enter your name"
            className={field}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className={label} htmlFor="d-company">
            Company Name *
          </label>
          <input
            id="d-company"
            required
            autoComplete="organization"
            placeholder="Enter your company name"
            className={field}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
        <div>
          <label className={label} htmlFor="d-email">
            Business Email *
          </label>
          <input
            id="d-email"
            required
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            className={field}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className={label} htmlFor="d-website">
            Website
          </label>
          <input
            id="d-website"
            type="url"
            inputMode="url"
            placeholder="https://"
            className={field}
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
        <div>
          <label className={label} htmlFor="d-phone">
            Phone Number *
          </label>
          <input
            id="d-phone"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter your contact number"
            className={field}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className={label} htmlFor="d-country">
            Country *
          </label>
          <input
            id="d-country"
            required
            autoComplete="country-name"
            placeholder="Select your country"
            className={field}
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>

        <div>
          <label className={label} htmlFor="d-product">
            Product Interested In *
          </label>
          <select
            id="d-product"
            className={selectCls}
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          >
            {demo.products.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="d-type">
            Business Type *
          </label>
          <select
            id="d-type"
            className={selectCls}
            value={form.businessType}
            onChange={(e) => setForm({ ...form, businessType: e.target.value })}
          >
            {demo.businessTypes.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="d-emp">
            Number of Employees
          </label>
          <select
            id="d-emp"
            className={selectCls}
            value={form.employees}
            onChange={(e) => setForm({ ...form, employees: e.target.value })}
          >
            {demo.employees.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="d-when">
            Preferred Demo Date &amp; Time
          </label>
          <input
            id="d-when"
            type="datetime-local"
            className={field}
            value={form.when}
            onChange={(e) => setForm({ ...form, when: e.target.value })}
          />
        </div>

        <div>
          <label className={label} htmlFor="d-challenges">
            Current Challenges
          </label>
          <textarea
            id="d-challenges"
            rows={4}
            placeholder={demo.challengesPlaceholder}
            className={`${field} form-textarea`}
            value={form.challenges}
            onChange={(e) => setForm({ ...form, challenges: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-morph btn-primary btn-lg group mt-7 w-full"
      >
        <span aria-hidden={sent} className={sent ? "opacity-0" : "opacity-100"}>
          {demo.submit}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[3px]"
            strokeWidth={2.25}
          />
        </span>
        <span aria-hidden={!sent} className={sent ? "opacity-100" : "opacity-0"}>
          <Check className="h-4 w-4" strokeWidth={3} />
          Booked — check your phone
        </span>
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-fg-subtle">
        By submitting you agree to be contacted about Flysync. We never share
        your details.
      </p>
    </form>
  );
}
