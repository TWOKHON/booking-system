"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const themes = [
  { key: "system", icon: Monitor, label: "System theme" },
  { key: "light", icon: Sun, label: "Light theme" },
  { key: "dark", icon: Moon, label: "Dark theme" },
];

export type ThemeSwitcherProps = {
  value?: "light" | "dark" | "system";
  onChange?: (theme: "light" | "dark" | "system") => void;
  defaultValue?: "light" | "dark" | "system";
  className?: string;
};

export const ThemeSwitcher = ({
  value,
  onChange,
  defaultValue = "system",
  className,
}: ThemeSwitcherProps) => {
  const { theme: currentTheme, setTheme } = useTheme();

  const [theme, setLocalTheme] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });

  const [mounted, setMounted] = useState(false);

  const handleThemeClick = useCallback(
    (themeKey: "light" | "dark" | "system") => {
      setLocalTheme(themeKey);   // local state
      setTheme(themeKey);        // next-themes (REAL CHANGE)
    },
    [setLocalTheme, setTheme]
  );

  // Sync external theme (important when reloading)
  useEffect(() => {
    if (currentTheme) {
      setLocalTheme(currentTheme as "light" | "dark" | "system");
    }
  }, [currentTheme, setLocalTheme]);

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border",
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            key={key}
            type="button"
            aria-label={label}
            onClick={() =>
              handleThemeClick(key as "light" | "dark" | "system")
            }
            className="relative h-6 w-6 rounded-full"
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}

            <Icon
              className={cn(
                "relative z-10 m-auto h-4 w-4",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};