"use client"

import { useTheme } from "next-themes"

import { RadiumcodersShader } from "@/components/radiumcoders-shader"

const BACKGROUND = {
  dark: "#090909",
  light: "#ffffff",
} as const

export function ShaderBackground() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "light" ? "light" : "dark"
  const ready = resolvedTheme === "light" || resolvedTheme === "dark"

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {ready ? (
        <RadiumcodersShader
          theme={theme}
          background={BACKGROUND}
          className="size-full animate-in duration-700 fade-in"
        />
      ) : null}
    </div>
  )
}
