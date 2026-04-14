/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export function LegalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <header className="sticky inset-x-0 top-0 z-50 w-full bg-black/45 py-5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-420 items-center justify-between px-6 md:px-8">
          <Link href="/" className="flex items-center gap-3 text-white">
            <img
              src="/main/logo-dark.png"
              alt="logo"
              width={30}
              height={30}
            />
            <span className="text-lg font-semibold">ResortCloud</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-white/90">
            <Link href="/pricing" className="transition hover:text-white">
              Pricing
            </Link>
            <Link
              href="/auth/sign-in"
              className="border-l border-white/15 pl-6 transition hover:text-white"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-18 z-0">
        <div
          className="mx-auto h-105 max-w-420 bg-cover bg-top bg-no-repeat opacity-70 md:h-130"
          style={{
            backgroundImage:
              "url('https://www.aomni.com/images/background-glow.png')",
          }}
        />
        <div className="mx-auto -mt-28 h-40 max-w-420 bg-linear-to-b from-transparent via-black/70 to-black md:h-56" />
      </div>

      <div className="relative z-10">
        {children}

        <footer className="mx-auto mt-15 w-full max-w-420 px-6 md:px-8">
          <div className="border-t py-7 flex items-center flex-row-reverse justify-between border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-medium text-white/90">
              {footerLinks.map((link) => {
                const icon =
                  link.label === "Twitter" ? (
                    <Image src="/brands/x.svg" alt="X" width={20} className="invert" height={20} />
                  ) : link.label === "LinkedIn" ? (
                    <Image src="/brands/linkedin.svg" alt="Linkedin" className="invert" width={20} height={20} />
                  ) : null;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 transition hover:text-white"
                  >
                    {icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <p className="text-center text-sm text-white/45">
              Copyright {new Date().getFullYear()} ResortCloud. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
