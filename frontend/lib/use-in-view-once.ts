"use client";

import * as React from "react";

/**
 * Returns a ref + boolean that flips true the first time the element enters the
 * viewport (and stays true). Used to defer mounting heavy R3F canvases until
 * they're actually scrolled near — saves GPU/battery on a long page.
 */
export function useInViewOnce<T extends HTMLElement>(rootMargin = "200px") {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}
