import Image from "next/image"

import { HoverLink } from "@/components/hover-link"
import { cn, pfpTint } from "@/lib/utils"

export function Intro() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-center gap-4">
          <Image
            src="https://avatars.githubusercontent.com/u/209637072"
            alt="Jay"
            width={56}
            height={56}
            priority
            className={cn(
              "size-14 shrink-0 rounded-full border border-border/70 object-cover",
              pfpTint
            )}
          />
          <div className="min-w-0">
            <h1 className="text-lg font-medium tracking-tight">
              Hi, I&apos;m Jay
            </h1>
            <p className="text-sm text-muted-foreground">Design engineer</p>
          </div>
        </div>
        <div className="order-last text-sm sm:order-none sm:text-right">
          <p className="text-muted-foreground">Got any project?</p>
          <p className="text-muted-foreground">
            <HoverLink
              href="https://x.com/radiumcoders"
              className="font-medium text-foreground"
            >
              DM
            </HoverLink>{" "}
            or{" "}
            <HoverLink
              href="mailto:radiumcoders@gmail.com"
              className="font-medium text-foreground"
            >
              email
            </HoverLink>
          </p>
        </div>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground sm:col-span-2">
          I build UI people want to click and tools that run on your own
          machine: component libraries like 23rd.dev and EvilButtons, and native
          Rust apps like LocalFlow. Mostly open source.
        </p>
      </div>
    </section>
  )
}
