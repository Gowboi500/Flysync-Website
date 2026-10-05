/**
 * Dot-matrix world map with live flight routes radiating from Chennai.
 *
 * The landmass is generated from a set of lat/lon bounding regions and
 * emitted as ONE svg <path> of zero-length subpaths with round linecaps —
 * ~900 dots in a single DOM node rather than 900 <circle> elements.
 */

/* Equirectangular projection onto a 1000 × 500 canvas */
const W = 1000;
const H = 500;
const project = (lat: number, lon: number) => ({
  x: ((lon + 180) / 360) * W,
  y: ((90 - lat) / 180) * H,
});

type Box = [lonMin: number, lonMax: number, latMin: number, latMax: number];

/** Landmass approximation — blocky by design at dot-grid resolution. */
const LAND: Box[] = [
  // North America
  [-168, -141, 55, 71], // Alaska
  [-141, -60, 50, 70], // Canada
  [-125, -70, 70, 78], // Arctic archipelago
  [-128, -55, 42, 50],
  [-125, -67, 30, 49], // USA
  [-88, -80, 25, 31], // Florida
  [-117, -97, 22, 32], // N Mexico
  [-105, -87, 15, 23], // S Mexico
  [-92, -77, 8, 18], // Central America
  [-85, -60, 17, 23], // Caribbean
  // Greenland
  [-50, -20, 70, 82],
  [-55, -25, 60, 72],
  // South America
  [-81, -35, -5, 12],
  [-79, -34, -18, -4],
  [-73, -38, -30, -18],
  [-72, -53, -40, -30],
  [-75, -62, -54, -40],
  // Europe
  [-10, 3, 36, 44], // Iberia
  [-5, 20, 43, 55],
  [-10, 2, 50, 59], // British Isles
  [5, 30, 55, 71], // Scandinavia
  [15, 40, 44, 60],
  [8, 18, 37, 46], // Italy
  [15, 28, 35, 46], // Balkans
  // Africa
  [-17, 33, 20, 37],
  [-17, 40, 5, 21],
  [8, 42, -12, 6],
  [12, 40, -28, -11],
  [16, 33, -35, -27],
  [43, 50, -25, -12], // Madagascar
  // Middle East
  [35, 56, 13, 32], // Arabia
  [26, 62, 30, 42], // Türkiye / Iran
  // Asia
  [30, 180, 50, 72], // Russia
  [45, 90, 36, 52], // Central Asia
  [68, 90, 20, 32], // N India
  [72, 88, 8, 21], // Peninsular India
  [75, 135, 20, 50], // China
  [92, 110, 5, 22], // SE Asia
  [126, 146, 31, 46], // Korea / Japan
  [95, 141, -10, 6], // Indonesia
  [118, 126, 5, 19], // Philippines
  // Oceania
  [113, 154, -39, -11], // Australia
  [166, 179, -47, -34], // New Zealand
];

/** Inland seas carved back out so coastlines read correctly. */
const WATER: Box[] = [
  [-95, -78, 52, 65], // Hudson Bay
  [-95, -85, 20, 29], // Gulf of Mexico
  [2, 33, 32, 38], // Mediterranean
  [28, 41, 41, 47], // Black Sea
  [47, 54, 37, 47], // Caspian
  [17, 25, 56, 65], // Baltic
];

const inside = (boxes: Box[], lat: number, lon: number) =>
  boxes.some(
    ([lo1, lo2, la1, la2]) =>
      lon >= lo1 && lon <= lo2 && lat >= la1 && lat <= la2,
  );

/**
 * Built once at module scope — this is static geometry.
 *
 * The step and integer rounding are deliberate: this single `d` attribute is
 * serialised into both the HTML and the RSC payload, so every extra character
 * is paid for twice on the wire.
 */
const DOT_PATH = (() => {
  const parts: string[] = [];
  for (let lat = 80; lat >= -56; lat -= 5) {
    for (let lon = -180; lon <= 180; lon += 5) {
      if (!inside(LAND, lat, lon)) continue;
      if (inside(WATER, lat, lon)) continue;
      const { x, y } = project(lat, lon);
      parts.push(`M${Math.round(x)} ${Math.round(y)}h0`);
    }
  }
  return parts.join("");
})();

/* ------------------------------------------------------------------ */
/* Flight routes — Chennai as the hub, matching Flysync's markets      */
/* ------------------------------------------------------------------ */

