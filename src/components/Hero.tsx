"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// mobile e address bar ar-nam korle ScrollTrigger jeno refresh/jump na kore
ScrollTrigger.config({ ignoreMobileResize: true });

const LINES = ["Rooms that", "hold your story."];

/* ------------------------------------------------------------------ */
/* Outline button: hover e niche theke fill uthe ashe (GSAP)           */
/* tone="dark"  -> white bg er upor                                    */
/* tone="light" -> photo er upor                                       */
/* ------------------------------------------------------------------ */
function OutlineButton({
  href,
  children,
  tone = "dark",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const base = tone === "dark" ? "#171717" : "#ffffff";
  const hover = tone === "dark" ? "#ffffff" : "#171717";

  const enter = () => {
    gsap.to(fillRef.current, { yPercent: -100, duration: 0.45, ease: "power3.out", overwrite: true });
    gsap.to(btnRef.current, { color: hover, duration: 0.3, ease: "power2.out", overwrite: true });
  };
  const leave = () => {
    gsap.to(fillRef.current, { yPercent: 0, duration: 0.45, ease: "power3.out", overwrite: true });
    gsap.to(btnRef.current, { color: base, duration: 0.3, ease: "power2.out", overwrite: true });
  };

  // touch device e tap korle fill atke thakto, tai shudhu real hover device e chalabo
  const canHover = () => window.matchMedia("(hover: hover)").matches;

  const toneClass =
    tone === "dark"
      ? "border-neutral-900 text-neutral-900 focus-visible:outline-neutral-900"
      : "border-white text-white focus-visible:outline-white";

  return (
    <Link
      ref={btnRef}
      href={href}
      onMouseEnter={() => canHover() && enter()}
      onMouseLeave={() => canHover() && leave()}
      // mouse click e focus hole fill na uthe, shudhu keyboard focus e uthbe
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && enter()}
      onBlur={leave}
      className={`relative inline-flex h-11 shrink-0 items-center overflow-hidden border px-5 text-[17px] font-medium sm:text-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${toneClass} ${className}`}
    >
      <span
        aria-hidden="true"
        ref={fillRef}
        className={`absolute inset-x-0 top-full h-full ${tone === "dark" ? "bg-neutral-900" : "bg-white"}`}
      />
      <span className="relative">{children}</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const media = mediaRef.current;

    const ctx = gsap.context(() => {
      // ---- page load sequence ----
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".hero-line-inner", { yPercent: 115, duration: 1.3, stagger: 0.12, delay: 0.15 })
        .from(".hero-fade", { opacity: 0, y: 22, duration: 0.9, stagger: 0.12 }, "-=0.9")
        .fromTo(
          media,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut" },
          "-=1.0"
        )
        .fromTo(".hero-img-scale", { scale: 1.35 }, { scale: 1, duration: 2, ease: "power3.out" }, "<")
        .from(".hero-overlay", { opacity: 0, y: 24, duration: 0.9 }, "-=0.7");

      // ---- scroll parallax ----
      const st = { trigger: media, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo(".hero-img", { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: st });
      gsap.fromTo(".hero-zoom", { scale: 1 }, { scale: 1.12, ease: "none", scrollTrigger: st });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="home"
      className="w-full bg-white px-5 pb-6 pt-24 text-neutral-900 sm:px-6 sm:pb-8 sm:pt-28 md:px-10 md:pb-10 md:pt-32"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          {/* Mobile e alada clamp: 320px phone e "hold your story." jeno 2 line e na bhange */}
          <h1 className="text-[clamp(34px,10vw,64px)] font-normal leading-[1.02] tracking-[-0.03em] md:col-span-7 md:text-[clamp(40px,6vw,108px)]">
            {LINES.map((line) => (
              <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                <span className="hero-line-inner block">{line}</span>
              </span>
            ))}
          </h1>

          <div className="flex flex-col items-start gap-6 md:col-span-5 md:pt-3">
            <p className="hero-fade max-w-[46ch] text-[17px] font-normal leading-snug text-neutral-800 sm:text-[18px] md:text-[20px]">
              From first sketch to final styling, we design interiors around how you live, with
              natural materials, honest detail and a calm sense of order.
            </p>
            <OutlineButton href="#projects" tone="dark" className="hero-fade">
              Explore our work
            </OutlineButton>
          </div>
        </div>

        {/* Photo */}
        <div
          ref={mediaRef}
          className="relative mt-8 aspect-[4/5] w-full overflow-hidden bg-neutral-200 min-[480px]:aspect-[4/3] sm:mt-10 sm:aspect-[16/10] md:mt-12 md:aspect-[2.1/1]"
        >
          {/* 130% height: parallax er somoy kinar a faka dekha jabe na */}
          <div className="hero-img absolute inset-x-0 -top-[15%] h-[130%]">
            <div className="hero-zoom h-full w-full">
              <div className="hero-img-scale relative h-full w-full">
                <Image
                  src="/oranBanner.jpg"
                  alt="Warm kitchen and dining space with olive tiles, oak cabinetry and afternoon light"
                  fill
                  priority
                  sizes="(min-width: 1600px) 1520px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* text ta jeno porha jay, tai niche halka gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent sm:h-1/2 sm:from-black/55"
          />

          {/* Left: title, Right: view project button */}
          <div className="hero-overlay absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:p-6 md:p-8">
            <h2 className="max-w-[16ch] text-[clamp(24px,3.2vw,52px)] font-normal leading-[1.05] tracking-[-0.02em] text-white">
              Oak &amp; Olive Kitchen
            </h2>
            <OutlineButton href="#projects" tone="light">
              View project
            </OutlineButton>
          </div>
        </div>
      </div>
    </section>
  );
}