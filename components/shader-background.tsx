"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { RadiumcodersShader } from "@/components/radiumcoders-shader"

// The page background behind the ink, per theme. Blueprint renders as white
// ink on drafting blue, so it uses the dark path with a blue background.
const BACKGROUNDS = {
  light: { theme: "light", dark: "#020202", light: "#ffffff" },
  dark: { theme: "dark", dark: "#020202", light: "#ffffff" },
  blueprint: { theme: "dark", dark: "#001fff", light: "#ffffff" },
} as const

// The sides only open up once the viewport is wider than the frame.
const WIDE = "(min-width: 64rem)"

function subscribeWide(onChange: () => void) {
  const query = window.matchMedia(WIDE)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

// One shader spanning the whole page behind the content. It scrolls with the
// page, and the Frame covers it, so it only shows on either side of the column.
export function ShaderBackground() {
  const { resolvedTheme } = useTheme()
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => false
  )
  const background =
    BACKGROUNDS[resolvedTheme as keyof typeof BACKGROUNDS] ?? null

  if (!wide || !background) return null

  return (
    // Quarter strength: the page background shows through and mutes it.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 animate-in overflow-hidden opacity-25 duration-700 fade-in"
    >
      <RadiumcodersShader
        theme={background.theme}
        background={background}
        className="size-full"
      />
    </div>
  )
}
