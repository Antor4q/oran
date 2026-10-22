"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// mobile e address bar ar-nam korle ScrollTrigger jeno jump na kore
ScrollTrigger.config({ ignoreMobileResize: true });

const TITLE_LINES = ["Ten years of designing", "spaces people love."];

// nijer number bosiye nio
const STATS = [
  { value: 120, suffix: "+", label: "Projects completed" },
  { value: 10, suffix: "", label: "Years of experience" },
  { value: 8, suffix: "", label: "Design awards" },
  { value: 95, suffix: "%", label: "Clients who come back" },
];

export default function Stats() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ---- title: line by line mask reveal ----
      gsap.from(root.querySelectorAll(".stats-line-inner"), {
        yPercent: 115,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
      });

      // ---- stats: line draw + count up + label fade ----
      gsap.utils.toArray<HTMLElement>(".stat", root).forEach((stat, i) => {
        const rule = stat.querySelector<HTMLElement>(".stat-rule");
        const num = stat.querySelector<HTMLElement>(".stat-num");
        const suffix = stat.querySelector<HTMLElement>(".stat-suffix");
        const label = stat.querySelector<HTMLElement>(".stat-label");
        const target = STATS[i].value;

        const enter = { trigger: stat, start: "top 90%", once: true };

        gsap.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, ease: "power4.inOut", scrollTrigger: enter }
        );

        if (num) {
          num.textContent = "0";
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 2.2,
            ease: "power3.out",
            delay: 0.2,
            onUpdate: () => {
              num.textContent = String(Math.round(counter.v));
            },
            onComplete: () => {
              num.textContent = String(target);
            },
            scrollTrigger: enter,
          });
        }

        gsap.from(suffix, {
          opacity: 0,
          y: 12,
          duration: 0.8,
          delay: 0.8,
          ease: "power3.out",
          scrollTrigger: enter,
        });
        gsap.from(label, {
          opacity: 0,
          y: 18,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: enter,
        });
      });
    }, root);

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="stats"
      className="mx-2 overflow-hidden rounded-[28px] bg-neutral-900 px-5 py-14 text-white sm:mx-3 sm:px-6 sm:py-16 md:mx-4 md:rounded-[48px] md:px-10 md:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Title: mobile e alada clamp, jate 320px e "Ten years of designing" 2 line e na bhange */}
        <h2
          ref={titleRef}
          className="text-[clamp(26px,7.2vw,56px)] font-normal leading-[1.04] tracking-[-0.03em] md:text-[clamp(32px,5vw,88px)]"
        >
          {TITLE_LINES.map((line) => (
            <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <span className="stats-line-inner block">{line}</span>
            </span>
          ))}
        </h2>

        {/* Stats: mobile + tablet 2x2, desktop (lg) 4 column */}
        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:mt-14 md:mt-24 md:gap-x-8 md:gap-y-14 lg:mt-32 lg:grid-cols-4 lg:gap-x-10"
        >
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <div className="stat-rule h-px w-full origin-left bg-white/30" />

              {/* screen reader ke shesh value ta pore dao, animate howa number na */}
              <span className="sr-only">
                {s.value}
                {s.suffix} {s.label}
              </span>

              <div aria-hidden="true" className="mt-5 flex items-start leading-none md:mt-8">
                {/* minWidth: count up er somoy number er width bodlay na, tai suffix lafay na */}
                <span
                  className="stat-num inline-block text-[clamp(44px,8vw,140px)] font-normal tabular-nums tracking-[-0.04em]"
                  style={{ minWidth: `${String(s.value).length}ch` }}
                >
                  {s.value}
                </span>
                {s.suffix && (
                  <span className="stat-suffix ml-1 mt-[0.35em] text-[clamp(18px,2.6vw,44px)] font-normal leading-none text-white/70">
                    {s.suffix}
                  </span>
                )}
              </div>

              <p
                aria-hidden="true"
                className="stat-label mt-4 max-w-[22ch] text-[14px] leading-snug text-neutral-400 sm:text-[15px] md:mt-6 md:text-[17px]"
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}