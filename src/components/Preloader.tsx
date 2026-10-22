"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TAGLINE = "Spaces shaped around the way you live.".split(" ");

/**
 * Oran — Preloader
 * Counter 0 → 85 nijei cholbe (minimum ~1.8s), tarpor real load + fonts ready hole 100 e jabe,
 * text upore uthe jabe, ar curtain upore uthe site dekha dibe.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const counterEl = counterRef.current;
    if (!root || !counterEl) return;

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden"; // loading cholar shomoy scroll bondho

    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // page load + fonts, duitai ready hole tarpor exit
    const ready = Promise.all([
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true })),
      document.fonts ? document.fonts.ready : Promise.resolve(),
    ]);

    const finish = () => {
      if (cancelled) return;
      html.style.overflow = prevOverflow;
      html.dataset.loaded = "true";
      window.dispatchEvent(new Event("preloader:done"));
      ScrollTrigger.refresh(); // layout settle howar por trigger position thik kora
      setDone(true);
    };

    const ctx = gsap.context(() => {
      // reduced motion: shudhu fade out
      if (reduce) {
        ready.then(() => {
          if (cancelled) return;
          ctx.add(() => gsap.to(root, { opacity: 0, duration: 0.3, onComplete: finish }));
        });
        return;
      }

      const counter = { v: 0 };
      const paint = () => {
        counterEl.textContent = String(Math.round(counter.v)).padStart(3, "0");
      };

      gsap.set("[data-pl='line']", { scaleX: 0, transformOrigin: "left center" });

      // intro: tagline word by word mask diye uthbe
      gsap.from("[data-pl='fade']", {
        opacity: 0,
        y: 12,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from("[data-pl='word']", {
        yPercent: 110,
        duration: 1,
        stagger: 0.06,
        delay: 0.1,
        ease: "expo.out",
      });

      // fake progress 85% porjonto, baki ta real load er por
      gsap
        .timeline({ onComplete: () => ready.then(() => !cancelled && ctx.add(exit)) })
        .to(counter, { v: 85, duration: 1.8, ease: "power2.inOut", onUpdate: paint })
        .to("[data-pl='line']", { scaleX: 0.85, duration: 1.8, ease: "power2.inOut" }, 0);

      function exit() {
        gsap
          .timeline({ onComplete: finish })
          .to(counter, { v: 100, duration: 0.5, ease: "power1.out", onUpdate: paint })
          .to("[data-pl='line']", { scaleX: 1, duration: 0.5, ease: "power1.out" }, "<")
          .to(
            "[data-pl='word']",
            { yPercent: -110, duration: 0.6, stagger: 0.04, ease: "power3.in" },
            ">+0.15"
          )
          .to("[data-pl='fade']", { opacity: 0, duration: 0.4, ease: "power2.in" }, "<")
          // curtain: niche theke upore uthe site reveal kore
          .to(
            root,
            { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" },
            "-=0.2"
          );
      }
    }, root);

    return () => {
      cancelled = true;
      ctx.revert();
      html.style.overflow = prevOverflow;
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      className="fixed inset-0 z-[100] flex h-[100svh] flex-col justify-between bg-neutral-900 px-6 py-6 text-white md:px-10 md:py-8"
    >
      {/* Top */}
      <div className="mx-auto flex w-full max-w-[1600px] items-start justify-between text-sm">
        <span data-pl="fade">Oran Studio</span>
        <span data-pl="fade" className="text-white/60">
          Interior Design Studio
        </span>
      </div>

      {/* Tagline: footer/CTA er moto 47% line e */}
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 md:grid-cols-[47fr_53fr]">
        <p className="flex flex-wrap gap-x-[0.3em] text-[clamp(1.5rem,5.6vw,1.9rem)] font-normal leading-[1.15] tracking-tight md:col-start-2 md:text-[clamp(1.5rem,2.6vw,2.5rem)]">
          {TAGLINE.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.1em]">
              <span data-pl="word" className="inline-block">
                {w}
              </span>
            </span>
          ))}
        </p>
      </div>

      {/* Bottom */}
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="h-px w-full bg-white/20">
          <div data-pl="line" className="h-px w-full bg-white" />
        </div>
        <div className="mt-4 flex items-end justify-between">
          <span
            ref={counterRef}
            className="text-[clamp(5rem,20vw,18rem)] font-normal leading-[0.8] tracking-tighter tabular-nums"
          >
            000
          </span>
          <span data-pl="fade" className="pb-1 text-sm text-white/60">
            Loading
          </span>
        </div>
      </div>
    </div>
  );
}