import Image from "next/image"

import { Aka } from "@/components/aka"
import { DmLink, EmailLink } from "@/components/contact-links"
import { Greeting } from "@/components/greeting"
import { Role } from "@/components/role"
import { cn } from "@/lib/utils"

export function Intro() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-center gap-4">
          <div className="group relative size-14 shrink-0">
            {/* The front is the orc; the dark theme gets a version in a white
                hoodie on a near-black backdrop. */}
            {[
              { src: "/pfp.webp", theme: "dark:hidden" },
              { src: "/pfp-dark.webp", theme: "hidden dark:block" },
            ].map(({ src, theme }) => (
              <Image
                key={src}
                src={src}
                alt="Jay"
                width={56}
                height={56}
                priority
                className={cn(
                  "size-14 [transform:perspective(400px)_rotateY(0deg)] rounded-full object-cover transition-transform duration-500 ease-in-out backface-hidden group-hover:[transform:perspective(400px)_rotateY(180deg)] motion-reduce:transition-none",
                  theme
                )}
              />
            ))}
            {/* The back is the GitHub avatar; the dark theme gets a night-time
                take on it. */}
            {[
              {
                src: "https://avatars.githubusercontent.com/u/209637072",
                theme: "dark:hidden",
              },
              { src: "/avatar-night.webp", theme: "hidden dark:block" },
            ].map(({ src, theme }) => (
              <Image
                key={src}
                src={src}
                alt=""
                aria-hidden
                width={56}
                height={56}
                className={cn(
                  "absolute inset-0 size-14 [transform:perspective(400px)_rotateY(-180deg)] rounded-full object-cover transition-transform duration-500 ease-in-out backface-hidden group-hover:[transform:perspective(400px)_rotateY(0deg)] motion-reduce:transition-none",
                  theme
                )}
              />
            ))}
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
