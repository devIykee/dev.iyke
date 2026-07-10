"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal sibling of AutoScrollY: a single-row strip that auto-scrolls left
 * on a slow, seamless loop when its content overflows the width. If everything
 * fits, it renders statically. Real scroll container (manual drag/scroll works),
 * content duplicated for the seamless wrap, pauses on hover/focus/touch, no
 * visible scrollbar, honors reduced-motion.
 */
export default function AutoScrollX({
  children,
  className = "",
  pxPerSecond = 40,
  gapClass = "gap-4",
}: {
  children: ReactNode;
  className?: string;
  pxPerSecond?: number;
  gapClass?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const paused = useRef(false);

  useEffect(() => {
    const scroller = scrollRef.current;
    const copy = firstCopyRef.current;
    if (!scroller || !copy) return;
    const measure = () => setOverflowing(copy.offsetWidth > scroller.clientWidth + 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(copy);
    ro.observe(scroller);
    return () => ro.disconnect();
  }, [children]);

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
        scroller.scrollLeft += pxPerSecond * dt;
        const seam = copy.offsetWidth;
        if (scroller.scrollLeft >= seam) scroller.scrollLeft -= seam;
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
      className={`no-scrollbar overflow-x-auto overscroll-x-contain ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onTouchCancel={resume}
    >
      <div className="flex w-max">
        <div ref={firstCopyRef} className={`flex ${gapClass} pr-4`}>
          {children}
        </div>
        {overflowing && (
          <div className={`flex ${gapClass} pr-4`} aria-hidden="true">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
