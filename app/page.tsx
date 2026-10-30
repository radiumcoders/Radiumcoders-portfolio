import type { ReactNode } from "react"

import { Contributions } from "@/components/contributions"
import { DashedRule } from "@/components/dashed-rule"
import { Intro } from "@/components/intro"
import { Projects } from "@/components/projects"
import { Sponsors } from "@/components/sponsors"
import { Testimonials } from "@/components/testimonials"

function Block({ children }: { children: ReactNode }) {
  return <div className="py-8 sm:py-10">{children}</div>
}

export default function Page() {
  return (
    <main className="w-full">
      <div className="pt-10 pb-8 sm:pt-14 sm:pb-10">
        <Intro />
      </div>
      <DashedRule />
      <Block>
        <Contributions />
      </Block>
      <DashedRule />
      <Block>
        <Projects />
      </Block>
      <DashedRule />
      <Block>
        <Sponsors />
      </Block>
      <DashedRule />
      <Block>
        <Testimonials />
      </Block>
    </main>
  )
}
