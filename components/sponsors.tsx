import Image from "next/image"

import { HoverLink } from "@/components/hover-link"
import { getSponsors, sponsorAvatar, type Sponsor } from "@/lib/sponsors"
import { cn, pfpTint } from "@/lib/utils"

function SponsorAvatar({
  sponsor,
  past = false,
}: {
  sponsor: Sponsor
  past?: boolean
}) {
  return (
    <a
      href={`https://github.com/${sponsor.login}`}
      target="_blank"
      rel="noreferrer"
      title={`@${sponsor.login}${past ? " (past sponsor)" : ""}`}
      aria-label={`@${sponsor.login}${past ? ", past sponsor" : ""}`}
      className={cn(
        "shrink-0 transition-opacity hover:opacity-100",
        past && "opacity-50"
      )}
    >
      <Image
        src={sponsorAvatar(sponsor)}
        alt=""
        width={28}
        height={28}
        quality={90}
        className={cn("size-7 rounded-full bg-muted object-cover", pfpTint)}
      />
    </a>
  )
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

export async function Sponsors() {
  const { current, past } = await getSponsors()

  if (current.length === 0 && past.length === 0) {
    return null
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">
          {current.length > 0 ? (
            <>
              <span className="text-foreground">
                Backed by {plural(current.length, "sponsor")}
              </span>
              {past.length > 0 ? `, and ${past.length} before them.` : "."}
            </>
          ) : (
            <span className="text-foreground">
              Backed by {plural(past.length, "past sponsor")}.
            </span>
          )}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {current.map((sponsor) => (
            <SponsorAvatar key={sponsor.login} sponsor={sponsor} />
          ))}
          {current.length > 0 && past.length > 0 ? (
            <span className="mx-1.5 h-4 w-px bg-border" aria-hidden="true" />
          ) : null}
          {past.map((sponsor) => (
            <SponsorAvatar key={sponsor.login} sponsor={sponsor} past />
          ))}
        </div>
      </div>
      <HoverLink
        href="https://github.com/sponsors/radiumcoders"
        className="shrink-0 self-start font-mono text-xs tracking-wider uppercase opacity-50 transition-opacity hover:opacity-100 sm:self-center"
      >
        Sponsor my work
      </HoverLink>
    </section>
  )
}
