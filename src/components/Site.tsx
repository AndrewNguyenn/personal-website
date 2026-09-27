import { useEffect, useRef } from 'react'
import Visual, { type Kind } from './ShowcaseVisuals'
import { reducedMotion } from './siteHooks'

// Shared pieces of the sand-and-clay site shell (Home and project pages).
// Styles live in styles/Site.css.

// Background blobs, laid out down a layer taller than the viewport. The layer
// scrolls up slower than the page (parallax); each blob also drifts on its own.
const blobs: { tone: 'a' | 'b' | 'c' | 'd'; left: string; top: number; w: number; h: number }[] = [
  { tone: 'c', left: '58%', top: 0,    w: 1000, h: 900 },
  { tone: 'a', left: '-6%', top: 480,  w: 1100, h: 800 },
  { tone: 'b', left: '24%', top: 860,  w: 900,  h: 600 },
  { tone: 'd', left: '72%', top: 820,  w: 700,  h: 520 },
  { tone: 'c', left: '30%', top: 1350, w: 900,  h: 800 },
  { tone: 'a', left: '70%', top: 1500, w: 900,  h: 700 },
  { tone: 'b', left: '-10%', top: 1650, w: 900, h: 650 },
  { tone: 'd', left: '12%', top: 2250, w: 800,  h: 600 },
  { tone: 'a', left: '55%', top: 2350, w: 950,  h: 720 },
]
const PARALLAX = 0.32

// Drifting terracotta blobs behind the page, plus a fixed film grain.
export function Atmosphere() {
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.classList.add('sand')
    return () => document.body.classList.remove('sand')
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (layer.current) layer.current.style.transform = `translate3d(0, ${-window.scrollY * PARALLAX}px, 0)`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <div className="site-atmos" aria-hidden="true">
        <div className="site-atmos-layer" ref={layer}>
          {blobs.map((b, i) => (
            <div
              key={i}
              className={`site-blob site-blob--${b.tone}`}
              style={{ left: b.left, top: b.top, width: b.w, height: b.h, animationDelay: `${-i * 3.7}s` }}
            />
          ))}
        </div>
      </div>
      <svg className="site-grain" aria-hidden="true">
        <filter id="site-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#site-grain)" />
      </svg>
    </>
  )
}

// The looping illustration from the showcase, scaled up inside a card.
export const CardVisual = ({ kind, scale }: { kind: Kind; scale: number }) => (
  <div className="card-visual" style={{ height: 150 * scale }}>
    <div className="card-visual-inner" style={{ transform: `scale(${scale})` }}>
      <Visual kind={kind} />
    </div>
  </div>
)
