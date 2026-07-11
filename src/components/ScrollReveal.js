"use client";

import { useEffect } from "react";

/**
 * ScrollReveal — adds subtle entry animations to major sections.
 * Uses GSAP ScrollTrigger (already synced with Lenis via SmoothScrollProvider).
 *
 * Effects applied:
 *  • Sections: fade in + 20px upward slide + blur removal
 *  • Section titles/subtitles: slight stagger
 *  • Background shapes: subtle parallax (5–10px)
 *
 * All effects are GPU-friendly (transform + opacity + filter only).
 * Respects prefers-reduced-motion.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ctx;

    const init = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default || gsapModule.gsap;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      // Create a GSAP context for clean teardown
      ctx = gsap.context(() => {

        // ──────────────────────────────────────────────
        // 1) Section-level fade-in + slide-up + unblur
        // ──────────────────────────────────────────────
        const sections = document.querySelectorAll("section");
        sections.forEach((section) => {
          // Animate the section title and subtitle with stagger
          const title = section.querySelector(".section-title");
          const subtitle = section.querySelector(".section-subtitle");
          const staggerElements = [title, subtitle].filter(Boolean);

          if (staggerElements.length > 0) {
            gsap.fromTo(
              staggerElements,
              {
                y: 20,
                opacity: 0,
                filter: "blur(4px)",
              },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
                  end: "top 50%",
                  toggleActions: "play none none none",
                },
              }
            );
          }

          // Animate major direct children (grids, containers) — not every element
          const contentBlocks = section.querySelectorAll(
            ".container > div, .container > form, .container > ul"
          );
          if (contentBlocks.length > 0) {
            gsap.fromTo(
              contentBlocks,
              {
                y: 15,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 75%",
                  end: "top 40%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
        });

        // ──────────────────────────────────────────────
        // 2) Subtle parallax for background shapes (5-10px)
        // ──────────────────────────────────────────────
        const shapes = document.querySelectorAll(".shape, .floatingTechNode");
        shapes.forEach((shape) => {
          const speed = parseFloat(shape.dataset.parallaxSpeed) || 0.03;
          gsap.to(shape, {
            yPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: shape.closest("main") || document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,  // Smooth interpolation, not instant
            },
          });
        });

      }); // end gsap.context
    };

    init();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return null; // Purely side-effect component
}
