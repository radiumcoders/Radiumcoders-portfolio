import Image from "next/image"

import { Aka } from "@/components/aka"
import { DmLink, EmailLink } from "@/components/contact-links"
import { Greeting } from "@/components/greeting"
import { Role } from "@/components/role"
import { cn, pfpTint } from "@/lib/utils"

export function Intro() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-center gap-4">
          {/* Each face carries its own perspective, so no 3D wrapper isolates
              the blueprint screen blend from the page. */}
          <div className="group relative size-14 shrink-0">
            <Image
              src="/pfp.webp"
              alt="Jay"
              width={56}
              height={56}
              priority
              className={cn(
                "size-14 [transform:perspective(400px)_rotateY(0deg)] rounded-full border border-border/70 object-cover transition-transform duration-500 ease-in-out backface-hidden group-hover:[transform:perspective(400px)_rotateY(180deg)] motion-reduce:transition-none",
                pfpTint
              )}
            />
            <Image
              src="https://avatars.githubusercontent.com/u/209637072"
              alt=""
              aria-hidden
              width={56}
              height={56}
              className={cn(
                "absolute inset-0 size-14 [transform:perspective(400px)_rotateY(-180deg)] rounded-full border border-border/70 object-cover transition-transform duration-500 ease-in-out backface-hidden group-hover:[transform:perspective(400px)_rotateY(0deg)] motion-reduce:transition-none",
                pfpTint
              )}
            />
          </div>
          <div className="min-w-0">
            <Greeting />
            <p className="text-sm text-muted-foreground">
              <Role />, <Aka />
            </p>
          </div>
        </div>
        <div className="order-last text-sm sm:order-none sm:text-right">
          <p className="text-muted-foreground">Got any project?</p>
          <p className="text-muted-foreground">
            <DmLink className="font-medium text-foreground" /> or{" "}
            <EmailLink className="font-medium text-foreground" />
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
