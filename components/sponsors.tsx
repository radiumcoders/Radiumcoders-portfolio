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
      <div className="bg-muted/60 px-5 py-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium tracking-wide uppercase opacity-50">
            Sponsors
          </h2>
          <a
            href="https://github.com/sponsors/radiumcoders"
            target="_blank"
            rel="noreferrer"
            className="group relative text-sm font-medium tracking-wide uppercase opacity-50"
          >
            Sponsor my work
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </a>
        </div>
        <div className="mt-6 flex flex-col gap-6">
          <SponsorRow title="Current" sponsors={current} />
          <SponsorRow title="Past" sponsors={past} />
        </div>
      </div>
    </section>
  )
}
