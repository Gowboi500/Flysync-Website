import { DatabaseBackup, FileCheck2, ShieldCheck, Upload } from "lucide-react";

/**
 * A single hairline row of the four things a travel business checks before
 * signing. Deliberately understated — outline icons, one line, no cards.
 */
const ITEMS = [
  { icon: FileCheck2, label: "GST-compliant invoicing" },
  { icon: ShieldCheck, label: "PCI-compliant gateways" },
  { icon: DatabaseBackup, label: "Daily backups" },
  { icon: Upload, label: "Full data export rights" },
];

export function TrustStrip() {
  return (
    <section aria-label="Compliance and data commitments" className="border-y border-line">
      <div className="container-page">
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 bg-canvas px-5 py-5"
            >
              <Icon
                className="h-4 w-4 shrink-0 text-accent"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="text-[0.875rem] font-medium text-fg">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