const CITIES = {
  chennai: { lat: 13.08, lon: 80.27, label: "Chennai" },
  delhi: { lat: 28.61, lon: 77.21, label: "Delhi" },
  dubai: { lat: 25.2, lon: 55.27, label: "Dubai" },
  singapore: { lat: 1.35, lon: 103.82, label: "Singapore" },
  london: { lat: 51.51, lon: -0.13, label: "London" },
  bangkok: { lat: 13.75, lon: 100.5, label: "Bangkok" },
  frankfurt: { lat: 50.11, lon: 8.68, label: "Frankfurt" },
  newYork: { lat: 40.71, lon: -74.01, label: "New York" },
  sydney: { lat: -33.87, lon: 151.21, label: "Sydney" },
  nairobi: { lat: -1.29, lon: 36.82, label: "Nairobi" },
} as const;

type CityKey = keyof typeof CITIES;

/** Quadratic arc that bows away from the great-circle chord. */
function arc(from: CityKey, to: CityKey, lift = 0.22) {
  const a = project(CITIES[from].lat, CITIES[from].lon);
  const b = project(CITIES[to].lat, CITIES[to].lon);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  // Perpendicular offset, always bowing "north" for a consistent look
  const nx = -dy / dist;
  const ny = dx / dist;
  const dir = ny > 0 ? -1 : 1;
  const cx = mx + nx * dist * lift * dir;
  const cy = my + ny * dist * lift * dir;
  return { d: `M${a.x} ${a.y}Q${cx} ${cy} ${b.x} ${b.y}`, a, b, dist };
}

const ROUTES = [
  { ...arc("chennai", "dubai"), delay: 0 },
  { ...arc("chennai", "singapore"), delay: 1.1 },
  { ...arc("chennai", "london", 0.26), delay: 2.2 },
  { ...arc("delhi", "frankfurt", 0.24), delay: 0.6 },
  { ...arc("dubai", "london", 0.2), delay: 3 },
  { ...arc("chennai", "bangkok", 0.2), delay: 1.7 },
  { ...arc("london", "newYork", 0.24), delay: 2.6 },
  { ...arc("singapore", "sydney", 0.2), delay: 0.3 },
  { ...arc("dubai", "nairobi", 0.2), delay: 3.4 },
];

const HUBS: CityKey[] = ["chennai", "dubai", "singapore", "london", "delhi"];

export function WorldMap({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 20 1000 390"
      className={`[mask-image:radial-gradient(ellipse_64%_60%_at_50%_48%,#000_0%,rgba(0,0,0,0.6)_58%,transparent_100%)] ${className}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="route-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--brand-1)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--brand-1)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--brand-1)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g>
        {/* Landmass */}
        <path
          d={DOT_PATH}
          stroke="#c9c4e4"
          strokeOpacity="0.2"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Route arcs — static base line */}
        <g>
          {ROUTES.map((r, i) => (
            <path
              key={`base-${i}`}
              d={r.d}
              stroke="url(#route-grad)"
              strokeWidth="1"
              strokeOpacity="0.6"
            />
          ))}
        </g>

        {/* Route arcs — travelling dash overlay */}
        <g>
          {ROUTES.map((r, i) => (
            <path
              key={`flow-${i}`}
              d={r.d}
              stroke="var(--brand-1)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="3 220"
              style={{
                animation: `dash-flow ${16 + (i % 4) * 3}s linear infinite`,
                animationDelay: `${r.delay}s`,
              }}
            />
          ))}
        </g>

        {/* Hub markers */}
        <g>
          {HUBS.map((key) => {
            const { x, y } = project(CITIES[key].lat, CITIES[key].lon);
            const isHome = key === "chennai";
            return (
              <g key={key}>
                {/* Layered discs read as a glow without an feGaussianBlur,
                    which forces an offscreen render pass on every frame. */}
                <circle cx={x} cy={y} r={isHome ? 9 : 7} fill="var(--brand-1)" fillOpacity="0.14" />
                <circle cx={x} cy={y} r={isHome ? 5.5 : 4.5} fill="var(--brand-1)" fillOpacity="0.26" />
                <circle
                  cx={x}
                  cy={y}
                  r={isHome ? 3.4 : 2.4}
                  fill="var(--brand-1)"
                  fillOpacity={isHome ? 1 : 0.85}
                />
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill="none"
                  stroke="var(--brand-1)"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                  style={{
                    transformOrigin: `${x}px ${y}px`,
                    animation: `pulse-ring ${isHome ? 3.2 : 4.4}s ease-out infinite`,
                    animationDelay: `${HUBS.indexOf(key) * 0.7}s`,
                  }}
                />
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
