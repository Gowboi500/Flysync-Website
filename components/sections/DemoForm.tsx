"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { demo } from "@/lib/pages";
import { site } from "@/lib/site";

type DemoFormState = {
  name: string;
  company: string;
  email: string;
  website: string;
  phone: string;
  country: string;
  products: string[];
  businessTypes: string[];
  employees: string;
  challenges: string;
  when: string;
};

/**
 * Fields mirror "12. DEMO.pdf" exactly.
 *
 * With no backend attached the submission opens WhatsApp pre-filled. Swap the
 * body of handleSubmit for a fetch() to post into a CRM instead.
 */
export function DemoForm() {
  const [form, setForm] = useState<DemoFormState>({
    name: "",
    company: "",
    email: "",
    website: "",
    phone: "",
    country: "India",
    products: [demo.products[0]],
    businessTypes: [],
    employees: demo.employees[0],
    challenges: "",
    when: "",
  });

  const field = "form-field field-ring";
  const label = "form-label";

  /**
   * The morph is feedback, not a delay. WhatsApp is opened synchronously
   * inside the submit handler because a window.open() deferred past the
   * gesture is a popup blocker's textbook case — the confirmation and the
   * handoff happen together rather than one waiting on the other.
   */
  const [sent, setSent] = useState(false);
  const [productError, setProductError] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [businessTypeError, setBusinessTypeError] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const [employeesDropdownOpen, setEmployeesDropdownOpen] = useState(false);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const businessDropdownRef = useRef<HTMLDivElement>(null);
  const employeesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!productDropdownOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setProductDropdownOpen(false);
        setEmployeesDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProductDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [productDropdownOpen]);

  useEffect(() => {
    if (!businessDropdownOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        businessDropdownRef.current &&
        !businessDropdownRef.current.contains(event.target as Node)
      ) {
        setBusinessDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBusinessDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [businessDropdownOpen]);

  useEffect(() => {
    if (!employeesDropdownOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        employeesDropdownRef.current &&
        !employeesDropdownRef.current.contains(event.target as Node)
      ) {
        setEmployeesDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEmployeesDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [employeesDropdownOpen]);

  const toggleProduct = (option: string) => {
    setProductError(false);
    setForm((current) => {
      const selected = current.products.includes(option);

      return {
        ...current,
        products: selected
          ? current.products.filter((value) => value !== option)
          : [...current.products, option],
      };
    });
  };

  const toggleBusinessType = (option: string) => {
    setBusinessTypeError(false);
    setForm((current) => {
      const selected = current.businessTypes.includes(option);

      return {
        ...current,
        businessTypes: selected
          ? current.businessTypes.filter((value) => value !== option)
          : [...current.businessTypes, option],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.products.length === 0) {
      setProductError(true);
      setProductDropdownOpen(true);
      return;
    }

    if (form.businessTypes.length === 0) {
      setBusinessTypeError(true);
      setBusinessDropdownOpen(true);
      return;
    }

    const body = [
      "Hi Flysync, I'd like to book a demo.",
      "",
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Email: ${form.email}`,
      form.website ? `Website: ${form.website}` : "",
      `Phone: ${form.phone}`,
      `Country: ${form.country}`,
      `Products interested in: ${form.products.join(", ")}`,
      `Business types: ${form.businessTypes.join(", ")}`,
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
          <div ref={productDropdownRef} className="relative z-30">
            <button
              type="button"
              id="d-product"
              className={`${field} flex items-center justify-between gap-3 text-left`}
              aria-haspopup="true"
              aria-expanded={productDropdownOpen}
              aria-controls="d-product-options"
              aria-describedby={productError ? "d-product-error" : undefined}
              onClick={() => {
                setBusinessDropdownOpen(false);
                setEmployeesDropdownOpen(false);
                setProductDropdownOpen((open) => !open);
              }}
            >
              <span
                className={`min-w-0 truncate ${
                  form.products.length > 0 ? "text-fg" : "text-fg-subtle"
                }`}
              >
                {form.products.length > 0
                  ? form.products.join(", ")
                  : "Select products"}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-accent transition-transform duration-[var(--duration-fast)] ${
                  productDropdownOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2.1}
                aria-hidden="true"
              />
            </button>

            {productDropdownOpen ? (
              <div
                id="d-product-options"
                role="group"
                aria-labelledby="d-product"
                className="dropdown-panel absolute left-0 right-0 top-full z-30 mt-2"
              >
                <div className="grid gap-1.5">
                  {demo.products.map((o) => {
                    const id = `d-product-${o.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                    const checked = form.products.includes(o);

                    return (
                      <label
                        key={o}
                        htmlFor={id}
                        className={`dropdown-item flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                          checked
                            ? "border-accent-line bg-accent-soft text-fg"
                            : "text-fg-muted"
                        }`}
                      >
                        <input
                          id={id}
                          name="products"
                          type="checkbox"
                          value={o}
                          checked={checked}
                          onChange={() => toggleProduct(o)}
                          className="h-4 w-4 rounded border-line accent-[var(--color-accent)]"
                        />
                        <span>{o}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
          {productError ? (
            <p id="d-product-error" className="mt-2 text-sm font-medium text-red-600">
              Select at least one product.
            </p>
          ) : null}
        </div>
        <fieldset>
          <legend className={label}>
            Business Type *
          </legend>
          <div ref={businessDropdownRef} className="relative z-20">
            <button
              type="button"
              id="d-type"
              className={`${field} flex items-center justify-between gap-3 text-left`}
              aria-haspopup="true"
              aria-expanded={businessDropdownOpen}
              aria-controls="d-type-options"
              aria-describedby={businessTypeError ? "d-type-error" : undefined}
              onClick={() => {
                setProductDropdownOpen(false);
                setEmployeesDropdownOpen(false);
                setBusinessDropdownOpen((open) => !open);
              }}
            >
              <span
                className={`min-w-0 truncate ${
                  form.businessTypes.length > 0 ? "text-fg" : "text-fg-subtle"
                }`}
              >
                {form.businessTypes.length > 0
                  ? form.businessTypes.join(", ")
                  : "Select business types"}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-accent transition-transform duration-[var(--duration-fast)] ${
                  businessDropdownOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2.1}
                aria-hidden="true"
              />
            </button>

            {businessDropdownOpen ? (
              <div
                id="d-type-options"
                role="group"
                aria-labelledby="d-type"
                className="dropdown-panel absolute left-0 right-0 top-full z-30 mt-2"
              >
                <div className="grid gap-1.5">
                  {demo.businessTypes.map((o) => {
                    const id = `d-type-${o.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                    const checked = form.businessTypes.includes(o);

                    return (
                      <label
                        key={o}
                        htmlFor={id}
                        className={`dropdown-item flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                          checked
                            ? "border-accent-line bg-accent-soft text-fg"
                            : "text-fg-muted"
                        }`}
                      >
                        <input
                          id={id}
                          name="businessTypes"
                          type="checkbox"
                          value={o}
                          checked={checked}
                          onChange={() => toggleBusinessType(o)}
                          className="h-4 w-4 rounded border-line accent-[var(--color-accent)]"
                        />
                        <span>{o}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
          {businessTypeError ? (
            <p id="d-type-error" className="mt-2 text-sm font-medium text-red-600">
              Select at least one business type.
            </p>
          ) : null}
        </fieldset>
        <div>
          <label className={label} htmlFor="d-emp">
            Number of Employees
          </label>
          <div ref={employeesDropdownRef} className="relative z-10">
            <button
              type="button"
              id="d-emp"
              className={`${field} flex items-center justify-between gap-3 text-left`}
              aria-haspopup="true"
              aria-expanded={employeesDropdownOpen}
              aria-controls="d-emp-options"
              onClick={() => {
                setProductDropdownOpen(false);
                setBusinessDropdownOpen(false);
                setEmployeesDropdownOpen((open) => !open);
              }}
            >
              <span className="min-w-0 truncate text-fg">{form.employees}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-accent transition-transform duration-[var(--duration-fast)] ${
                  employeesDropdownOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2.1}
                aria-hidden="true"
              />
            </button>

            {employeesDropdownOpen ? (
              <div
                id="d-emp-options"
                role="group"
                aria-labelledby="d-emp"
                className="dropdown-panel absolute left-0 right-0 top-full z-30 mt-2"
              >
                <div className="grid gap-1.5">
                  {demo.employees.map((o) => {
                    const selected = form.employees === o;

                    return (
                      <button
                        key={o}
                        type="button"
                        className={`dropdown-item flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium ${
                          selected
                            ? "border-accent-line bg-accent-soft text-fg"
                            : "text-fg-muted"
                        }`}
                        onClick={() => {
                          setForm((current) => ({ ...current, employees: o }));
                          setEmployeesDropdownOpen(false);
                        }}
                      >
                        <span>{o}</span>
                        {selected ? (
                          <Check
                            className="h-4 w-4 shrink-0 text-accent"
                            strokeWidth={2.4}
                            aria-hidden="true"
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
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
