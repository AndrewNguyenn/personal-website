// The `lights` show is choreographed to the first 16.6s of /audio/lights.mp3.
//
// Every time below was measured from the track (onset / band-energy analysis):
// the beat grid, the intro hits, and each kick and hi-hat. LightShow reads the
// audio clock, so the lights land on what you actually hear.

export const SONG_URL = '/audio/lights.mp3'

// The clip starts 13ms later than the audio that was analysed.
export const CLIP_OFFSET = 0.013

// The groove's pulse: 182.7 BPM, grid origin at 0.029s.
export const PULSE = 0.3284
export const GRID0 = 0.029

export const SHOW_END = 16.6

// Five accented hits that open the track (off the grid).
export const INTRO_HITS = [0.046, 0.499, 0.952, 1.486, 1.95]
// Sparse hits while the cymbals swell in.
export const SWELL_HITS = [3.007, 3.994]
// Kicks and hi-hats once the groove locks in (on the grid, within ~30ms).
export const KICKS = [4.656, 4.957, 5.317, 5.584, 6.943, 7.558, 7.895, 8.22, 8.522, 9.207, 9.52, 9.857, 11.517, 11.854, 13.479, 13.816, 15.43, 15.79]
export const HATS = [4.656, 4.969, 5.294, 6.281, 6.606, 6.931, 7.256, 7.558, 7.895, 8.231, 8.557, 8.893, 9.532, 10.53, 10.867, 11.204, 11.529, 11.854, 12.179, 12.504, 12.841, 13.154, 13.491, 13.839, 14.164, 14.489, 14.803, 15.139, 15.79]

// Sections of the track, and the cue that plays over each.
export const CUE = {
  intro: 0,
  swell: 2.0,
  groove: 4.6,
  uplights: 6.9,
  kickRun: 7.55,
  breathe: 10.1,
  pairs: 11.45,
  build: 13.45,
  hit: 15.4,
  blackout: 16.0,
} as const

// ── Audio ──────────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null
let song: Promise<AudioBuffer> | null = null

// Call from the user gesture that runs `lights`, so the browser allows playback.
export function unlockAudio() {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return
  ctx ??= new Ctx()
  if (ctx.state === 'suspended') void ctx.resume()
  song ??= fetch(SONG_URL).then(r => r.arrayBuffer()).then(b => ctx!.decodeAudioData(b))
}

export type Playback = {
  // Song time (seconds) of what is being heard right now.
  now: () => number
  // Live bass level, 0…1, for a little extra punch on top of the choreography.
  bass: () => number
  stop: () => void
}

// Starts the song if audio is unlocked and decodes in time; otherwise null.
export async function playSong(): Promise<Playback | null> {
  if (!ctx || !song) return null
  const buffer = await Promise.race([song, new Promise<null>(r => setTimeout(() => r(null), 2500))]).catch(() => null)
  if (!buffer || ctx.state !== 'running') return null

  const c = ctx
  const src = c.createBufferSource()
  src.buffer = buffer
  const gain = c.createGain()
  const analyser = c.createAnalyser()
  analyser.fftSize = 1024
  src.connect(gain).connect(analyser).connect(c.destination)

  const startAt = c.currentTime + 0.05
  const fadeAt = startAt + CLIP_OFFSET + CUE.blackout - 0.1
  gain.gain.setValueAtTime(1, fadeAt)
  gain.gain.linearRampToValueAtTime(0, startAt + SHOW_END)
  src.start(startAt, 0, SHOW_END + 0.1)

  const bins = new Uint8Array(analyser.frequencyBinCount)
  const lowBins = Math.max(2, Math.round(150 / (c.sampleRate / analyser.fftSize)))
  return {
    now: () => c.currentTime - (c.outputLatency || c.baseLatency || 0) - startAt - CLIP_OFFSET,
    bass: () => {
      analyser.getByteFrequencyData(bins)
      let sum = 0
      for (let i = 0; i < lowBins; i++) sum += bins[i]
      return sum / lowBins / 255
    },
    stop: () => {
      const t = c.currentTime
      gain.gain.cancelScheduledValues(t)
      gain.gain.setValueAtTime(gain.gain.value, t)
      gain.gain.linearRampToValueAtTime(0, t + 0.15)
      try { src.stop(t + 0.2) } catch { /* already stopped */ }
    },
  }
}

// ── Event helpers ──────────────────────────────────────────────────────────

// Seconds since the most recent event at or before t (Infinity if none yet).
export function since(events: readonly number[], t: number) {
  let last = -Infinity
  for (const e of events) {
    if (e > t) break
    last = e
  }
  return t - last
}

// How many events have happened at or before t.
export function countTo(events: readonly number[], t: number, from = -Infinity) {
  let n = 0
  for (const e of events) {
    if (e > t) break
    if (e >= from) n++
  }
  return n
}

export const pulseAt = (t: number) => Math.floor((t - GRID0) / PULSE)
