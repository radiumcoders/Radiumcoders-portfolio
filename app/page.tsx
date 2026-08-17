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
    <main className="w-full pb-16">
      <div className="mt-8">
        <DashedRule />
      </div>
      <div className="py-10">
        <Sponsors />
      </div>
      <DashedRule />
      <div className="pt-10">
        <Testimonials />
      </div>
    </main>
  )
}
