"use client";

import * as React from "react";

/**
 * Scroll-spy: returns the id of the section currently nearest the top of the
 * viewport. Uses a single IntersectionObserver over the given ids.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = React.useState(ids[0] ?? "");

  React.useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
