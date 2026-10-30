export type ContributionDay = {
  date: string
  level: number
  count: number
}

export type Contributions = {
  total: number
  weeks: (ContributionDay | null)[][]
}

const GITHUB_LOGIN = "radiumcoders"

const DAY_RE = /<td\b[^>]*\bContributionCalendar-day\b[^>]*>/gi
const TOOLTIP_RE = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/gi
const TOTAL_RE =
  /id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions?/i

function attr(tag: string, name: string) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
}

function parseContributions(html: string): Contributions {
  const counts = new Map<string, number>()

  for (const [, id, label] of html.matchAll(TOOLTIP_RE)) {
    const count = label.match(/^([\d,]+) contributions?/)?.[1]
    counts.set(id, count ? Number(count.replaceAll(",", "")) : 0)
  }

  const weeks: (ContributionDay | null)[][] = []

  for (const [tag] of html.matchAll(DAY_RE)) {
    const id = attr(tag, "id")
    const date = attr(tag, "data-date")
    const position = id?.match(/-(\d+)-(\d+)$/)

    if (!id || !date || !position) {
      continue
    }

    const weekday = Number(position[1])
    const week = Number(position[2])

    weeks[week] ??= Array.from({ length: 7 }, () => null)
    weeks[week][weekday] = {
      date,
      level: Number(attr(tag, "data-level") ?? 0),
      count: counts.get(id) ?? 0,
    }
  }

  const total = html.match(TOTAL_RE)?.[1]

  return {
    total: total
      ? Number(total.replaceAll(",", ""))
      : weeks.flat().reduce((sum, day) => sum + (day?.count ?? 0), 0),
    weeks: weeks.filter(Boolean),
  }
}

export async function getContributions(): Promise<Contributions | null> {
  try {
    const response = await fetch(
      `https://github.com/users/${GITHUB_LOGIN}/contributions`,
      {
        headers: {
          Accept: "text/html",
          "User-Agent": "radiumcoders-portfolio",
        },
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return null
    }

    const contributions = parseContributions(await response.text())

    return contributions.weeks.length > 0 ? contributions : null
  } catch {
    return null
  }
}
