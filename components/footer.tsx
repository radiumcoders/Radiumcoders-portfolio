import {
  DiscordIcon,
  GithubIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Rule } from "@/components/frame"
import { HoverLink } from "@/components/hover-link"
import { socialLinks } from "@/lib/social"

const socialIcons = {
  Discord: DiscordIcon,
  Twitter: NewTwitterIcon,
  GitHub: GithubIcon,
} satisfies Record<(typeof socialLinks)[number]["name"], IconSvgElement>

export function Footer() {
  return (
    <footer className="w-full">
      <Rule />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 pt-8 pb-12 sm:flex-row sm:items-center sm:justify-between sm:pt-10 sm:pb-16">
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
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.name}
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground opacity-50 transition-opacity hover:opacity-100"
              >
                <HugeiconsIcon
                  icon={socialIcons[link.name]}
                  size={16}
                  aria-hidden="true"
                />
              </a>
            )
          })}
        </nav>
      </div>
    </footer>
  )
}
