"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/** Ambient visuals only run while visible and respect system motion preferences. */
export function useAmbientPlayback() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return {
    ref,
    reducedMotion: Boolean(reducedMotion),
    canPlay: inView && pageVisible && reducedMotion === false,
  };
}
