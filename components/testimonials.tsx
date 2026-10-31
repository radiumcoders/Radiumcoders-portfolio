import {
  CheckmarkBadge01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import Image from "next/image"

import { SectionHeading } from "@/components/section-heading"
import { cn, emojiTint, pfpTint } from "@/lib/utils"
import {
  featuredTestimonials,
  restTestimonials,
  trailingTestimonials,
  type Testimonial,
} from "@/lib/testimonials"

// An emoji with any skin tone, variation selector, or joined parts.
const EMOJI =
  /(\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F)*(?:\u200D\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F)*)*)/u

// Wraps each emoji in the text so it can be tinted to match the page.
function TintedEmoji({ text }: { text: string }) {
  return text.split(EMOJI).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className={emojiTint}>
        {part}
      </span>
    ) : (
      part
    )
  )
}

function TestimonialCard({
  testimonial,
  compact = false,
  tabIndex,
}: {
  testimonial: Testimonial
  // Clamps the quote to a few lines, for the marquee.
  compact?: boolean
  tabIndex?: number
}) {
  return (
    <a
      href={testimonial.href}
      target="_blank"
      rel="noreferrer"
      tabIndex={tabIndex}
      className="flex flex-col transition-opacity hover:opacity-80"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src={testimonial.avatar}
            alt=""
            width={32}
            height={32}
            quality={90}
            className={cn(
              "size-8 shrink-0 rounded-full bg-muted object-cover",
              pfpTint
            )}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate text-sm font-medium tracking-tight">
                <TintedEmoji text={testimonial.name} />
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
            <p className="truncate text-xs text-muted-foreground">
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
      <p
        className={cn(
          "mt-4 text-sm leading-relaxed text-muted-foreground",
          compact ? "line-clamp-3" : "whitespace-pre-wrap"
        )}
      >
        <TintedEmoji text={testimonial.quote} />
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
    const height = estimateHeight(item) + 32
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
    <div className="flex min-w-0 flex-1 flex-col gap-8">
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
      <div className="flex flex-col gap-8 sm:hidden">
        {items.map((testimonial) => (
          <div key={testimonial.href}>
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
      <div className="hidden sm:flex sm:items-start sm:gap-8">
        <MasonryColumn items={left} />
        <MasonryColumn items={right} />
      </div>
    </>
  )
}

// The featured testimonials, scrolling sideways in a loop. The list is drawn
// twice so the track can slide by half its width and land where it started.
// The moving track is isolated from the page, so it carries the page
// background itself for the blueprint photo blend to mix with.
export function TestimonialMarquee() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="group/marquee overflow-hidden mask-x-from-85% mask-x-to-100% motion-reduce:overflow-x-auto">
        <div className="-ml-2 flex w-max animate-marquee bg-background group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none sm:-ml-4">
          {[0, 1].map((copy) =>
            featuredTestimonials.map((testimonial) => (
              <div
                key={`${copy}-${testimonial.href}`}
                aria-hidden={copy === 1 ? true : undefined}
                className="w-80 shrink-0 pl-8 sm:w-[22rem] sm:pl-10"
              >
                <TestimonialCard
                  testimonial={testimonial}
                  compact
                  tabIndex={copy === 1 ? -1 : undefined}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <SectionHeading title="Kind words" />
      <div className="mt-5">
        <Masonry items={[...restTestimonials, ...trailingTestimonials]} />
      </div>
    </section>
  )
}
