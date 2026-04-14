import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <span className="text-center">{children}</span>
    </button>
  );
}

function GoogleMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18.7846 10.2789C18.7846 9.66221 18.7346 9.04221 18.628 8.43555H10.0713V11.9289H14.9713C14.768 13.0555 14.1146 14.0522 13.158 14.6855V16.9522H16.0813C17.798 15.3722 18.7846 13.0389 18.7846 10.2789Z"
        fill="#4285F4"
      ></path>
      <path
        d="M10.0715 19.1429C12.5182 19.1429 14.5815 18.3396 16.0848 16.9529L13.1615 14.6862C12.3482 15.2396 11.2982 15.5529 10.0748 15.5529C7.70818 15.5529 5.70151 13.9562 4.98151 11.8096H1.96484V14.1462C3.50484 17.2096 6.64151 19.1429 10.0715 19.1429Z"
        fill="#34A853"
      ></path>
      <path
        d="M4.97833 11.81C4.59833 10.6833 4.59833 9.46333 4.97833 8.33667V6H1.965C0.678333 8.56333 0.678333 11.5833 1.965 14.1467L4.97833 11.81Z"
        fill="#FBBC04"
      ></path>
      <path
        d="M10.0715 4.59061C11.3648 4.57061 12.6148 5.05728 13.5515 5.95061L16.1415 3.36061C14.5015 1.82061 12.3248 0.973945 10.0715 1.00061C6.64151 1.00061 3.50484 2.93394 1.96484 6.00061L4.97818 8.33728C5.69484 6.18728 7.70484 4.59061 10.0715 4.59061Z"
        fill="#EA4335"
      ></path>
    </svg>
  );
}

function AppleMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17.6219 6.81868C17.5059 6.90869 15.4577 8.06281 15.4577 10.6291C15.4577 13.5974 18.064 14.6475 18.142 14.6735C18.13 14.7375 17.7279 16.1116 16.7678 17.5118C15.9117 18.7439 15.0177 19.974 13.6575 19.974C12.2974 19.974 11.9474 19.1839 10.3772 19.1839C8.84709 19.1839 8.30304 20 7.05892 20C5.81479 20 4.9467 18.8599 3.9486 17.4597C2.79249 15.8156 1.8584 13.2613 1.8584 10.8371C1.8584 6.9487 4.38665 4.88649 6.8749 4.88649C8.19703 4.88649 9.29914 5.75458 10.1292 5.75458C10.9192 5.75458 12.1514 4.83448 13.6555 4.83448C14.2256 4.83448 16.2738 4.88649 17.6219 6.81868ZM12.9415 3.18832C13.5635 2.45025 14.0036 1.42614 14.0036 0.40204C14.0036 0.260026 13.9916 0.116012 13.9656 0C12.9535 0.0380038 11.7493 0.674068 11.0233 1.51615C10.4532 2.16422 9.9212 3.18832 9.9212 4.22642C9.9212 4.38244 9.9472 4.53845 9.95925 4.58846C10.0232 4.60046 10.1272 4.61446 10.2312 4.61446C11.1393 4.61446 12.2814 4.0064 12.9415 3.18832Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function SignInView() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
        <Image
          src="/main/logo-light.png"
          alt="ResortCloud logo"
          width={76}
          height={76}
          className="h-16 w-auto"
          priority
        />

        <h1 className="mt-5 text-center text-3xl font-semibold tracking-tight text-zinc-950">
          Log in to ResortCloud
        </h1>

        <Card className="mt-8 w-full border border-zinc-200 bg-white py-0 shadow-none">
          <CardContent className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="space-y-3">
              <SocialButton icon={<GoogleMark />}>
                Sign in with Google
              </SocialButton>
              <SocialButton icon={<AppleMark />}>
                Sign in with Apple
              </SocialButton>
            </div>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs font-medium text-zinc-500">OR</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-950"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="h-9 rounded-xl border-zinc-200 px-4 text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-950"
                  >
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-sm font-medium text-zinc-950 transition hover:text-zinc-600"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-9 rounded-xl border-zinc-200 px-4 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-500"
                    aria-label="Show password"
                  >
                    <Eye className="size-4.5" />
                  </button>
                </div>
              </div>

              <Button type="submit" className="h-9 w-full">
                Log in with email
              </Button>
            </form>
            <Button type="button" variant="link" className="w-full mt-2">
              Use passkey instead <ArrowRight className="size-3.5" />
            </Button>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-base text-zinc-700">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-zinc-950 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
