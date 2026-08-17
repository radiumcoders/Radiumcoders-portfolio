import { Intro } from "@/components/intro"
import { Projects } from "@/components/projects"
import { Sponsors } from "@/components/sponsors"
import { Testimonials } from "@/components/testimonials"

function DashedRule() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6" aria-hidden="true">
      <div className="border-t border-dashed border-border" />
    </div>
  )
}

export default function Page() {
  return (
    <main className="w-full">
      <div className="pt-6 pb-5">
        <Intro />
      </div>
      <DashedRule />
      <div className="py-6">
        <Projects />
      </div>
      <DashedRule />
      <div className="py-6">
        <Sponsors />
      </div>
      <DashedRule />
      <div className="pt-6">
        <Testimonials />
      </div>
    </main>
  )
}
