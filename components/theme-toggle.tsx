"use client"

import { RiMoonLine, RiSunLine } from "@remixicon/react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground opacity-50 transition-opacity hover:opacity-100",
        className
      )}
    >
      <RiSunLine size={16} className="hidden dark:block" aria-hidden="true" />
      <RiMoonLine size={16} className="dark:hidden" aria-hidden="true" />
    </button>
  )
}
