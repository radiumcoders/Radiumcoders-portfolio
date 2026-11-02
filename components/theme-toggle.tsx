"use client"

import { ComputerIcon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { nextTheme, type ThemeChoice } from "@/lib/themes"
import { cn } from "@/lib/utils"

const icons = {
  light: Sun03Icon,
  dark: Moon02Icon,
  system: ComputerIcon,
} satisfies Record<ThemeChoice, IconSvgElement>

const subscribe = () => () => {}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  // The saved choice is only known in the browser, so the server renders a
  // generic label and an empty icon slot of the same size.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const next = nextTheme(theme)
  const label = mounted ? `Switch to ${next} theme` : "Switch theme"

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground opacity-50 transition-opacity hover:opacity-100",
        className
      )}
    >
      {/* The icon shows the theme you'll switch to next. */}
      {mounted ? (
        <HugeiconsIcon icon={icons[next]} size={16} aria-hidden="true" />
      ) : (
        <span className="size-4" aria-hidden="true" />
      )}
    </button>
  )
}
