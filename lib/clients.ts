/**
 * The customer wall.
 *
 * These are the client's own logo files (37 of them, supplied as PNGs at
 * ~1500px wide). They are not redrawn. A build-time pass trimmed each one to
 * its ink, scaled it to fit 340×136 — about 2× the largest container it is
 * ever painted into — and kept whichever of full-colour or 256-colour PNG
 * came out smaller. The whole set is 238KB on disk; before that it was 13MB.
 *
 * `shape` is the only thing the layout needs to know about the artwork, and
 * it exists because real logos never match each other. A wordmark like
 * `Partner Hub` is 9:1 and a roundel like `Sakshi Travels` is 1:1; painted at
 * a common height the roundel is six times the area and shouts over
 * everything beside it. So height is capped by shape instead — see
 * `.logo-cell` in globals.css — and the row reads as one set of equals.
 *
 *   wide    ar ≥ 2.2   fills the container
 *   mid     1.5–2.2    capped at 90% height
 *   emblem  ar < 1.5   capped at 80% height
 *
 * `plate` marks the three files whose artwork is a solid filled rectangle
 * of colour rather than ink on transparency. They are the other half of the
 * weight problem: a filled slab has every pixel of its box, so beside
 * outline wordmarks it reads as the loudest thing in the row no matter what
 * the aspect ratio says. They take a height cap for that reason — the spec
 * lets wide marks fill the width, but "no logo dominates" wins. Nothing is
 * done to the artwork itself: no rounding, no recolouring, no container.
 *
 * Three files carried a white rectangle, and on a tinted ground a white
 * rectangle is exactly the thing that must not ship. All three are keyed
 * out at build time rather than hidden behind a card, and each needed a
 * different method, because "remove the white" is not one problem:
 *
 *   FlyforSure   whole-file plate. Blanket near-white to transparent with
 *                a ramp across the anti-aliased fringe. This also cleared
 *                the white trapped inside the letter counters, which is
 *                what a transparent logo should do.
 *   RKC          an app-icon plate behind the roundel, WITH a drop shadow
 *                baked around it. Keying the white alone left the shadow
 *                as a visible ghost of the square, so anything light,
 *                near-neutral and barely opaque goes too. The roundel's
 *                own anti-aliasing is dark and survives that test.
 *   KSP          could NOT take a blanket key: its K, S and P are white
 *                ink on blue and its HOLIDAYS.COM is white on red, and a
 *                blanket pass erases the brand. Edge-connected flood fill
 *                instead — the outer rectangle reaches the border, the
 *                letters are enclosed by colour and do not.
 *
 * Nothing is left awaiting replacement. Four files still contain white
 * that is deliberate and stays: goimomi's die-cut sticker outline, DMC's
 * postage-stamp frame, Bharath's white India silhouette and Sakshi's white
 * script. Those are ink and artwork, not backdrops.
 *
 * `w`/`h` are the true pixel dimensions and are emitted as the img
 * attributes: the cell is a fixed size either way, but the intrinsic ratio
 * has to be on the element or the browser has nothing to lay out against
 * while the file is still in flight.
 *
 * Three customers are NOT here — Travelone, Make Voyage and VoloFly. No
 * artwork was supplied for them, and the text pills that used to carry
 * their names have been removed along with the rest of the text under the
 * wall. If files turn up later, add them to the list and they appear.
 *
 * Two files are named for one client but carry another's artwork:
 * `VoloFlyLogo 1.png` reads FlyforSure and `Mask group.png` reads Make Air
 * Trip. Both ship under the brand actually drawn on them. If either company
 * really did rebrand, the fix is renaming the entry here — not relabelling
 * the mark.
 */

export type ClientLogo = {
  name: string;
  src: string;
  w: number;
  h: number;
  shape: "wide" | "mid" | "emblem";
  /** Artwork is a solid filled colour rectangle, not ink on transparency. */
  plate?: true;
};

