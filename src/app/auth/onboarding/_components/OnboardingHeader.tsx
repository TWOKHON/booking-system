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
      <div className="flex h-18 w-full items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
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

          
        </div>
      </div>
    </header>
  );
}
