import { useEffect, useRef } from 'react'
import { CUE_EVENT } from './siteHooks'
import {
  CUE, HATS, INTRO_HITS, KICKS, SHOW_END, SWELL_HITS,
  countTo, playSong, pulseAt, since, type Playback,
} from './lightsScore'

// The `lights` easter egg: a small lighting-console "effects engine" set to music.
//
// A rig of moving heads (top truss) and uplights (floor) is drawn on a canvas
// every frame. Each cue is a function of song time and fixture position that
// returns pan, zoom, intensity and colour, driven by the hits, kicks and
// hi-hats measured from the track (lightsScore.ts). Cues crossfade like a real
// console, and the song's live bass level adds a little extra punch.

type RGB = [number, number, number]
type State = { pan: number; zoom: number; I: number; c: RGB }
type Fixture = { group: 'top' | 'floor'; i: number; m: number; x: number; y: number }
type CueFn = (lt: number, t: number, f: Fixture, W: number, H: number) => State

const AMBER: RGB = [242, 179, 107]
const CLAY: RGB = [224, 120, 74]
const CREAM: RGB = [255, 240, 220]
const RED: RGB = [196, 64, 44]
const ROSE: RGB = [240, 150, 130]
const PALETTE = [AMBER, CLAY, CREAM, ROSE]

const TOP = 9
const FLOOR = 4
const FADE = 0.25
const TRUSS_Y = 22
// Beams are soft light, so the canvases render at half resolution and scale up.
const RES = 0.5

const smooth = (x: number) => x * x * (3 - 2 * x)
const flash = (dt: number, k = 8) => (Number.isFinite(dt) ? Math.exp(-dt * k) : 0)
const off = (c: RGB = AMBER): State => ({ pan: 0, zoom: 7, I: 0, c })
const alt = (f: Fixture, a: RGB, b: RGB) => (f.i % 2 ? b : a)
// Rings out from the centre fixture: 0 (centre) … 4 (ends).
const ring = (f: Fixture) => Math.abs(f.i - (TOP - 1) / 2)
// Beam positions the rig snaps between on each kick pair.
const POSES = [
  (m: number) => m * -34,
  (m: number) => m * 30,
  (m: number) => 24 * Math.sign(m || 1),
  (m: number) => (m + 0.5) * -26,
]

