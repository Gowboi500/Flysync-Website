/**
 * Departure-board resolve for eyebrow labels.
 *
 * Each character flickers through two or three glyphs and then settles, the
 * whole line landing inside 400ms, left to right. It is the one playful note
 * on the page and it is deliberately confined: eyebrows only, never a
 * headline, never body copy.
 *
 * Three things this is careful about.
 *
 * Width. Glyphs in a proportional face are not the same width, so scrambling
 * in place makes the label breathe and — because most eyebrows sit in a
 * centred flex row — shoves the whole line sideways for 400ms. The element's
 * settled width is measured once and pinned for the duration, then released.
 *
 * Pinning the width is necessary but on its own it is worse than nothing: a
 * scramble that happens to be wider than the settled label then WRAPS inside
 * that width, the eyebrow becomes two lines tall, and the entire section
 * below it jumps. That measured 0.033 CLS across the page — a third of the
 * budget, spent on a decoration. `nowrap` plus a clip pins the height too, so
 * an over-wide scramble loses a pixel or two off its right edge for a couple
 * of frames instead of relaying out the page.
 *
 * Frame rate vs. flicker rate. One rAF loop drives the whole string, but the
 * glyphs are picked from a 60ms step counter rather than per frame. Rolling
 * fresh randomness every frame reads as static, not as a flap board.
 *
 * The real text. The server renders the actual label, so a visitor with no
 * JS, a crawler, or a screen reader gets the words and nothing else. Only
 * `textContent` is touched, and the final assignment always restores the
 * exact original string.
 */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Total resolve time for the whole label. */
const TOTAL_MS = 400;
/** The last character starts settling this late; earlier ones land sooner. */
const LAST_START_MS = 280;
/** How long a glyph stays up before flipping. */
const FLIP_MS = 60;

/**
 * Deterministic per (index, step) glyph pick. A plain Math.random() would
 * re-roll on every read, so a character could not be recomputed twice in the
 * same step and the board would shimmer instead of flip.
 */
function glyphFor(index: number, step: number): string {
  const h = Math.imul(index * 73856093 + step * 19349663, 2654435761);
  return GLYPHS[(h >>> 8) % GLYPHS.length];
}

export function splitFlap(el: HTMLElement): void {
  // Cache the pristine label on the element. Reveals replay, so this can run
  // more than once — and reading `textContent` on a later run could capture a
  // half-scrambled string and bake the noise in permanently.
  const final = el.dataset.flapText ?? el.textContent ?? "";
  if (!final.trim()) return;
  el.dataset.flapText = final;

  const chars = Array.from(final);
  // Only letters and digits flap. Spaces, ampersands and hyphens are the
  // label's skeleton — flipping those makes it unreadable rather than alive.
  const flappable = chars.map((c) => /[a-z0-9]/i.test(c));
  const lastFlappable = flappable.lastIndexOf(true);
  if (lastFlappable === -1) return;

  // Pin the settled box before the first scrambled frame.
  const { width } = el.getBoundingClientRect();
  const restore = {
    width: el.style.width,
    display: el.style.display,
    whiteSpace: el.style.whiteSpace,
    overflow: el.style.overflow,
  };
  el.style.display = "inline-block";
  el.style.width = `${width}px`;
  el.style.whiteSpace = "nowrap";
  el.style.overflow = "hidden";

  const release = () => {
    el.textContent = final;
    el.style.width = restore.width;
    el.style.display = restore.display;
    el.style.whiteSpace = restore.whiteSpace;
    el.style.overflow = restore.overflow;
  };

  const start = performance.now();

  const tick = (now: number) => {
    const t = now - start;

    if (t >= TOTAL_MS) {
      release();
      return;
    }

    const step = Math.floor(t / FLIP_MS);
    let out = "";

    for (let i = 0; i < chars.length; i++) {
      if (!flappable[i]) {
        out += chars[i];
        continue;
      }
      const settleAt = (i / lastFlappable) * LAST_START_MS;
      out += t >= settleAt ? chars[i] : glyphFor(i, step);
    }

    el.textContent = out;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
