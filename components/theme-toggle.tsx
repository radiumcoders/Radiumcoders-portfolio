"use client"

import {
  BlueprintIcon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { nextTheme } from "@/lib/themes"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme(resolvedTheme))}
      aria-label="Switch theme"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground opacity-50 transition-opacity hover:opacity-100",
        className
      )}
    >
      {/* Each icon shows the theme you'll switch to next. */}
      <HugeiconsIcon
        icon={Moon02Icon}
        size={16}
        className="dark:hidden blueprint:hidden"
        aria-hidden="true"
      />
      <HugeiconsIcon
        icon={BlueprintIcon}
        size={16}
        className="hidden dark:block"
        aria-hidden="true"
      />
      <HugeiconsIcon
        icon={Sun03Icon}
        size={16}
        className="hidden blueprint:block"
        aria-hidden="true"
      />
    </button>
  )
}
