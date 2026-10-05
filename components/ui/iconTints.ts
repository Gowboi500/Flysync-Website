/**
 * A small supporting palette for repeated content-card icons. Primary actions
 * and interface controls remain Flysync blue; these classes are for scanning
 * benefit, capability, and contact grids without making their cards colourful.
 */
const TINT_NAMES = ["blue", "red", "violet", "teal", "amber", "rose"] as const;

export const ICON_TINTS = TINT_NAMES.map(
  (name) => `grad-badge--${name}` as const,
);

export function iconTint(index: number) {
  return ICON_TINTS[index % ICON_TINTS.length];
}

export function cardTint(index: number) {
  return `card-tint-border--${TINT_NAMES[index % TINT_NAMES.length]}`;
}

export function accentBarTint(index: number) {
  return `accent-bar--${TINT_NAMES[index % TINT_NAMES.length]}`;
}