export const clientLogos: ClientLogo[] = [
  { name: "Arohaka", src: "/logos/arohaka.png", w: 331, h: 136, shape: "wide", plate: true },
  { name: "Bharath", src: "/logos/bharath.png", w: 136, h: 136, shape: "emblem", plate: true },
  { name: "Deal Fare", src: "/logos/deal-fare.png", w: 340, h: 131, shape: "wide" },
  { name: "DMC Leisure", src: "/logos/dmc-leisure.png", w: 116, h: 136, shape: "emblem" },
  { name: "DS Travels", src: "/logos/ds-travels.png", w: 183, h: 136, shape: "emblem" },
  { name: "Farenest", src: "/logos/farenest.png", w: 307, h: 136, shape: "wide" },
  { name: "Fareport", src: "/logos/fareport.png", w: 232, h: 136, shape: "mid" },
  { name: "Flight Guru Online", src: "/logos/flight-guru-online.png", w: 340, h: 119, shape: "wide" },
  { name: "Bittu Happy Overseas", src: "/logos/bittu-happy-overseas.png", w: 512, h: 512, shape: "emblem" },
  { name: "Flybest", src: "/logos/flybest.png", w: 340, h: 120, shape: "wide" },
  { name: "FlyforSure", src: "/logos/flyforsure.png", w: 340, h: 104, shape: "wide" },
  { name: "FlyNext", src: "/logos/flynext.png", w: 340, h: 115, shape: "wide" },
  { name: "Goimomi Holidays", src: "/logos/goimomi-holidays.png", w: 340, h: 120, shape: "wide" },
  { name: "Group Series", src: "/logos/group-series.png", w: 173, h: 136, shape: "emblem" },
  { name: "Helinto", src: "/logos/helinto.png", w: 340, h: 82, shape: "wide" },
  { name: "Jalandhar Air Travels", src: "/logos/jalandhar-air-travels.png", w: 340, h: 79, shape: "wide" },
  { name: "Krishna Travels", src: "/logos/krishna-travels.png", w: 323, h: 136, shape: "wide" },
  { name: "KSP Holidays", src: "/logos/ksp-holidays.png", w: 234, h: 136, shape: "mid", plate: true },
  { name: "Make Air Trip", src: "/logos/make-air-trip.png", w: 340, h: 84, shape: "wide" },
  { name: "Manpasand", src: "/logos/manpasand.png", w: 340, h: 68, shape: "wide" },
  { name: "Maruti Trips", src: "/logos/maruti-trips.png", w: 340, h: 87, shape: "wide" },
  { name: "Marvel World", src: "/logos/marvel-world.png", w: 340, h: 75, shape: "wide" },
  { name: "Mayank Travel Services", src: "/logos/mayank-travel-services.png", w: 340, h: 42, shape: "wide" },
  { name: "Multitrip Holiday", src: "/logos/multitrip-holiday.png", w: 302, h: 136, shape: "wide" },
  { name: "NNK Tours", src: "/logos/nnk-tours.png", w: 259, h: 136, shape: "mid" },
  { name: "Partner Hub", src: "/logos/partner-hub.png", w: 340, h: 37, shape: "wide" },
  { name: "Preveen Air Travels", src: "/logos/preveen-air-travels.png", w: 158, h: 136, shape: "emblem" },
  { name: "Raj & Raj Tours", src: "/logos/raj-raj-tours.png", w: 305, h: 136, shape: "wide" },
  { name: "Raj Travels", src: "/logos/raj-travels.png", w: 229, h: 136, shape: "mid" },
  { name: "Rajesh Travels", src: "/logos/rajesh-travels.png", w: 340, h: 69, shape: "wide" },
  { name: "RKC Flight Centre", src: "/logos/rkc-flight-centre.png", w: 340, h: 133, shape: "wide" },
  { name: "Sakshi Travels", src: "/logos/sakshi-travels.png", w: 136, h: 136, shape: "emblem" },
  { name: "Setia Travels", src: "/logos/setia-travels.png", w: 340, h: 103, shape: "wide" },
  { name: "Shreyaa Air", src: "/logos/shreyaa-air.png", w: 106, h: 136, shape: "emblem" },
  { name: "Trailfinder", src: "/logos/trailfinder.png", w: 340, h: 112, shape: "wide" },
  { name: "Trip N Tie", src: "/logos/trip-n-tie.png", w: 170, h: 136, shape: "emblem" },
  { name: "Vijay Tour and Travel", src: "/logos/vijay-tour-and-travel.png", w: 266, h: 136, shape: "mid" },
];

/**
 * Two rows, alternating. Splitting the alphabetical list down the middle
 * would put every wide wordmark in one row and every roundel in the other;
 * interleaving keeps both rows mixed, which is what stops either one from
 * reading as a block of the same shape.
 */
export const clientRows: ClientLogo[][] = [
  clientLogos.filter((_, i) => i % 2 === 0),
  clientLogos.filter((_, i) => i % 2 === 1),
];
