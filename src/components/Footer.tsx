import Link from "next/link";
import Image from "next/image";

const PAGES = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const LINK =
  "inline-block py-1 transition-opacity duration-300 active:opacity-50 [@media(hover:hover)]:hover:opacity-50";

const COLS = "md:grid-cols-[47fr_23fr_30fr]";

// Tailwind full class name na dekhle CSS banay na, tai gulo purapuri likhsi
const FOOTER_WRAP =
  "relative [@media(min-width:768px)_and_(min-height:640px)]:h-[70vh] [@media(min-width:768px)_and_(min-height:640px)]:min-h-[560px] [@media(min-width:768px)_and_(min-height:640px)]:[clip-path:inset(0)]";

const FOOTER_INNER =
  "bg-white text-neutral-900 [@media(min-width:768px)_and_(min-height:640px)]:fixed [@media(min-width:768px)_and_(min-height:640px)]:bottom-0 [@media(min-width:768px)_and_(min-height:640px)]:left-0 [@media(min-width:768px)_and_(min-height:640px)]:h-[70vh] [@media(min-width:768px)_and_(min-height:640px)]:min-h-[560px] [@media(min-width:768px)_and_(min-height:640px)]:w-full";

export default function Footer() {
  return (
    <footer className={FOOTER_WRAP}>
      <div className={FOOTER_INNER}>
        <div className="h-full px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-12 sm:px-8 md:px-10 md:pt-16">
          <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col justify-between gap-14 md:gap-20">
            {/* Top section */}
            <div className={`grid grid-cols-1 gap-10 ${COLS} md:gap-0`}>
              {/* Brand */}
              <div className="max-w-md">
                <Link
                  href="/"
                  aria-label="Oran Studio home"
                  className="block w-fit"
                >
                  <Image
                    src="/oranlogo.svg"
                    alt="Oran Studio"
                    width={80}
                    height={80}
                    className="h-16 w-16 md:h-32 md:w-32"
                  />
                </Link>

                <p className="mt-4 text-sm text-neutral-600">
                  Interior Design Studio
                </p>

                <p className="mt-4 max-w-[300px] text-sm leading-6 text-neutral-500">
                  Thoughtfully designed spaces, shaped around the way you live.
                </p>
              </div>

              {/* Pages */}
              <nav aria-label="Footer navigation">
                <p className="text-sm text-neutral-500">Pages</p>

                <ul className="mt-4 flex flex-col gap-1 md:gap-2">
                  {PAGES.map((page) => (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        className={`${LINK} text-[clamp(1.5rem,5.5vw,1.75rem)] leading-tight md:text-[clamp(1.4rem,2.2vw,2.1rem)]`}
                      >
                        {page.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Studio information */}
              <div className="flex flex-col items-start gap-6 text-sm">
                <p className="text-neutral-500">Info</p>

                <div>
                  <p className="mb-2 text-neutral-500">Email</p>
                  <a
                    href="mailto:hello@oran.studio"
                    className={`${LINK} break-words`}
                  >
                    hello@oran.studio
                  </a>
                </div>

                <div>
                  <p className="mb-2 text-neutral-500">Phone</p>
                  <a href="tel:+8801000000000" className={LINK}>
                    +880 1000 000000
                  </a>
                </div>

                <div className="max-w-full">
                  <p className="mb-2 text-neutral-500">Address</p>
                  <p>Gulshan, Dhaka</p>
                  <p className="mt-1 leading-6 text-neutral-600">
                    Serving clients across Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="grid grid-cols-1 gap-y-4 border-t border-neutral-200 pt-5 text-sm md:grid-cols-3 md:items-center md:gap-y-0">
              {/* Left — Legal */}
              <ul className="order-2 flex flex-wrap gap-x-6 md:order-1 md:justify-self-start">
                {LEGAL.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={LINK}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Center — Copyright */}
              <p className="order-3 text-neutral-500 md:order-2 md:justify-self-center md:text-center">
                &copy; {new Date().getFullYear()} Oran Studio
              </p>

              {/* Right — Social links */}
              <ul className="order-1 flex flex-wrap gap-x-5 gap-y-1 md:order-3 md:justify-self-end lg:gap-x-6">
                {SOCIAL.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}