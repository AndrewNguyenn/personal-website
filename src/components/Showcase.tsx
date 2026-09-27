import { useEffect, useRef, useState, type TouchEvent, type WheelEvent } from 'react'
import { Link } from 'react-router-dom'
import './styles/Showcase.css'

// The scene is authored on a 1000px-tall stage and scaled to fit the viewport.
// Cards sit on a horizontal track; the camera centers the selected card.

type Kind = 'fixtures' | 'term' | 'calendar' | 'image' | 'now'

type Stop = {
  x: number
  lane: 'up' | 'low'
  kind: Kind
  label: string
  title: string
  sub: string
  tags: string[]
  desc: string
  lines?: string[]
  href?: string
  external?: true
  cta?: string
}

const stops: Stop[] = [
  {
    x: 0, lane: 'low', kind: 'fixtures', label: 'COMPANY · CONTRACT', title: 'Lighting automation', sub: 'Light cues for live TV, NYC',
    tags: ['NFL Network', 'ViacomCBS', 'Disney'],
    desc: 'Contract lighting automation programming in New York for NFL Network, ViacomCBS and Disney, before the move into software.',
  },
  {
    x: 700, lane: 'low', kind: 'term', label: 'COMPANY', title: 'JPMorgan Chase', sub: 'Chase.com, rebuilt in React',
    lines: ['$ migrate chase.com', '  proprietary → React', '  ✓ shipped'], tags: ['React', 'Frontend'],
    desc: "Migrated Chase.com's frontend from a proprietary framework to React, improving security and stability and cutting ramp-up time for new engineers.",
  },
  {
    x: 1100, lane: 'low', kind: 'term', label: 'COMPANY · AWS', title: 'AWS Wickr', sub: 'Console, GovCloud, billing',
    lines: ['$ cdk deploy --region us-gov-west-1', '  read load   −15%', '  saved       ~$75K/mo'], tags: ['EKS', 'AWS CDK', 'Aurora'],
    desc: 'Deployed EKS across regions including GovCloud, replaced the legacy portal with an AWS Console experience for 40+ enterprise and government customers, and owned the AWS-native billing integration end to end.',
  },
  {
    x: 1800, lane: 'low', kind: 'term', label: 'COMPANY · AMAZON', title: 'Alexa AI', sub: 'Web agents that book for you',
    lines: ['> open partner site', '> reason over page state', '> create booking  ✓'], tags: ['VLM agents', 'Evals', 'Java'],
    desc: 'Designed the LLM-driven agent that browses partner websites and completes reservations, cut partner onboarding from 38 to 12 weeks, and built an eval pipeline that writes its own prompt fixes.',
    href: '/projects/alexa-expert-sdk', cta: 'Read the case study',
  },
  {
    x: 2150, lane: 'up', kind: 'term', label: 'TOOL · OPEN SOURCE', title: 'ComfyUI on AWS', sub: 'One-command GPU workstation',
    lines: ['$ cdk deploy ComfyUIStack', '  g4dn → p5 scaling', '  models on EFS'], tags: ['AWS CDK', 'EFS', 'GPU'],
    desc: 'A CDK package that spins up a full image-generation workstation with a single command, with model persistence on EFS and a built-in file browser.',
    href: 'https://github.com/AndrewNguyenn/aws-deployment-of-comfyui', external: true, cta: 'View on GitHub',
  },
  {
    x: 2480, lane: 'up', kind: 'calendar', label: 'WEB · OCR', title: 'Schedule Portal', sub: 'Schedule photos → calendar',
    tags: ['Python', 'Cloud Vision', 'GCP'],
    desc: 'Upload a photo of a hospital shift schedule; Cloud Vision OCR parses the shifts and fills a shared Google Calendar automatically.',
    href: 'https://github.com/AndrewNguyenn/schedule-portal', external: true, cta: 'View on GitHub',
  },
  {
    x: 2810, lane: 'up', kind: 'term', label: 'AGENT', title: 'Job Application Agent', sub: 'The job search, automated',
    lines: ['→ find relevant postings', '→ tailor materials', '→ track status'], tags: ['AI Agents', 'LLM', 'Python'],
    desc: 'Applying for jobs is repetitive and mostly mechanical. This agent finds relevant postings, tailors application materials and tracks status, so the focus stays on the conversations that matter.',
    href: '/projects/job-application-agent', cta: 'Read the notes',
  },
  {
    x: 3140, lane: 'up', kind: 'image', label: 'APP · iOS', title: 'BowPress', sub: 'Tune smarter. Shoot better.',
    tags: ['SwiftUI', 'Workers', 'SQLite'],
    desc: 'An iOS app for archers who want quantifiable data behind every bow adjustment. Configurations get snapshotted, arrows get plotted on a real WA target face, and over time it surfaces what to tune next.',
    href: '/projects/bowpress', cta: 'Open project',
  },
  {
    x: 3300, lane: 'low', kind: 'now', label: 'COMPANY · NOW', title: 'Coinbase', sub: 'Financial engineering',
    tags: ['2026 —'], desc: 'Currently in financial engineering at Coinbase.',
  },
]

