"use client"

import {
  ArrowLeft01Icon,
  BombIcon,
  FireIcon,
  FireworksIcon,
  FlowerPotIcon,
  MagicWand01Icon,
  Rocket01Icon,
  SpiralsIcon,
  VolumeHighIcon,
  VolumeOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import Link from "next/link"
import { type PointerEvent, useEffect, useRef, useState } from "react"

import {
  createFireworks,
  type Fireworks,
  type Tool,
  tools,
} from "@/components/diwali/engine"
import { CrackerSound } from "@/components/diwali/sound"
import { Diya } from "@/components/diyas"
import { cn } from "@/lib/utils"

const crackers = {
  rocket: { label: "Rocket", hint: "Tap the sky", icon: Rocket01Icon },
  anar: { label: "Anar", hint: "Tap the roof", icon: FlowerPotIcon },
  chakri: { label: "Chakri", hint: "Tap the roof", icon: SpiralsIcon },
  phuljhadi: {
    label: "Phuljhadi",
    hint: "Hold and draw",
    icon: MagicWand01Icon,
  },
  bomb: { label: "Bomb", hint: "Tap, then step back", icon: BombIcon },
  ladi: { label: "Ladi", hint: "Tap the roof", icon: FireIcon },
} satisfies Record<Tool, { label: string; hint: string; icon: IconSvgElement }>

const COUNT_KEY = "diwali-crackers"
const MUTE_KEY = "diwali-muted"

function read(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Private windows can refuse storage; the page works without it.
  }
}

