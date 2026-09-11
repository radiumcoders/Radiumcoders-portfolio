import Image from "next/image"

import { HoverLink } from "@/components/hover-link"

export function Intro() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Jay"
            width={48}
            height={48}
            priority
            className="size-12 rounded-full bg-neutral-900 object-cover object-[center_20%] ring-1 ring-border"
          />
          <h1 className="text-lg font-medium tracking-tight">
            Hi, I&apos;m Jay
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Got any project? DM{" "}
          <HoverLink
            href="https://x.com/radiumcoders"
            className="font-medium text-foreground"
          >
            @radiumcoders
          </HoverLink>
        </p>
      </div>
      <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
        I build, break, ship stuff. :D Sometimes I do gamedev or design eng.
      </p>
    </section>
  )
}
