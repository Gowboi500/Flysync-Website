/**
 * Intrinsic design dimensions each UI mockup was composed at.
 *
 * Lives outside FitScreen.tsx deliberately: that file is a client module, and
 * plain values exported from client modules arrive in server components as
 * client references rather than real objects.
 */
export const SCREEN_SIZE = {
  /** 16:9 — matches the laptop lid proportion */
  dashboard: { w: 1150, h: 647 },
  reports: { w: 300, h: 400 },
  wallet: { w: 250, h: 528 },
  product: { w: 470, h: 345 },
} as const;
