"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// mobile e address bar ar-nam korle ScrollTrigger jeno jump na kore
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Oran — CTA
 * Full-bleed image, dark overlay, copy sits on the same 47% column line as the footer.
 * Only motion: slow parallax on the image while the section scrolls through.
 */

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

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    // matchMedia: screen size change / reduced motion hole nijei revert hoye abar setup hoy
    const mm = gsap.matchMedia();

    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { reduce, isMobile } = context.conditions as { reduce: boolean; isMobile: boolean };
        if (reduce) return;

        // mobile e parallax kom (image er 120% height er bhetor-i thake, kinar faka dekha jay na)
        const amount = isMobile ? 5 : 8;

        gsap.fromTo(
          img,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      },
      section
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="cta-heading"
      // 100svh = full screen; svh use korsi jate mobile address bar e lafay na
      className="relative z-10 flex h-[100svh] min-h-[480px] items-center overflow-hidden bg-neutral-900 text-white sm:min-h-[560px]"
    >
      {/* Image (oversized so parallax never shows edges) */}
      <div ref={imgRef} className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
        <Image
          src="/ctabanner.jpg"
          alt="A calm interior designed by Oran"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* mobile e text image er upor, tai overlay ektu dark */}
      <div aria-hidden className="absolute inset-0 bg-black/45 md:bg-black/35" />

      {/* Content */}
      {/* padding baire, content 1600px: Footer er sathe same container, tai 47% line mile thake */}
      <div className="relative w-full px-6 md:px-10">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 md:grid-cols-[47fr_53fr]">
          <div className="md:col-start-2">
          <h2
            id="cta-heading"
            className="mb-6 text-[clamp(1.5rem,5.6vw,1.9rem)] font-normal leading-[1.15] tracking-tight md:mb-8 md:text-[clamp(1.5rem,2.6vw,2.5rem)]"
          >
            Have a space in mind?
            <br />
            Let&rsquo;s shape it, from the first sketch to the final styling.
          </h2>

          <OutlineButton href="/" tone="light">
            Tell Us About Your Project
          </OutlineButton>
          </div>
        </div>
      </div>
    </section>
  );
}