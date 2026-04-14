import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SocialButton({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex h-9 w-full items-center rounded-xl gap-3 justify-center border border-zinc-200 bg-white px-5 text-base font-medium text-zinc-900 transition hover:bg-zinc-50"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </button>
  );
}

function GoogleMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18.7846 10.2789C18.7846 9.66221 18.7346 9.04221 18.628 8.43555H10.0713V11.9289H14.9713C14.768 13.0555 14.1146 14.0522 13.158 14.6855V16.9522H16.0813C17.798 15.3722 18.7846 13.0389 18.7846 10.2789Z"
        fill="#4285F4"
      />
      <path
        d="M10.0715 19.1429C12.5182 19.1429 14.5815 18.3396 16.0848 16.9529L13.1615 14.6862C12.3482 15.2396 11.2982 15.5529 10.0748 15.5529C7.70818 15.5529 5.70151 13.9562 4.98151 11.8096H1.96484V14.1462C3.50484 17.2096 6.64151 19.1429 10.0715 19.1429Z"
        fill="#34A853"
      />
      <path
        d="M4.97833 11.81C4.59833 10.6833 4.59833 9.46333 4.97833 8.33667V6H1.965C0.678333 8.56333 0.678333 11.5833 1.965 14.1467L4.97833 11.81Z"
        fill="#FBBC04"
      />
      <path
        d="M10.0715 4.59061C11.3648 4.57061 12.6148 5.05728 13.5515 5.95061L16.1415 3.36061C14.5015 1.82061 12.3248 0.973945 10.0715 1.00061C6.64151 1.00061 3.50484 2.93394 1.96484 6.00061L4.97818 8.33728C5.69484 6.18728 7.70484 4.59061 10.0715 4.59061Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17.6219 6.81868C17.5059 6.90869 15.4577 8.06281 15.4577 10.6291C15.4577 13.5974 18.064 14.6475 18.142 14.6735C18.13 14.7375 17.7279 16.1116 16.7678 17.5118C15.9117 18.7439 15.0177 19.974 13.6575 19.974C12.2974 19.974 11.9474 19.1839 10.3772 19.1839C8.84709 19.1839 8.30304 20 7.05892 20C5.81479 20 4.9467 18.8599 3.9486 17.4597C2.79249 15.8156 1.8584 13.2613 1.8584 10.8371C1.8584 6.9487 4.38665 4.88649 6.8749 4.88649C8.19703 4.88649 9.29914 5.75458 10.1292 5.75458C10.9192 5.75458 12.1514 4.83448 13.6555 4.83448C14.2256 4.83448 16.2738 4.88649 17.6219 6.81868ZM12.9415 3.18832C13.5635 2.45025 14.0036 1.42614 14.0036 0.40204C14.0036 0.260026 13.9916 0.116012 13.9656 0C12.9535 0.0380038 11.7493 0.674068 11.0233 1.51615C10.4532 2.16422 9.9212 3.18832 9.9212 4.22642C9.9212 4.38244 9.9472 4.53845 9.95925 4.58846C10.0232 4.60046 10.1272 4.61446 10.2312 4.61446C11.1393 4.61446 12.2814 4.0064 12.9415 3.18832Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SignUpView() {
  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* ── Left column: zinc-100 bg, white card ── */}
        <div className="flex flex-col justify-center px-6 py-12 bg-zinc-100">
          <div className="max-w-lg mx-auto">
            {/* White card */}
            <div className="rounded-2xl bg-white mb-5 p-6 shadow-sm border border-zinc-200/80">
              {/* Logo + heading above the card */}
              <div className="mb-6 flex flex-col items-center">
                <Image
                  src="/main/logo-light.png"
                  alt="ResortCloud logo"
                  width={56}
                  height={56}
                  className="h-12 w-auto"
                  priority
                />
                <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
                  Create your account
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  No credit card required.
                </p>
              </div>
              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-2">
                <SocialButton icon={<GoogleMark />}>Google</SocialButton>
                <SocialButton icon={<AppleMark />}>Apple</SocialButton>
              </div>

              {/* OR divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs font-medium text-zinc-500">OR</span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              {/* Form */}
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="first-name"
                      className="text-sm font-medium text-zinc-950"
                    >
                      First name
                    </Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="Enter your first name"
                      className="h-9 rounded-xl border-zinc-200 px-4 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="last-name"
                      className="text-sm font-medium text-zinc-950"
                    >
                      Last name
                    </Label>
                    <Input
                      id="last-name"
                      type="text"
                      placeholder="Enter your last name"
                      className="h-9 rounded-xl border-zinc-200 px-4 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-950"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="h-9 rounded-xl border-zinc-200 px-4 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-950"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      className="h-9 rounded-xl border-zinc-200 px-4 text-sm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 hover:text-zinc-600"
                      aria-label="Show password"
                    >
                      <Eye className="size-4" />
                    </button>
                  </div>
                </div>

                <Button type="submit" className="h-9 w-full">
                  Continue
                </Button>
              </form>

              {/* Below-card links */}
              <p className="mt-5 text-center text-sm text-zinc-500">
                Already have an account?{" "}
                <Link
                  href="/auth/sign-in"
                  className="font-semibold text-black hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              © 2026 ResortCloud
            </span>
          </div>
        </div>

        {/* ── Center blade: zinc-100 (#f4f4f5) so it blends with left panel ── */}
        <div
          className="hidden lg:flex absolute inset-y-0 z-10 w-10 flex-col pointer-events-none"
          style={{ left: "calc(50% - 5px)", transform: "scaleX(-1)" }}
        >
          {/* Top angled cap */}
          <div className="shrink-0" style={{ height: 48 }}>
            <svg
              width="40"
              height="48"
              viewBox="0 0 40 48"
              fill="none"
              aria-hidden="true"
              style={{ display: "block" }}
            >
              <path
                d="M1.5726 39.2806L35.8127 1.84475C36.8877 0.669421 38.4072 0 40 0V48H0V43.3301C0 41.8312 0.561002 40.3866 1.5726 39.2806Z"
                fill="#f4f4f5"
              />
            </svg>
          </div>
          {/* Straight middle */}
          <div className="flex-1" style={{ background: "#f4f4f5" }} />
          {/* Bottom angled cap */}
          <div className="shrink-0" style={{ height: 48 }}>
            <svg
              width="40"
              height="48"
              viewBox="0 0 40 48"
              fill="none"
              aria-hidden="true"
              style={{ display: "block" }}
            >
              <path
                d="M1.5726 8.71937L35.8127 46.1552C36.8877 47.3306 38.4072 48 40 48V0H0V4.66991C0 6.16878 0.561002 7.61336 1.5726 8.71937Z"
                fill="#f4f4f5"
              />
            </svg>
          </div>
        </div>

        {/* ── Right column: white bg, testimonial ── */}
        <div className="hidden lg:flex flex-col justify-between pl-40 pr-20 py-16 bg-white">
          {/* Top: badge */}
          <div>
            <span className="inline-block text-xs font-medium text-zinc-500 tracking-widest uppercase"></span>
          </div>

          {/* Middle: testimonial */}
          <div className="flex flex-col gap-8">
            <svg
              width="40"
              height="32"
              viewBox="0 0 40 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0 32V19.556C0 14.37 1.333 9.956 4 6.311 6.667 2.667 10.667.444 16 0l2 3.556C13.778 4.444 11.556 6 10 8.444 8.444 10.889 7.778 13.556 8 16.444H16V32H0zm24 0V19.556c0-5.186 1.333-9.6 4-13.245C30.667 2.667 34.667.444 40 0l2 3.556C37.778 4.444 35.556 6 34 8.444c-1.556 2.445-2.222 5.112-2 8H40V32H24z"
                fill="#111827"
              />
            </svg>

            <blockquote className="text-2xl font-semibold leading-snug tracking-tight text-zinc-900">
              ResortCloud helps resort teams manage bookings, coordinate guest
              requests, and keep daily operations organized in one system
              designed for a smoother staff and guest experience.
            </blockquote>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold">
                JA
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Jason Jhon Almonte
                </p>
                <p className="text-sm text-zinc-500">ResortCloud, CEO</p>
              </div>
            </div>
          </div>

          {/* Bottom: footer */}
          <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <Link
              href="/help-center"
              target="_blank"
              className="hover:text-black transition-colors"
            >
              Support
            </Link>
            <span className="bg-muted-foreground rounded-full size-0.75"></span>
            <Link
              href="/privacy-policy"
              target="_blank"
              className="hover:text-black transition-colors"
            >
              Privacy
            </Link>
            <span className="bg-muted-foreground rounded-full size-0.75"></span>
            <Link
              href="/terms"
              target="_blank"
              className="hover:text-black transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
