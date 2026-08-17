import {
  featuredTestimonials,
  restTestimonials,
  trailingTestimonials,
  type Testimonial,
} from "@/lib/testimonials"
import { cn } from "@/lib/utils"

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-3.5", className)}
    >
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  )
}

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-3.5", className)}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        fill="none"
        stroke="var(--background)"
        strokeWidth="2"
        strokeLinecap="square"
        d="M7.5 12.2 10.6 15.2 16.5 9"
      />
    </svg>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <a
      href={testimonial.href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col border border-border bg-background p-5 grayscale transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <img
            src={testimonial.avatar}
            alt=""
            width={32}
            height={32}
            referrerPolicy="no-referrer"
            className="size-8 shrink-0 bg-muted object-cover grayscale"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate text-sm font-medium tracking-tight">
                {testimonial.name}
              </span>
              {testimonial.verified ? (
                <VerifiedIcon className="shrink-0 text-foreground" />
              ) : null}
            </div>
            <p className="truncate font-mono text-[11px] tracking-tight text-muted-foreground">
              @{testimonial.handle}
            </p>
          </div>
        </div>
        <XIcon className="mt-0.5 shrink-0 text-muted-foreground/70" />
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
      <TestimonialCard testimonial={orc} />
      <div className="mt-4">
        <Masonry items={[...pinned, ...restTestimonials, ...trailingTestimonials]} />
      </div>
    </section>
  )
}