const cues: { at: number; name: string; fn: CueFn }[] = [
  {
    // Five accented hits: each lights the next ring out from the centre.
    at: CUE.intro, name: 'intro hits',
    fn: (_lt, t, f) => {
      if (f.group === 'floor') return off()
      const hits = countTo(INTRO_HITS, t)
      if (ring(f) >= hits) return off(CREAM)
      return { pan: 0, zoom: 4 + ring(f), I: 0.35 + 0.65 * flash(since(INTRO_HITS, t), 5), c: ring(f) === 0 ? CREAM : alt(f, AMBER, CLAY) }
    },
  },
  {
    // Cymbals swell: a slow wave that reverses (with a flash) on each sparse hit.
    at: CUE.swell, name: 'cymbal swell',
    fn: (lt, t, f) => {
      if (f.group === 'floor') return off()
      const dir = countTo(SWELL_HITS, t) % 2 ? -1 : 1
      return {
        pan: dir * 24 * Math.sin(Math.PI * 0.5 * lt - f.i * 0.5),
        zoom: 8,
        I: Math.min(1, 0.45 + 0.2 * lt / 2.6 + 0.5 * flash(since(SWELL_HITS, t), 6)),
        c: alt(f, AMBER, CLAY),
      }
    },
  },
  {
    // The groove locks in: one fixture per pulse, and every kick bumps the rig.
    at: CUE.groove, name: 'groove',
    fn: (_lt, t, f) => {
      if (f.group === 'floor') return off()
      const step = pulseAt(t) - pulseAt(CUE.groove)
      const dist = (((f.i - step) % TOP) + TOP) % TOP
      const head = dist === 0 ? 1 : Math.max(0.15, Math.exp(-dist * 0.8))
      return { pan: 0, zoom: 6, I: Math.min(1, head * (0.65 + 0.5 * flash(since(KICKS, t), 7))), c: alt(f, AMBER, CLAY) }
    },
  },
  {
    // Uplights fire on the kick and cross the top rig's fan.
    at: CUE.uplights, name: 'uplights',
    fn: (lt, t, f) => {
      const kick = flash(since(KICKS, t), 6)
      return f.group === 'floor'
        ? { pan: f.m * 34 * Math.sin(lt * 3), zoom: 6, I: 0.6 + 0.4 * kick, c: RED }
        : { pan: -f.m * 22, zoom: 7, I: 0.55 + 0.45 * kick, c: AMBER }
    },
  },
  {
    // A dense run of kicks: fan in and out, flipping on every kick.
    at: CUE.kickRun, name: 'kick run',
    fn: (_lt, t, f) => {
      const n = countTo(KICKS, t)
      const side = n % 2 ? 1 : -1
      const kick = flash(since(KICKS, t), 6)
      if (f.group === 'floor') return { pan: side * f.m * 28, zoom: 6, I: 0.3 + 0.6 * kick, c: RED }
      return { pan: side * f.m * 30, zoom: 5 + 4 * kick, I: 0.3 + 0.7 * kick, c: n % 2 ? CREAM : CLAY }
    },
  },
  {
    // Kicks drop out: a floaty ballyhoo that sparkles on the hi-hats.
    at: CUE.breathe, name: 'breathe',
    fn: (lt, t, f) => ({
      pan: 26 * Math.sin(2 * Math.PI * 0.35 * lt + f.i * 1.3 + (f.group === 'floor' ? 2 : 0)),
      zoom: 5,
      I: (f.group === 'floor' ? 0.25 : 0.45) + 0.4 * flash(since(HATS, t), 10),
      c: PALETTE[(f.i + pulseAt(t)) % PALETTE.length],
    }),
  },
  {
    // Kick pairs: a double strobe, and the beams snap to a new pose each pair.
    at: CUE.pairs, name: 'pairs',
    fn: (_lt, t, f) => {
      const pair = Math.floor((countTo(KICKS, t, CUE.pairs) - 1) / 2)
      const pose = POSES[((pair % POSES.length) + POSES.length) % POSES.length]
      const kick = flash(since(KICKS, t), 14)
      const hat = flash(since(HATS, t), 12)
      if (f.group === 'floor') return { pan: -pose(f.m), zoom: 6, I: 0.15 + 0.7 * kick, c: RED }
      return { pan: pose(f.m), zoom: 5, I: Math.min(1, 0.15 + 0.85 * kick + 0.25 * hat), c: kick > 0.3 ? CREAM : CLAY }
    },
  },
  {
    // The build: every beam converges on one point; the strobe rides the hi-hats.
    at: CUE.build, name: 'build',
    fn: (lt, t, f, W, H) => {
      const dir = f.group === 'top' ? 1 : -1
      const pan = (Math.atan2(W / 2 - f.x, dir * (H * 0.55 - f.y)) * 180) / Math.PI
      const rise = Math.min(1, lt / (CUE.hit - CUE.build))
      return { pan, zoom: 5 - 2.5 * rise, I: 0.1 + (0.6 + 0.4 * rise) * flash(since(HATS, t), 14), c: CREAM }
    },
  },
  {
    // The final kick pair: two full-white hits.
    at: CUE.hit, name: 'hit',
    fn: (_lt, t) => ({ pan: 0, zoom: 14, I: 0.45 + 0.55 * flash(since(KICKS, t), 3), c: CREAM }),
  },
  { at: CUE.blackout, name: 'blackout', fn: () => off(CREAM) },
]

function stateAt(t: number, f: Fixture, W: number, H: number): State {
  let k = 0
  while (k + 1 < cues.length && t >= cues[k + 1].at) k++
  const lt = t - cues[k].at
  const cur = cues[k].fn(lt, t, f, W, H)
  if (k === 0 || lt >= FADE) return cur
  const prev = cues[k - 1].fn(t - cues[k - 1].at, t, f, W, H)
  const a = smooth(lt / FADE)
  const mix = (p: number, q: number) => p + (q - p) * a
  return {
    pan: mix(prev.pan, cur.pan),
    zoom: mix(prev.zoom, cur.zoom),
    I: mix(prev.I, cur.I),
    c: [mix(prev.c[0], cur.c[0]), mix(prev.c[1], cur.c[1]), mix(prev.c[2], cur.c[2])],
  }
}

