"use client"

import "lenis/dist/lenis.css"

import { ReactLenis } from "lenis/react"
import { useSyncExternalStore } from "react"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

// Eases wheel and keyboard scrolling on the page. Touch keeps the native
// scroll, and anyone who asks for reduced motion gets plain scrolling.
export function SmoothScroll() {
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true
  )

  if (reduced) return null

  return <ReactLenis root options={{ lerp: 0.1, autoRaf: true }} />
}
