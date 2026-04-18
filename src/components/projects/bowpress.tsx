import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { ProjectMeta } from './index'
import '../styles/ProjectPage.css'

export const meta: ProjectMeta = {
  slug: 'bowpress',
  name: 'BowPress (IOS App)',
  tagline: 'Version control for your bow',
  description:
    "An iOS app I'm building for archers who want to move beyond feel-based tuning. Every session captures both structured shot data and the ephemeral stuff — feel notes, hold quality, tension observations — which get embedded as vectors and correlated against your actual scores and groupings over time.",
  tags: ['SwiftUI', 'iOS', 'TypeScript', 'Cloudflare Workers', 'SQLite', 'Vector Search'],
}

export default function BowPress() {
  const rowRef = useRef<HTMLDivElement>(null)
  const mouseDown = useRef(false)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startScroll = useRef(0)

  useEffect(() => {
    const el = rowRef.current
    if (!el) return

    const onMouseDown = (e: MouseEvent) => {
      mouseDown.current = true
      startX.current = e.clientX
      startScroll.current = el.scrollLeft
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown.current) return
      const dx = e.clientX - startX.current
      if (!dragging.current && Math.abs(dx) < 6) return
      dragging.current = true
      el.classList.add('dragging')
      el.scrollLeft = startScroll.current - dx
    }

    const onMouseUp = () => {
      mouseDown.current = false
      dragging.current = false
      el.classList.remove('dragging')
    }

    el.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <article id="project-page">
      <Link to="/projects" className="back-link">← Projects</Link>
      <div className="project-page-header">
        <h2>BowPress</h2>
        <p className="project-page-subtitle">
          Version control for your bow — every configuration, every session, every insight.
        </p>
      </div>
      <div className="project-page-body">
        <p>
          Archery tuning has always been a feel-based process. You twist a cable, move your peep
          sight, adjust your rest — and then you shoot and try to remember whether things got
          better. Most archers keep a notebook or a notes app, but the problem is deeper than
          record-keeping: there's no way to connect a specific change to a specific outcome when
          you're changing multiple things between sessions.
        </p>
        <p>
          BowPress is an iOS app that turns tuning into something you can actually measure. Every
          bow configuration is saved as a snapshot, and every arrow you shoot is tied to the exact
          setup you were running when you shot it. Over time, the data answers questions that used
          to be guesswork: which configuration produces the tightest groups? Has my point of
          impact drifted since I changed my peep height? Is my X-ring rate actually improving, or
          does it just feel that way?
        </p>
        <div className="screenshot-row" ref={rowRef}>
          <div className="screenshot-frame">
            <img src="/projects/bowpress/analytics-overview.png" alt="Analytics target overlay comparing previous vs current period groupings" />
            <span className="screenshot-caption">Period Comparison</span>
          </div>
          <div className="screenshot-frame">
            <img src="/projects/bowpress/analytics-insights.png" alt="Analytics trend analysis with AI-generated insight cards" />
            <span className="screenshot-caption">Trend Insights</span>
          </div>
          <div className="screenshot-frame">
            <img src="/projects/bowpress/session.png" alt="Session recording with drag-to-place target UI" />
            <span className="screenshot-caption">Session</span>
          </div>
          <div className="screenshot-frame">
            <img src="/projects/bowpress/session-detail.png" alt="Session detail showing numbered arrow grouping and end breakdown" />
            <span className="screenshot-caption">Session Detail</span>
          </div>
          <div className="screenshot-frame">
            <img src="/projects/bowpress/equipment.png" alt="Equipment configuration showing all bow parameters" />
            <span className="screenshot-caption">Equipment</span>
          </div>
        </div>
        <p>
          The metrics the app tracks are the ones that actually matter at a competitive level:
          average ring score, X-ring rate, 10-ring+ rate, group center position, and how all of
          those shift period over period. The analytics view overlays two time windows on the
          same target face so you can see grouping drift spatially, not just as a number.
        </p>
        <p>
          The more interesting part is what happens with the data you can't easily quantify.
          Every session captures two streams: structured data — arrow coordinates, scores,
          timestamps, the exact configuration parameters you were on — and ephemeral data, the
          qualitative notes you jot down mid-session. Things like "held clean but felt rushed",
          "back tension was off on ends 3 and 4", "anchor felt low". That stuff usually lives
          in a notebook and never gets looked at again.
        </p>
        <p>
          BowPress embeds those notes as vectors alongside the shot data from the same end. Over
          time, the system builds a searchable record of how you felt against how you actually
          performed. It can surface correlations that would be invisible in the numbers alone —
          that your group center drifts left specifically on ends where you noted grip pressure,
          or that your worst scoring sessions cluster around a particular note pattern. The
          ephemeral stuff turns out to be some of the most useful signal once it's indexed and
          connected to outcomes.
        </p>
        <p>
          Launching soon on TestFlight.
        </p>
        <p>
          <a href="https://github.com/AndrewNguyenn/bowpress-ios" target="_blank" rel="noopener noreferrer">bowpress-ios on GitHub →</a>
        </p>
      </div>
    </article>
  )
}
