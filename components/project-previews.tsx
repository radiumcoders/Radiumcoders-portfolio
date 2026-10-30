"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

const CARD = { width: 384, height: 240 }
const OFFSET = 20
const EASE = 0.2

export function ProjectPreviews({
  previews,
  className,
  children,
}: {
  previews: string[]
  className?: string
  children: ReactNode
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const frame = useRef(0)
  const [armed, setArmed] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  useEffect(() => {
    if (!active) {
      return
    }

    const hide = () => setActive(null)
    window.addEventListener("scroll", hide, { passive: true })

    return () => window.removeEventListener("scroll", hide)
  }, [active])

  function place(x: number, y: number) {
    if (cardRef.current) {
      // Snap to device pixels; fractional offsets blur the screenshot.
      const dpr = window.devicePixelRatio || 1
      const snap = (value: number) => Math.round(value * dpr) / dpr
      cardRef.current.style.transform = `translate(${snap(x)}px, ${snap(y)}px)`
    }
  }

  function follow() {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const ease = reduced ? 1 : EASE

    current.current.x += (target.current.x - current.current.x) * ease
    current.current.y += (target.current.y - current.current.y) * ease
    place(current.current.x, current.current.y)

    const settled =
      Math.abs(target.current.x - current.current.x) < 0.1 &&
      Math.abs(target.current.y - current.current.y) < 0.1

    frame.current = settled ? 0 : requestAnimationFrame(follow)
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") {
      return
    }

    const row = (event.target as Element).closest<HTMLElement>("[data-preview]")
    const src = row?.dataset.preview ?? null

    const x =
      event.clientX + OFFSET + CARD.width > window.innerWidth
        ? event.clientX - OFFSET - CARD.width
        : event.clientX + OFFSET
    const y =
      event.clientY + OFFSET + CARD.height > window.innerHeight
        ? event.clientY - OFFSET - CARD.height
        : event.clientY + OFFSET

    target.current = { x, y }

    if (src && !active) {
      // Appear at the cursor instead of gliding in from the last spot.
      current.current = { x, y }
      place(x, y)
    }

    setArmed(true)
    setActive(src)

    if (!frame.current) {
      frame.current = requestAnimationFrame(follow)
    }
  }

  return (
    <>
      <ul
        className={className}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setActive(null)}
      >
        {children}
      </ul>
      <div
        ref={cardRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border border-border/70 bg-background shadow-2xl shadow-black/20 transition-opacity duration-200 ease-out",
            active ? "opacity-100" : "opacity-0"
          )}
          style={CARD}
        >
          {armed
            ? previews.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={2560}
                  height={1600}
                  // Ask for 1.5x the card size so small text in the
                  // screenshot stays legible, even on 1x displays.
                  sizes={`${CARD.width * 1.5}px`}
                  quality={90}
                  loading="eager"
                  className={cn(
                    "absolute inset-0 size-full object-cover object-top transition-opacity duration-200",
                    active === src ? "opacity-100" : "opacity-0"
                  )}
                />
              ))
            : null}
        </div>
      </div>
    </>
  )
}