export function Playground() {
  const stage = useRef<HTMLDivElement>(null)
  const scene = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<HTMLCanvasElement>(null)
  const ground = useRef<HTMLDivElement>(null)
  const fireworks = useRef<Fireworks | null>(null)
  const sound = useRef<CrackerSound | null>(null)
  const [tool, setTool] = useState<Tool>("rocket")
  const [muted, setMuted] = useState(false)
  const [count, setCount] = useState(0)
  const [lit, setLit] = useState(false)

  // Saved settings only exist in the browser, so they load after mount.
  useEffect(() => {
    const saved = Number(read(COUNT_KEY))
    const quiet = read(MUTE_KEY) === "1"
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved > 0) setCount(saved)
    setMuted(quiet)
  }, [])

  useEffect(() => {
    if (!stage.current || !scene.current || !sparks.current || !ground.current)
      return
    const audio = new CrackerSound()
    audio.muted = read(MUTE_KEY) === "1"
    sound.current = audio
    const show = createFireworks({
      stage: stage.current,
      scene: scene.current,
      sparks: sparks.current,
      ground: ground.current,
      sound: audio,
      onLight: () => {
        setLit(true)
        setCount((value) => {
          write(COUNT_KEY, String(value + 1))
          return value + 1
        })
      },
    })
    fireworks.current = show
    return () => {
      show.destroy()
      audio.destroy()
      fireworks.current = null
      sound.current = null
    }
  }, [])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    write(MUTE_KEY, next ? "1" : "0")
    if (sound.current) sound.current.muted = next
    sound.current?.unlock()
  }

  function finale() {
    sound.current?.unlock()
    fireworks.current?.finale()
  }

  // Keys: 1 to 6 pick a cracker, space or enter lights it, F for the finale,
  // M to mute.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("button, a, input")
      ) {
        if (event.key === " " || event.key === "Enter") return
      }
      const index = Number(event.key) - 1
      if (index >= 0 && index < tools.length) {
        setTool(tools[index])
        return
      }
      const key = event.key.toLowerCase()
      if (key === " " || key === "enter") {
        event.preventDefault()
        sound.current?.unlock()
        fireworks.current?.surprise(tool)
      } else if (key === "f") {
        finale()
      } else if (key === "m") {
        toggleMute()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  function point(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return [event.clientX - rect.left, event.clientY - rect.top] as const
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    // Buttons on top handle their own taps.
    if ((event.target as HTMLElement).closest("button, a")) return
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    sound.current?.unlock()
    const [x, y] = point(event)
    fireworks.current?.press(tool, x, y)
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const [x, y] = point(event)
    fireworks.current?.move(x, y)
  }

  function onPointerUp() {
    fireworks.current?.release()
  }

  return (
    <div className="dark fixed inset-0 overflow-hidden bg-[#03040b] text-foreground select-none">
      <div
        ref={stage}
        role="img"
        aria-label={`Night sky over a rooftop. ${crackers[tool].hint} to light a ${crackers[tool].label.toLowerCase()}, or press space.`}
        className={cn(
          "absolute inset-0 touch-none",
          tool === "phuljhadi" ? "cursor-none" : "cursor-crosshair"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onLostPointerCapture={onPointerUp}
        onContextMenu={(event) => event.preventDefault()}
      >
        <canvas
          ref={sparks}
          className="absolute inset-0 size-full"
          aria-hidden="true"
        />
        {/* Diyas along the edge of the roof, which is painted into the sky. */}
        <div
          ref={ground}
          className="absolute inset-x-0 bottom-0 h-[clamp(96px,16vh,150px)]"
        >
          <div className="absolute inset-x-0 top-0 flex -translate-y-[85%] justify-around px-4">
            {Array.from({ length: 9 }, (_, i) => (
              <Diya
                key={i}
                duration={1.9 + ((i * 7) % 5) * 0.2}
                delay={(i * 0.37) % 1.3}
                className={cn("w-5", i % 2 === 1 && "max-sm:hidden")}
              />
            ))}
          </div>
        </div>
        <canvas
          ref={scene}
          className="pointer-events-none absolute inset-0 size-full"
          aria-hidden="true"
        />
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-6">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-1 rounded-md py-1 pr-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden="true" />
          radiumcoders
        </Link>
        <div
          className={cn(
            "absolute inset-x-0 top-16 flex items-center justify-center gap-3 transition-opacity duration-1000 sm:top-5",
            lit && "max-sm:opacity-0"
          )}
        >
          <Diya className="w-5" duration={2.3} />
          <h1 className="bg-linear-to-b from-[#fff1c9] via-[#ffc65c] to-[#ff8a2a] bg-clip-text text-2xl font-medium tracking-tight text-transparent drop-shadow-[0_0_18px_rgba(255,160,60,0.55)] sm:text-3xl">
            Happy Diwali
          </h1>
          <Diya className="w-5" duration={2.6} delay={0.6} />
        </div>
        <div className="pointer-events-auto flex items-center gap-1">
          <button
            type="button"
            onClick={finale}
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm text-crayon-amber transition-colors hover:bg-white/10"
          >
            <HugeiconsIcon icon={FireworksIcon} size={16} aria-hidden="true" />
            Finale
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            aria-pressed={!muted}
            title={muted ? "Sound off (M)" : "Sound on (M)"}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <HugeiconsIcon
              icon={muted ? VolumeOffIcon : VolumeHighIcon}
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-4 pb-4 sm:pb-5">
        <p
          className="text-xs text-muted-foreground tabular-nums"
          aria-live="polite"
        >
          {count > 0
            ? `${count.toLocaleString()} cracker${count === 1 ? "" : "s"} burst`
            : crackers[tool].hint}
        </p>
        <div
          role="radiogroup"
          aria-label="Cracker"
          className="pointer-events-auto flex gap-0.5 rounded-xl bg-black/50 p-1 ring-1 ring-white/10 backdrop-blur-md"
        >
          {tools.map((name, index) => {
            const { label, icon } = crackers[name]
            const selected = tool === name
            return (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={selected}
                title={`${label} (${index + 1})`}
                onClick={() => setTool(name)}
                className={cn(
                  "flex w-14 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground sm:w-16",
                  selected && "bg-white/12 text-foreground"
                )}
              >
                <HugeiconsIcon
                  icon={icon}
                  size={18}
                  aria-hidden="true"
                  className={cn(selected && "text-crayon-amber")}
                />
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
