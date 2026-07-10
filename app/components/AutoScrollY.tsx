"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fixed-height container that auto-scrolls its content vertically on a slow,
 * seamless loop — but ONLY when the content actually overflows the height.
 * If everything fits, it renders statically (no duplication, no motion).
 *
 * Implementation uses a real scroll container (so manual scroll/interaction
 * works) with the content duplicated; a rAF loop nudges scrollTop and wraps by
 * subtracting the first copy's height at the seam (invisible reset). Pauses on
 * hover, focus-within, and touch. No visible scrollbar. Honors reduced-motion.
 */
export default function AutoScrollY({
  children,
  className = "",
  heightClass = "max-h-[320px]",
  pxPerSecond = 22,
}: {
  children: ReactNode;
  className?: string;
  heightClass?: string;
  pxPerSecond?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const paused = useRef(false);

  // Measure whether a single copy overflows the fixed-height box.
  useEffect(() => {
    const scroller = scrollRef.current;
    const copy = firstCopyRef.current;
    if (!scroller || !copy) return;
    const measure = () => setOverflowing(copy.offsetHeight > scroller.clientHeight + 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(copy);
    ro.observe(scroller);
    return () => ro.disconnect();
  }, [children]);

  // Auto-scroll loop (only while overflowing and not reduced-motion).
  useEffect(() => {
    if (!overflowing) return;
    const scroller = scrollRef.current;
    const copy = firstCopyRef.current;
    if (!scroller || !copy) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = 0;
    const step = (t: number) => {
      if (!last) last = t;
      const dt = (t - last) / 1000;
      last = t;
      if (!paused.current) {
        scroller.scrollTop += pxPerSecond * dt;
        const seam = copy.offsetHeight;
        if (scroller.scrollTop >= seam) scroller.scrollTop -= seam;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [overflowing, pxPerSecond]);

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  return (
    <div
      ref={scrollRef}
      className={`no-scrollbar overflow-y-auto overscroll-contain ${heightClass} ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onTouchCancel={resume}
    >
      <div ref={firstCopyRef}>{children}</div>
      {/* Second copy only when looping, for the seamless wrap. */}
      {overflowing && <div aria-hidden="true">{children}</div>}
    </div>
  );
}
