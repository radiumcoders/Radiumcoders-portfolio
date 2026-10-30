import {
  CheckmarkBadge01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import Image from "next/image"

import { SectionHeading } from "@/components/section-heading"
import {
  featuredTestimonials,
  restTestimonials,
  trailingTestimonials,
  type Testimonial,
} from "@/lib/testimonials"

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <a
      href={testimonial.href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col rounded-2xl border border-border/70 bg-background/55 p-5 backdrop-blur-md transition-colors hover:bg-background/75"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src={testimonial.avatar}
            alt=""
            width={32}
            height={32}
            quality={90}
            className="size-8 shrink-0 rounded-full bg-muted object-cover"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate text-sm font-medium tracking-tight">
                {testimonial.name}
              </span>
              {testimonial.verified ? (
                <HugeiconsIcon
                  icon={CheckmarkBadge01Icon}
                  size={14}
                  aria-label="Verified"
                  className="shrink-0 text-foreground"
                />
              ) : null}
            </div>
            <p className="truncate font-mono text-[11px] tracking-tight text-muted-foreground">
              @{testimonial.handle}
            </p>
          </div>
        </div>
        <HugeiconsIcon
          icon={NewTwitterIcon}
          size={14}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-muted-foreground/70"
        />
      </div>
      <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
        {testimonial.quote}
      </p>
    </a>
  )
}

function estimateHeight(item: Testimonial) {
  const lines = item.quote.split("\n").reduce((total, line) => {
    return total + Math.max(1, Math.ceil(line.length / 40))
  }, 0)

  return 88 + lines * 23
}

function packColumns(items: Testimonial[]) {
  const columns: [Testimonial[], Testimonial[]] = [[], []]
  const heights = [0, 0]

  for (const item of items) {
    const height = estimateHeight(item) + 16
    let target = heights[0] <= heights[1] ? 0 : 1
    const other = 1 - target

    if (
      columns[target].at(-1)?.handle === item.handle &&
      columns[other].at(-1)?.handle !== item.handle
    ) {
      target = other
    }

    columns[target].push(item)
    heights[target] += height
  }

  return { left: columns[0], right: columns[1] }
}

function MasonryColumn({ items }: { items: Testimonial[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {items.map((testimonial) => (
        <div key={testimonial.href}>
          <TestimonialCard testimonial={testimonial} />
        </div>
      ))}
    </div>
  )
}

function Masonry({ items }: { items: Testimonial[] }) {
  const { left, right } = packColumns(items)

  return (
    <>
      <div className="flex flex-col gap-4 sm:hidden">
        {items.map((testimonial) => (
          <div key={testimonial.href}>
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
      <div className="hidden sm:flex sm:items-start sm:gap-4">
        <MasonryColumn items={left} />
        <MasonryColumn items={right} />
      </div>
    </>
  )
}

export function Testimonials() {
  const [orc, ...pinned] = featuredTestimonials

  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <SectionHeading title="Kind words" />
      <div className="mt-5">
        <TestimonialCard testimonial={orc} />
      </div>
      <div className="mt-4">
        <Masonry
          items={[...pinned, ...restTestimonials, ...trailingTestimonials]}
        />
      </div>
    </section>
  )
}
