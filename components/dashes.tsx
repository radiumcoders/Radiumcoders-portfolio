import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

// A dashed hairline drawn as SVG, so the dashes keep their length at any size.
export function Dashes({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical"
  className?: string
}) {
  const vertical = orientation === "vertical"
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none block shrink-0 text-rail",
        vertical ? "h-full w-px" : "h-px w-full",
        className
      )}
    >
      <line
        x1={vertical ? "0.5" : "0"}
        y1={vertical ? "0" : "0.5"}
        x2={vertical ? "0.5" : "100%"}
        y2={vertical ? "100%" : "0.5"}
        stroke="currentColor"
        strokeDasharray="10 6"
      />
    </svg>
  )
}

// Breaks out of the Frame so horizontal lines run the full width of the screen.
const bleed = "relative left-1/2 w-screen max-w-none -translate-x-1/2"

// A full-width dashed line.
export function Rule() {
  return <Dashes className={bleed} />
}

// The striped band between sections, closed by dashed lines. Its solid fill
// hides the Frame's rails, so they stop at the band instead of crossing it.
export function Stripes() {
  return (
    <div aria-hidden="true" className={cn(bleed, "bg-background")}>
      <Dashes />
      <div className="h-8 stripes sm:h-10" />
      <Dashes />
    </div>
  )
}

// The centered column every section sits in, framed by dashed rails.
export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <Dashes orientation="vertical" className="absolute inset-y-0 left-0" />
      <Dashes orientation="vertical" className="absolute inset-y-0 right-0" />
      {children}
    </div>
  )
}
