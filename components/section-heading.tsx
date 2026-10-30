import { HoverLink } from "@/components/hover-link"

export function SectionHeading({
  title,
  action,
}: {
  title: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="font-mono text-xs tracking-wider uppercase opacity-50">
        {title}
      </h2>
      {action ? (
        <HoverLink
          href={action.href}
          className="font-mono text-xs tracking-wider uppercase opacity-50 transition-opacity hover:opacity-100"
        >
          {action.label}
        </HoverLink>
      ) : null}
    </div>
  )
}
