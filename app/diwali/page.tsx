import type { Metadata } from "next"

import { Playground } from "@/components/diwali/playground"

export const metadata: Metadata = {
  title: "Burst crackers - Radiumcoders",
  description:
    "Happy Diwali! Light rockets, anars, chakris, phuljhadis, bombs and ladis on a rooftop under a new-moon sky.",
}

export default function DiwaliPage() {
  return (
    <main>
      <Playground />
    </main>
  )
}
