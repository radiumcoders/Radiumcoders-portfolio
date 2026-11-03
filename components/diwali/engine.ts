import type { CrackerSound } from "@/components/diwali/sound"

export const tools = [
  "rocket",
  "anar",
  "chakri",
  "phuljhadi",
  "bomb",
  "ladi",
] as const

export type Tool = (typeof tools)[number]

// Spark colours, as "r,g,b" so each can be drawn at a few strengths.
const COLOURS = {
  gold: "255,186,82",
  marigold: "255,140,36",
  red: "255,72,64",
  pink: "255,92,170",
  violet: "178,112,255",
  blue: "92,150,255",
  cyan: "96,230,255",
  green: "112,255,140",
  white: "255,246,228",
  silver: "214,222,255",
} as const

type Colour = keyof typeof COLOURS

const COLOUR_NAMES = Object.keys(COLOURS) as Colour[]
const COLOUR_INDEX = Object.fromEntries(
  COLOUR_NAMES.map((name, index) => [name, index])
) as Record<Colour, number>
const SHELL_COLOURS: Colour[] = [
  "gold",
  "marigold",
  "red",
  "pink",
  "violet",
  "blue",
  "cyan",
  "green",
  "silver",
]

// Sparks fade through this many strengths; each strength of each colour is
// one batched stroke per frame.
const LEVELS = 4
const STYLES = COLOUR_NAMES.flatMap((name) =>
  Array.from(
    { length: LEVELS },
    (_, level) => `rgba(${COLOURS[name]},${(level + 1) / LEVELS})`
  )
)

const GRAVITY = 240
const MAX_PARTICLES = 9000
const MAX_EMITTERS = 40
// How much of the last frame's light is left after a 60th of a second. The
// rest stays on as trails.
const TRAIL = 0.8
const LIGHT_SCALE = 0.25

type Particle = {
  x: number
  y: number
  px: number
  py: number
  vx: number
  vy: number
  life: number
  max: number
  colour: number
  drag: number
  gravity: number
  flicker: boolean
  crackle: boolean
  // Embers shed per second, for willows and chrysanthemums.
  trail: number
  // Colour-changing stars switch to this colour (-1 for none) once their
  // remaining life drops below shiftAt.
  next: number
  shiftAt: number
}

type SparkOptions = Partial<
  Pick<Particle, "drag" | "gravity" | "flicker" | "crackle" | "trail">
> & { next?: Colour; shift?: number }

// A light that lives for one frame: a fountain, a rocket's motor, a sparkler.
type Lamp = {
  x: number
  y: number
  radius: number
  colour: string
  strength: number
}

type Smoke = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  life: number
  max: number
  alpha: number
}

type Glow = {
  x: number
  y: number
  radius: number
  colour: string
  life: number
  max: number
}

type Emitter = {
  // Advances by dt seconds; false once it has burnt out.
  update(dt: number): boolean
  // Draws the cracker itself (casing, fuse, wheel) on the scene layer.
  draw?(scene: CanvasRenderingContext2D): void
}

type Shell =
  "peony" | "chrysanthemum" | "ring" | "willow" | "crackle" | "heart" | "double"

const SHELLS: Shell[] = [
  "peony",
  "peony",
  "chrysanthemum",
  "ring",
  "willow",
  "crackle",
  "double",
  "heart",
]

const random = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)]

export type Fireworks = {
  press(tool: Tool, x: number, y: number): void
  move(x: number, y: number): void
  release(): void
  // Lights the chosen cracker somewhere sensible, for keyboard players.
  surprise(tool: Tool): void
  finale(): void
  destroy(): void
}

