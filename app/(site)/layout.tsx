import type { ReactNode } from "react"

import { BottomBlur } from "@/components/bottom-blur"
import { Footer } from "@/components/footer"
import { Frame } from "@/components/frame"
import { Navbar } from "@/components/navbar"
import { ShaderBackground } from "@/components/shader-background"
import { SmoothScroll } from "@/components/smooth-scroll"

// The portfolio's chrome: the shader behind a frosted column, with the navbar,
// footer and bottom blur. Full-screen pages like /diwali sit outside it.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ShaderBackground />
      <Frame>
        <Navbar />
        {children}
        <Footer />
      </Frame>
      <BottomBlur />
      <SmoothScroll />
    </>
  )
}
