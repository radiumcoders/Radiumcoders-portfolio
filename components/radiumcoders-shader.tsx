"use client"

import { type CSSProperties, useEffect, useRef } from "react"

const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 position = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}
`

const FIELD_SHADER = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float uLightMode;
uniform float uFestive;
uniform vec3 uDarkBackground;
uniform vec3 uLightBackground;
out vec4 fragColor;

const float HUE = 0.64;
const float HUE_SPREAD = 0.5;
const float HUE_TRAVEL = 1.46733272;
// The hues run blue through violet and pink to orange, a sunset arc that
// skips the muddy greens.
const float COLOUR_CYCLE = 0.107821159;
// Diwali swaps the arc for diya colours: rose through vermilion and saffron
// to marigold gold.
const float FESTIVE_HUE = 0.95;
const float FESTIVE_SPREAD = 0.29;
const float THETA = 2.12879038;
const float SHEAR = 0.965124965;
const float SHRINK = 0.952293038;
const float LAYERS = 75.0;
const float WARP_FREQ_X = 0.426897645;
const float WARP_FREQ_Y = 2.16138268;
const float WARP_AMP_X = 0.158535615;
const float WARP_AMP_Y = 0.0281481836;
const float ASPECT_X = 2.57334447;
const float ASPECT_Y = 0.163778409;
const float OFFSET_X = 0.417951316;
const float OFFSET_Y = -0.00873308722;
const float TILT = -1.9888494;
const float ZOOM = 0.901184976;
const float CENTRE_X = -0.0940958485;
const float CENTRE_Y = 0.527618766;
const float GLOW_SIZE = 0.00157413376;
const float FALLOFF = 0.272963226;
const float VIGNETTE = 0.0806964487;
const float FLOW_SPEED = 0.42407161;
const float FLOW_DIRECTION = -1.0;
const float BREATH_RATE = 0.375965297;
const float BREATH_AMOUNT = 0.0561308973;
const float PHASE = 21.2679958;
const float ECHO = 0.0;
const float ECHO_SHIFT = -0.217620835;
const float SOFTNESS = 0.0012762316;
// The field is tracked as density plus an average hue, and only coloured at
// the end, so bright areas get more vivid instead of clipping to white.
const float DENSITY = 0.4;
// Where the strongest ink lands in OKLCH, per theme. Chroma rises faster than
// the lightness shift, so faint areas read as clean pastels, not grey.
const float DARK_LIGHTNESS = 0.78;
const float DARK_CHROMA = 0.19;
const float LIGHT_LIGHTNESS = 0.6;
const float LIGHT_CHROMA = 0.22;
const float LIGHT_INK = 0.75;

const float TAU = 6.28318530718;

vec3 oklchToLinear(float L, float C, float h) {
  float a = C * cos(h), b = C * sin(h);
  float l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  float m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  float s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  vec3 lms = vec3(l_, m_, s_);
  lms = lms * lms * lms;
  return mat3(4.0767416621, -1.2684380046, -0.0041960863,
              -3.3077115913, 2.6097574011, -0.7034186147,
              0.2309699292, -0.3413193965, 1.7076147010) * lms;
}

vec3 linearToSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(12.92 * c, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

float blueNoise(vec2 p, float frame) {
  p += 5.588238 * mod(frame, 64.0);
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}

void main() {
  vec2 R = iResolution.xy;
  // Scaled by width so a page-tall canvas keeps the composition's shape.
  vec2 pos = (gl_FragCoord.xy - 0.5 * R) / R.x;
  float t = iTime * FLOW_SPEED * FLOW_DIRECTION + PHASE;
  float breath = (-sin(iTime * BREATH_RATE * 1.5) + sin(iTime * BREATH_RATE + 1.0)) * 0.25 + 0.5;

  vec2 u = (pos - vec2(CENTRE_X, CENTRE_Y)) * (ZOOM - breath * BREATH_AMOUNT);
  float ct = cos(TILT), st = sin(TILT);
  u = mat2(ct, st, -st, ct) * u;

  mat2 fold = mat2(cos(THETA), sin(THETA), -SHEAR, cos(THETA));

  float hue0 = mix(HUE, FESTIVE_HUE, uFestive) * TAU;
  float hue1 = hue0 + mix(HUE_SPREAD, FESTIVE_SPREAD, uFestive) * TAU;
  float density = 0.0;
  vec2 hueSum = vec2(0.0);

  for (float i = 1.0; i <= 96.0; i += 1.0) {
    if (i > LAYERS) break;
    u.x += -sin(u.y * WARP_FREQ_X + t + i * 0.007) * WARP_AMP_X;
    u.y += -sin(u.x * WARP_FREQ_Y - t + i * 0.02) * WARP_AMP_Y;
    u = fold * u * SHRINK;

    vec2 q = u - vec2(OFFSET_X + breath * 0.1, OFFSET_Y);
    vec2 s = vec2(q.x * ASPECT_X, q.y * ASPECT_Y);
    float glow = GLOW_SIZE / (dot(s, s) + SOFTNESS);
#ifndef SKIP_ECHO
    vec2 e = vec2((q.x - ECHO_SHIFT) * ASPECT_X, s.y);
    glow += ECHO * GLOW_SIZE / (dot(e, e) + SOFTNESS);
#endif
    glow *= 0.25 + breath * 0.4;

    float r = length(u);
    float k = sin(i * COLOUR_CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
    float h = mix(hue0, hue1, k);
    float w = glow * exp2(-r * FALLOFF);
    density += w;
    hueSum += w * vec2(cos(h), sin(h));
  }

  float x = density * DENSITY;
  float tone = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  float edge = smoothstep(0.5, 1.6, length(pos));
  tone *= 1.0 - edge * VIGNETTE;

  float hue = atan(hueSum.y, hueSum.x);
  // Where layers of different hues overlap, the average hue is less certain,
  // so it is drawn a little less saturated.
  float certainty = 0.65 + 0.35 * clamp(length(hueSum) / max(density, 1e-5), 0.0, 1.0);
  float chroma = pow(tone, 0.6) * certainty;

  // Dark: the glow lights up out of the page.
  vec3 glowColor = linearToSrgb(oklchToLinear(DARK_LIGHTNESS * pow(tone, 0.6), DARK_CHROMA * chroma, hue));
  vec3 dark = uDarkBackground + glowColor * (1.0 - uDarkBackground);
  // Light: the glow prints as ink of its own hue.
  float ink = tone * LIGHT_INK;
  vec3 inkColor = linearToSrgb(oklchToLinear(mix(1.0, LIGHT_LIGHTNESS, ink), LIGHT_CHROMA * pow(ink, 0.6) * certainty, hue));
  vec3 light = uLightBackground - (1.0 - inkColor);
  vec3 color = mix(dark, light, uLightMode);

  color += (blueNoise(gl_FragCoord.xy, floor(iTime * 24.0)) - 0.5) / 255.0;
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

const RARITY_SHADER = `#version 300 es
precision highp float;

