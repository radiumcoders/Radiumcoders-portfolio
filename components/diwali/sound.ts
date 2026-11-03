// Every cracker sound is synthesised: filtered noise for bangs, hiss and
// crackle, and oscillators for the thump and the rocket's whistle. Nothing to
// download. Browsers only allow audio after a tap or key press, so the
// context is created on the first one.
//
// The signal chain, so the bangs land loud and full instead of thin:
//
//   voice ─ pan ─┬─ saturator ───────────┬─ compressor ─ makeup ─ limiter ─ out
//                └─ echo send ─ reverb ──┘
//
// The saturator rounds off peaks so they can be driven hotter, the reverb is
// the bang echoing off the buildings, and the compressor and limiter bring
// the whole mix up close to full scale without clipping.

// Enough voices for a finale; past this, quieter sounds are dropped.
const MAX_VOICES = 64

type Voice = {
  context: AudioContext
  out: AudioNode
  now: number
  noise(): AudioBufferSourceNode
}

export class CrackerSound {
  private context: AudioContext | null = null
  private dry: AudioNode | null = null
  private echo: AudioNode | null = null
  private buffer: AudioBuffer | null = null
  private voices = 0
  muted = false

  unlock() {
    if (!this.context) {
      const Context =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Context) return
      const context = new Context()

      const compressor = context.createDynamicsCompressor()
      compressor.threshold.value = -20
      compressor.knee.value = 6
      compressor.ratio.value = 4
      compressor.attack.value = 0.003
      compressor.release.value = 0.3
      const makeup = context.createGain()
      makeup.gain.value = 3.2
      const limiter = context.createDynamicsCompressor()
      limiter.threshold.value = -1
      limiter.knee.value = 0
      limiter.ratio.value = 20
      limiter.attack.value = 0.001
      limiter.release.value = 0.12
      // The limiter can overshoot by a fraction of a decibel on the sharpest
      // cracks, so the very end sits just under full scale.
      const ceiling = context.createGain()
      ceiling.gain.value = 0.88
      compressor
        .connect(makeup)
        .connect(limiter)
        .connect(ceiling)
        .connect(context.destination)

      const saturator = context.createWaveShaper()
      saturator.curve = softClip(2.6)
      saturator.oversample = "4x"
      saturator.connect(compressor)

      const reverb = context.createConvolver()
      reverb.buffer = echoes(context)
      const wet = context.createGain()
      wet.gain.value = 0.9
      reverb.connect(wet).connect(compressor)

      const noise = context.createBuffer(
        1,
        context.sampleRate * 2,
        context.sampleRate
      )
      const data = noise.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

      this.context = context
      this.dry = saturator
      this.echo = reverb
      this.buffer = noise
    }
    if (this.context.state === "suspended") void this.context.resume()
  }

  destroy() {
    void this.context?.close()
    this.context = null
  }

  // A panned output for one sound, with some of it sent to the echo. The
  // voice is released once its last source has finished.
  private voice(
    pan: number,
    echo: number,
    length: number,
    important = false
  ): Voice | null {
    const { context, dry, echo: reverb, buffer } = this
    if (!context || !dry || !reverb || !buffer || this.muted) return null
    if (context.state !== "running") return null
    if (this.voices >= MAX_VOICES && !important) return null

    const panner = context.createStereoPanner()
    panner.pan.value = Math.max(-1, Math.min(1, pan)) * 0.7
    panner.connect(dry)
    const send = context.createGain()
    send.gain.value = echo
    panner.connect(send).connect(reverb)

    this.voices++
    window.setTimeout(
      () => {
        this.voices--
        panner.disconnect()
        send.disconnect()
      },
      (length + 0.2) * 1000
    )

    const now = context.currentTime
    return {
      context,
      out: panner,
      now,
      noise() {
        const source = context.createBufferSource()
        source.buffer = buffer
        source.loop = true
        return source
      },
    }
  }

  // The part every bang shares: a crack, a body of noise that darkens as it
  // dies away, and a sub-bass thump. Size runs from 0 (a single cracker) to 1
  // (a sutli bomb).
  private bang(voice: Voice, size: number, at = voice.now) {
    const { context, out } = voice
    const tone = random(0.85, 1.15)

    // The crack: a few milliseconds of raw, full-range noise.
    const crack = voice.noise()
    const crackGain = context.createGain()
    crackGain.gain.setValueAtTime(0.0001, at)
    crackGain.gain.exponentialRampToValueAtTime(1.6 + size * 0.8, at + 0.001)
    crackGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.03 + size * 0.03)
    crack.connect(crackGain).connect(out)
    crack.start(at, Math.random() * 1.5)
    crack.stop(at + 0.08)

    // The body: the roar of the blast, closing down from bright to dark.
    const decay = 0.35 + size * 1.5
    const body = voice.noise()
    const filter = context.createBiquadFilter()
    filter.type = "lowpass"
    filter.Q.value = 0.9
    filter.frequency.setValueAtTime((2600 + size * 2400) * tone, at)
    filter.frequency.exponentialRampToValueAtTime(90, at + decay)
    // A bump in the low mids, which is what phone speakers can actually play.
    const weight = context.createBiquadFilter()
    weight.type = "peaking"
    weight.frequency.value = 160 * tone
    weight.Q.value = 0.8
    weight.gain.value = 9
    const bodyGain = context.createGain()
    bodyGain.gain.setValueAtTime(0.0001, at)
    bodyGain.gain.exponentialRampToValueAtTime(1.4 + size * 1.2, at + 0.004)
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, at + decay)
    body.connect(filter).connect(weight).connect(bodyGain).connect(out)
    body.start(at, Math.random() * 1.5)
    body.stop(at + decay)

    // The thump in your chest, with a second, rougher layer so it still
    // carries on small speakers.
    const sub = context.createOscillator()
    sub.frequency.setValueAtTime((95 + size * 25) * tone, at)
    sub.frequency.exponentialRampToValueAtTime(32, at + 0.3 + size * 0.2)
    const subGain = context.createGain()
    subGain.gain.setValueAtTime(0.0001, at)
    subGain.gain.exponentialRampToValueAtTime(1.2 + size * 0.8, at + 0.004)
    subGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.4 + size * 0.7)
    sub.connect(subGain).connect(out)
    sub.start(at)
    sub.stop(at + 0.45 + size * 0.7)

    const punch = context.createOscillator()
    punch.type = "triangle"
    punch.frequency.setValueAtTime((180 + size * 40) * tone, at)
    punch.frequency.exponentialRampToValueAtTime(55, at + 0.12)
    const punchGain = context.createGain()
    punchGain.gain.setValueAtTime(0.0001, at)
    punchGain.gain.exponentialRampToValueAtTime(0.7 + size * 0.4, at + 0.003)
    punchGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.18)
    punch.connect(punchGain).connect(out)
    punch.start(at)
    punch.stop(at + 0.2)
  }

  // A shell bursting in the sky: size 0 is a pop, 1 is a sutli bomb.
  boom(size: number, pan = 0) {
    const level = Math.min(Math.max(size, 0), 1)
    const tail = 0.6 + level * 2
    const voice = this.voice(pan, 0.55 + level * 0.25, tail + 2.6, true)
    if (!voice) return
    this.bang(voice, level)

    // The big ones keep rumbling after the blast.
    if (level > 0.8) {
      const { context, out, now } = voice
      const rumble = voice.noise()
      const filter = context.createBiquadFilter()
      filter.type = "lowpass"
      filter.frequency.value = 220
      const gain = context.createGain()
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(1.1, now + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tail)
      rumble.connect(filter).connect(gain).connect(out)
      rumble.start(now, Math.random() * 1.5)
      rumble.stop(now + tail)
    }
  }

  // One cracker in a ladi: small, but still a proper bang.
  pop(pan = 0) {
    const voice = this.voice(pan, 0.35, 0.5 + 2.6)
    if (!voice) return
    this.bang(voice, random(0, 0.12))
  }

  // Many tiny ticks scattered over a stretch of time: a crackling shell, or
  // a phuljhadi in your hand.
  crackle(duration: number, density: number, pan = 0) {
    const voice = this.voice(pan, 0.25, duration + 2.6)
    if (!voice) return
    const { context, out, now } = voice
    const source = voice.noise()
    const filter = context.createBiquadFilter()
    filter.type = "highpass"
    filter.frequency.value = 1800
    const gain = context.createGain()
    gain.gain.setValueAtTime(0, now)
    const ticks = Math.max(1, Math.round(duration * density))
    for (let i = 0; i < ticks; i++) {
      const at = now + Math.random() * duration
      gain.gain.setValueAtTime(0.1 + Math.random() * 0.18, at)
      gain.gain.setTargetAtTime(0, at + 0.002, 0.008)
    }
    source.connect(filter).connect(gain).connect(out)
    source.start(now, Math.random() * 1.5)
    source.stop(now + duration + 0.05)
  }

  // The steady rush of an anar or chakri.
  hiss(duration: number, pitch = 3200, pan = 0) {
    const voice = this.voice(pan, 0.2, duration + 2.6)
    if (!voice) return
    const { context, out, now } = voice
    const source = voice.noise()
    const filter = context.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.value = pitch
    filter.Q.value = 0.6
    // A low roar under the hiss, so a fountain sounds like fire and not air.
    const roar = voice.noise()
    const low = context.createBiquadFilter()
    low.type = "lowpass"
    low.frequency.value = 500
    const gain = context.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.12)
    gain.gain.setValueAtTime(0.06, now + duration * 0.7)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    source.connect(filter).connect(gain)
    roar.connect(low).connect(gain)
    gain.connect(out)
    for (const s of [source, roar]) {
      s.start(now, Math.random() * 1.5)
      s.stop(now + duration)
    }
  }

  // A rocket climbing: a whoosh off the ground, then a whistle rising in
  // pitch as it goes.
  whistle(duration: number, pan = 0) {
    const voice = this.voice(pan, 0.3, duration + 2.6)
    if (!voice) return
    const { context, out, now } = voice

    const launch = voice.noise()
    const launchFilter = context.createBiquadFilter()
    launchFilter.type = "bandpass"
    launchFilter.frequency.setValueAtTime(400, now)
    launchFilter.frequency.exponentialRampToValueAtTime(2400, now + 0.3)
    const launchGain = context.createGain()
    launchGain.gain.setValueAtTime(0.0001, now)
    launchGain.gain.exponentialRampToValueAtTime(0.45, now + 0.01)
    launchGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)
    launch.connect(launchFilter).connect(launchGain).connect(out)
    launch.start(now, Math.random() * 1.5)
    launch.stop(now + 0.4)

    const tone = context.createOscillator()
    tone.type = "triangle"
    const start = 900 + Math.random() * 300
    tone.frequency.setValueAtTime(start, now)
    tone.frequency.exponentialRampToValueAtTime(start * 2.4, now + duration)
    const toneGain = context.createGain()
    toneGain.gain.setValueAtTime(0.0001, now)
    toneGain.gain.exponentialRampToValueAtTime(0.06, now + 0.1)
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    tone.connect(toneGain).connect(out)
    tone.start(now)
    tone.stop(now + duration)

    const air = voice.noise()
    const filter = context.createBiquadFilter()
    filter.type = "highpass"
    filter.frequency.value = 3500
    const gain = context.createGain()
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    air.connect(filter).connect(gain).connect(out)
    air.start(now, Math.random() * 1.5)
    air.stop(now + duration)
  }
}

function random(min: number, max: number) {
  return min + Math.random() * (max - min)
}

// A tanh curve: loud peaks bend instead of clipping flat.
function softClip(drive: number) {
  const curve = new Float32Array(2048)
  const scale = Math.tanh(drive)
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1
    curve[i] = Math.tanh(drive * x) / scale
  }
  return curve
}

// A rooftop among buildings: a couple of sharp slaps off the nearest walls,
// then a long, rolling tail as the bang carries across the city.
function echoes(context: AudioContext) {
  const rate = context.sampleRate
  const length = Math.round(rate * 2.6)
  const impulse = context.createBuffer(2, length, rate)
  const slaps = [0.09, 0.17, 0.31, 0.52]
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      const t = i / rate
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 2.4) * 0.35
    }
    slaps.forEach((at, index) => {
      const start = Math.round((at + channel * 0.013 * (index + 1)) * rate)
      const gain = 0.7 * 0.6 ** index
      for (let i = 0; i < rate * 0.02 && start + i < length; i++) {
        data[start + i] +=
          (Math.random() * 2 - 1) * gain * Math.exp(-i / (rate * 0.004))
      }
    })
  }
  return impulse
}
