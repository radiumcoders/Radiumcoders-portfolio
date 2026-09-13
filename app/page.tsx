import { Intro } from "@/components/intro"
import { Projects } from "@/components/projects"
import { Sponsors } from "@/components/sponsors"
import { Testimonials } from "@/components/testimonials"

function DashedRule() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6" aria-hidden="true">
      <div className="border-t border-dashed border-border/80" />
    </div>
  )
}

export default function Page() {
  return (
    <main className="w-full">
      <div className="pt-10 pb-8 sm:pt-14 sm:pb-10">
        <Intro />
      </div>
      <DashedRule />
      <div className="py-8">
        <Projects />
      </div>
      <DashedRule />
      <div className="py-8">
        <Sponsors />
      </div>
      <DashedRule />
      <div className="pt-8">
        <Testimonials />
      </div>
    </main>
  )
}