uniform sampler2D tScene;
uniform vec2 iResolution;
uniform float iTime;
uniform float uLightMode;
uniform vec3 uDarkBackground;
uniform vec3 uLightBackground;
uniform float uPixelRatio;
out vec4 fragColor;

const float uStrength = 1.18383622;
const float uScale = 0.905171037;
const float uSeed = 0.159142181;

const float TAU = 6.28318530718;
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

vec3 toInk(vec3 c) { return mix(c - uDarkBackground, uLightBackground - c, uLightMode); }
vec3 fromInk(vec3 ink) { return mix(uDarkBackground + ink, uLightBackground - ink, uLightMode); }
vec3 sceneInk(vec2 uv) { return toInk(texture(tScene, clamp(uv, 0.0, 1.0)).rgb); }

float blueNoise(vec2 p, float frame) {
  p += 5.588238 * mod(frame, 64.0);
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}

vec3 halftone(vec2 frag) {
  float cell = max(3.0, uScale * 3.6 * uPixelRatio);
  float angle = 0.26 + uSeed * 0.3;
  mat2 turn = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 rotated = turn * frag;
  vec2 grid = floor(rotated / cell);
  vec2 centre = (grid + 0.5) * cell;
  vec2 source = transpose(turn) * centre;
  vec3 soft = sceneInk(frag / iResolution);
  vec3 ink = sceneInk(source / iResolution);
  float level = clamp(dot(ink, LUMA), 0.0, 1.0);
  float radius = cell * sqrt(pow(level, 0.9) / 3.14159265);
  float dist = length(rotated - centre);
  float aa = 0.7 * uPixelRatio;
  float dot_ = 1.0 - smoothstep(radius - aa, radius + aa, dist);
  vec3 dots = ink * min(0.8 / max(level, 1e-3), 2.2) * dot_;
  float presence = smoothstep(0.03, 0.16, level) * (0.3 + 0.14 * uStrength);
  return mix(soft, dots, presence);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec3 ink = halftone(frag);
  vec3 color = fromInk(clamp(ink, 0.0, 1.0));
  color += (blueNoise(frag, floor(iTime * 24.0)) - 0.5) / 255.0;
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

export type ShaderTheme = "dark" | "light"

export type ShaderOptions = {
  theme?: ShaderTheme
  festive?: boolean
  background?: { dark?: string; light?: string }
  autoplay?: boolean
  signal?: AbortSignal
  onError?: (error: Error) => void
}

export type ShaderHandle = {
  setTheme(theme: ShaderTheme): void
  setFestive(festive: boolean): void
  setBackground(background: { dark?: string; light?: string }): void
  render(time: number): void
  destroy(): void
}

// Once the GPU has dropped the shader, it stays off for this page load, so a
// driver fault cannot be retriggered over and over by remounts.
let failed = false

export type RadiumcodersShaderProps = {
  theme?: ShaderTheme
  festive?: boolean
  background?: { dark?: string; light?: string }
  time?: number
  onError?: (error: Error) => void
  className?: string
  style?: CSSProperties
}

export function RadiumcodersShader({
  theme = "dark",
  festive = false,
  background,
  time,
  onError,
  className,
  style,
}: RadiumcodersShaderProps) {
  const container = useRef<HTMLDivElement>(null)
  const shader = useRef<ShaderHandle | null>(null)
  const latestTheme = useRef(theme)
  const latestFestive = useRef(festive)
  const latestTime = useRef(time)
  const latestOnError = useRef(onError)
  const dark = background?.dark ?? "#090909"
  const light = background?.light ?? "#ffffff"
  const latestBackground = useRef({ dark, light })
  const animated = time === undefined

  useEffect(() => {
    latestTheme.current = theme
    shader.current?.setTheme(theme)
  }, [theme])

  useEffect(() => {
    latestFestive.current = festive
    shader.current?.setFestive(festive)
  }, [festive])

  // Colours change in place, so switching themes never rebuilds the context.
  useEffect(() => {
    latestBackground.current = { dark, light }
    try {
      shader.current?.setBackground({ dark, light })
    } catch (error) {
      const failure = error instanceof Error ? error : new Error(String(error))
      if (latestOnError.current) latestOnError.current(failure)
      else console.error(failure)
    }
  }, [dark, light])

  useEffect(() => {
    latestTime.current = time
    if (time !== undefined) shader.current?.render(time)
  }, [time])

  useEffect(() => {
    latestOnError.current = onError
  }, [onError])

  useEffect(() => {
    const host = container.current
    if (!host || failed) return
    // Each run gets its own canvas, Strict Mode's double run included.
    const element = document.createElement("canvas")
    element.style.display = "block"
    element.style.width = "100%"
    element.style.height = "100%"
    host.appendChild(element)
    let handle: ShaderHandle | null = null
    const controller = new AbortController()
    const options: ShaderOptions = {
      theme: latestTheme.current,
      festive: latestFestive.current,
      background: latestBackground.current,
      autoplay: animated,
      signal: controller.signal,
      onError: (error) => {
        if (controller.signal.aborted) return
        failed = true
        if (latestOnError.current) latestOnError.current(error)
        else console.error(error)
      },
    }
    try {
      handle = createShader(element, options)
      shader.current = handle
      if (latestTime.current !== undefined) handle.render(latestTime.current)
    } catch (error) {
      options.onError?.(
        error instanceof Error ? error : new Error(String(error))
      )
    }
    return () => {
      controller.abort()
      handle?.destroy()
      shader.current = null
      element.remove()
    }
  }, [animated])

  return (
    <div
      ref={container}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      aria-hidden="true"
    />
  )
}

// The canvas can span the whole page; this caps its backing store and the
// matching offscreen texture.
const MAX_PIXELS = 1500000
const THEME_EASE = 7
// Festive colours drift in and out more slowly than a theme switch.
const FESTIVE_EASE = 2.5

function parseHex(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match)
    throw new Error(`Background colours must be #rrggbb, got "${hex}".`)
  return [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ]
}

