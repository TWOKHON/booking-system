import Link from "next/link";
import {
  Bell,
  CircleHelp,
  CreditCard,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function OnboardingHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 w-full max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <div className="min-w-0">
          <p className="text-[1.7rem] font-semibold tracking-tight text-zinc-950">
            ResortCloud
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">
            Onboarding workspace
          </p>
        </div>

        <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500 md:flex">
          <Link href="#" className="transition hover:text-zinc-950">
            Support
          </Link>
          <Link href="#" className="transition hover:text-zinc-950">
            Documentation
          </Link>
          <Link href="#" className="transition hover:text-zinc-950">
            Legal
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 rounded-full border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
            aria-label="Help"
          >
            <CircleHelp className="size-4.5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 rounded-full border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
            aria-label="Notifications"
          >
            <Bell className="size-4.5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full outline-none transition focus-visible:ring-4 focus-visible:ring-zinc-200"
                aria-label="Open account menu"
              >
                <Avatar
                  size="lg"
                  className="border border-zinc-300 bg-white shadow-sm"
                >
                  <AvatarFallback className="bg-zinc-950 font-medium text-white">
                    AR
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <DropdownMenuLabel className="px-3 py-2">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-950">
                    Admin User
                  </p>
                  <p className="text-xs text-zinc-500">
                    admin@alrioresort.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="rounded-xl px-3 py-2 text-zinc-700">
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2 text-zinc-700">
                  <Settings className="size-4" />
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2 text-zinc-700">
                  <CreditCard className="size-4" />
                  Billing
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl px-3 py-2 text-zinc-700">
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
