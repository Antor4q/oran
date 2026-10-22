"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// mobile e address bar ar-nam korle ScrollTrigger jeno jump na kore
ScrollTrigger.config({ ignoreMobileResize: true });

interface Testimonial {
  quote: string;
  name: string;
  project: string;
}

const TITLE_LINES = ["Kind words", "from our clients."];

// left er static image (bodlabe na)
const IMAGE = { src: "/test.jpg", alt: "Living room with a blue modular sofa and framed art" };

// quote, naam ar project nijer moto bodle nio
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Working with them felt effortless. They understood how we live before we could explain it, and the result feels like home from the very first day.",
    name: "Farhana & Imran Karim",
    project: "Olive Residence, Gulshan",
  },
  {
    quote:
      "Every detail was considered, from the light in the kitchen to the handles on the doors. We never had to chase anyone, and nothing was a surprise.",
    name: "Rafiq Ahmed",
    project: "Oak & Linen Apartment, Banani",
  },
  {
    quote:
      "Our office finally feels like us. Clients comment on the space before they say hello, and the team genuinely loves coming in.",
    name: "Sadia Islam",
    project: "Studio Nine, Dhanmondi",
  },
  {
    quote:
      "They delivered a hotel lobby that guests photograph before they even check in. On budget, on time, and with real craft in every corner.",
    name: "Mahin Chowdhury",
    project: "Casa Terra, Cox’s Bazar",
  },
];

const N = TESTIMONIALS.length;

// quote ke shabdo e bhag kore, jate slide bodlale ekta ekta kore dark hoy
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span className="tq-word">{w}</span>{" "}
        </Fragment>
      ))}
    </>
  );
}

function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={flip ? "rotate-180" : ""}
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

// hover shudhu mouse device e, touch e tap korle button filled hoye atke thakto.
// touch e feedback er jonno active: use kora hoyeche.
const ARROW_CLASS =
  "tq-arrow flex h-14 w-14 items-center justify-center rounded-full border border-neutral-900/30 transition-colors duration-300 active:bg-neutral-900 active:text-white [@media(hover:hover)]:hover:bg-neutral-900 [@media(hover:hover)]:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 md:h-16 md:w-16";

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [active, setActive] = useState(0);
  const curRef = useRef(0);
  const lockRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  // ---- entrance animation (scroll e section ashle ekbar) ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(root.querySelectorAll(".tq-title-inner"), {
        yPercent: 115,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
      });

      const enter = { trigger: root.querySelector(".tq-grid"), start: "top 85%", once: true };

      gsap.fromTo(
        root.querySelector(".tq-frame"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut", scrollTrigger: enter }
      );
      gsap.from(root.querySelector(".tq-slide"), {
        opacity: 0,
        y: 28,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
        scrollTrigger: enter,
      });
      gsap.from(root.querySelectorAll(".tq-arrow"), {
        opacity: 0,
        y: 16,
        duration: 0.8,
        delay: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: enter,
      });
    }, root);

    return () => {
      mm.revert();
      tlRef.current?.kill();
    };
  }, []);

  // ---- arrow click / swipe: prev / next ----
  const go = (dir: 1 | -1) => {
    const root = rootRef.current;
    if (!root || lockRef.current) return;

    const from = curRef.current;
    const to = (from + dir + N) % N;

    const slides = root.querySelectorAll<HTMLElement>(".tq-slide");
    const outSlide = slides[from];
    const inSlide = slides[to];
    const words = inSlide.querySelectorAll(".tq-word");

    curRef.current = to;
    setActive(to);

    // reduced motion hole shorashori bodle jabe
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(outSlide, { opacity: 0 });
      gsap.set(inSlide, { opacity: 1, y: 0 });
      gsap.set(words, { opacity: 1 });
      return;
    }

    lockRef.current = true;

    const tl = gsap.timeline({ onComplete: () => (lockRef.current = false) });
    tlRef.current = tl;

    // purano quote chole jay, notun quote shabdo shoho ashe (image bodlay na)
    tl.to(outSlide, { opacity: 0, y: -24 * dir, duration: 0.45, ease: "power2.in" }, 0)
      .fromTo(
        inSlide,
        { opacity: 0, y: 24 * dir },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        0.45
      )
      .fromTo(
        words,
        { opacity: 0.2 },
        { opacity: 1, duration: 0.4, ease: "none", stagger: { each: 0.025 } },
        0.5
      );
  };

  // ---- touch swipe (phone/tablet): left swipe = next, right swipe = prev ----
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // shudhu clear horizontal swipe, jate vertical scroll e quote na bodlay
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  return (
    <section
      ref={rootRef}
      id="testimonials"
      // overflow-clip (hidden na), jate sticky kaj kore
      className="w-full overflow-clip bg-white px-5 pb-14 text-neutral-900 sm:px-6 sm:pb-16 md:px-10 md:pb-20 lg:pb-28"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Title: mobile/tablet e alada clamp, jate 320px e 2 line e na bhange, tablet e boro dekhay */}
        <h2
          ref={titleRef}
          className="text-[clamp(30px,9vw,60px)] font-normal leading-[1.04] tracking-[-0.03em] lg:text-[clamp(40px,5vw,88px)]"
        >
          {TITLE_LINES.map((line) => (
            <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <span className="tq-title-inner block">{line}</span>
            </span>
          ))}
        </h2>

        <div className="tq-grid mt-12 grid grid-cols-1 gap-y-10 sm:mt-14 md:mt-20 md:grid-cols-12 md:gap-x-8 lg:mt-28 lg:gap-x-10">
          {/* Left: static sticky image (sticky shudhu lg+ e) */}
          <div className="w-[78%] sm:w-[60%] md:col-span-5 md:w-full md:self-start lg:sticky lg:top-28 lg:col-span-4">
            <div className="tq-frame relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
              <Image
                src={IMAGE.src}
                alt={IMAGE.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 42vw, (min-width: 640px) 60vw, 78vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: quote + arrows */}
          <div className="flex flex-col justify-center md:col-span-7 lg:col-start-6">
            {/* sob quote ekoi jayga e (grid overlay), height sobcheye boro ta r moto.
                touch-pan-y: vertical scroll thik thakbe, horizontal swipe ta amra handle kori */}
            <div
              className="grid touch-pan-y"
              aria-live="polite"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.name}
                  aria-hidden={i !== active}
                  className={`tq-slide col-start-1 row-start-1 ${i > 0 ? "opacity-0" : ""}`}
                >
                  {/* quote boro kora hoyeche: mobile 22-26px, sm 26-34px, md 24-40px, lg 30-48px */}
                  <p className="text-[clamp(22px,6vw,26px)] font-normal leading-[1.28] tracking-[-0.015em] sm:text-[clamp(26px,4.4vw,34px)] md:text-[clamp(24px,3.2vw,40px)] lg:text-[clamp(30px,2.8vw,48px)] lg:tracking-[-0.02em]">
                    <Words text={t.quote} />
                  </p>
                  <div className="mt-6 md:mt-8 lg:mt-10">
                    <div className="text-[16px] md:text-[18px] lg:text-[20px]">{t.name}</div>
                    <div className="mt-0.5 text-[14px] text-neutral-500 md:text-[16px] lg:text-[17px]">
                      {t.project}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows */}
            <div className="mt-10 flex gap-3 md:mt-12">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className={ARROW_CLASS}
              >
                <Arrow flip />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className={ARROW_CLASS}
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}