import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

// A clay diya with a flame that sways, plus a soft glow behind it. Duration
// and delay are per lamp, so a row of them never flickers in step.
export function Diya({
  className,
  duration = 2.2,
  delay = 0,
}: {
  className?: string
  duration?: number
  delay?: number
}) {
  const timing: CSSProperties = {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  }

  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-block w-6", className)}
    >
      <span
        className="absolute top-0 left-1/2 size-5 -translate-x-1/2 rounded-full bg-crayon-amber/60 blur-md motion-safe:animate-glow"
        style={timing}
      />
      <svg viewBox="0 0 24 20" className="relative block w-full">
        <g
          className="origin-bottom [transform-box:fill-box] motion-safe:animate-diya"
          style={timing}
        >
          <path
            d="M12 1c2.6 3.4 3.6 5.4 3.6 7a3.6 3.6 0 0 1-7.2 0c0-1.6 1-3.6 3.6-7z"
            className="fill-crayon-amber"
          />
          <path
            d="M12 5.5c1.1 1.5 1.6 2.4 1.6 3.1a1.6 1.6 0 0 1-3.2 0c0-.7.5-1.6 1.6-3.1z"
            className="fill-white/85"
          />
        </g>
        <path
          d="M2 11.5h20c-1 4.4-5 6.8-10 6.8S3 15.9 2 11.5z"
          className="fill-crayon-orange"
        />
        <path
          d="M2 11.5h20"
          className="fill-none stroke-crayon-red stroke-[1.5]"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

const lamps = [
  { duration: 2.1, delay: 0 },
  { duration: 2.6, delay: 0.4, wide: true },
  { duration: 1.9, delay: 0.9 },
  { duration: 2.4, delay: 0.2 },
  { duration: 2.0, delay: 0.7 },
  { duration: 2.7, delay: 1.1, wide: true },
  { duration: 2.3, delay: 0.5 },
]

// A row of diyas along the bottom of the screen for Diwali week. Phones get
// five, wider screens seven.
export function Diyas() {
  return (
    <div className="absolute inset-x-0 bottom-3 mx-auto flex max-w-3xl animate-in justify-between px-6 duration-1000 fade-in sm:bottom-4">
      {lamps.map(({ duration, delay, wide }) => (
        <Diya
          key={delay}
          duration={duration}
          delay={delay}
          className={cn(wide && "max-sm:hidden")}
        />
      ))}
    </div>
  )
}
