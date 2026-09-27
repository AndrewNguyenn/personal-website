import { useEffect, useState } from 'react'
import LightShow from './LightShow'
import { LIGHTS_EVENT, reducedMotion } from './siteHooks'

// Site-wide easter eggs: the Konami code, an over-clicked logo, a needy tab
// title, and the light show the terminal's `lights` command cues. Mounted once in App.

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const AWAY_TITLE = 'the feed is still running, you know'

console.log(
  '%chi, fellow inspector of elements.%c\nthe source is at https://github.com/AndrewNguyenn — be nice to it.',
  'font: 600 14px ui-monospace, monospace; color: #e0784a',
  'font: 12px ui-monospace, monospace; color: inherit',
)

export default function EasterEggs() {
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const [show, setShow] = useState(0)
  const [sound, setSound] = useState(true)

  const say = (text: string) => setToast({ id: Date.now(), text })

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  // Konami code, ignoring anything typed into a field.
  useEffect(() => {
    let pos = 0
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return
      pos = e.key === KONAMI[pos] ? pos + 1 : e.key === KONAMI[0] ? 1 : 0
      if (pos === KONAMI.length) {
        pos = 0
        say('cheat code accepted. there are still no shortcuts in life.')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Five quick clicks on the logo.
  useEffect(() => {
    let clicks: number[] = []
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement) || !e.target.closest('.site-logo')) return
      const now = Date.now()
      clicks = [...clicks.filter(t => now - t < 2000), now]
      if (clicks.length >= 5) {
        clicks = []
        say("it's just a username. you can stop clicking.")
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // A slightly needy tab title while you're away.
  useEffect(() => {
    let saved = document.title
    const onVisibility = () => {
      if (document.hidden) {
        saved = document.title
        document.title = AWAY_TITLE
      } else if (document.title === AWAY_TITLE) {
        document.title = saved
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // The light show (LightShow.tsx). Each run remounts the rig (key = show).
  useEffect(() => {
    const onLights = (e: Event) => {
      if (reducedMotion()) return
      setSound((e as CustomEvent<{ sound?: boolean }>).detail?.sound ?? false)
      setShow(n => n + 1)
    }
    window.addEventListener(LIGHTS_EVENT, onLights)
    return () => window.removeEventListener(LIGHTS_EVENT, onLights)
  }, [])

  return (
    <>
      {show > 0 && <LightShow key={show} sound={sound} onDone={() => setShow(0)} />}
      {toast && <div key={toast.id} className="egg-toast" role="status">{toast.text}</div>}
    </>
  )
}
