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
const REVALIDATE_SECONDS = 3600

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

    if (seen.has(login.toLowerCase())) {
      continue
    }

    seen.add(login.toLowerCase())
    sponsors.push({
      login,
      avatar: decodeHtml(match[2]),
    })
  }

  return sponsors
}

function sliceAfterHeading(html: string, heading: RegExp) {
  const match = heading.exec(html)

  if (!match || match.index === undefined) {
    return ""
  }

  return html.slice(match.index)
}

function splitSponsorSections(html: string) {
  const listStart = html.indexOf('id="sponsors-section-list"')
  const scoped = listStart === -1 ? html : html.slice(listStart)
  const pastHtml = sliceAfterHeading(
    scoped,
    /<h[45]\b[^>]*>\s*Past sponsors\b/i
  )
  const currentScoped = pastHtml
    ? scoped.slice(0, scoped.length - pastHtml.length)
    : scoped

  return {
    current: sliceAfterHeading(
      currentScoped,
      /<h[45]\b[^>]*>\s*Current sponsors\b/i
    ),
    past: pastHtml,
  }
}

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": "radiumcoders-portfolio",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch sponsors (${response.status})`)
  }

  return response.text()
}

async function fetchSponsorPage(filter: "active" | "inactive", page: number) {
  const url = `https://github.com/sponsors/${GITHUB_LOGIN}/sponsors_partial?filter=${encodeURIComponent(filter)}&page=${page}`

  return parseSponsors(await fetchHtml(url))
}

function mergeSponsors(existing: Sponsor[], incoming: Sponsor[]) {
  const sponsors = [...existing]
  const seen = new Set(existing.map((sponsor) => sponsor.login.toLowerCase()))

  for (const sponsor of incoming) {
    const login = sponsor.login.toLowerCase()

    if (seen.has(login)) {
      continue
    }

    seen.add(login)
    sponsors.push(sponsor)
  }

  return { sponsors, added: sponsors.length - existing.length }
}

async function fetchRemainingPages(
  filter: "active" | "inactive",
  existing: Sponsor[]
) {
  let sponsors = existing

  for (let page = existing.length > 0 ? 2 : 1; page <= MAX_PAGES; page++) {
    const batch = await fetchSponsorPage(filter, page)

    if (batch.length === 0) {
      break
    }

    const merged = mergeSponsors(sponsors, batch)
    sponsors = merged.sponsors

    if (merged.added === 0) {
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
    const html = await fetchHtml(`https://github.com/sponsors/${GITHUB_LOGIN}`)
    const sections = splitSponsorSections(html)
    const currentSeed = parseSponsors(sections.current)
    const pastSeed = parseSponsors(sections.past)

    const [current, pastRaw] = await Promise.all([
      fetchRemainingPages("active", currentSeed),
      fetchRemainingPages("inactive", pastSeed),
    ])

    const currentLogins = new Set(
      current.map((sponsor) => sponsor.login.toLowerCase())
    )
    const past = pastRaw.filter(
      (sponsor) => !currentLogins.has(sponsor.login.toLowerCase())
    )

    return { current, past }
  } catch {
    return { current: [], past: [] }
  }
}
