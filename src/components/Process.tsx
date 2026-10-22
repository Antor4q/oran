"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// mobile e address bar ar-nam korle ScrollTrigger jeno jump na kore
ScrollTrigger.config({ ignoreMobileResize: true });

interface Step {
  title: string;
  duration: string;
  description: string;
  tags: string;
  image: string;
  alt: string;
}

const TITLE_LINES = ["From first idea", "to final handover."];

const DESCRIPTION =
  "Every project follows the same calm, transparent path. You always know where we are, what comes next and what it takes to get there.";

// image gulo nijer moto bodle nio
const STEPS: Step[] = [
  {
    title: "Consultation",
    duration: "Week 1",
    description:
      "We start by listening. A site visit, a conversation about how you live, and a clear brief and budget to guide every decision.",
    tags: "Site visit · Brief · Budget",
    image: "/pro6.webp",
    alt: "Living room with a blue modular sofa and framed art",
  },
  {
    title: "Concept",
    duration: "Weeks 2–3",
    description:
      "Mood boards, material palettes and first layouts that capture the feeling of the space before any detail is fixed.",
    tags: "Mood boards · Materials · Layouts",
    image: "/pro8.webp",
    alt: "Open kitchen and green sofa lounge in warm light",
  },
  {
    title: "Design",
    duration: "Weeks 4–6",
    description:
      "Detailed drawings, 3D visuals, custom furniture and lighting plans, refined with you until everything feels right.",
    tags: "Drawings · 3D visuals · Furniture",
    image: "/design.webp",
    alt: "Creative office with oak desks and soft pendant lighting",
  },
  {
    title: "Execution",
    duration: "Weeks 7–16",
    description:
      "We manage contractors, craftsmen and deliveries on site, keeping quality, timeline and budget under control.",
    tags: "Site management · Sourcing · Quality checks",
    image: "/pro4.webp",
    alt: "Boutique hotel lobby with terracotta walls and rattan seating",
  },
  {
    title: "Handover",
    duration: "Final week",
    description:
      "Final styling, a walkthrough and a care guide. We hand you a home that is ready to be lived in.",
    tags: "Styling · Walkthrough · Care guide",
    image: "/pro5.webp",
    alt: "Minimal bedroom with linen bedding and a wooden bench",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // matchMedia: screen size change hole animation nijei abar setup hoy
    const mm = gsap.matchMedia();

    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { reduce, isDesktop, isMobile } = context.conditions as {
          reduce: boolean;
          isDesktop: boolean;
          isMobile: boolean;
        };
        if (reduce) return;

        const k = isMobile ? 0.5 : 1; // choto screen e parallax kom

        // ---- title: line by line mask reveal ----
        gsap.from(root.querySelectorAll(".process-line-inner"), {
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

        // ---- steps ----
        const steps = gsap.utils.toArray<HTMLElement>(".process-step", root);

        // desktop e je step viewport er majhe sheta full, baki gulo halka
        if (isDesktop) {
          gsap.set(root.querySelectorAll(".process-body"), { opacity: 0.3 });
        }

        steps.forEach((step) => {
          const rule = step.querySelector<HTMLElement>(".process-rule");
          const body = step.querySelector<HTMLElement>(".process-body");
          const text = step.querySelectorAll<HTMLElement>(".process-text");
          const frame = step.querySelector<HTMLElement>(".process-frame");
          const scale = step.querySelector<HTMLElement>(".process-scale");
          const inner = step.querySelector<HTMLElement>(".process-inner");

          const enter = { trigger: step, start: "top 88%", once: true };

          gsap.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.4, ease: "power4.inOut", scrollTrigger: enter }
          );
          gsap.from(text, {
            opacity: 0,
            y: 24,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.2,
            scrollTrigger: enter,
          });
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

          gsap.fromTo(
            inner,
            { yPercent: -8 * k },
            {
              yPercent: 8 * k,
              ease: "none",
              scrollTrigger: { trigger: step, start: "top bottom", end: "bottom top", scrub: true },
            }
          );

          if (isDesktop && body) {
            ScrollTrigger.create({
              trigger: step,
              start: "top 70%",
              end: "bottom 40%",
              onToggle: (self) =>
                gsap.to(body, {
                  opacity: self.isActive ? 1 : 0.3,
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: "auto",
                }),
            });
          }
        });
      },
      root
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="process"
      // overflow-clip (hidden na): hidden dile sticky kaj kore na
      className="w-full overflow-clip bg-white px-5 pb-14 text-neutral-900 sm:px-6 sm:pb-16 md:px-10 md:pb-20 lg:pb-28"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-y-12 sm:gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        {/* Left: sticky title + description (sticky shudhu lg+ e) */}
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          {/* mobile/tablet e single column, tai heading boro; lg e column choto, tai alada clamp */}
          <h2
            ref={titleRef}
            className="text-[clamp(30px,9vw,60px)] font-normal leading-[1.04] tracking-[-0.03em] lg:text-[clamp(40px,4vw,68px)]"
          >
            {TITLE_LINES.map((line) => (
              <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                <span className="process-line-inner block">{line}</span>
              </span>
            ))}
          </h2>

          <p
            ref={descRef}
            className="mt-6 max-w-[42ch] text-[17px] font-normal leading-snug text-neutral-800 sm:text-[18px] md:mt-8 md:text-[20px]"
          >
            {DESCRIPTION}
          </p>
        </div>

        {/* Right: steps */}
        <div className="flex flex-col gap-y-16 sm:gap-y-20 md:gap-y-28 lg:col-span-6 lg:col-start-7 lg:gap-y-44">
          {STEPS.map((s, i) => (
            <article key={s.title} className="process-step">
              <div className="process-rule h-px w-full origin-left bg-neutral-900/25" />

              <div className="process-body pt-5 md:pt-6">
                {/* header row: title wrap korte pare, duration kokhono bhange na */}
                <div className="process-text flex items-baseline justify-between gap-3 md:gap-4">
                  <div className="flex min-w-0 items-baseline gap-4 md:gap-6">
                    {/* fixed width: jate niche er description er indent ta thik line up hoy */}
                    <span className="inline-block w-6 shrink-0 text-[15px] tabular-nums text-neutral-500 md:w-8 md:text-[17px]">
                      {pad(i + 1)}
                    </span>
                    <h3 className="text-[24px] font-normal leading-[1.05] tracking-[-0.02em] sm:text-[30px] lg:text-[clamp(28px,2.6vw,44px)]">
                      {s.title}
                    </h3>
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-[14px] text-neutral-500 md:text-[16px]">
                    {s.duration}
                  </span>
                </div>

                {/* description + tags (indent = number width + gap) */}
                <div className="mt-4 pl-10 md:mt-5 md:pl-14">
                  <p className="process-text max-w-[52ch] text-[16px] leading-snug text-neutral-800 md:text-[18px]">
                    {s.description}
                  </p>
                  <p className="process-text mt-3 text-[14px] leading-snug text-neutral-500 md:text-[15px]">
                    {s.tags}
                  </p>
                </div>

                {/* image */}
                <div className="process-frame relative mt-8 aspect-[4/3] w-full overflow-hidden bg-neutral-200 sm:aspect-[16/10] md:mt-10">
                  {/* 120% height: parallax er somoy kinar a faka dekha jabe na */}
                  <div className="process-inner absolute inset-x-0 -top-[10%] h-[120%]">
                    <div className="process-scale relative h-full w-full">
                      <Image
                        src={s.image}
                        alt={s.alt}
                        fill
                        sizes="(min-width: 1024px) 46vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}