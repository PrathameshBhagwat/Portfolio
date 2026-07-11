"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const SmoothScrollContext = createContext(null);

/**
 * Provides a premium smooth-scroll experience using Lenis, synchronized with GSAP ScrollTrigger.
 * Respects prefers-reduced-motion. Supports wheel, trackpad, keyboard, and touch.
 */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setTimeout(() => setReady(true), 0);
      return;
    }

    let raf;
    let lenis;

    const init = async () => {
      const Lenis = (await import("lenis")).default;
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default || gsapModule.gsap;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.1,            // Slightly above 1 for gentle momentum
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out (Apple-like)
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        smoothTouch: false,       // Let mobile OS native physics manage scroll gesture inertia
        wheelMultiplier: 1.0,     // 1:1 feel — no amplification
        infinite: false,
        autoResize: true,
      });

      lenisRef.current = lenis;

      // Synchronize Lenis scroll position → GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Use GSAP ticker as the single RAF loop (avoids double-RAF jank)
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // GSAP sends seconds, Lenis wants ms
      });
      gsap.ticker.lagSmoothing(0); // Prevent GSAP from throttling on slow frames

      // Remove native scroll-behavior:smooth — Lenis handles it now
      document.documentElement.style.scrollBehavior = "auto";

      setReady(true);
    };

    init();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenisRef}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

/**
 * Hook to access the Lenis instance for imperative control.
 * Returns a ref whose `.current` is the Lenis instance (or null before init).
 */
export function useLenis() {
  return useContext(SmoothScrollContext);
}

/**
 * Hook for smooth anchor scrolling.
 * Returns a function: scrollTo(target, options)
 *   target: CSS selector string (e.g. "#about") or number (pixel offset)
 *   options: { offset, duration, immediate, onComplete }
 */
export function useSmoothScroll() {
  const lenisRef = useContext(SmoothScrollContext);

  return (target, options = {}) => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: options.offset ?? -80,  // Respect fixed navbar height (~72px + buffer)
        duration: options.duration ?? 1.2,
        immediate: options.immediate ?? false,
        onComplete: options.onComplete,
      });
    } else {
      // Fallback for reduced-motion or before init
      const el = typeof target === "string" ? document.querySelector(target) : null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
}
