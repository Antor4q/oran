"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// mobile e address bar ar-nam korle ScrollTrigger jeno jump na kore
ScrollTrigger.config({ ignoreMobileResize: true });

interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: number;
  image: string;
  alt: string;
}

const PROJECTS: Project[] = [
  {
    id: "olive-residence",
    title: "Olive Residence",
    category: "Residential",
    location: "Gulshan, Dhaka",
    year: 2026,
    image: "/pro9.webp",
    alt: "Living room with a blue modular sofa, framed art and terracotta armchairs",
  },
  {
    id: "oak-and-linen",
    title: "Oak & Linen Apartment",
    category: "Residential",
    location: "Banani, Dhaka",
    year: 2025,
    image: "/pro911.jpg",
    alt: "Open kitchen and green sofa lounge in warm natural light",
  },
  {
    id: "studio-nine",
    title: "Studio Nine",
    category: "Commercial",
    location: "Dhanmondi, Dhaka",
    year: 2025,
    image: "/pro910.jpg",
    alt: "Creative office with oak desks and soft pendant lighting",
  },
  {
    id: "casa-terra",
    title: "Casa Terra",
    category: "Hospitality",
    location: "Cox's Bazar",
    year: 2025,
    image: "/pro4.webp",
    alt: "Boutique hotel lobby with terracotta walls and rattan seating",
  },
  {
    id: "the-quiet-house",
    title: "The Quiet House",
    category: "Residential",
    location: "Uttara, Dhaka",
    year: 2024,
    image: "/pro912.jpg",
    alt: "Minimal bedroom with linen bedding and a wooden bench",
  },
];

const TITLE_LINES = ["Spaces shaped with", "care and character."];

// Breakpoint: mobile = 1 column, sm = 1 column (tall image choto), md = 12 col, lg = 12 col aro khola.
// protita row te 1 ta tall (height boro) + 1 ta wide (width boro) image.
// mover = pura card er speed, inner = frame er bhitor image er speed
const TALL_SIZES = "(min-width: 1024px) 33vw, (min-width: 768px) 42vw, (min-width: 640px) 60vw, 78vw";
const WIDE_SIZES = "(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw";

const LAYOUTS = [
  // row 1: tall left + wide right (niche align)
  [
    {
      slot: "w-[78%] sm:w-[60%] md:col-span-5 md:col-start-1 md:w-full lg:col-span-4",
      ratio: "aspect-[3/4]",
      sizes: TALL_SIZES,
      mover: 8,
      inner: 8,
    },
    {
      slot: "md:col-span-6 md:col-start-7 md:self-end lg:col-span-7 lg:col-start-6",
      ratio: "aspect-[3/2]",
      sizes: WIDE_SIZES,
      mover: 14,
      inner: -8,
    },
  ],
  // row 2: ulta, wide left + tall right (ektu nicher dike)
  [
    {
      slot: "md:col-span-6 md:col-start-1 md:self-start lg:col-span-7",
      ratio: "aspect-[3/2]",
      sizes: WIDE_SIZES,
      mover: 10,
      inner: 8,
    },
    {
      slot: "ml-auto w-[78%] sm:w-[60%] md:col-span-5 md:col-start-8 md:ml-0 md:mt-20 md:w-full lg:col-span-4 lg:col-start-9 lg:mt-40",
      ratio: "aspect-[3/4]",
      sizes: TALL_SIZES,
      mover: 6,
      inner: -8,
    },
  ],
  // row 3: ekta boro wide image, majhkhane
  [
    {
      slot: "md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4",
      ratio: "aspect-[4/3] md:aspect-[16/10]",
      sizes: "(min-width: 1024px) 50vw, (min-width: 768px) 66vw, 100vw",
      mover: 10,
      inner: 8,
    },
  ],
];

const ROWS: Project[][] = [PROJECTS.slice(0, 2), PROJECTS.slice(2, 4), PROJECTS.slice(4, 5)];

