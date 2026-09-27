import { useRef, useEffect } from 'react'
import type { ProjectMeta } from './index'
import { BowPressPhoneRow } from './BowPressPhones'
import ProjectLayout, { ProjectSection } from '../ProjectLayout'

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
    <ProjectLayout
      slug="bowpress"
      num="05"
      kind="iOS APP · SIDE PROJECT"
      title="BowPress"
      tagline="Tune smarter. Shoot better. A logbook with a coach attached."
      tags={meta.tags}
      visual="target"
      links={[
        { label: 'Download on the App Store', href: 'https://apps.apple.com/app/bowpress/id6762573347' },
        { label: 'bowpress-ios on GitHub', href: 'https://github.com/AndrewNguyenn/bowpress-ios' },
      ]}
      next={{ to: '/projects/job-application-agent', num: '04', kind: 'AGENT', name: 'Job Application Agent', visual: 'jobs' }}
    >
      <ProjectSection eyebrow="Why it exists" title="Tuning has always been a feel-based process.">
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
      </ProjectSection>

      <ProjectSection eyebrow="How a session works" title="Pick the setup. Start. Tap where each arrow lands.">
        <p>
          Sessions have no end-count and no arrow cap. You pick a distance, a bow, and an
          arrow spec, then tap Start. Each arrow plots onto a real World Archery target face
          as a solid ink dot. You finish when you're done — not when a form says you are.
        </p>
        <div className="pp-spec">
          <div className="pp-spec-row">
            <span className="pp-spec-key">Distance</span>
            <span className="pp-spec-val">20yd · 50m · 70m</span>
            <span className="pp-spec-meta">WA standard</span>
          </div>
          <div className="pp-spec-row">
            <span className="pp-spec-key">Target face</span>
            <span className="pp-spec-val">10-ring · 6-ring</span>
            <span className="pp-spec-meta">real WA colors</span>
          </div>
          <div className="pp-spec-row">
            <span className="pp-spec-key">Scoring</span>
            <span className="pp-spec-val">Ring score 6–10 plus X</span>
            <span className="pp-spec-meta">tap to plot</span>
          </div>
          <div className="pp-spec-row">
            <span className="pp-spec-key">Fliers</span>
            <span className="pp-spec-val">Flag to exclude from analytics</span>
            <span className="pp-spec-meta">per-arrow</span>
          </div>
        </div>
      </ProjectSection>

      <ProjectSection eyebrow="Screens" title="Five tabs. The target is the loudest thing in the UI.">
        <BowPressPhoneRow innerRef={rowRef} />
      </ProjectSection>

      <ProjectSection eyebrow="What it tracks" title="Parameter drift, not vibes.">
        <p>
          Every bow carries a full parameter set — draw length, peep height, rest position,
          top and bottom cable twists, nocking point, tiller, stabilizer weights, arrow spine
          and point grain. Change any of them and the app snapshots the delta against the last
          configuration. The Parameter Drift table shows each value, its previous value, and
          the arrow count shot under each — so you can see exactly which change moved which
          metric.
        </p>
      </ProjectSection>

      <ProjectSection eyebrow="Analytics" title="The target face overlaid against itself.">
        <p>
          The metrics that matter at a competitive level: average ring score, X-ring rate,
          10-ring plus rate, group center position, and how all of those shift period over
          period. The analytics view overlays two time windows on the same target face so you
          can read grouping drift spatially — shift vector, standard deviation ellipse, and a
          moss-green arrow pointing from last week's centroid to this week's.
        </p>
        <p>
          Tuning suggestions surface as a ranked ledger — each finding stamped as{' '}
          <span className="pp-stamp pp-stamp--solid">New</span>{' '}
          <span className="pp-stamp">Proposed</span>{' '}
          <span className="pp-stamp pp-stamp--good">Good</span>{' '}
          <span className="pp-stamp pp-stamp--watch">Watch</span>{' '}
          — ordered by actionability, with the parameter to adjust, the direction, and the
          confidence behind the recommendation.
        </p>
      </ProjectSection>

      <ProjectSection eyebrow="Notes as signal" title="The ephemeral stuff turns out to matter.">
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
      </ProjectSection>
    </ProjectLayout>
  )
}
