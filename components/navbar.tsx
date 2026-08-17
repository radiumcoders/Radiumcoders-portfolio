import { Fragment } from "react"
import Link from "next/link"

import { socialLinks } from "@/lib/social"

export function Navbar() {
  return (
    <header className="w-full">
      <nav
        className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-8 text-sm font-medium tracking-wide uppercase opacity-50"
        aria-label="Social"
      >
        <div className="flex items-center">
          {socialLinks.map((link, index) => (
            <Fragment key={link.name}>
              {index > 0 ? (
                <span className="px-2.5" aria-hidden="true">
                  /
                </span>
              ) : null}
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group relative"
              >
                {link.name}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            </Fragment>
          ))}
        </div>
        <Link href="/" className="normal-case tracking-normal uppercase">
          radiumcoders
        </Link>
      </nav>
    </header>
  )
}
