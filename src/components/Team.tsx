"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// mobile e address bar ar-nam korle ScrollTrigger jeno jump na kore
ScrollTrigger.config({ ignoreMobileResize: true });

interface Member {
  name: string;
  role: string;
  image: string;
  alt: string;
}

const TITLE_LINES = ["The people behind", "the spaces."];

const DESCRIPTION =
  "A small team of designers, architects and project managers who care about the details, and about the people who will live with them.";

// nam, role ar image nijer moto bodle nio
const TEAM: Member[] = [
  {
    name: "Nadia Rahman",
    role: "Founder & Principal Designer",
    image: "/team1.jpg",
    alt: "Portrait of Nadia Rahman",
  },
  {
    name: "Arif Hossain",
    role: "Senior Interior Designer",
    image: "/team2.jpg",
    alt: "Portrait of Arif Hossain",
  },
  {
    name: "Samira Chowdhury",
    role: "Architect",
    image: "/team3.jpg",
    alt: "Portrait of Samira Chowdhury",
  },
  {
    name: "Tanvir Ahmed",
    role: "Project Manager",
    image: "/team4.jpg",
    alt: "Portrait of Tanvir Ahmed",
  },
];

export default function Team() {
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
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { reduce, isMobile } = context.conditions as {
          reduce: boolean;
          isMobile: boolean;
        };
        if (reduce) return;

        const k = isMobile ? 0.5 : 1; // choto screen e parallax kom

        // ---- title: line by line mask reveal ----
        gsap.from(root.querySelectorAll(".team-line-inner"), {
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

        // ---- members: entrance + parallax ----
        gsap.utils.toArray<HTMLElement>(".team-card", root).forEach((card) => {
          const frame = card.querySelector<HTMLElement>(".team-frame");
          const inner = card.querySelector<HTMLElement>(".team-inner");
          const scale = card.querySelector<HTMLElement>(".team-scale");
          const caption = card.querySelector<HTMLElement>(".team-caption");

          const enter = { trigger: card, start: "top 90%", once: true };

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
          gsap.from(caption, {
            opacity: 0,
            y: 18,
            duration: 1,
            delay: 0.5,
            ease: "power3.out",
            scrollTrigger: enter,
          });

          gsap.fromTo(
            inner,
            { yPercent: -8 * k },
            {
              yPercent: 8 * k,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      },
      root
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="team"
      className="w-full overflow-hidden bg-white px-5 py-14 text-neutral-900 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Header: title left, description right (lg+) */}
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          {/* mobile/tablet e full width, tai heading boro; lg e column, tai alada clamp */}
          <h2
            ref={titleRef}
            className="text-[clamp(30px,9vw,60px)] font-normal leading-[1.04] tracking-[-0.03em] lg:col-span-8 lg:text-[clamp(40px,5vw,88px)]"
          >
            {TITLE_LINES.map((line) => (
              <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                <span className="team-line-inner block">{line}</span>
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

        {/* Members: mobile/tablet 2 col, desktop (lg) 4 col, even gulo ektu nicher dike */}
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:mt-14 sm:gap-x-6 md:mt-20 md:gap-x-8 lg:mt-28 lg:grid-cols-4 lg:gap-x-10">
          {TEAM.map((m) => (
            <article
              key={m.name}
              className="team-card group odd:mt-0 even:mt-10 md:even:mt-16 lg:even:mt-24"
            >
              <div className="team-frame relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
                {/* 120% height: parallax er somoy kinar a faka dekha jabe na */}
                <div className="team-inner absolute inset-x-0 -top-[10%] h-[120%]">
                  <div className="team-scale relative h-full w-full">
                    {/* hover: halka grayscale theke full color + zoom (alada div, gsap scale er sathe conflict na hoy).
                        shudhu real hover device e, jate phone e tap korle effect atke na thake */}
                    <div className="relative h-full w-full grayscale-[35%] transition-all duration-700 ease-out [@media(hover:hover)]:group-hover:scale-105 [@media(hover:hover)]:group-hover:grayscale-0">
                      <Image
                        src={m.image}
                        alt={m.alt}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 42vw, 48vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 320px e column ~130px, tai name/role wrap korte pare, kintu kete jabe na */}
              <div className="team-caption mt-3 md:mt-4">
                <h3 className="text-[15px] font-normal leading-snug sm:text-[16px] md:text-[19px]">
                  {m.name}
                </h3>
                <p className="mt-0.5 text-[13px] leading-snug text-neutral-500 sm:text-[14px] md:text-[16px]">
                  {m.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}