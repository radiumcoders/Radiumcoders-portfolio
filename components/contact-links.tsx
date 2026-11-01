import type { ReactNode } from "react"

import { HoverLink } from "@/components/hover-link"
import { cn } from "@/lib/utils"

// A little sticker that springs up from above the link while it is hovered.
function Pop({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 mb-1 origin-bottom -translate-x-1/2 translate-y-1.5 scale-50 opacity-0 transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "group-hover/link:translate-y-0 group-hover/link:scale-100 group-hover/link:opacity-100",
        "group-focus-visible/link:translate-y-0 group-focus-visible/link:scale-100 group-focus-visible/link:opacity-100",
        "motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-opacity",
        className
      )}
    >
      {children}
    </span>
  )
}

// Chat bubble with a typing indicator.
export function DmLink({ className }: { className?: string }) {
  return (
    <HoverLink href="https://x.com/radiumcoders" className={className}>
      DM
      <Pop className="group-hover/link:-rotate-8 group-focus-visible/link:-rotate-8">
        <svg
          viewBox="0 0 36 26"
          className="block w-9 fill-background stroke-current stroke-[1.25] text-foreground"
        >
          <path
            d="M10 2h16a8 8 0 0 1 0 16H15l-6 5v-5.3A8 8 0 0 1 10 2z"
            strokeLinejoin="round"
          />
          {[0, 150, 300].map((delay, index) => (
            <circle
              key={delay}
              cx={12 + index * 6}
              cy={10}
              r={1.6}
              className="fill-current stroke-none [transform-box:fill-box] group-hover/link:animate-typing motion-reduce:animate-none!"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </svg>
      </Pop>
    </HoverLink>
  )
}

// Envelope whose flap opens and lets a letter slide out.
export function EmailLink({ className }: { className?: string }) {
  return (
    <HoverLink href="mailto:radiumcoders@gmail.com" className={className}>
      email
      <Pop className="group-hover/link:rotate-6 group-focus-visible/link:rotate-6">
        <svg
          viewBox="0 -4 32 28"
          className="block w-8 overflow-visible fill-background stroke-current stroke-[1.25] text-foreground"
          strokeLinejoin="round"
        >
          <rect x="2" y="6" width="28" height="16" rx="2" />
          <path
            d="M3 6.5 16 15 29 6.5z"
            className="origin-top transition-transform delay-150 duration-300 [transform-box:fill-box] group-hover/link:-scale-y-100 group-hover/link:delay-0 motion-reduce:transition-none"
          />
          <g className="translate-y-1 opacity-0 transition duration-300 group-hover/link:-translate-y-2 group-hover/link:opacity-100 group-hover/link:delay-150 motion-reduce:transition-none">
            <rect x="7" y="8" width="18" height="12" rx="1" />
            <path d="M10 11.5h12M10 14.5h8" fill="none" />
          </g>
          <path d="M2 10.5 16 18l14-7.5V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
        </svg>
      </Pop>
    </HoverLink>
  )
}
