export type Sponsor = {
  login: string
  avatar: string
}

export type Sponsors = {
  current: Sponsor[]
  past: Sponsor[]
}

const GITHUB_LOGIN = "radiumcoders"
const MAX_PAGES = 10

const SPONSOR_RE =
  /href="\/([^"]+)"[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*alt="@([^"]+)"/gi

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
}

function parseSponsors(html: string) {
  const sponsors: Sponsor[] = []
  const seen = new Set<string>()

  for (const match of html.matchAll(SPONSOR_RE)) {
    const login = match[1]

    if (seen.has(login)) {
      continue
    }

    seen.add(login)
    sponsors.push({
      login,
      avatar: decodeHtml(match[2]),
    })
  }

  return sponsors
}

async function fetchSponsorPage(filter: "active" | "inactive", page: number) {
  const url = new URL(`https://github.com/sponsors/${GITHUB_LOGIN}/sponsors_partial`)
  url.searchParams.set("filter", filter)
  url.searchParams.set("page", String(page))

  const response = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": "radiumcoders-portfolio",
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${filter} sponsors (${response.status})`)
  }

  return parseSponsors(await response.text())
}

async function fetchSponsorsByFilter(filter: "active" | "inactive") {
  const sponsors: Sponsor[] = []
  const seen = new Set<string>()

  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await fetchSponsorPage(filter, page)

    if (batch.length === 0) {
      break
    }

    const previousCount = seen.size

    for (const sponsor of batch) {
      if (seen.has(sponsor.login)) {
        continue
      }

      seen.add(sponsor.login)
      sponsors.push(sponsor)
    }

    if (seen.size === previousCount) {
      break
    }
  }

  return sponsors
}

export function sponsorAvatar(sponsor: Sponsor, size: number) {
  const separator = sponsor.avatar.includes("?") ? "&" : "?"

  if (/[?&]s=\d+/.test(sponsor.avatar)) {
    return sponsor.avatar.replace(/s=\d+/, `s=${size}`)
  }

  return `${sponsor.avatar}${separator}s=${size}`
}

export async function getSponsors(): Promise<Sponsors> {
  try {
    const [current, past] = await Promise.all([
      fetchSponsorsByFilter("active"),
      fetchSponsorsByFilter("inactive"),
    ])

    return { current, past }
  } catch {
    return { current: [], past: [] }
  }
}
