import { Fragment } from "react"
import Link from "next/link"

import { HoverLink } from "@/components/hover-link"
import { socialLinks } from "@/lib/social"

export function Navbar() {
  return (
    <header className="w-full">
      <nav
        className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-8 text-sm font-medium tracking-wide uppercase"
        aria-label="Social"
      >
        <div className="flex items-center text-muted-foreground">
          {socialLinks.map((link, index) => (
            <Fragment key={link.name}>
              {index > 0 ? (
                <span className="px-2.5 opacity-50" aria-hidden="true">
                  /
                </span>
              ) : null}
              <HoverLink
                href={link.href}
                className="opacity-50 transition-opacity hover:opacity-100"
              >
                {link.name}
              </HoverLink>
            </Fragment>
          ))}
        </div>
        <Link
          href="/"
          className="uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
        >
          radiumcoders
        </Link>
      </nav>
    </header>
  )
}
