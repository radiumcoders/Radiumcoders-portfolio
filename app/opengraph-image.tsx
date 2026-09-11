import { ImageResponse } from "next/og"

import { testimonials } from "@/lib/testimonials"

export const alt = "Jay — kind words from builders"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

const FONT_REGULAR = fetch(
  "https://cdn.jsdelivr.net/npm/geist@1.7.0/dist/fonts/geist-sans/Geist-Regular.ttf"
).then((response) => response.arrayBuffer())

const FONT_MEDIUM = fetch(
  "https://cdn.jsdelivr.net/npm/geist@1.7.0/dist/fonts/geist-sans/Geist-Medium.ttf"
).then((response) => response.arrayBuffer())

const FONT_MONO = fetch(
  "https://cdn.jsdelivr.net/npm/geist@1.7.0/dist/fonts/geist-mono/GeistMono-Regular.ttf"
).then((response) => response.arrayBuffer())

const VERIFIED_SRC = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="#f5f5f5"/><path d="M3.6 7.2 5.75 9.3 10.4 4.6" fill="none" stroke="#0a0a0a" stroke-width="1.35" stroke-linecap="square"/></svg>`
).toString("base64")}`

const OG_HANDLES = [
  "orcdev",
  "evilrabbit_",
  "joncphillips",
  "0xMassi",
  "kapish_dima",
  "_remocn",
  "ajaypatel_aj",
  "iamncdai",
  "SwamiMalode",
] as const

const EXCERPTS: Record<(typeof OG_HANDLES)[number], string> = {
  orcdev:
    "Super talented builder. I think he's going to become an amazing design engineer.",
  evilrabbit_: "Evil Charts… and now Evil Buttons.",
  joncphillips:
    "Been clicking buttons for a few minutes and actually enjoying it.",
  "0xMassi": "I really love this guy, so talented and always available.",
  kapish_dima: "Jay is a great developer with a lot of potential.",
  _remocn: "This is now the only working way to create GitHub Stars Videos.",
  ajaypatel_aj: "We crossed 1700 stars for ShadcnStudio. Great project, Jay!",
  iamncdai: "Thanks Jay. Super cool.",
  SwamiMalode: "Rooting for him. I think he's gonna do great work.",
}

const DISPLAY_NAMES: Partial<Record<(typeof OG_HANDLES)[number], string>> = {
  "0xMassi": "Massi",
}

type OgCard = {
  name: string
  handle: string
  quote: string
  verified: boolean
  avatar: string | null
}

function initials(name: string) {
  return name
    .split(/[\s./—-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

async function loadAvatar(url: string) {
  try {
    if (url.startsWith("/")) {
      const { readFile } = await import("node:fs/promises")
      const { join } = await import("node:path")
      const buffer = await readFile(join(process.cwd(), "public", url.slice(1)))
      const contentType = url.endsWith(".png") ? "image/png" : "image/jpeg"
      return `data:${contentType};base64,${buffer.toString("base64")}`
    }

    const response = await fetch(url, {
      headers: {
        Accept: "image/*",
        "User-Agent": "Mozilla/5.0 (compatible; radiumcoders-og/1.0)",
      },
      next: { revalidate: 60 * 60 * 24 },
    })

    if (!response.ok) {
      return null
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg"

    if (!contentType.startsWith("image/")) {
      return null
    }

    const buffer = await response.arrayBuffer()
    return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`
  } catch {
    return null
  }
}

async function getOgCards(): Promise<OgCard[]> {
  const selected = OG_HANDLES.map((handle) => {
    const testimonial = testimonials.find((item) => item.handle === handle)

    if (!testimonial) {
      throw new Error(`Missing OG testimonial: ${handle}`)
    }

    return testimonial
  })

  const avatars = await Promise.all(
    selected.map((item) => loadAvatar(item.avatar))
  )

  return selected.map((item, index) => ({
    name: DISPLAY_NAMES[item.handle as (typeof OG_HANDLES)[number]] ?? item.name,
    handle: item.handle,
    quote: EXCERPTS[item.handle as (typeof OG_HANDLES)[number]],
    verified: Boolean(item.verified),
    avatar: avatars[index],
  }))
}

function VerifiedMark() {
  return (
    <img
      src={VERIFIED_SRC}
      alt=""
      width={14}
      height={14}
      style={{ width: 14, height: 14 }}
    />
  )
}

function Avatar({ card }: { card: OgCard }) {
  if (card.avatar) {
    return (
      <img
        src={card.avatar}
        alt=""
        width={32}
        height={32}
        style={{
          width: 32,
          height: 32,
          objectFit: "cover",
          backgroundColor: "#171717",
        }}
      />
    )
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        backgroundColor: "#171717",
        color: "#a3a3a3",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.04em",
      }}
    >
      {initials(card.name)}
    </div>
  )
}

function Card({ card }: { card: OgCard }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 364,
        height: 158,
        padding: 18,
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid #222222",
        backgroundColor: "#0a0a0a",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar card={card} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#fafafa",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {card.name}
            </span>
            {card.verified ? (
              <div style={{ display: "flex", marginLeft: 5 }}>
                <VerifiedMark />
              </div>
            ) : null}
          </div>
          <span
            style={{
              marginTop: 2,
              fontFamily: "Geist Mono",
              fontSize: 12,
              color: "#737373",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            @{card.handle}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 14,
          fontSize: 15,
          lineHeight: 1.4,
          color: "#a3a3a3",
          letterSpacing: "-0.01em",
        }}
      >
        {card.quote}
      </div>
    </div>
  )
}

export default async function Image() {
  const [regular, medium, mono, cards] = await Promise.all([
    FONT_REGULAR,
    FONT_MEDIUM,
    FONT_MONO,
    getOgCards(),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 40,
          backgroundColor: "#000000",
          color: "#fafafa",
          fontFamily: "Geist Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "#fafafa",
              }}
            >
              Jay
            </span>
            <span
              style={{
                marginLeft: 12,
                fontFamily: "Geist Mono",
                fontSize: 13,
                color: "#737373",
                letterSpacing: "-0.02em",
              }}
            >
              @radiumcoders
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#737373",
            }}
          >
            Kind words
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {cards.map((card) => (
            <Card key={card.handle} card={card} />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist Sans",
          data: regular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Geist Sans",
          data: medium,
          style: "normal",
          weight: 500,
        },
        {
          name: "Geist Mono",
          data: mono,
          style: "normal",
          weight: 400,
        },
      ],
    }
  )
}
