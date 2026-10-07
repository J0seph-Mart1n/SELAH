import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * True once the sentinel (rendered by the page at `threshold` px from the
 * document top) leaves the viewport. IntersectionObserver, no scroll listener.
 */
export function useScrolled(): {
  scrolled: boolean;
  sentinelRef: RefObject<HTMLSpanElement | null>;
} {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { scrolled, sentinelRef };
}

interface InViewOptions extends IntersectionObserverInit {
  /** Stop observing after the first intersection (default true). */
  once?: boolean;
}

/** True while the element is inside the viewport (IntersectionObserver). */
export function useInView(
  ref: RefObject<HTMLElement | null>,
  options: InViewOptions = {}
): boolean {
  const { once = true, threshold = 0.15, root = null, rootMargin = "0px" } = options;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // deferred so SSR HTML and first client render stay identical
      const t = window.setTimeout(() => setInView(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, root, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, threshold, root, rootMargin]);

  return inView;
}
