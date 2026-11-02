"use client"

import { useEffect, useRef, type CSSProperties } from "react"

// Each layer blurs harder and starts further down, so the blur ramps up
// toward the bottom edge instead of stopping at a hard line.
const layers = [1, 2, 4, 8, 16].map((blur, index, all) => {
  const start = (index / all.length) * 100
  const solid = ((index + 1) / all.length) * 100
  const mask = `linear-gradient(to bottom, transparent ${start}%, black ${solid}%)`

  return {
    blur,
    style: {
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      maskImage: mask,
      WebkitMaskImage: mask,
    } satisfies CSSProperties,
  }
})

// Pinned to the bottom of the screen: content scrolling under it blurs and
// fades into the page instead of being cut off by the edge of the window.
// It slides off the bottom in step with the footer rising into view, so the
// end of the page stays sharp and the hand-off follows the scroll. It moves
// rather than fades: any opacity below 1 cuts the backdrop blur off entirely.
export function BottomBlur() {
  const blur = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footer = document.querySelector("footer")
    if (!footer) return

    let frame = 0
    const update = () => {
      frame = 0
      const { top, height } = footer.getBoundingClientRect()
      const shown = (window.innerHeight - top) / height
      const offset = Math.min(Math.max(shown, 0), 1) * 100
      if (blur.current) blur.current.style.transform = `translateY(${offset}%)`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <div
      ref={blur}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-24 sm:h-32"
    >
      {layers.map(({ blur: radius, style }) => (
        <div key={radius} className="absolute inset-0" style={style} />
      ))}
      <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/30 to-transparent" />
    </div>
  )
}
