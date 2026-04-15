
import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Sign in", href: "/auth/sign-in" },
  { label: "Get Started", href: "/auth/sign-up" },
];

export function FooterSection() {
  return (
    <footer className="border-t">
      <div className="pt-12 pb-4">
        {/* Main footer grid */}
        <div className="flex max-w-7xl mx-auto px-6 justify-between gap-12">
          {/* Left: Brand */}
          <div>
            <div className="flex items-center gap-1.5">
              <Image
                src="/main/logo-light.png"
                alt="Logo"
                width={30}
                height={30}
              />
              <p className="text-2xl font-semibold">ResortCloud</p>
            </div>
            <p className="text-sm mt-4 leading-relaxed max-w-xs">
              Resort Management SaaS Platform built exclusively for private
              resort operators.
            </p>
            <p className="text-sm mt-6">
              Based in the Philippines
            </p>
          </div>

          {/* Center: Badge */}
          <div className="flex flex-col items-center gap-3">
            <div className="size-32 rounded-full border-4 border-zinc-500 bg-zinc-900 flex flex-col items-center justify-center text-white shadow-lg">
              <p className="text-sm font-extrabold leading-none">7-Day</p>
              <p className="text-xs mt-0.5">Free Trial</p>
              <div className="mx-auto flex flex-col gap-0.5 items-center mt-3">
                <p className="text-zinc-400 text-[8px]">Secured by</p>
                <div className="flex gap-1 items-center">
                  <Image
                    src="/main/logo-dark.png"
                    alt="Logo"
                    width={13}
                    height={13}
                  />
                  <p className="text-[8px]">ResortCloud</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-center">
              Try ResortCloud free for 7 days
            </p>
          </div>

          {/* Right: Nav links + socials */}
          <div className="flex md:items-start gap-4">
            <nav className="flex flex-col md:items-start gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:underline transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-4 mb-2">
              <Link
                href="#"
                className="hover:underline transition-colors"
              >
               <Image src="/brands/linkedin.svg" alt="Linkedin" width={20} height={20} />
              </Link>
              <Link
                href="#"
                className="hover:underline transition-colors"
              >
                <Image src="/brands/x.svg" alt="X" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-10 pt-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>
              Copyright © {new Date().getFullYear()} ResortCloud · Resort
              Management Platform
            </p>
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="hover:underline transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
