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
          className="size-full animate-in duration-700 fade-in dark:[filter:url(#shader-dark-veil)]"
        />
      ) : null}
      <svg className="absolute size-0 overflow-hidden" aria-hidden="true">
        <filter
          id="shader-dark-veil"
          x="-12%"
          y="-12%"
          width="124%"
          height="124%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="18"
            result="blurred"
          />
          <feFlood floodColor="#000000" floodOpacity="0.46" result="ink" />
          <feBlend in="ink" in2="blurred" mode="multiply" />
        </filter>
      </svg>
      <div className="absolute inset-0 hidden bg-black/25 dark:block" />
    </div>
  )
}
