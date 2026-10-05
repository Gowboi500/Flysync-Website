"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { contact } from "@/lib/pages";
import { site } from "@/lib/site";

/**
 * With no backend attached, the form hands off to WhatsApp with the details
 * pre-filled — the channel Indian travel businesses actually reply on. To
 * post to a CRM instead, replace the body of handleSubmit with a fetch().
 */
export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    interest: contact.form.interestedIn[0],
    message: "",
  });

  const field = "form-field field-ring";
  const label = "form-label";
  const select = `${field} form-select`;

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
      "Hi Flysync, I'd like to request a consultation.",
      "",
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Interested in: ${form.interest}`,
      form.message ? `\nRequirements:\n${form.message}` : "",
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
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
      <form
        onSubmit={handleSubmit}
        className="form-card p-6 sm:p-8"
      >
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-fg">
          {contact.form.heading}
        </h2>
        <p className="mt-2 text-[0.9375rem] text-fg-muted">
          {contact.form.body}
        </p>

        <div className="mt-7 grid gap-3">
          <div>
            <label htmlFor="c-name" className="sr-only">
              Full name
            </label>
            <input
              id="c-name"
              required
              autoComplete="name"
              placeholder="Full Name"
              className={field}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="c-company" className="sr-only">
              Company name
            </label>
            <input
              id="c-company"
              required
              autoComplete="organization"
              placeholder="Company Name"
              className={field}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="c-email" className="sr-only">
              Email address
            </label>
            <input
              id="c-email"
              required
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              className={field}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="c-phone" className="sr-only">
              Phone number
            </label>
            <input
              id="c-phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Phone Number"
              className={field}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="c-interest"
              className={label}
            >
              Interested In
            </label>
            <select
              id="c-interest"
              className={select}
              value={form.interest}
              onChange={(e) => setForm({ ...form, interest: e.target.value })}
            >
              {contact.form.interestedIn.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="c-msg" className="sr-only">
              Message
            </label>
            <textarea
              id="c-msg"
              rows={4}
              placeholder="Tell us more about your requirements."
              className={`${field} form-textarea`}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-morph btn-primary btn-lg group mt-6 w-full"
        >
          <span aria-hidden={sent} className={sent ? "opacity-0" : "opacity-100"}>
            {contact.form.submit}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-[3px]"
              strokeWidth={2.25}
            />
          </span>
          <span aria-hidden={!sent} className={sent ? "opacity-100" : "opacity-0"}>
            <Check className="h-4 w-4" strokeWidth={3} />
            Sent — check your phone
          </span>
        </button>
      </form>

      <aside className="lg:pt-4">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-fg">
          {contact.why.heading}
        </h2>
        <ul className="mt-5 space-y-3">
          {contact.why.items.map((t) => (
            <li key={t} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50">
                <Check className="h-3 w-3 text-emerald-600" strokeWidth={3.5} />
              </span>
              <span className="text-[0.9375rem] text-fg-muted">{t}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