export default function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // matchMedia: screen size change hole animation nijei revert hoye abar setup hoy
    const mm = gsap.matchMedia();

    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        isMobile: "(max-width: 767px)",
        isTablet: "(min-width: 768px) and (max-width: 1023px)",
      },
      (context) => {
        const { reduce, isMobile, isTablet } = context.conditions as {
          reduce: boolean;
          isMobile: boolean;
          isTablet: boolean;
        };
        if (reduce) return;

        // choto screen e parallax kom, jate card er caption pashe'r card er sathe na milay
        const k = isMobile ? 0.4 : isTablet ? 0.7 : 1;

        // ---- title: line by line mask reveal ----
        gsap.from(root.querySelectorAll(".projects-line-inner"), {
          yPercent: 115,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
        });

        // ---- cards: entrance + 2 layer parallax ----
        gsap.utils.toArray<HTMLElement>(".project-card", root).forEach((card) => {
          const mover = card.querySelector<HTMLElement>(".project-mover");
          const frame = card.querySelector<HTMLElement>(".project-frame");
          const inner = card.querySelector<HTMLElement>(".project-inner");
          const scale = card.querySelector<HTMLElement>(".project-scale");
          const caption = card.querySelector<HTMLElement>(".project-caption");
          const m = Number(card.dataset.mover ?? 8) * k;
          const n = Number(card.dataset.inner ?? 8) * k;

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

          const scrub = { trigger: card, start: "top bottom", end: "bottom top", scrub: true };

          gsap.fromTo(mover, { yPercent: m }, { yPercent: -m, ease: "none", scrollTrigger: scrub });
          gsap.fromTo(inner, { yPercent: -n }, { yPercent: n, ease: "none", scrollTrigger: scrub });
        });
      },
      root
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="projects"
      className="w-full overflow-hidden bg-white px-5 pb-14 text-neutral-900 sm:px-6 sm:pb-16 md:px-10 md:pb-20 lg:pb-28"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Title: mobile e alada clamp, jate 320px e 2 line e na bhange */}
        <h2
          ref={titleRef}
          className="text-[clamp(28px,8.6vw,56px)] font-normal leading-[1.04] tracking-[-0.03em] md:text-[clamp(32px,5vw,88px)]"
        >
          {TITLE_LINES.map((line) => (
            <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <span className="projects-line-inner block">{line}</span>
            </span>
          ))}
        </h2>

        {/* Grid */}
        <div className="mt-12 flex flex-col gap-y-20 md:mt-20 md:gap-y-28 lg:mt-28 lg:gap-y-40">
          {ROWS.map((row, r) => (
            <div
              key={r}
              className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-6 md:gap-y-0 lg:gap-x-10"
            >
              {row.map((p, c) => {
                const cfg = LAYOUTS[r][c];

                return (
                  <article
                    key={p.id}
                    data-mover={cfg.mover}
                    data-inner={cfg.inner}
                    className={`project-card group ${cfg.slot}`}
                  >
                    <Link
                      href={`/`}
                      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
                    >
                      <div className="project-mover">
                        <div
                          className={`project-frame relative w-full overflow-hidden bg-neutral-200 ${cfg.ratio}`}
                        >
                          {/* 120% height: parallax er somoy kinar a faka dekha jabe na */}
                          <div className="project-inner absolute inset-x-0 -top-[10%] h-[120%]">
                            <div className="project-scale relative h-full w-full">
                              {/* hover zoom alada div e (gsap scale er sathe conflict na hoy),
                                  ar shudhu real hover device e, jate phone e tap korle zoom atke na thake */}
                              <div className="relative h-full w-full transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-105">
                                <Image
                                  src={p.image}
                                  alt={p.alt}
                                  fill
                                  sizes={cfg.sizes}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Caption: md (narrow card) e stack, sm ar lg e side by side */}
                        <div className="project-caption mt-3 flex flex-col gap-1 text-[14px] leading-snug sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:text-[15px] md:mt-4 md:flex-col md:gap-1 md:text-[16px] lg:flex-row lg:justify-between lg:gap-6 lg:text-[17px]">
                          <span className="text-[18px] font-medium sm:text-[20px]">{p.title}</span>
                          <div className="text-neutral-500 sm:text-right md:text-left lg:text-right">
                            <div>{p.category}</div>
                            <div>
                              {p.location}, {p.year}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}