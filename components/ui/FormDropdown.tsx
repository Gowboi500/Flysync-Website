"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type FormDropdownProps = {
  id: string;
  name?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  buttonClassName?: string;
  wrapperClassName?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  ariaDescribedBy?: string;
};

export function FormDropdown({
  id,
  name,
  value,
  options,
  onChange,
  placeholder = "Select option",
  buttonClassName = "form-field field-ring",
  wrapperClassName = "relative",
  required = false,
  disabled = false,
  invalid = false,
  ariaDescribedBy,
}: FormDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.includes(value) ? value : "";

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className={`${wrapperClassName} ${open ? "z-40" : "z-0"}`}>
      {name ? <input type="hidden" name={name} value={selected} /> : null}
      <button
        type="button"
        id={id}
        disabled={disabled}
        className={`${buttonClassName} flex items-center justify-between gap-3 text-left`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className={`min-w-0 truncate ${
            selected ? "text-fg" : "text-fg-subtle"
          }`}
        >
          {selected || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-accent transition-transform duration-[var(--duration-fast)] ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2.1}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-labelledby={id}
          className="dropdown-panel absolute left-0 right-0 top-full z-30 mt-2"
          style={{ maxHeight: "18rem", overflowX: "hidden", overflowY: "auto" }}
        >
          <div className="grid gap-1.5">
            {options.map((option) => {
              const isSelected = selected === option;

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`dropdown-item flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium ${
                    isSelected
                      ? "border-accent-line bg-accent-soft text-fg"
                      : "text-fg-muted"
                  }`}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <span className="min-w-0 truncate">{option}</span>
                  {isSelected ? (
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
  );
}

type FormCheckboxDropdownProps = {
  id: string;
  name?: string;
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  buttonClassName?: string;
  wrapperClassName?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  ariaDescribedBy?: string;
};

export function FormCheckboxDropdown({
  id,
  name,
  values,
  options,
  onChange,
  placeholder = "Select options",
  buttonClassName = "form-field field-ring",
  wrapperClassName = "relative",
  required = false,
  disabled = false,
  invalid = false,
  ariaDescribedBy,
}: FormCheckboxDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selectedValues = values.filter((value) => options.includes(value));

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const toggleOption = (option: string) => {
    const selected = selectedValues.includes(option);
    onChange(
      selected
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option],
    );
  };

  return (
    <div ref={dropdownRef} className={`${wrapperClassName} ${open ? "z-40" : "z-0"}`}>
      {name
        ? selectedValues.map((value) => (
            <input key={value} type="hidden" name={name} value={value} />
          ))
        : null}
      <button
        type="button"
        id={id}
        disabled={disabled}
        className={`${buttonClassName} flex items-center justify-between gap-3 text-left`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className={`min-w-0 truncate ${
            selectedValues.length > 0 ? "text-fg" : "text-fg-subtle"
          }`}
        >
          {selectedValues.length > 0 ? selectedValues.join(", ") : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-accent transition-transform duration-[var(--duration-fast)] ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2.1}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id={listId}
          role="group"
          aria-labelledby={id}
          className="dropdown-panel absolute left-0 right-0 top-full z-30 mt-2"
          style={{ maxHeight: "18rem", overflowX: "hidden", overflowY: "auto" }}
        >
          <div className="grid gap-1.5">
            {options.map((option) => {
              const checkboxId = `${id}-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              const checked = selectedValues.includes(option);

              return (
                <label
                  key={option}
                  htmlFor={checkboxId}
                  className={`dropdown-item flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                    checked
                      ? "border-accent-line bg-accent-soft text-fg"
                      : "text-fg-muted"
                  }`}
                >
                  <input
                    id={checkboxId}
                    name={`${id}-option`}
                    type="checkbox"
                    value={option}
                    checked={checked}
                    onChange={() => toggleOption(option)}
                    className="h-4 w-4 rounded border-line accent-[var(--color-accent)]"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
