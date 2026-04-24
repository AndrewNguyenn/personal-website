import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { ProjectMeta } from './index'
import { BowPressPhoneRow } from './BowPressPhones'
import '../styles/ProjectPage.css'
import '../styles/BowPressPage.css'

export const meta: ProjectMeta = {
  slug: 'bowpress',
  name: 'BowPress (IOS App)',
  tagline: 'Tune smarter. Shoot better.',
  description:
    "An iOS app for competitive and recreational archers who want quantifiable data behind every bow adjustment. Configurations get snapshotted. Arrows get plotted on a real WA target face. Over time the app surfaces which setups produce the tightest groups and what to tune next.",
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
    <article id="project-page" className="bowpress-page">
      <Link to="/projects" className="back-link">← Projects</Link>

      <p className="bp-eyebrow">BowPress · iOS · 2026</p>

      <div className="project-page-header">
        <h2>BowPress</h2>
        <p className="project-page-subtitle">
          Tune smarter. Shoot better. A logbook with a coach attached.
        </p>
        <div className="bp-stamp-row">
          <span className="bp-stamp">SwiftUI</span>
          <span className="bp-stamp">iOS</span>
          <span className="bp-stamp bp-stamp--moss">TypeScript</span>
          <span className="bp-stamp bp-stamp--moss">Cloudflare Workers</span>
          <span className="bp-stamp bp-stamp--stone">SQLite</span>
          <span className="bp-stamp bp-stamp--stone">Vector Search</span>
        </div>
      </div>

      <div className="project-page-body">
        <section className="bp-section">
          <p className="bp-section-eyebrow">Why it exists</p>
          <h3 className="bp-section-title">Tuning has always been a feel-based process.</h3>
          <p>
            You twist a cable, move your peep sight, adjust your rest — then you shoot and try
            to remember whether things got better. Most archers keep a notebook or a notes app,
            but the problem is deeper than record-keeping. There's no way to connect a specific
            change to a specific outcome when you're changing multiple things between sessions.
          </p>
          <p>
            BowPress treats every bow configuration as a snapshot. Every arrow you shoot is tied
            to the exact setup you were running when you shot it. Over time, the data answers
            questions that used to be guesswork: which configuration produces the tightest
            groups? Has your point of impact drifted since you changed your peep height? Is your
            X-ring rate actually improving, or does it just feel that way?
          </p>
        </section>

        <section className="bp-section">
          <p className="bp-section-eyebrow">How a session works</p>
          <h3 className="bp-section-title">Pick the setup. Start. Tap where each arrow lands.</h3>
          <p>
            Sessions have no end-count and no arrow cap. You pick a distance, a bow, and an
            arrow spec, then tap Start. Each arrow plots onto a real World Archery target face
            as a solid ink dot. You finish when you're done — not when a form says you are.
          </p>
          <div className="bp-spec">
            <div className="bp-spec-row">
              <span className="bp-spec-key">Distance</span>
              <span className="bp-spec-val">20yd · 50m · 70m</span>
              <span className="bp-spec-meta">WA standard</span>
            </div>
            <div className="bp-spec-row">
              <span className="bp-spec-key">Target face</span>
              <span className="bp-spec-val">10-ring · 6-ring</span>
              <span className="bp-spec-meta">real WA colors</span>
            </div>
            <div className="bp-spec-row">
              <span className="bp-spec-key">Scoring</span>
              <span className="bp-spec-val">Ring score 6–10 plus X</span>
              <span className="bp-spec-meta">tap to plot</span>
            </div>
            <div className="bp-spec-row">
              <span className="bp-spec-key">Fliers</span>
              <span className="bp-spec-val">Flag to exclude from analytics</span>
              <span className="bp-spec-meta">per-arrow</span>
            </div>
          </div>
        </section>

        <section className="bp-section">
          <p className="bp-section-eyebrow">Screens</p>
          <h3 className="bp-section-title">Five tabs. The target is the loudest thing in the UI.</h3>
          <BowPressPhoneRow innerRef={rowRef} />
        </section>

        <section className="bp-section">
          <p className="bp-section-eyebrow">What it tracks</p>
          <h3 className="bp-section-title">Parameter drift, not vibes.</h3>
          <p>
            Every bow carries a full parameter set — draw length, peep height, rest position,
            top and bottom cable twists, nocking point, tiller, stabilizer weights, arrow spine
            and point grain. Change any of them and the app snapshots the delta against the last
            configuration. The Parameter Drift table shows each value, its previous value, and
            the arrow count shot under each — so you can see exactly which change moved which
            metric.
          </p>
        </section>

        <section className="bp-section">
          <p className="bp-section-eyebrow">Analytics</p>
          <h3 className="bp-section-title">The target face overlaid against itself.</h3>
          <p>
            The metrics that matter at a competitive level: average ring score, X-ring rate,
            10-ring plus rate, group center position, and how all of those shift period over
            period. The analytics view overlays two time windows on the same target face so you
            can read grouping drift spatially — shift vector, standard deviation ellipse, and a
            moss-green arrow pointing from last week's centroid to this week's.
          </p>
          <p>
            Tuning suggestions surface as a ranked ledger — each finding stamped as{' '}
            <span className="bp-stamp bp-stamp--solid">New</span>{' '}
            <span className="bp-stamp">Proposed</span>{' '}
            <span className="bp-stamp bp-stamp--moss">Good</span>{' '}
            <span className="bp-stamp bp-stamp--maple">Watch</span>{' '}
            — ordered by actionability, with the parameter to adjust, the direction, and the
            confidence behind the recommendation.
          </p>
        </section>

        <section className="bp-section">
          <p className="bp-section-eyebrow">Notes as signal</p>
          <h3 className="bp-section-title">The ephemeral stuff turns out to matter.</h3>
          <p>
            Every session captures two streams. Structured data — arrow coordinates, scores,
            timestamps, the exact configuration parameters you were on. And ephemeral data —
            qualitative notes jotted mid-session. Things like <em>"held clean but felt rushed,"</em>{' '}
            <em>"back tension was off on ends 3 and 4,"</em> <em>"anchor felt low."</em> That
            stuff usually lives in a notebook and never gets looked at again.
          </p>
          <p>
            BowPress embeds those notes as vectors alongside the shot data from the same end.
            Over time, the system builds a searchable record of how you felt against how you
            actually performed. It surfaces correlations that would be invisible in the numbers
            alone — that your group center drifts left specifically on ends where you noted grip
            pressure, or that your worst scoring sessions cluster around a particular note
            pattern. Once indexed and connected to outcomes, the ephemeral stuff becomes some of
            the most useful signal the app has.
          </p>
        </section>

        <div className="bp-footer">
          <p>
            <span className="bp-stamp bp-stamp--solid">Live</span>{' '}
            <span className="bp-stamp">App Store</span>
          </p>
          <div className="bp-link-row">
            <a className="bp-link" href="https://apps.apple.com/app/bowpress/id6762573347" target="_blank" rel="noopener noreferrer">
              Download on the App Store
            </a>
            <a className="bp-link" href="https://github.com/AndrewNguyenn/bowpress-ios" target="_blank" rel="noopener noreferrer">
              bowpress-ios on GitHub
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
