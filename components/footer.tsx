import {
  RiDiscordFill,
  RiGithubFill,
  RiTwitterXFill,
  type RemixiconComponentType,
} from "@remixicon/react"

import { HoverLink } from "@/components/hover-link"
import { socialLinks } from "@/lib/social"

const socialIcons = {
  Discord: RiDiscordFill,
  Twitter: RiTwitterXFill,
  GitHub: RiGithubFill,
} satisfies Record<(typeof socialLinks)[number]["name"], RemixiconComponentType>

export function Footer() {
  return (
    <footer className="w-full pt-6">
      <div className="mx-auto w-full max-w-3xl px-6" aria-hidden="true">
        <div className="border-t border-dashed border-border/80" />
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-6 pt-12 pb-16 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-lg text-sm text-muted-foreground">
          made with orcish vibes by jay{" "}
          <HoverLink
            href="https://x.com/radiumcoders"
            className="font-medium text-foreground"
          >
            @radiumcoders
          </HoverLink>{" "}
          © {new Date().getFullYear()}
        </p>
        <nav className="flex items-center gap-1" aria-label="Social">
          {socialLinks.map((link) => {
            const Icon = socialIcons[link.name]

            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.name}
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground opacity-50 transition-opacity hover:opacity-100"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            )
          })}
        </nav>
      </div>
    </footer>
  )
}