// House lights and truss position over the show (the music starts on a hit,
// so the rig is in place fast).
const houseAt = (t: number) => (t < 0.3 ? smooth(Math.max(0, t) / 0.3) : t > SHOW_END - 0.6 ? 1 - smooth(Math.min(1, (t - (SHOW_END - 0.6)) / 0.6)) : 1)
const trussAt = (t: number) => (t < 0.35 ? 1 - smooth(Math.max(0, t) / 0.35) : t > SHOW_END - 0.5 ? smooth(Math.min(1, (t - (SHOW_END - 0.5)) / 0.5)) : 0)

// Soft cloudy noise, tiled over the beams so they read as light in haze.
function makeHaze() {
  const small = document.createElement('canvas')
  small.width = small.height = 48
  const s = small.getContext('2d')!
  const img = s.createImageData(48, 48)
  for (let p = 0; p < img.data.length; p += 4) img.data[p + 3] = Math.random() * 255
  s.putImageData(img, 0, 0)
  const big = document.createElement('canvas')
  big.width = big.height = 512
  const b = big.getContext('2d')!
  b.imageSmoothingEnabled = true
  b.filter = 'blur(10px)'
  b.drawImage(small, -32, -32, 576, 576)
  return big
}

const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${Math.max(0, Math.min(1, a)).toFixed(4)})`

export default function LightShow({ sound, onDone }: { sound: boolean; onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const truss = useRef<HTMLDivElement>(null)
  const floor = useRef<HTMLDivElement>(null)
  const done = useRef(onDone)
  useEffect(() => { done.current = onDone })

  useEffect(() => {
    // Two canvases: beams are drawn (and hazed) offscreen, then composited
    // onto the visible canvas, which also carries the house-lights darkness.
    // Where light falls it cuts the darkness away, so the page shows through.
    const cv = canvas.current!
    const out = cv.getContext('2d')!
    const beams = document.createElement('canvas')
    const ctx = beams.getContext('2d')!
    const hazePattern = ctx.createPattern(makeHaze(), 'repeat')!
    let W = 0, H = 0
    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      cv.width = beams.width = Math.ceil(W * RES)
      cv.height = beams.height = Math.ceil(H * RES)
    }
    resize()
    window.addEventListener('resize', resize)

    const fixtures = (): Fixture[] => [
      ...Array.from({ length: TOP }, (_, i) => ({ group: 'top' as const, i, m: (i - (TOP - 1) / 2) / ((TOP - 1) / 2), x: ((i + 0.5) / TOP) * W, y: TRUSS_Y })),
      ...Array.from({ length: FLOOR }, (_, i) => ({ group: 'floor' as const, i, m: (i - (FLOOR - 1) / 2) / ((FLOOR - 1) / 2), x: [0.12, 0.37, 0.63, 0.88][i] * W, y: H - 8 })),
    ]

    const drawBeam = (f: Fixture, s: State) => {
      if (s.I <= 0.01) return
      const dirY = f.group === 'top' ? 1 : -1
      const th = (s.pan * Math.PI) / 180
      const z = (s.zoom * Math.PI) / 180
      const L = Math.hypot(W, H) * 1.1
      const ray = (a: number, len: number) => [f.x + len * Math.sin(a), f.y + dirY * len * Math.cos(a)]
      const cone = (half: number, alpha: number) => {
        const [x1, y1] = ray(th - half, L)
        const [x2, y2] = ray(th + half, L)
        const [ex, ey] = ray(th, L * 0.85)
        const g = ctx.createLinearGradient(f.x, f.y, ex, ey)
        g.addColorStop(0, rgba(s.c, alpha * s.I))
        g.addColorStop(0.45, rgba(s.c, alpha * 0.32 * s.I))
        g.addColorStop(1, rgba(s.c, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(f.x - 3, f.y)
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(f.x + 3, f.y)
        ctx.closePath()
        ctx.fill()
      }
      cone(z, 0.5)
      cone(z * 0.4, 0.35)

      // Lens glow at the source.
      const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 30)
      glow.addColorStop(0, rgba(s.c, s.I))
      glow.addColorStop(1, rgba(s.c, 0))
      ctx.fillStyle = glow
      ctx.fillRect(f.x - 30, f.y - 30, 60, 60)

      // Pool where a top beam lands on the floor.
      if (f.group === 'top' && Math.cos(th) > 0.3) {
        const d = (H - f.y) / Math.cos(th)
        const px = f.x + d * Math.sin(th)
        const r = Math.max(24, d * Math.tan(z) * 1.2)
        ctx.save()
        ctx.translate(px, H)
        ctx.scale(1, 0.22)
        const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
        pool.addColorStop(0, rgba(s.c, 0.45 * s.I))
        pool.addColorStop(1, rgba(s.c, 0))
        ctx.fillStyle = pool
        ctx.fillRect(-r, -r, r * 2, r * 2)
        ctx.restore()
      }
    }

    const render = (t: number, bass: number) => {
      let k = 0
      while (k + 1 < cues.length && t >= cues[k + 1].at) k++
      if (k !== lastCue) {
        lastCue = k
        window.dispatchEvent(new CustomEvent(CUE_EVENT, { detail: `cue ${k + 1} · ${cues[k].name}` }))
      }

      const drop = `translateY(${-60 * trussAt(t)}px)`
      if (truss.current) truss.current.style.transform = drop
      if (floor.current) floor.current.style.opacity = String(t > CUE.uplights - 0.2 && t < SHOW_END - 0.6 ? 1 : 0)

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, beams.width, beams.height)
      ctx.setTransform(RES, 0, 0, RES, 0, 0)
      ctx.globalCompositeOperation = 'lighter'
      // The song's live bass adds punch on top of the choreography.
      const punch = 0.82 + 0.3 * bass
      for (const f of fixtures()) {
        if (f.group === 'top') f.y = TRUSS_Y - 60 * trussAt(t)
        const s = stateAt(t, f, W, H)
        drawBeam(f, { ...s, I: Math.min(1, s.I * punch) })
      }

      // The final hits: a flash across the whole page.
      if (t >= CUE.hit && t < CUE.blackout) {
        ctx.fillStyle = rgba(CREAM, 0.5 * flash(since(KICKS, t), 5))
        ctx.fillRect(0, 0, W, H)
      }

      // Haze: knock drifting holes out of the light.
      ctx.globalCompositeOperation = 'destination-out'
      ctx.globalAlpha = 0.45
      hazePattern.setTransform(new DOMMatrix([1, 0, 0, 1, (t * 18) % 512, (t * 7) % 512]))
      ctx.fillStyle = hazePattern
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1

      // Composite: house darkness, cut away where light falls, plus the light.
      out.globalCompositeOperation = 'source-over'
      out.clearRect(0, 0, cv.width, cv.height)
      out.fillStyle = `rgba(12, 7, 4, ${(0.9 * houseAt(t)).toFixed(4)})`
      out.fillRect(0, 0, cv.width, cv.height)
      out.globalCompositeOperation = 'destination-out'
      out.globalAlpha = 0.8
      out.drawImage(beams, 0, 0)
      out.globalCompositeOperation = 'lighter'
      out.globalAlpha = 0.9
      out.drawImage(beams, 0, 0)
      out.globalAlpha = 1
    }

    let lastCue = -1
    let raf = 0
    let stopped = false
    let playback: Playback | null = null
    document.body.classList.add('show-running')

    // With music, song time comes from the audio clock. Without it (muted, or
    // audio unavailable), advance by frame time, capped so a stalled frame or
    // a hidden tab slows the show down instead of skipping to the end.
    let silentT = 0
    let last = performance.now()
    let warned = false
    const frame = (now: number) => {
      const t = playback ? playback.now() : (silentT += Math.min((now - last) / 1000, 1 / 10))
      last = now
      try {
        render(Math.max(0, t), playback ? playback.bass() : 0.5)
      } catch (err) {
        // Never let one bad frame end the show; note it once and keep going.
        if (!warned) console.warn('light show frame failed', err)
        warned = true
      }
      if (t >= SHOW_END) {
        done.current()
        return
      }
      raf = requestAnimationFrame(frame)
    }

    const begin = async () => {
      if (sound) playback = await playSong()
      if (stopped) {
        playback?.stop()
        return
      }
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    void begin()

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      playback?.stop()
      window.removeEventListener('resize', resize)
      document.body.classList.remove('show-running')
    }
  }, [sound])

  return (
    <div className="ls" aria-hidden="true">
      <canvas className="ls-canvas" ref={canvas} />
      <div className="ls-truss" ref={truss}>
        {Array.from({ length: TOP }, (_, i) => (
          <span key={i} className="ls-head" style={{ left: `${((i + 0.5) / TOP) * 100}%` }} />
        ))}
      </div>
      <div className="ls-floor" ref={floor}>
        {[12, 37, 63, 88].map(x => <span key={x} className="ls-unit" style={{ left: `${x}%` }} />)}
      </div>
    </div>
  )
}