function animate(
  options: ShaderOptions,
  draw: (
    time: number,
    theme: number,
    festive: number,
    pixelRatio: number
  ) => void,
  canvas: HTMLCanvasElement,
  release: () => void,
  maxDimension = Infinity
): Omit<ShaderHandle, "setBackground"> & { redraw(): void } {
  const autoplay = options.autoplay !== false
  const stillness = window.matchMedia("(prefers-reduced-motion: reduce)")
  let resolution = window.matchMedia(
    `(resolution: ${window.devicePixelRatio || 1}dppx)`
  )
  let deviceRatio = window.devicePixelRatio || 1
  let width = canvas.clientWidth,
    height = canvas.clientHeight
  let visible = true
  let disposed = false
  let targetTheme = options.theme === "light" ? 1 : 0
  let theme = targetTheme
  let targetFestive = options.festive ? 1 : 0
  let festive = targetFestive
  let frame = 0
  let elapsed = 0
  let lastTime = 0
  let previous: number | null = null

  function canDraw() {
    return !disposed && !document.hidden && visible && width > 0 && height > 0
  }

  function fitCanvas() {
    const scale = Math.min(
      deviceRatio,
      2,
      Math.sqrt(MAX_PIXELS / (width * height)),
      maxDimension / width,
      maxDimension / height
    )
    const w = Math.max(1, Math.floor(width * scale)),
      h = Math.max(1, Math.floor(height * scale))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    return w / width
  }

  function fail(error: unknown) {
    destroy()
    const failure = error instanceof Error ? error : new Error(String(error))
    if (options.onError) options.onError(failure)
    else console.error(failure)
  }

  function render(time: number) {
    if (disposed) return
    lastTime = time
    if (!canDraw()) return
    try {
      draw(time, theme, festive, fitCanvas())
    } catch (error) {
      fail(error)
    }
  }

  // The GPU dropped the context (a driver reset or crash). Stop for good
  // rather than asking for it back and risking the same fault again.
  function contextLost() {
    fail(new Error("The shader's WebGL context was lost."))
  }

  function redraw() {
    if (disposed) return
    if (autoplay) refresh()
    else render(lastTime)
  }

  function schedule() {
    if (!frame && canDraw()) frame = requestAnimationFrame(tick)
  }

  function refresh() {
    if (!canDraw()) {
      cancelAnimationFrame(frame)
      frame = 0
      previous = null
    } else schedule()
  }

  function tick(now: number) {
    frame = 0
    if (!canDraw()) {
      previous = null
      return
    }
    const delta = previous === null ? 0 : Math.min((now - previous) / 1000, 0.1)
    previous = now
    if (autoplay) {
      if (!stillness.matches) elapsed += delta
      theme += (targetTheme - theme) * (1 - Math.exp(-delta * THEME_EASE))
      if (Math.abs(targetTheme - theme) < 0.002) theme = targetTheme
      festive +=
        (targetFestive - festive) * (1 - Math.exp(-delta * FESTIVE_EASE))
      if (Math.abs(targetFestive - festive) < 0.002) festive = targetFestive
    }
    render(autoplay ? elapsed : lastTime)
    const settling = theme !== targetTheme || festive !== targetFestive
    if (autoplay && (!stillness.matches || settling)) schedule()
    else previous = null
  }

  function pixelRatioChanged() {
    if (disposed) return
    const next = window.devicePixelRatio || 1
    if (deviceRatio === next) return
    deviceRatio = next
    resolution.removeEventListener("change", pixelRatioChanged)
    resolution = window.matchMedia(`(resolution: ${next}dppx)`)
    resolution.addEventListener("change", pixelRatioChanged)
    refresh()
  }

  const observer = new ResizeObserver(([entry]) => {
    if (disposed || !entry) return
    const next = entry.contentRect
    if (width === next.width && height === next.height) return
    width = next.width
    height = next.height
    refresh()
  })
  const intersection = new IntersectionObserver(([entry]) => {
    if (disposed || !entry || visible === entry.isIntersecting) return
    visible = entry.isIntersecting
    refresh()
  })

  function destroy() {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(frame)
    frame = 0
    observer.disconnect()
    intersection.disconnect()
    resolution.removeEventListener("change", pixelRatioChanged)
    stillness.removeEventListener("change", refresh)
    document.removeEventListener("visibilitychange", refresh)
    window.removeEventListener("resize", pixelRatioChanged)
    canvas.removeEventListener("webglcontextlost", contextLost)
    options.signal?.removeEventListener("abort", destroy)
    release()
  }

  observer.observe(canvas)
  intersection.observe(canvas)
  resolution.addEventListener("change", pixelRatioChanged)
  stillness.addEventListener("change", refresh)
  document.addEventListener("visibilitychange", refresh)
  window.addEventListener("resize", pixelRatioChanged)
  canvas.addEventListener("webglcontextlost", contextLost)
  options.signal?.addEventListener("abort", destroy, { once: true })
  if (options.signal?.aborted) destroy()
  else schedule()

  return {
    setTheme(next: ShaderTheme) {
      if (disposed) return
      targetTheme = next === "light" ? 1 : 0
      if (!autoplay) theme = targetTheme
      redraw()
    },
    setFestive(next: boolean) {
      if (disposed) return
      targetFestive = next ? 1 : 0
      if (!autoplay) festive = targetFestive
      redraw()
    },
    redraw,
    render,
    destroy,
  }
}

