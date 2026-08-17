import { SectionHeading } from "@/components/section-heading"
import { getSponsors, sponsorAvatar, type Sponsor } from "@/lib/sponsors"

function SponsorAvatar({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={`https://github.com/${sponsor.login}`}
      target="_blank"
      rel="noreferrer"
      title={`@${sponsor.login}`}
      aria-label={`@${sponsor.login}`}
      className="shrink-0"
    >
      <img
        src={sponsorAvatar(sponsor, 48)}
        alt=""
        width={24}
        height={24}
        referrerPolicy="no-referrer"
        className="size-6 rounded-full bg-muted object-cover grayscale transition-[filter] hover:grayscale-0"
      />
    </a>
  )
}

function SponsorRow({
  title,
  sponsors,
}: {
  title: string
  sponsors: Sponsor[]
}) {
  if (sponsors.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {sponsors.map((sponsor) => (
          <SponsorAvatar key={sponsor.login} sponsor={sponsor} />
        ))}
      </div>
    </div>
  )
}

export async function Sponsors() {
  const { current, past } = await getSponsors()

  if (current.length === 0 && past.length === 0) {
    return null
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <div className="bg-muted/60 px-5 py-5">
        <SectionHeading
          title="Sponsors"
          action={{
            href: "https://github.com/sponsors/radiumcoders",
            label: "Sponsor my work",
          }}
        />
        <div className="mt-5 flex flex-col gap-5">
          <SponsorRow title="Current" sponsors={current} />
          <SponsorRow title="Past" sponsors={past} />
        </div>
      </div>
    </section>
  )
}
