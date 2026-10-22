"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// mobile e address bar ar-nam korle ScrollTrigger jeno jump na kore
ScrollTrigger.config({ ignoreMobileResize: true });

type Mark = {
  name: string;
  style?: string;
};

const TITLE_LINES = ["Seen where design", "is taken seriously."];

const DESCRIPTION =
  "Our work has been featured in design journals and trusted by hotels, developers and families across Dhaka.";

const PRESS: Mark[] = [
  { name: "Dwell & Dhaka", style: "font-light tracking-[0.06em]" },
  { name: "Architectural Digest BD", style: "font-normal tracking-[0.04em]" },
  { name: "The Daily Interior", style: "font-light tracking-[0.1em]" },
  { name: "Habitat Journal", style: "font-medium tracking-[0.05em]" },
  { name: "Form & Fold", style: "font-light tracking-[0.08em]" },
  { name: "Studio Quarterly", style: "font-normal tracking-[0.06em]" },
];

const CLIENTS: Mark[] = [
  { name: "Olive & Oak", style: "font-light tracking-[0.06em]" },
  { name: "Northfield Hotels", style: "font-medium tracking-[0.04em]" },
  { name: "Casa Terra", style: "font-light tracking-[0.08em]" },
  { name: "Meridian Group", style: "font-normal tracking-[0.06em]" },
  { name: "Banyan Living", style: "font-light tracking-[0.1em]" },
  { name: "Atelier Nine", style: "font-medium tracking-[0.05em]" },
];

type RowProps = {
  items: Mark[];
  reverse?: boolean;
  speed?: number;
};

function Row({ items, reverse = false, speed = 55 }: RowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 }
    );

    // touch device e tap korle slow-down atke thakto, tai shudhu real hover device e
    const canHover = () => window.matchMedia("(hover: hover)").matches;

    const slowDown = () => {
      if (!canHover()) return;
      gsap.to(tween, { timeScale: 0.15, duration: 0.8, ease: "power2.out", overwrite: true });
    };
    const resume = () => {
      if (!canHover()) return;
      gsap.to(tween, { timeScale: 1, duration: 0.8, ease: "power2.out", overwrite: true });
    };

    container.addEventListener("mouseenter", slowDown);
    container.addEventListener("mouseleave", resume);

    // screen er baire thakle marquee pause, jate phone e CPU/battery kharap na hoy
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tween.resume() : tween.pause()),
    });

    return () => {
      st.kill();
      container.removeEventListener("mouseenter", slowDown);
      container.removeEventListener("mouseleave", resume);
      gsap.killTweensOf(tween);
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  }, [reverse, speed]);

  const loop = [...items, ...items];

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Scrolling names"
      className="relative overflow-hidden motion-reduce:overflow-x-auto"
      style={{
        maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {loop.map((mark, index) => (
          <div
            key={`${mark.name}-${index}`}
            aria-hidden={index >= items.length ? true : undefined}
            className="flex shrink-0 items-center"
          >
            <span
              className={[
                "whitespace-nowrap px-6",
                "text-[clamp(1.1rem,2.2vw,2rem)]",
                "uppercase leading-none text-neutral-900/80",
                "transition-colors duration-300 hover:text-neutral-900",
                "md:px-10",
                mark.style ?? "",
              ].join(" ")}
            >
              {mark.name}
            </span>

            <span aria-hidden="true" className="h-px w-6 shrink-0 bg-neutral-300 md:w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Press() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ---- title: line by line mask reveal ----
      gsap.from(root.querySelectorAll(".press-line-inner"), {
        yPercent: 115,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
      });

      // ---- description: fade + up ----
      gsap.from(descRef.current, {
        opacity: 0,
        y: 28,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: descRef.current, start: "top 90%", once: true },
      });
    }, root);

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="press-heading"
      className="overflow-hidden bg-white pb-14 text-neutral-900 sm:pb-16 md:pb-20 lg:pb-28"
    >
      {/* Header: title left, description right (lg+), Team er moto same style */}
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          {/* mobile/tablet e full width, tai heading boro; lg e column, tai alada clamp */}
          <h2
            id="press-heading"
            ref={titleRef}
            className="text-[clamp(30px,9vw,60px)] font-normal leading-[1.04] tracking-[-0.03em] lg:col-span-8 lg:text-[clamp(40px,5vw,88px)]"
          >
            {TITLE_LINES.map((line) => (
              <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                <span className="press-line-inner block">{line}</span>
              </span>
            ))}
          </h2>

          <p
            ref={descRef}
            className="max-w-[46ch] text-[17px] font-normal leading-snug text-neutral-800 sm:text-[18px] md:text-[20px] lg:col-span-4"
          >
            {DESCRIPTION}
          </p>
        </div>
      </div>

      {/* Scrolling rows */}
      <div className="mx-auto mt-12 flex max-w-[1600px] flex-col gap-0 sm:mt-14 md:mt-20 lg:mt-24">
        <div className="border-y border-neutral-200 py-7 md:py-10">
          <Row items={PRESS} speed={55} />
        </div>

        <div className="border-b border-neutral-200 py-7 md:py-10">
          <Row items={CLIENTS} reverse speed={70} />
        </div>
      </div>
    </section>
  );
}