const CARD_W = 250
const NOW_X = 3425
const ticks: [string, number][] = [['2018', 125], ['2021', 825], ['2022', 1225], ['2024', 1650], ['2025', 1925], ['2026', 2700]]
const bigYears: [string, number][] = [['2018', -260], ['2022', 900], ['2025', 2000], ['2026', 3250]]
const captions: [string, number][] = [
  ['It started with light cues for live TV.', -40],
  ['Then infrastructure: GovCloud, EKS, billing.', 980],
  ['Agents that browse, reason, and book.', 2200],
  ["Now it's deciding what to build next.", 3220],
]
const calendar = [0,1,0,0,1,1,0, 0,0,1,1,0,0,1, 1,0,0,1,0,1,0, 0,1,1,0,0,0,1]
const beams = ['a', 'b', 'c', 'b', 'a']

const pad = (n: number) => String(n).padStart(2, '0')
const clamp = (i: number) => Math.max(0, Math.min(stops.length - 1, i))

function Visual({ stop }: { stop: Stop }) {
  switch (stop.kind) {
    case 'image':
      return <img className="sc-shot" src="/projects/bowpress/analytics-overview.png" alt="BowPress analytics overview screen" />
    case 'term':
      return (
        <div className="sc-term">
          {stop.lines?.map(l => <span key={l}>{l}</span>)}
          <span className="sc-term-caret"><span className="sc-caret" /></span>
        </div>
      )
    case 'calendar':
      return (
        <div className="sc-cal">
          <span className="sc-cal-label">SHIFTS → CALENDAR</span>
          <div className="sc-cal-grid">
            {calendar.map((on, i) => <span key={i} className={on ? 'sc-cal-on' : 'sc-cal-off'} />)}
          </div>
        </div>
      )
    case 'fixtures':
      return (
        <div className="sc-fixtures">
          {beams.map((b, i) => (
            <div key={i} className="sc-fixture">
              <span className={`sc-beam sc-beam-${b}`} />
              <span className="sc-lamp" />
            </div>
          ))}
        </div>
      )
    case 'now':
      return (
        <div className="sc-now">
          <span className="sc-now-label">CURRENTLY</span>
          <span className="sc-now-year">2026 —<span className="sc-caret sc-caret--ac" /></span>
        </div>
      )
  }
}

function useViewport() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