export function createFireworks({
  scene,
  sparks,
  stage,
  ground,
  sound,
  onLight,
}: {
  // Smoke, glows and the crackers themselves, redrawn every frame.
  scene: HTMLCanvasElement
  // The sky with the sparks' light painted into it, left to fade as trails.
  sparks: HTMLCanvasElement
  stage: HTMLElement
  ground: HTMLElement
  sound: CrackerSound
  // Called once for every cracker a visitor lights.
  onLight: () => void
}): Fireworks {
  // The still sky lives offscreen. Each frame the sparks canvas fades back
  // towards it, which leaves trails without the faint ghost lines that fading
  // to transparent leaves behind.
  const sky = document.createElement("canvas")
  const skyContext = sky.getContext("2d")!
  const sceneContext = scene.getContext("2d")!
  const sparkContext = sparks.getContext("2d")!
  // Bloom and light spill, drawn offscreen at quarter resolution (upscaling
  // softens it for free) and then added into the sparks canvas at the rate
  // the trails fade, so a steady light settles at its own strength.
  const lightCanvas = document.createElement("canvas")
  const lightContext = lightCanvas.getContext("2d")!
  const stillness = window.matchMedia("(prefers-reduced-motion: reduce)")

  let width = 0
  let height = 0
  let floor = 0
  let ratio = 1
  let clock = 0
  let frame = 0
  let previous: number | null = null
  let shake = 0
  let flash = 0
  let disposed = false

  const particles: Particle[] = []
  const spare: Particle[] = []
  const smoke: Smoke[] = []
  const glows: Glow[] = []
  const lamps: Lamp[] = []
  let twinkles: {
    x: number
    y: number
    size: number
    phase: number
    speed: number
  }[] = []
  let meteor = random(4, 9)
  const emitters: Emitter[] = []
  const queue: { at: number; run: () => void }[] = []
  const buckets: Particle[][] = STYLES.map(() => [])
  let crackles = 0
  let crackleX = 0

  const sparkler = { active: false, x: 0, y: 0, sound: 0 }

  // Scale for burst sizes, so a phone and a monitor both get a full sky.
  const reach = () =>
    Math.min(Math.max(Math.min(width, height) * 0.22, 80), 240)
  const pan = (x: number) => (x / Math.max(width, 1)) * 2 - 1

  function spawn(
    x: number,
    y: number,
    vx: number,
    vy: number,
    life: number,
    colour: Colour,
    options: SparkOptions = {}
  ) {
    if (particles.length >= MAX_PARTICLES) return
    const particle = spare.pop() ?? ({} as Particle)
    particle.x = particle.px = x
    particle.y = particle.py = y
    particle.vx = vx
    particle.vy = vy
    particle.life = particle.max = life
    particle.colour = COLOUR_INDEX[colour]
    particle.drag = options.drag ?? 1.4
    particle.gravity = options.gravity ?? 1
    particle.flicker = options.flicker ?? false
    particle.crackle = options.crackle ?? false
    particle.trail = options.trail ?? 0
    particle.next = options.next ? COLOUR_INDEX[options.next] : -1
    particle.shiftAt = life * (options.shift ?? 0.5)
    particles.push(particle)
  }

  function puff(
    x: number,
    y: number,
    radius: number,
    count: number,
    alpha = 0.16
  ) {
    for (let i = 0; i < count; i++) {
      const life = random(3, 6)
      smoke.push({
        x: x + random(-radius, radius),
        y: y + random(-radius, radius) * 0.6,
        vx: random(4, 18),
        vy: random(-14, -4),
        radius: random(radius * 0.5, radius * 1.1),
        life,
        max: life,
        alpha,
      })
    }
    if (smoke.length > 220) smoke.splice(0, smoke.length - 220)
  }

  function glow(
    x: number,
    y: number,
    radius: number,
    colour: Colour,
    life = 0.35
  ) {
    glows.push({ x, y, radius, colour: COLOURS[colour], life, max: life })
  }

  function lamp(
    x: number,
    y: number,
    radius: number,
    colour: Colour,
    strength: number
  ) {
    lamps.push({ x, y, radius, colour: COLOURS[colour], strength })
  }

  function later(delay: number, run: () => void) {
    queue.push({ at: clock + delay, run })
  }

  // A point on a sphere seen from the side, which is why real bursts look
  // denser at the rim.
  function sphere(speed: number) {
    const z = Math.random() * 2 - 1
    const angle = Math.random() * Math.PI * 2
    const r = Math.sqrt(1 - z * z)
    return [Math.cos(angle) * r * speed, Math.sin(angle) * r * speed] as const
  }

  function burst(x: number, y: number, shell: Shell) {
    const size = reach()
    const colour = pick(SHELL_COLOURS)
    const second = pick(SHELL_COLOURS.filter((c) => c !== colour))
    let bang = 0.7

    switch (shell) {
      case "peony":
      case "chrysanthemum": {
        const drag = 1.5
        const trail = shell === "chrysanthemum" ? 7 : 0
        // Some shells change colour halfway through, like the real ones.
        const shift = Math.random() < 0.45 ? second : undefined
        for (let i = 0; i < 180; i++) {
          const [vx, vy] = sphere(size * drag * random(0.92, 1.05))
          spawn(x, y, vx, vy, random(1.3, 1.9), colour, {
            drag,
            flicker: Math.random() < 0.3,
            trail,
            next: shift,
            shift: random(0.4, 0.5),
          })
        }
        break
      }
      case "double": {
        const drag = 1.5
        for (let i = 0; i < 120; i++) {
          const [vx, vy] = sphere(size * drag * random(0.95, 1.05))
          spawn(x, y, vx, vy, random(1.2, 1.7), colour, { drag })
        }
        for (let i = 0; i < 60; i++) {
          const [vx, vy] = sphere(size * drag * 0.5)
          spawn(x, y, vx, vy, random(1, 1.4), second, { drag, flicker: true })
        }
        bang = 0.82
        break
      }
      case "ring": {
        const drag = 1.5
        const tilt = random(0, Math.PI)
        const squash = random(0.35, 1)
        for (let i = 0; i < 80; i++) {
          const angle = (i / 80) * Math.PI * 2
          const rx = Math.cos(angle) * size * drag
          const ry = Math.sin(angle) * size * drag * squash
          spawn(
            x,
            y,
            rx * Math.cos(tilt) - ry * Math.sin(tilt),
            rx * Math.sin(tilt) + ry * Math.cos(tilt),
            random(1.3, 1.6),
            colour,
            { drag }
          )
        }
        for (let i = 0; i < 20; i++) {
          const [vx, vy] = sphere(size * 0.4)
          spawn(x, y, vx, vy, random(0.8, 1.1), "white", { drag })
        }
        break
      }
      case "willow": {
        // Slow, heavy gold that droops and drips embers.
        const drag = 2.2
        for (let i = 0; i < 110; i++) {
          const [vx, vy] = sphere(size * drag * random(0.65, 0.8))
          spawn(x, y, vx, vy, random(2.6, 3.4), "gold", {
            drag,
            gravity: 0.35,
            trail: 9,
          })
        }
        bang = 0.6
        break
      }
      case "crackle": {
        const drag = 1.6
        for (let i = 0; i < 90; i++) {
          const [vx, vy] = sphere(size * drag * random(0.7, 1))
          spawn(
            x,
            y,
            vx,
            vy,
            random(0.8, 1.2),
            Math.random() < 0.5 ? "gold" : "silver",
            {
              drag,
              crackle: true,
            }
          )
        }
        break
      }
      case "heart": {
        const drag = 1.5
        const heart = Math.random() < 0.5 ? "pink" : "red"
        for (let i = 0; i < 100; i++) {
          const t = (i / 100) * Math.PI * 2
          const hx = 16 * Math.sin(t) ** 3
          const hy = -(
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
          )
          spawn(
            x,
            y,
            (hx / 17) * size * drag,
            (hy / 17) * size * drag,
            random(1.4, 1.7),
            heart,
            {
              drag,
              gravity: 0.4,
            }
          )
        }
        break
      }
    }

    glow(x, y, size * 1.6, colour, 0.6)
    puff(x, y, size * 0.35, 6, 0.08)
    sound.boom(bang, pan(x))
  }

  function rocket(x: number, target: number, shell: Shell = pick(SHELLS)) {
    const rise = Math.max(floor - target, 120)
    let vy = -Math.sqrt(2 * GRAVITY * rise)
    let vx = random(-18, 18)
    let rx = x
    let ry = floor
    sound.whistle(Math.min(-vy / GRAVITY, 2.2), pan(x))
    puff(x, floor - 8, 10, 3, 0.12)
    emitters.push({
      update(dt) {
        vy += GRAVITY * dt
        rx += vx * dt
        ry += vy * dt
        vx *= Math.exp(-0.4 * dt)
        const count = Math.ceil(dt * 120)
        for (let i = 0; i < count; i++) {
          spawn(
            rx,
            ry,
            random(-25, 25),
            random(30, 90),
            random(0.25, 0.6),
            "gold",
            {
              drag: 2,
              gravity: 0.6,
              flicker: true,
            }
          )
        }
        if (vy >= -20) {
          burst(rx, ry, shell)
          return false
        }
        lamp(rx, ry, 34, "gold", 0.5)
        return true
      },
      draw(context) {
        context.fillStyle = "rgba(255,240,210,0.95)"
        context.beginPath()
        context.arc(rx, ry, 2, 0, Math.PI * 2)
        context.fill()
      },
    })
  }

  // The flower pot: a fountain of gold that swells and dies back down.
  function anar(x: number) {
    const duration = 3.4
    const height = Math.min(Math.max((floor - 40) * 0.45, 140), 380)
    const speed = Math.sqrt(2 * GRAVITY * height)
    let t = 0
    sound.hiss(duration, 2600, pan(x))
    sound.crackle(duration, 26, pan(x))
    emitters.push({
      update(dt) {
        t += dt
        if (t >= duration) {
          puff(x, floor - 10, 14, 4)
          return false
        }
        const strength = Math.sin((Math.PI * t) / duration) ** 0.5
        const count = Math.ceil(dt * 520 * strength)
        for (let i = 0; i < count; i++) {
          const angle =
            -Math.PI / 2 + (Math.random() + Math.random() - 1) * 0.32
          const v = speed * random(0.55, 1.05) * (0.6 + 0.4 * strength)
          spawn(
            x + random(-2, 2),
            floor - 14,
            Math.cos(angle) * v,
            Math.sin(angle) * v,
            random(0.9, 1.6),
            pick(["gold", "gold", "white", "marigold"] as const),
            { drag: 0.5, flicker: Math.random() < 0.5 }
          )
        }
        if (Math.random() < dt * 6) puff(x, floor - 30, 10, 1, 0.08)
        lamp(x, floor - height * 0.35, height * 0.9, "gold", 0.32 * strength)
        lamp(x, floor - 16, 46, "white", 0.55 * strength)
        return true
      },
      draw(context) {
        // A squat clay pot, wrapped in paper.
        context.fillStyle = "#b9542b"
        context.beginPath()
        context.moveTo(x - 9, floor)
        context.lineTo(x - 5, floor - 14)
        context.lineTo(x + 5, floor - 14)
        context.lineTo(x + 9, floor)
        context.closePath()
        context.fill()
        context.fillStyle = "#f2c14e"
        context.fillRect(x - 7, floor - 8, 14, 2.5)
      },
    })
  }

  // The ground spinner: it whirls on the spot, throwing sparks off its rim.
  function chakri(x: number) {
    const duration = 4
    const colour = pick(["gold", "red", "green", "pink", "cyan"] as const)
    let t = 0
    let angle = 0
    let cx = x
    const cy = floor - 5
    sound.hiss(duration, 4200, pan(x))
    sound.crackle(duration, 14, pan(x))
    emitters.push({
      update(dt) {
        t += dt
        if (t >= duration) {
          puff(cx, cy, 10, 4)
          return false
        }
        const spin = 26 * Math.min(t * 2, 1) * (1 - (t / duration) ** 3)
        angle += spin * dt
        cx += Math.sin(t * 2.3) * 14 * dt
        const count = Math.ceil(dt * 380)
        for (let i = 0; i < count; i++) {
          const a = angle + random(0, Math.PI * 2)
          const rimX = cx + Math.cos(a) * 9
          const rimY = cy + Math.sin(a) * 3.5
          const v = random(120, 260) * (spin / 26 + 0.2)
          spawn(
            rimX,
            rimY,
            -Math.sin(a) * v,
            Math.cos(a) * v * 0.45 - random(10, 70),
            random(0.3, 0.75),
            Math.random() < 0.7 ? colour : "white",
            { drag: 2.2, gravity: 0.9, flicker: true }
          )
        }
        lamp(cx, cy, 90, colour, 0.45 * Math.min(spin / 26 + 0.2, 1))
        return true
      },
      draw(context) {
        context.save()
        context.translate(cx, cy)
        context.scale(1, 0.4)
        context.rotate(angle)
        context.strokeStyle = "#e9b64c"
        context.lineWidth = 2.4
        context.beginPath()
        for (let i = 0; i < 26; i++) {
          const a = i * 0.5
          const r = 1 + i * 0.36
          if (i === 0) context.moveTo(Math.cos(a) * r, Math.sin(a) * r)
          else context.lineTo(Math.cos(a) * r, Math.sin(a) * r)
        }
        context.stroke()
        context.restore()
        const halo = context.createRadialGradient(cx, cy, 0, cx, cy, 22)
        halo.addColorStop(0, "rgba(255,230,170,0.55)")
        halo.addColorStop(1, "rgba(255,230,170,0)")
        context.fillStyle = halo
        context.fillRect(cx - 22, cy - 22, 44, 44)
      },
    })
  }

  // The sutli bomb: a fuse that fizzes for a moment, then the big one.
  function bomb(x: number) {
    const fuse = 1.5
    let t = 0
    const y = floor - 9
    sound.crackle(fuse, 30, pan(x))
    emitters.push({
      update(dt) {
        t += dt
        const tip = {
          x: x + 4 + (t / fuse) * -2,
          y: y - 9 - (1 - t / fuse) * 8,
        }
        if (t < fuse) {
          const count = Math.ceil(dt * 90)
          for (let i = 0; i < count; i++) {
            spawn(
              tip.x,
              tip.y,
              random(-60, 60),
              random(-110, -20),
              random(0.15, 0.4),
              "white",
              {
                drag: 3,
                gravity: 0.6,
                flicker: true,
              }
            )
          }
          lamp(tip.x, tip.y, 30, "white", 0.4)
          return true
        }
        const size = reach()
        for (let i = 0; i < 240; i++) {
          const angle = random(Math.PI, Math.PI * 2)
          const v = size * random(2, 5.5)
          spawn(
            x,
            y,
            Math.cos(angle) * v,
            Math.sin(angle) * v,
            random(0.2, 0.55),
            pick(["white", "gold", "marigold"] as const),
            {
              drag: 4,
              gravity: 1.2,
            }
          )
        }
        for (let i = 0; i < 40; i++) {
          const angle = random(Math.PI * 1.1, Math.PI * 1.9)
          const v = random(200, 420)
          spawn(
            x,
            y,
            Math.cos(angle) * v,
            Math.sin(angle) * v,
            random(0.6, 1.1),
            "red",
            {
              drag: 2.5,
              gravity: 1.4,
              flicker: true,
            }
          )
        }
        glow(x, y, size * 2.2, "white", 0.5)
        puff(x, y - 20, 34, 14, 0.22)
        sound.boom(1, pan(x))
        if (!stillness.matches) {
          shake = 0.45
          flash = 0.32
        } else {
          flash = 0.08
        }
        return false
      },
      draw(context) {
        if (t >= fuse) return
        // Brown paper wound tight with string.
        context.fillStyle = "#8a5a2e"
        context.beginPath()
        context.arc(x, y, 9, 0, Math.PI * 2)
        context.fill()
        context.strokeStyle = "rgba(232,200,150,0.55)"
        context.lineWidth = 1
        for (let i = -6; i <= 6; i += 3) {
          context.beginPath()
          context.moveTo(x - 9, y + i)
          context.lineTo(x + 9, y + i + 2)
          context.stroke()
        }
        context.strokeStyle = "#d8c7a0"
        context.lineWidth = 1.2
        context.beginPath()
        context.moveTo(x + 2, y - 8)
        context.lineTo(x + 4 - (t / fuse) * 2, y - 9 - (1 - t / fuse) * 8)
        context.stroke()
      },
    })
  }

  // A string of small crackers that go off one after another down the line.
  function ladi(x: number) {
    const count = 36
    const spacing = 7
    const direction = x > width / 2 ? -1 : 1
    const positions = Array.from(
      { length: count },
      (_, i) => x + i * spacing * direction
    ).filter((p) => p > 6 && p < width - 6)
    let next = 0
    let wait = 0.5
    emitters.push({
      update(dt) {
        wait -= dt
        while (wait <= 0 && next < positions.length) {
          const px = positions[next++]
          const py = floor - 3 - Math.random() * 6
          for (let i = 0; i < 22; i++) {
            const angle = random(0, Math.PI * 2)
            const v = random(80, 260)
            spawn(
              px,
              py,
              Math.cos(angle) * v,
              Math.sin(angle) * v * 0.8 - 40,
              random(0.1, 0.3),
              Math.random() < 0.6 ? "white" : "marigold",
              { drag: 5, gravity: 0.5 }
            )
          }
          glow(px, py, 26, "gold", 0.12)
          if (Math.random() < 0.4) puff(px, py - 6, 8, 1, 0.12)
          sound.pop(pan(px))
          wait += random(0.035, 0.11)
        }
        return next < positions.length
      },
      draw(context) {
        context.strokeStyle = "rgba(220,200,160,0.5)"
        context.lineWidth = 1
        if (next < positions.length) {
          context.beginPath()
          context.moveTo(positions[next], floor - 4)
          context.lineTo(positions[positions.length - 1], floor - 4)
          context.stroke()
        }
        context.fillStyle = "#c8312d"
        for (let i = next; i < positions.length; i++) {
          context.fillRect(positions[i] - 1.5, floor - 8, 3, 7)
        }
      },
    })
  }

  function light(tool: Tool, x: number, y: number) {
    if (tool === "phuljhadi") return
    if (emitters.length >= MAX_EMITTERS) return
    onLight()
    if (tool === "rocket") rocket(x, Math.min(y, floor - 140))
    else if (tool === "anar") anar(x)
    else if (tool === "chakri") chakri(x)
    else if (tool === "bomb") bomb(x)
    else ladi(x)
  }

  function resize() {
    const rect = stage.getBoundingClientRect()
    width = rect.width
    height = rect.height
    floor = height - ground.offsetHeight
    ratio = Math.min(window.devicePixelRatio || 1, 2)
    for (const canvas of [sky, scene, sparks]) {
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
    }
    for (const context of [skyContext, sceneContext, sparkContext]) {
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    lightCanvas.width = Math.round(width * LIGHT_SCALE)
    lightCanvas.height = Math.round(height * LIGHT_SCALE)
    lightContext.setTransform(LIGHT_SCALE, 0, 0, LIGHT_SCALE, 0, 0)
    paintSky()
    sparkContext.globalCompositeOperation = "source-over"
    sparkContext.drawImage(sky, 0, 0, width, height)
  }

  // The still backdrop: stars, and a city skyline glowing with lights.
  // Diwali falls on a new moon, so there's no moon.
  function paintSky() {
    // Seeded, so the skyline stays put when the window resizes.
    let seed = 2026
    const seeded = () => {
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    const between = (min: number, max: number) => min + seeded() * (max - min)
    const context = skyContext
    const gradient = context.createLinearGradient(0, 0, 0, floor)
    gradient.addColorStop(0, "#03040b")
    gradient.addColorStop(0.6, "#0a0918")
    gradient.addColorStop(1, "#24112b")
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)

    const stars = Math.round((width * floor) / 2600)
    for (let i = 0; i < stars; i++) {
      const sy = seeded() ** 1.6 * floor * 0.8
      context.fillStyle = `rgba(255,255,255,${between(0.15, 0.7) * (1 - sy / floor)})`
      context.fillRect(
        seeded() * width,
        sy,
        between(0.6, 1.4),
        between(0.6, 1.4)
      )
    }

    // The brighter stars twinkle, so they're drawn live each frame.
    twinkles = Array.from({ length: Math.round(width / 28) }, () => ({
      x: seeded() * width,
      y: seeded() ** 1.4 * floor * 0.7,
      size: between(1, 1.8),
      phase: between(0, Math.PI * 2),
      speed: between(0.8, 2.4),
    }))

    const torans = ["#ff8c24", "#ffd24a", "#ff4f7a", "#7ef08f", "#6fd8ff"]
    let bx = -between(0, 40)
    while (bx < width) {
      const bw = between(28, 86)
      const bh = between(20, Math.min(130, floor * 0.3))
      const top = floor - bh
      context.fillStyle = "#08070f"
      context.fillRect(bx, top, bw, bh)
      context.fillStyle = "rgba(255,196,120,0.55)"
      for (let wy = top + 8; wy < floor - 6; wy += 9) {
        for (let wx = bx + 5; wx < bx + bw - 5; wx += 8) {
          if (seeded() < 0.22) context.fillRect(wx, wy, 3, 4)
        }
      }
      // Strings of lights draped along some rooftops.
      if (seeded() < 0.45) {
        for (let lx = bx + 3; lx < bx + bw - 2; lx += 5) {
          const sag = Math.sin(((lx - bx) / bw) * Math.PI) * 4
          context.fillStyle = torans[Math.floor(lx / 5) % torans.length]
          context.fillRect(lx, top + 2 + sag, 1.6, 1.6)
        }
      }
      bx += bw + between(0, 14)
    }

    // The rooftop everyone's standing on.
    const roof = context.createLinearGradient(0, floor, 0, height)
    roof.addColorStop(0, "#1c1119")
    roof.addColorStop(1, "#0a0608")
    context.fillStyle = roof
    context.fillRect(0, floor, width, height - floor)
    context.fillStyle = "#3d2735"
    context.fillRect(0, floor, width, 1)
  }

  function step(dt: number) {
    clock += dt

    // Now and then a shooting star slips across the top of the sky.
    meteor -= dt
    if (meteor <= 0) {
      meteor = random(7, 16)
      const leftward = Math.random() < 0.5
      const speed = random(650, 900)
      const angle = random(0.25, 0.45)
      spawn(
        leftward ? width * random(0.6, 1) : width * random(0, 0.4),
        floor * random(0.05, 0.25),
        Math.cos(angle) * speed * (leftward ? -1 : 1),
        Math.sin(angle) * speed,
        random(0.6, 0.9),
        "silver",
        { drag: 0.2, gravity: 0 }
      )
    }

    for (let i = queue.length - 1; i >= 0; i--) {
      if (queue[i].at <= clock) {
        const { run } = queue[i]
        queue.splice(i, 1)
        run()
      }
    }

    for (let i = emitters.length - 1; i >= 0; i--) {
      if (!emitters[i].update(dt)) emitters.splice(i, 1)
    }

    if (sparkler.active) {
      const count = Math.ceil(dt * 520)
      for (let i = 0; i < count; i++) {
        const angle = random(0, Math.PI * 2)
        const v = random(60, 280)
        spawn(
          sparkler.x,
          sparkler.y,
          Math.cos(angle) * v,
          Math.sin(angle) * v,
          random(0.12, 0.42),
          Math.random() < 0.75 ? "white" : "gold",
          {
            drag: 3.2,
            gravity: 0.5,
            flicker: true,
            crackle: Math.random() < 0.02,
          }
        )
      }
      lamp(sparkler.x, sparkler.y, 80, "white", 0.5)
      sparkler.sound -= dt
      if (sparkler.sound <= 0) {
        sound.crackle(0.25, 70, pan(sparkler.x))
        sparkler.sound = 0.22
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.px = p.x
      p.py = p.y
      const drag = Math.exp(-p.drag * dt)
      p.vx *= drag
      p.vy = p.vy * drag + GRAVITY * p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.y > floor && p.vy > 0) {
        p.y = floor
        p.vy *= -0.25
        p.vx *= 0.6
      }
      if (p.trail && Math.random() < p.trail * dt) {
        spawn(p.x, p.y, p.vx * 0.1, p.vy * 0.1, random(0.3, 0.7), "gold", {
          drag: 2,
          gravity: 0.3,
          flicker: true,
        })
      }
      p.life -= dt
      if (p.next >= 0 && p.life < p.shiftAt) {
        p.colour = p.next
        p.next = -1
      }
      if (p.life <= 0) {
        if (p.crackle) {
          for (let k = 0; k < 4; k++) {
            spawn(
              p.x,
              p.y,
              random(-50, 50),
              random(-50, 50),
              random(0.05, 0.14),
              "white",
              { drag: 4, gravity: 0 }
            )
          }
          crackles++
          crackleX = p.x
        }
        particles[i] = particles[particles.length - 1]
        particles.pop()
        spare.push(p)
      }
    }

    // All the crackles from this frame share one burst of sound.
    if (crackles) {
      sound.crackle(0.12, crackles * 6, pan(crackleX))
      crackles = 0
    }

    for (let i = smoke.length - 1; i >= 0; i--) {
      const s = smoke[i]
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.radius += dt * 6
      s.life -= dt
      if (s.life <= 0) smoke.splice(i, 1)
    }
    for (let i = glows.length - 1; i >= 0; i--) {
      glows[i].life -= dt
      if (glows[i].life <= 0) glows.splice(i, 1)
    }
    shake = Math.max(0, shake - dt)
    flash = Math.max(0, flash - dt * 0.9)
  }

  function draw(dt: number) {
    // Sparks: fade what's there back towards the sky so it lingers as
    // trails, then add light.
    sparkContext.globalCompositeOperation = "source-over"
    const fade = 1 - TRAIL ** (dt * 60)
    sparkContext.globalAlpha = fade
    sparkContext.drawImage(sky, 0, 0, width, height)
    sparkContext.globalAlpha = 1
    sparkContext.globalCompositeOperation = "lighter"
    sparkContext.lineCap = "round"
    sparkContext.lineWidth = 1.6

    for (const bucket of buckets) bucket.length = 0
    for (const p of particles) {
      let strength = Math.min((p.life / p.max) * 1.6, 1)
      if (p.flicker && Math.random() < 0.35) strength *= 0.25
      if (strength < 0.04) continue
      const level = Math.min(LEVELS - 1, Math.floor(strength * LEVELS))
      // Stars burn white-hot for a moment before their colour comes through.
      const colour = p.life > p.max * 0.88 ? COLOUR_INDEX.white : p.colour
      buckets[colour * LEVELS + level].push(p)
    }
    buckets.forEach((bucket, index) => {
      if (!bucket.length) return
      sparkContext.strokeStyle = STYLES[index]
      sparkContext.beginPath()
      for (const p of bucket) {
        sparkContext.moveTo(p.px, p.py)
        sparkContext.lineTo(p.x + 0.1, p.y + 0.1)
      }
      sparkContext.stroke()
    })

    // Light: a wide, soft copy of the sparks for bloom, plus the glow each
    // burst and fountain throws on the sky, the smoke and the roof.
    const glowing = lightContext
    glowing.clearRect(0, 0, width, height)
    glowing.globalCompositeOperation = "lighter"
    glowing.lineCap = "round"
    glowing.lineWidth = 4
    buckets.forEach((bucket, index) => {
      if (!bucket.length || index % LEVELS < 1) return
      glowing.strokeStyle = STYLES[index]
      glowing.beginPath()
      for (const p of bucket) {
        glowing.moveTo(p.px, p.py)
        glowing.lineTo(p.x + 0.1, p.y + 0.1)
      }
      glowing.stroke()
    })
    const shine = (
      x: number,
      y: number,
      radius: number,
      colour: string,
      strength: number
    ) => {
      const halo = glowing.createRadialGradient(x, y, 0, x, y, radius)
      halo.addColorStop(0, `rgba(${colour},${strength})`)
      halo.addColorStop(0.35, `rgba(${colour},${strength * 0.35})`)
      halo.addColorStop(1, `rgba(${colour},0)`)
      glowing.fillStyle = halo
      glowing.fillRect(x - radius, y - radius, radius * 2, radius * 2)
      // Light pooling on the roof, stronger the closer the source is.
      const near = 1 - Math.min(Math.max((floor - y) / (floor * 0.9), 0), 1)
      if (near > 0.05) {
        glowing.save()
        glowing.translate(x, floor + 6)
        glowing.scale(1, 0.16)
        const pool = glowing.createRadialGradient(0, 0, 0, 0, 0, radius * 1.4)
        pool.addColorStop(0, `rgba(${colour},${strength * near * 0.9})`)
        pool.addColorStop(1, `rgba(${colour},0)`)
        glowing.fillStyle = pool
        glowing.fillRect(
          -radius * 1.4,
          -radius * 1.4,
          radius * 2.8,
          radius * 2.8
        )
        glowing.restore()
      }
    }
    for (const g of glows) {
      const fresh = g.life / g.max
      shine(g.x, g.y, g.radius, g.colour, 0.5 * fresh * fresh)
      // A faint wash over the whole sky in the burst's colour.
      shine(g.x, g.y, Math.max(width, height), g.colour, 0.07 * fresh)
    }
    for (const l of lamps) shine(l.x, l.y, l.radius, l.colour, l.strength)
    lamps.length = 0
    if (flash > 0) {
      glowing.fillStyle = `rgba(255,226,180,${flash})`
      glowing.fillRect(0, 0, width, height)
    }
    glowing.globalCompositeOperation = "source-over"
    sparkContext.globalCompositeOperation = "lighter"
    sparkContext.globalAlpha = fade
    sparkContext.imageSmoothingQuality = "high"
    sparkContext.drawImage(lightCanvas, 0, 0, width, height)
    sparkContext.globalAlpha = 1

    // The scene: smoke, glows and the crackers themselves, redrawn fresh.
    const context = sceneContext
    context.clearRect(0, 0, width, height)
    for (const star of twinkles) {
      const shimmer = 0.5 + 0.5 * Math.sin(clock * star.speed + star.phase)
      context.fillStyle = `rgba(255,250,235,${0.15 + shimmer * 0.7})`
      context.fillRect(star.x, star.y, star.size, star.size)
    }
    for (const s of smoke) {
      const strength =
        s.alpha * Math.min(s.life / s.max, (s.max - s.life) * 3, 1)
      const cloud = context.createRadialGradient(
        s.x,
        s.y,
        0,
        s.x,
        s.y,
        s.radius
      )
      cloud.addColorStop(0, `rgba(150,140,160,${strength})`)
      cloud.addColorStop(1, "rgba(150,140,160,0)")
      context.fillStyle = cloud
      context.fillRect(
        s.x - s.radius,
        s.y - s.radius,
        s.radius * 2,
        s.radius * 2
      )
    }
    for (const emitter of emitters) emitter.draw?.(context)
    if (sparkler.active) {
      context.strokeStyle = "rgba(150,150,160,0.9)"
      context.lineWidth = 1.5
      context.beginPath()
      context.moveTo(sparkler.x, sparkler.y)
      context.lineTo(sparkler.x + 26, sparkler.y + 46)
      context.stroke()
    }

    stage.style.transform = shake
      ? `translate(${random(-1, 1) * shake * 18}px, ${random(-1, 1) * shake * 18}px)`
      : ""
  }

  function tick(now: number) {
    frame = 0
    if (disposed) return
    const dt =
      previous === null ? 1 / 60 : Math.min((now - previous) / 1000, 0.05)
    previous = now
    step(dt)
    draw(dt)
    frame = requestAnimationFrame(tick)
  }

  function visibility() {
    // Don't let a tab that was away catch up all at once.
    previous = null
  }

  const observer = new ResizeObserver(resize)
  observer.observe(stage)
  document.addEventListener("visibilitychange", visibility)
  resize()
  frame = requestAnimationFrame(tick)

  // A few shells to set the mood. They're silent: sound only starts after the
  // first tap.
  ;[0.5, 1.1, 1.6].forEach((delay, i) =>
    later(delay, () =>
      rocket(width * [0.3, 0.7, 0.5][i], floor * random(0.25, 0.4))
    )
  )

  return {
    press(tool, x, y) {
      if (tool === "phuljhadi") {
        if (!sparkler.active) onLight()
        sparkler.active = true
        sparkler.x = x
        sparkler.y = y
        sparkler.sound = 0
        return
      }
      light(tool, x, y)
    },
    move(x, y) {
      sparkler.x = x
      sparkler.y = y
    },
    release() {
      sparkler.active = false
    },
    surprise(tool) {
      const x = random(width * 0.15, width * 0.85)
      if (tool === "phuljhadi") {
        // A quick swirl drawn in the air.
        onLight()
        sparkler.active = true
        const cy = floor * 0.5
        for (let i = 0; i <= 30; i++) {
          later(i * 0.04, () => {
            const a = (i / 30) * Math.PI * 4
            sparkler.x = x + Math.cos(a) * 60
            sparkler.y = cy + Math.sin(a) * 60
            if (i === 30) sparkler.active = false
          })
        }
        return
      }
      light(tool, x, random(floor * 0.2, floor * 0.45))
    },
    finale() {
      // Every shell in the show counts towards the tally.
      for (let i = 0; i < 16; i++) {
        later(i * 0.28 + random(0, 0.15), () => {
          onLight()
          rocket(
            random(width * 0.1, width * 0.9),
            random(floor * 0.15, floor * 0.45)
          )
        })
      }
      later(0.2, () => {
        onLight()
        anar(width * 0.25)
      })
      later(0.6, () => {
        onLight()
        anar(width * 0.75)
      })
      // Everything at once to close.
      later(5, () => {
        for (let i = 0; i < 6; i++) {
          onLight()
          rocket(
            width * (0.12 + i * 0.152),
            floor * random(0.2, 0.35),
            pick(["peony", "chrysanthemum", "willow"] as const)
          )
        }
      })
    },
    destroy() {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener("visibilitychange", visibility)
      stage.style.transform = ""
    },
  }
}
