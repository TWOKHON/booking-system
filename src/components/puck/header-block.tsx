/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type NavLink = { label: string; url: string };

type NavItem = {
  label: string;
  url: string;
  children?: {
    heading: string;
    description: string;
    cta: { label: string; url: string };
    links: NavLink[];
  };
};

export type HeaderBlockProps = {
  logo: string;
  logoType?: "text" | "image";
  logoImage?: string;
  navItems: NavItem[];
  ctaPrimary: { label: string; url: string };
  ctaSecondary: { label: string; url: string };
  ctaTertiary: { label: string; url: string };
  variant?: "centered" | "logo-left" | "logo-right";
  puck?: {
    renderLink?: (props: { href: string; children: React.ReactNode; className?: string }) => React.ReactNode;
  };
};

export function HeaderBlock({
  logo,
  logoType = "text",
  logoImage,
  navItems,
  ctaPrimary,
  ctaSecondary,
  ctaTertiary,
  variant = "centered",
  puck,
}: HeaderBlockProps) {
  const SmartLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
    if (puck?.renderLink) {
      return puck.renderLink({ href, children, className });
    }
    
    // In preview mode, we want to intercept links that are likely internal paths
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/preview")) {
      const isInternal = href.startsWith("/") && !href.startsWith("//");
      if (isInternal) {
        return (
          <a
            href={`/preview?path=${encodeURIComponent(href)}`}
            className={className}
          >
            {children}
          </a>
        );
      }
    }

    return (
      <a href={href || "#"} className={className}>
        {children}
      </a>
    );
  };

  const NavLinks = () => (
    <NavigationMenu viewport={false} className="justify-start">
      <NavigationMenuList className="gap-1">
        {navItems?.map((item, i) => {
          const hasChildren = Boolean(
            item.children &&
              (item.children.links?.length > 0 || item.children.heading)
          );

          return (
            <NavigationMenuItem key={`nav-${i}-${item.label}`}>
              {hasChildren ? (
                <>
                  <NavigationMenuTrigger className="h-8 rounded-md px-2.5 py-1.5 text-sm font-normal text-muted-foreground hover:text-foreground data-open:text-foreground">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="z-50 min-w-[420px] p-4">
                    <div className="flex gap-6">
                      {(item.children!.heading ||
                        item.children!.description) && (
                        <CardContent className="flex min-w-[11.25rem] flex-col justify-between gap-3 rounded-lg bg-muted p-4">
                          <div>
                            {item.children!.heading && (
                              <p className="mb-1.5 text-sm font-semibold text-foreground">
                                {item.children!.heading}
                              </p>
                            )}
                            {item.children!.description && (
                              <p className="text-[13px] leading-relaxed text-muted-foreground">
                                {item.children!.description}
                              </p>
                            )}
                          </div>
                          {item.children!.cta?.label && (
                            <Button asChild size="sm" className="w-fit">
                              <SmartLink href={item.children!.cta.url}>
                                {item.children!.cta.label}
                              </SmartLink>
                            </Button>
                          )}
                        </CardContent>
                      )}

                      {item.children!.links?.length > 0 && (
                        <div className="flex min-w-40 flex-col gap-1">
                          {item.children!.links.map((link, j) => (
                            <SmartLink
                              key={`link-${i}-${j}-${link.label}`}
                              href={link.url}
                              className="flex items-center justify-between gap-6 rounded-md px-2.5 py-2 text-sm text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground"
                            >
                              {link.label}
                              <ArrowRight className="size-3.5 text-muted-foreground" />
                            </SmartLink>
                          ))}
                        </div>
                      )}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  asChild
                  className="h-8 rounded-md px-2.5 py-1.5 text-sm font-normal text-muted-foreground hover:text-foreground"
                >
                  <SmartLink href={item.url}>{item.label}</SmartLink>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );

  const Logo = () => (
    <SmartLink
      href="/"
      className={cn(
        "flex items-center text-[15px] font-bold text-foreground no-underline",
        variant === "centered" && "absolute left-1/2 -translate-x-1/2"
      )}
    >
      {logoType === "image" && logoImage ? (
        <img
          src={logoImage}
          alt={logo || "Logo"}
          className="h-8 w-auto object-contain"
        />
      ) : (
        logo
      )}
    </SmartLink>
  );

  const CTAs = () => (
    <div className="flex items-center gap-1">
      {ctaTertiary?.label && (
        <Button asChild variant="ghost" size="sm">
          <SmartLink href={ctaTertiary.url}>{ctaTertiary.label}</SmartLink>
        </Button>
      )}
      {ctaSecondary?.label && (
        <Button asChild variant="outline" size="sm">
          <SmartLink href={ctaSecondary.url}>{ctaSecondary.label}</SmartLink>
        </Button>
      )}
      {ctaPrimary?.label && (
        <Button asChild size="sm">
          <SmartLink href={ctaPrimary.url}>{ctaPrimary.label}</SmartLink>
        </Button>
      )}
    </div>
  );

  return (
    <header className="relative z-50 w-full border-b bg-background">
      <div className="relative mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
        {variant === "centered" && (
          <>
            <NavLinks />
            <Logo />
            <CTAs />
          </>
        )}

        {variant === "logo-left" && (
          <div className="flex w-full items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <Logo />
              <NavLinks />
            </div>
            <CTAs />
          </div>
        )}

        {variant === "logo-right" && (
          <div className="flex w-full items-center justify-between gap-8">
            <CTAs />
            <div className="flex items-center gap-8">
              <NavLinks />
              <Logo />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
