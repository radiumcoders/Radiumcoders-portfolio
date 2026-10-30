import { SectionHeading } from "@/components/section-heading"
import { getContributions, type ContributionDay } from "@/lib/contributions"
import { cn } from "@/lib/utils"

const LEVELS = [
  "bg-[color-mix(in_oklab,var(--foreground)_13%,var(--background))]",
  "bg-[color-mix(in_oklab,var(--foreground)_32%,var(--background))]",
  "bg-[color-mix(in_oklab,var(--foreground)_54%,var(--background))]",
  "bg-[color-mix(in_oklab,var(--foreground)_76%,var(--background))]",
  "bg-foreground",
]

const dateFormat = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

function describe(day: ContributionDay) {
  const date = dateFormat.format(new Date(`${day.date}T00:00:00Z`))
  const count = day.count === 0 ? "No" : day.count.toLocaleString("en")

  return `${count} contribution${day.count === 1 ? "" : "s"} on ${date}`
}

function Cell({ day }: { day: ContributionDay | null }) {
  if (!day) {
    return <span className="aspect-square w-full" />
  }

  return (
    <span
      title={describe(day)}
      className={cn(
        "aspect-square w-full rounded-[2px]",
        LEVELS[day.level] ?? LEVELS[0]
      )}
    />
  )
}

export async function Contributions() {
  const contributions = await getContributions()

  if (!contributions) {
    return null
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <SectionHeading
        title="Contributions"
        action={{ href: "https://github.com/radiumcoders", label: "GitHub" }}
      />
      <div className="mt-5">
        <div className="[scrollbar-width:none] overflow-x-auto [direction:rtl]">
          <div
            className="flex w-[560px] gap-[3px] [direction:ltr] sm:w-full"
            role="img"
            aria-label={`${contributions.total.toLocaleString("en")} GitHub contributions in the last year`}
          >
            {contributions.weeks.map((week, index) => (
              <div key={index} className="flex flex-1 flex-col gap-[3px]">
                {week.map((day, weekday) => (
                  <Cell key={day?.date ?? weekday} day={day} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="font-mono tabular-nums">
            {contributions.total.toLocaleString("en")} contributions in the last
            year
          </p>
          <div
            className="hidden items-center gap-[3px] sm:flex"
            aria-hidden="true"
          >
            <span className="mr-1">Less</span>
            {LEVELS.map((level) => (
              <span
                key={level}
                className={cn("size-2.5 rounded-[2px]", level)}
              />
            ))}
            <span className="ml-1">More</span>
          </div>
        </div>
      </div>
    </section>
  )
}
