"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// mobile e address bar ar-nam korle ScrollTrigger jeno jump na kore
ScrollTrigger.config({ ignoreMobileResize: true });

const TITLE_LINES = ["Thoughtful design", "for everyday living."];

const DESCRIPTION =
  "Every project begins with listening. We study the light, the way you move through a room and the things you love, then shape a space that feels effortless to live in.";

// mover = pura frame ta koto speed e shore, inner = frame er bhitor image ta koto shore
const IMAGES = [
  {
    src: "/intro1.jpg",
    alt: "Oak kitchen with olive tiles, wall lights and framed art",
    sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 42vw, (min-width: 640px) 60vw, 85vw",
    mover: 8,
    inner: 8,
    ratio: "aspect-[4/5]",
    // mobile: 85% width, tablet portrait: 60%, md+: grid column
    slot: "w-[85%] sm:w-[60%] md:col-span-5 md:col-start-1 md:row-span-2 md:row-start-2 md:w-full lg:col-span-4",
  },
  {
    src: "/intro2.jpg",
    alt: "Round oak dining table with red chairs in soft afternoon light",
    sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 70vw",
    mover: 16,
    inner: -8,
    ratio: "aspect-[3/2]",
    slot: "ml-auto w-[70%] sm:w-[50%] md:col-span-4 md:col-start-9 md:row-start-3 md:self-end md:w-full lg:col-span-3 lg:col-start-10",
  },
];

export default function Intro() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 768px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
        if (reduce) return;

        // ---- title: line by line mask reveal ----
        gsap.from(root.querySelectorAll(".intro-line-inner"), {
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

        // mobile e images stacked, tai bhaari parallax korle ek ta arek tar upor uthe jay.
        // tai mobile e frame er move 40% e kommiye dilam.
        const moverFactor = desktop ? 1 : 0.4;

        // ---- images: entrance + 2 layer parallax ----
        root.querySelectorAll<HTMLElement>(".intro-slot").forEach((slot, i) => {
          const mover = slot.querySelector<HTMLElement>(".intro-mover");
          const frame = slot.querySelector<HTMLElement>(".intro-frame");
          const inner = slot.querySelector<HTMLElement>(".intro-inner");
          const scale = slot.querySelector<HTMLElement>(".intro-scale");
          const cfg = IMAGES[i];

          const enter = { trigger: slot, start: "top 88%", once: true };

          gsap.fromTo(
            frame,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut", scrollTrigger: enter }
          );
          gsap.fromTo(
            scale,
            { scale: 1.3 },
            { scale: 1, duration: 2, ease: "power3.out", scrollTrigger: enter }
          );

          const scrub = { trigger: slot, start: "top bottom", end: "bottom top", scrub: true };
          const m = cfg.mover * moverFactor;

          gsap.fromTo(mover, { yPercent: m }, { yPercent: -m, ease: "none", scrollTrigger: scrub });
          gsap.fromTo(
            inner,
            { yPercent: -cfg.inner },
            { yPercent: cfg.inner, ease: "none", scrollTrigger: scrub }
          );
        });
      }
    );

    // screen rotate / resize hole breakpoint change e nijei revert + abar setup hobe
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="intro"
      className="w-full overflow-hidden bg-white px-5 py-14 text-neutral-900 sm:px-6 sm:py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10 md:gap-y-12">
        {/* Title: mobile e alada clamp, jate 320px e "for everyday living." 2 line e na bhange */}
        <h2
          ref={titleRef}
          className="text-[clamp(30px,9vw,56px)] font-normal leading-[1.04] tracking-[-0.03em] md:col-span-9 md:text-[clamp(36px,5vw,88px)]"
        >
          {TITLE_LINES.map((line) => (
            <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <span className="intro-line-inner block">{line}</span>
            </span>
          ))}
        </h2>

        {/* Description: tablet e wide (5 col), desktop e right column er upore */}
        <p
          ref={descRef}
          className="max-w-[46ch] text-[17px] font-normal leading-snug text-neutral-800 sm:text-[18px] md:col-span-5 md:col-start-8 md:row-start-2 md:text-[19px] lg:col-span-4 lg:col-start-9 lg:text-[20px]"
        >
          {DESCRIPTION}
        </p>

        {/* Images */}
        {IMAGES.map((img) => (
          <div key={img.src} className={`intro-slot ${img.slot}`}>
            <div className="intro-mover">
              <div className={`intro-frame relative w-full overflow-hidden bg-neutral-200 ${img.ratio}`}>
                {/* 120% height: parallax er somoy kinar a faka dekha jabe na */}
                <div className="intro-inner absolute inset-x-0 -top-[10%] h-[120%]">
                  <div className="intro-scale relative h-full w-full">
                    <Image src={img.src} alt={img.alt} fill sizes={img.sizes} className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}