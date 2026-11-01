import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

const sides = {
  top: "bottom-full left-1/2 mb-1 origin-bottom -translate-x-1/2 translate-y-1.5 group-hover/doodle:translate-y-0",
  bottom:
    "top-full left-1/2 mt-1 origin-top -translate-x-1/2 -translate-y-1.5 group-hover/doodle:translate-y-0",
  right:
    "top-1/2 left-full ml-2 origin-left -translate-x-1.5 -translate-y-1/2 group-hover/doodle:translate-x-0",
}

const tilts = {
  left: "group-hover/doodle:-rotate-6",
  right: "group-hover/doodle:rotate-6",
  none: "",
}

// Wraps a word so a little line drawing springs out of it on hover. The art
// can hook its own motion onto the same `group-hover/doodle` state.
export function Doodle({
  art,
  side = "top",
  tilt = "none",
  children,
}: {
  art: ReactNode
  side?: keyof typeof sides
  tilt?: keyof typeof tilts
  children: ReactNode
}) {
  return (
    <span className="group/doodle relative inline-block">
      {children}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-10 scale-50 opacity-0 transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/doodle:scale-100 group-hover/doodle:opacity-100",
          "motion-reduce:translate-0 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:transition-opacity",
          sides[side],
          tilts[tilt]
        )}
      >
        {art}
      </span>
    </span>
  )
}

const ink =
  "block fill-background stroke-current stroke-[1.25] text-foreground [stroke-linecap:round] [stroke-linejoin:round]"
const dot = "fill-current stroke-none"
const still = "motion-reduce:animate-none!"

// A branch splitting off main and merging back.
export function BranchArt() {
  return (
    <svg viewBox="0 0 24 24" className={cn(ink, "w-6")}>
      <rect width="24" height="24" rx="6" className="stroke-none" />
      <path d="M8 7v10" fill="none" />
      <path
        d="M16 9c0 4.5-8 3.5-8 8"
        fill="none"
        pathLength={1}
        className="transition-[stroke-dashoffset] delay-150 duration-500 [stroke-dasharray:1] [stroke-dashoffset:1] group-hover/doodle:[stroke-dashoffset:0]"
      />
      <circle cx="8" cy="5" r="2" />
      <circle cx="8" cy="19" r="2" />
      <circle cx="16" cy="7" r="2" />
    </svg>
  )
}