function attach(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  type: number,
  source: string
) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error("WebGL could not create a shader object.")
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(`Shader failed to compile: ${gl.getShaderInfoLog(shader)}`)
  gl.attachShader(program, shader)
  gl.deleteShader(shader)
}

function compile(gl: WebGL2RenderingContext, fragmentSource: string) {
  const program = gl.createProgram()
  attach(gl, program, gl.VERTEX_SHADER, VERTEX_SHADER)
  attach(gl, program, gl.FRAGMENT_SHADER, fragmentSource)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(`Shader failed to link: ${gl.getProgramInfoLog(program)}`)
  return program
}

function uniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  names: readonly string[]
) {
  return Object.fromEntries(
    names.map((name) => [name, gl.getUniformLocation(program, name)])
  )
}

export function createShader(
  canvas: HTMLCanvasElement,
  options: ShaderOptions = {}
): ShaderHandle {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  })
  if (!gl) throw new Error("WebGL2 is not available in this browser.")
  let dark = parseHex(options.background?.dark ?? "#090909")
  let light = parseHex(options.background?.light ?? "#ffffff")

  const field = compile(gl, FIELD_SHADER)
  const fieldUniforms = uniforms(gl, field, [
    "iResolution",
    "iTime",
    "uLightMode",
    "uFestive",
    "uDarkBackground",
    "uLightBackground",
  ])
  const post = compile(gl, RARITY_SHADER)
  const postUniforms = uniforms(gl, post, [
    "tScene",
    "iResolution",
    "iTime",
    "uLightMode",
    "uDarkBackground",
    "uLightBackground",
    "uPixelRatio",
  ])
  const framebuffer = gl.createFramebuffer()
  const scene = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, scene)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  let sceneWidth = 0,
    sceneHeight = 0

  const setFrame = (
    locations: Record<string, WebGLUniformLocation | null>,
    time: number,
    theme: number
  ) => {
    gl.uniform2f(locations.iResolution, canvas.width, canvas.height)
    gl.uniform1f(locations.iTime, time)
    gl.uniform1f(locations.uLightMode, theme)
    gl.uniform3fv(locations.uDarkBackground, dark)
    gl.uniform3fv(locations.uLightBackground, light)
  }

  const { redraw, ...handle } = animate(
    options,
    (time, theme, festive, pixelRatio) => {
      const { width, height } = canvas
      gl.viewport(0, 0, width, height)
      if (sceneWidth !== width || sceneHeight !== height) {
        sceneWidth = width
        sceneHeight = height
        gl.bindTexture(gl.TEXTURE_2D, scene)
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          width,
          height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null
        )
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          scene,
          0
        )
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      }
      const drawThemed = (mode: number) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
        gl.useProgram(field)
        setFrame(fieldUniforms, time, mode)
        gl.uniform1f(fieldUniforms.uFestive, festive)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        gl.useProgram(post)
        setFrame(postUniforms, time, mode)
        gl.uniform1f(postUniforms.uPixelRatio, pixelRatio)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, scene)
        gl.uniform1i(postUniforms.tScene, 0)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      if (theme <= 0 || theme >= 1) {
        drawThemed(theme)
        return
      }
      drawThemed(0)
      gl.enable(gl.BLEND)
      gl.blendColor(0, 0, 0, theme)
      gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA)
      drawThemed(1)
      gl.disable(gl.BLEND)
    },
    canvas,
    () => {
      gl.deleteProgram(field)
      gl.deleteProgram(post)
      gl.deleteFramebuffer(framebuffer)
      gl.deleteTexture(scene)
      // No loseContext() here: forcing the context down while a frame may
      // still be in flight is the suspected trigger of amdgpu page faults on
      // RDNA4. The browser frees it once the canvas is gone.
    },
    Math.min(
      gl.getParameter(gl.MAX_TEXTURE_SIZE),
      gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
    )
  )

  return {
    ...handle,
    setBackground(background) {
      const nextDark = parseHex(background.dark ?? "#090909")
      const nextLight = parseHex(background.light ?? "#ffffff")
      dark = nextDark
      light = nextLight
      redraw()
    },
  }
}
