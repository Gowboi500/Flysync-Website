/**
 * Renders its children at a fixed design size and scales them to fill the
 * container — exactly how a real screenshot behaves. Without this, the UI
 * mockups reflow and clip when the device frame is narrower than the content
 * they were composed for.
 *
 * The transform scales the DOM, not a bitmap, so text stays vector-crisp at
 * every size.
 *
 * This used to be a client component: a ResizeObserver measured the host and
 * pushed a scale into React state. Container query units do the same job in
 * CSS, which buys three things —
 *
 *  - The mockups are server components again. Four of them across the page,
 *    each hydrating and holding a ResizeObserver purely to compute one
 *    number.
 *  - The scale is correct on first paint rather than one frame after
 *    hydration.
 *  - With JavaScript disabled the mock fits, instead of rendering at its
 *    full 1150px design width and being cropped by the device frame.
 *
 * The fallback is declaration order, not a feature query. The inline
 * transform is a whole declaration on its own, so a browser that cannot
 * parse `calc(<length> / <length>)` as a number drops it and inherits
 * `scale(1)` from the class — exactly the behaviour this replaced. A `var()`
 * would NOT degrade that way: an unresolvable substitution is invalid at
 * computed-value time and resets the property rather than falling back to
 * the earlier declaration.
 */
export function FitScreen({
  designWidth,
  designHeight,
  children,
  className = "",
}: {
  designWidth: number;
  designHeight: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`fit-host ${className}`}
      style={{ aspectRatio: `${designWidth} / ${designHeight}` }}
    >
      <div
        className="fit-inner"
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(calc(100cqw / ${designWidth}px))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