// A gamepad whose buttons take turns lighting up.
export function GamepadArt() {
  return (
    <svg viewBox="0 0 32 22" className={cn(ink, "w-8")}>
      <path d="M9 3h14a7 7 0 0 1 6.8 5.4l1.6 7.2a3.6 3.6 0 0 1-6.3 3l-3-3.6H9.9l-3 3.6a3.6 3.6 0 0 1-6.3-3l1.6-7.2A7 7 0 0 1 9 3z" />
      <path d="M9.5 8.5v5M7 11h5" fill="none" />
      {[
        { cx: 22, cy: 9.5, delay: 0 },
        { cx: 25, cy: 12.5, delay: 250 },
      ].map(({ cx, cy, delay }) => (
        <circle
          key={cx}
          cx={cx}
          cy={cy}
          r={1.2}
          className={cn(
            dot,
            "[transform-box:fill-box] group-hover/doodle:animate-typing",
            still
          )}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </svg>
  )
}

// A megaphone with sound rings rolling out.
export function MegaphoneArt() {
  return (
    <svg viewBox="0 0 30 24" className={cn(ink, "w-7.5")}>
      <path d="M8.5 15l1.5 5.5h3l-1-5.5" />
      <path d="M4 9h4l12-6v18L8 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" />
      {["M23.5 9a4 4 0 0 1 0 6", "M26 6.5a7.5 7.5 0 0 1 0 11"].map(
        (d, index) => (
          <path
            key={d}
            d={d}
            fill="none"
            className={cn("group-hover/doodle:animate-typing", still)}
            style={{ animationDelay: `${index * 200}ms` }}
          />
        )
      )}
    </svg>
  )
}

const cells = [0.3, 1, 0.6, 0.15, 0.8, 0.45, 1, 0.3, 0.6, 0.15, 0.8, 1]

// A tiny contribution graph that fills in square by square.
export function GraphArt() {
  return (
    <svg viewBox="0 0 26 20" className={cn(ink, "w-6.5")}>
      <rect width="26" height="20" rx="4" className="stroke-none" />
      {cells.map((level, index) => (
        <rect
          key={index}
          x={2 + (index % 4) * 6}
          y={2 + Math.floor(index / 4) * 6}
          width="4"
          height="4"
          rx="1"
          className="fill-current stroke-none transition-[fill-opacity] duration-300 [fill-opacity:0.08] group-hover/doodle:[fill-opacity:var(--level)]"
          style={
            {
              "--level": level,
              transitionDelay: `${index * 40}ms`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  )
}

// A rocket idling on a flickering flame.
export function RocketArt() {
  return (
    <svg viewBox="0 0 24 32" className={cn(ink, "w-5")}>
      <g className={cn("group-hover/doodle:animate-float", still)}>
        <path
          d="M9.5 23.5 12 30l2.5-6.5z"
          className={cn(
            "origin-top [transform-box:fill-box] group-hover/doodle:animate-flicker",
            still
          )}
        />
        <path d="M6.5 15 3 20v4l3.5-2M17.5 15l3.5 5v4l-3.5-2" />
        <path d="M12 2c4 3 6 8 6 13v8H6v-8c0-5 2-10 6-13z" />
        <circle cx="12" cy="12" r="2.25" />
      </g>
    </svg>
  )
}

// A heart that beats.
export function HeartArt() {
  return (
    <svg viewBox="0 0 24 22" className={cn(ink, "w-5.5 overflow-visible")}>
      <path
        d="M12 20.5S2 14.6 2 7.8A5 5 0 0 1 12 5.2a5 5 0 0 1 10 2.6c0 6.8-10 12.7-10 12.7z"
        className={cn(
          "origin-center [transform-box:fill-box] group-hover/doodle:animate-beat",
          still
        )}
      />
    </svg>
  )
}

// A cup of coffee with steam curling up.
export function CoffeeArt() {
  return (
    <svg viewBox="0 0 26 28" className={cn(ink, "w-6.5")}>
      {[
        "M9 10c-1.5-1.5 1.5-3 0-4.5S10.5 3 9 1.5",
        "M14 10c-1.5-1.5 1.5-3 0-4.5S15.5 3 14 1.5",
      ].map((d, index) => (
        <path
          key={d}
          d={d}
          fill="none"
          className={cn("group-hover/doodle:animate-steam", still)}
          style={{ animationDelay: `${index * 400}ms` }}
        />
      ))}
      <path d="M19 15h1.5a3 3 0 0 1 0 6H19" fill="none" />
      <path d="M4 13h15v7a6 6 0 0 1-6 6h-3a6 6 0 0 1-6-6z" />
    </svg>
  )
}

// The crab from the profile picture, snapping its claws.
export function CrabArt() {
  return (
    <svg viewBox="0 0 34 26" className={cn(ink, "w-8.5")}>
      <path
        d="M10 18.5 6 20.5M10.5 20.5 7.5 24M24 18.5l4 2M23.5 20.5l3 3.5"
        fill="none"
      />
      <path d="M14.5 11.5 13.5 7M19.5 11.5l1-4.5" fill="none" />
      <circle cx="13.5" cy="6" r="1.4" className={dot} />
      <circle cx="20.5" cy="6" r="1.4" className={dot} />
      {[
        {
          arm: "M10.5 14.5 7 11",
          claw: "M7.6 9.6a2.8 2.8 0 1 1-1.9-4.4L5.4 8z",
          origin: "origin-bottom-right",
          snap: "14deg",
          delay: 0,
        },
        {
          arm: "M23.5 14.5 27 11",
          claw: "M26.4 9.6a2.8 2.8 0 1 0 1.9-4.4l.3 2.8z",
          origin: "origin-bottom-left",
          snap: "-14deg",
          delay: 150,
        },
      ].map(({ arm, claw, origin, snap, delay }) => (
        <g
          key={arm}
          className={cn(
            "[transform-box:fill-box] group-hover/doodle:animate-snap",
            origin,
            still
          )}
          style={
            { "--snap": snap, animationDelay: `${delay}ms` } as CSSProperties
          }
        >
          <path d={arm} fill="none" />
          <path d={claw} />
        </g>
      ))}
      <ellipse cx="17" cy="16" rx="8" ry="5.5" />
      <path d="M15 16.5q2 1.5 4 0" fill="none" />
    </svg>
  )
}
