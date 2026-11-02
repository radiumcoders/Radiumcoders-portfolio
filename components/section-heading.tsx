import type { ReactNode } from "react"

import { Doodle, type Crayon } from "@/components/doodle"
import { HoverLink } from "@/components/hover-link"

export function SectionHeading({
  title,
  action,
  art,
  color,
}: {
  title: string
  action?: { href: string; label: string }
  art?: ReactNode
  color?: Crayon
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="cursor-default text-sm tracking-wide uppercase opacity-50 transition-opacity hover:opacity-100">
        {art ? (
          <Doodle art={art} color={color} side="right" tilt="right">
            {title}
          </Doodle>
        ) : (
          title
        )}
      </h2>
      {action ? (
        <HoverLink
          href={action.href}
          className="text-sm tracking-wide uppercase opacity-50 transition-opacity hover:opacity-100"
        >
          {action.label}
        </HoverLink>
      ) : null}
    </div>
  )
}