export default function Showcase() {
  const [index, setIndex] = useState(7)
  const [focus, setFocus] = useState(false)
  const lastWheel = useRef(0)
  const touchX = useRef<number | null>(null)
  const { w, h } = useViewport()

  const go = (i: number) => setIndex(clamp(i))
  const step = (delta: number) => setIndex(i => clamp(i + delta))

  useEffect(() => {
    document.body.classList.add('sand')
    return () => document.body.classList.remove('sand')
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !focus) { e.preventDefault(); step(1) }
      else if (e.key === 'ArrowLeft' && !focus) { e.preventDefault(); step(-1) }
      else if (e.key === 'Enter') { e.preventDefault(); setFocus(true) }
      else if (e.key === 'Escape') setFocus(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focus])

  const onWheel = (e: WheelEvent) => {
    if (focus) return
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    const t = Date.now()
    if (Math.abs(d) < 8 || t - lastWheel.current < 550) return
    lastWheel.current = t
    step(d > 0 ? 1 : -1)
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null || focus) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
  }

  const scale = Math.min(h / 1000, w / 620, 1.15)
  const stageW = w / scale
  const cam = stops[index].x + CARD_W / 2
  const cur = stops[index]

  return (
    <div
      className="showcase"
      onWheel={onWheel}
      onTouchStart={e => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={onTouchEnd}
    >
      <div className="sc-bg" aria-hidden="true" style={{ transform: `translateX(${Math.round(-cam * 0.06)}px)` }}>
        <div className="sc-blob sc-blob-1" />
        <div className="sc-blob sc-blob-2" />
        <div className="sc-blob sc-blob-3" />
        <div className="sc-blob sc-blob-4" />
      </div>
      <svg className="sc-grain" aria-hidden="true">
        <filter id="sc-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#sc-grain)" />
      </svg>

      <div
        className="sc-stage"
        role="region"
        aria-label="Project timeline"
        style={{ width: stageW, top: (h - 1000 * scale) / 2, transform: `scale(${scale})` }}
      >
        <div className="sc-track" style={{ transform: `translateX(${stageW / 2 - cam}px)` }}>
          <div className="sc-layer sc-layer--far" aria-hidden="true">
            {bigYears.map(([y, x]) => <span key={y} className="sc-bigyear" style={{ left: x }}>{y}</span>)}
          </div>
          <div className="sc-layer sc-layer--mid">
            {captions.map(([text, x]) => <span key={text} className="sc-caption" style={{ left: x }}>{text}</span>)}
          </div>

          <div className="sc-axis" aria-hidden="true" />
          <div className="sc-axis sc-axis--future" aria-hidden="true" />
          {ticks.map(([label, x]) => (
            <div key={label} aria-hidden="true">
              <div className="sc-tick" style={{ left: x }} />
              <span className="sc-tick-label" style={{ left: x - 100 }}>{label}</span>
            </div>
          ))}
          <div className="sc-tick sc-tick--now" style={{ left: NOW_X }} />
          <span className="sc-now-tick" style={{ left: NOW_X - 50 }}>NOW<span className="sc-caret" /></span>

          {stops.map((stop, k) => {
            const dx = stop.x + CARD_W / 2 - cam
            const ad = Math.abs(dx)
            const isCur = k === index
            const rot = Math.max(-26, Math.min(26, dx / 38))
            const z = isCur ? 90 : -Math.min(ad / 5, 260)
            return (
              <button
                key={stop.title}
                type="button"
                className="sc-card-wrap"
                aria-label={`${pad(k + 1)} ${stop.title}${isCur ? ', open details' : ''}`}
                onClick={() => (isCur ? setFocus(true) : go(k))}
                style={{
                  left: stop.x,
                  top: stop.lane === 'up' ? 170 : 500,
                  transform: `translateZ(${z}px) rotateY(${rot.toFixed(1)}deg)`,
                  opacity: isCur ? 1 : Math.max(0.3, 1 - ad / 1700),
                  filter: `blur(${isCur ? 0 : Math.min(ad / 650, 3.5).toFixed(1)}px)`,
                }}
              >
                <div className={`sc-card${isCur ? ' sc-card--cur' : ''}`}>
                  <div className="sc-card-label"><span>{pad(k + 1)}</span><span>{stop.label}</span></div>
                  <div className="sc-card-title">{stop.title}</div>
                  <div className="sc-visual"><Visual stop={stop} /></div>
                  <div className="sc-tags">{stop.tags.map(t => <span key={t} className="sc-tag">{t}</span>)}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="sc-head">
        <div className="sc-head-copy">
          <span className="sc-cmd">andrew@anduwu ~ % showcase --3d-timeline</span>
          <div key={index} className="sc-swap">
            <span className="sc-title">{cur.title}</span>
            <span className="sc-sub">{cur.sub}</span>
          </div>
        </div>
        <div className="sc-head-actions">
          <span className="sc-counter">{pad(index + 1)} / {pad(stops.length)}</span>
          <Link to="/" className="sc-btn">← anduwu.dev</Link>
        </div>
      </div>

      <div className="sc-controls">
        <button type="button" className="sc-btn" onClick={() => step(-1)} aria-label="Previous">← prev</button>
        <div className="sc-dots-wrap">
          <div className="sc-dots">
            {stops.map((stop, k) => (
              <button key={stop.title} type="button" className="sc-dot-btn" aria-label={`${pad(k + 1)} ${stop.title}`} onClick={() => { setFocus(false); go(k) }}>
                <span className={`sc-dot${k === index ? ' sc-dot--cur' : ''}`} />
              </button>
            ))}
          </div>
          <span className="sc-hint">SCROLL OR ← → TO TRAVEL · CLICK OR ↵ TO FOCUS</span>
        </div>
        <button type="button" className="sc-btn" onClick={() => step(1)} aria-label="Next">next →</button>
      </div>

      {focus && (
        <div className="sc-focus">
          <button type="button" className="sc-scrim" aria-label="Close" onClick={() => setFocus(false)} />
          <div className="sc-panel" role="dialog" aria-label={cur.title}>
            <div className="sc-panel-visual">
              <div className="sc-visual sc-visual--lg"><Visual stop={cur} /></div>
            </div>
            <div className="sc-panel-copy">
              <div className="sc-card-label"><span>{pad(index + 1)}</span><span>{cur.label}</span></div>
              <span className="sc-panel-title">{cur.title}</span>
              <span className="sc-panel-sub">{cur.sub}</span>
              <p>{cur.desc}</p>
              <div className="sc-tags">{cur.tags.map(t => <span key={t} className="sc-tag">{t}</span>)}</div>
              <div className="sc-panel-actions">
                {cur.href && (cur.external
                  ? <a href={cur.href} target="_blank" rel="noopener noreferrer" className="sc-open">{cur.cta} ↗</a>
                  : <Link to={cur.href} className="sc-open">{cur.cta} ↗</Link>)}
                <button type="button" className="sc-close" onClick={() => setFocus(false)}>esc · back to timeline</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
