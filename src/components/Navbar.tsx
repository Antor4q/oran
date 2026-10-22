
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

const BAR_LINKS = [
  { label: "Approach", href: "/" },
  { label: "Projects", href: "/" },
  { label: "Contact", href: "/" },
];

const MENU_LINKS = [
  { label: "Home", hint: "Back to start", href: "/" },
  { label: "Approach", hint: "How we work", href: "/" },
  { label: "Projects", hint: "Selected work", href: "/" },
  { label: "Services", hint: "What we do", href: "/" },
  { label: "Contact", hint: "Start a project", href: "/" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "/" },
  { label: "LinkedIn", href: "/" },
  { label: "X", href: "/" },

];

const EMAIL = "hello@oran.com";

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(false);

  // Keep the latest menu state available to the scroll listener.
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Hide on scroll down, reveal smoothly on scroll up.
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const difference = currentScrollY - lastScrollY;

        if (currentScrollY <= 10) {
          setVisible(true);
          lastScrollY = currentScrollY;
        } else if (Math.abs(difference) > 4) {
          if (openRef.current || difference < 0) {
            setVisible(true);
          } else {
            setVisible(false);
          }

          lastScrollY = currentScrollY;
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // GSAP menu animation.
  useEffect(() => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const d = (value: number) => (reduceMotion ? 0.01 : value);

    const ctx = gsap.context(() => {
      gsap.set(overlay, {
        clipPath: "inset(0% 0% 100% 0%)",
        visibility: "hidden",
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.inOut" },
        onReverseComplete: () => {
          gsap.set(overlay, { visibility: "hidden" });
        },
      });

      tl.set(overlay, { visibility: "visible" })
        .to(overlay, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: d(0.9),
        })
        .from(
          ".menu-line",
          {
            scaleX: 0,
            duration: d(0.9),
            stagger: 0.07,
            ease: "power3.inOut",
          },
          "-=0.45"
        )
        .from(
          ".menu-item-inner",
          {
            yPercent: 110,
            duration: d(0.85),
            stagger: 0.07,
            ease: "power4.out",
          },
          "<0.05"
        )
        .from(
          ".menu-fade",
          {
            opacity: 0,
            y: 14,
            duration: d(0.6),
            stagger: 0.05,
            ease: "power3.out",
          },
          "-=0.6"
        );

      tlRef.current = tl;
    }, rootRef);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, []);

  // Synchronize the GSAP timeline and document scrolling with menu state.
  useEffect(() => {
    const tl = tlRef.current;

    if (tl) {
      if (open) {
        tl.timeScale(1).play();
      } else {
        tl.timeScale(1.5).reverse();
      }
    }

    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close menu with Escape.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const close = () => setOpen(false);
  const tab = open ? 0 : -1;

  return (
    <div ref={rootRef}>
      {/* Header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,opacity,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible || open
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } ${open ? "text-white" : "text-neutral-900"}`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between"
        >
          {/* Oran SVG logo */}
          <Link
            href="/"
            onClick={close}
            aria-label="Oran home"
            className="inline-flex shrink-0 items-center"
          >
            <Image
              src="/oranlogo.svg"
              alt="Oran"
              width={100}
              height={42}
              priority
              className={`h-auto w-[100px] ${
                open ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          {/* Desktop links and menu toggle */}
          <div className="flex items-center gap-8 md:gap-10">
            <ul className="hidden items-center gap-8 md:flex">
              {BAR_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="text-[18px] font-medium opacity-90 transition-opacity hover:opacity-60 focus-visible:underline focus-visible:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative -mr-2 flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <span
                className={`absolute h-[2px] w-6 bg-current transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  open ? "rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute h-[2px] w-6 bg-current transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  open ? "-rotate-45" : "translate-y-[4px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen menu overlay */}
      <div
        id="site-menu"
        data-lenis-prevent
        ref={overlayRef}
        aria-hidden={!open}
        className="fixed inset-0 z-40 h-[100dvh] w-full overflow-y-auto overscroll-contain bg-neutral-950 text-white"
      >
        <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col px-6 pb-8 pt-24 md:px-10 md:pt-28">
          <div className="grid flex-1 grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Menu links */}
            <ul className="group/list flex flex-col justify-center lg:col-span-8">
              {MENU_LINKS.map((item) => (
                <li
                  key={item.label}
                  className="group/item relative overflow-hidden transition-opacity duration-300 group-hover/list:opacity-35 hover:!opacity-100"
                >
                  <Link
                    href={item.href}
                    onClick={close}
                    tabIndex={tab}
                    className="menu-item-inner flex items-center justify-between gap-6 py-3 md:py-4"
                  >
                    <span className="flex items-center gap-4 text-[clamp(40px,min(8vw,10.5vh),104px)] font-medium leading-[1.05] tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover/item:translate-x-4">
                      {item.label}
                      <Arrow className="hidden -translate-x-4 text-[0.5em] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:block md:group-hover/item:translate-x-0 md:group-hover/item:opacity-100" />
                    </span>

                    <span className="hidden text-[18px] font-medium text-white/55 sm:block">
                      {item.hint}
                    </span>
                  </Link>

                  <span className="menu-line absolute inset-x-0 bottom-0 h-px origin-left bg-white/20" />
                </li>
              ))}
            </ul>

            {/* Contact and socials */}
            <aside className="flex flex-col justify-end gap-10 lg:col-span-4 lg:border-l lg:border-white/15 lg:pl-10">
              <div className="menu-fade">
                <p className="text-[18px] font-medium text-white/55">
                  Say hello
                </p>

                <a
                  href={`mailto:${EMAIL}`}
                  tabIndex={tab}
                  className="mt-2 inline-block break-all text-[clamp(22px,3vw,34px)] font-medium tracking-tight underline decoration-white/30 underline-offset-8 transition-colors hover:decoration-white"
                >
                  {EMAIL}
                </a>
              </div>

              <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 lg:grid-cols-1">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label} className="menu-fade">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={tab}
                      className="group/social inline-flex items-center gap-2 text-[18px] font-medium text-white/80 transition-colors hover:text-white"
                    >
                      {social.label}
                      <Arrow className="-rotate-45 transition-transform duration-300 group-hover/social:translate-x-0.5 group-hover/social:-translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
