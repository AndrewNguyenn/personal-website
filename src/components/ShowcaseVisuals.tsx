import type { CSSProperties } from 'react'
import './styles/Visuals.css'

// Small looping illustrations for the showcase cards. Each draws inside the
// 222×150 visual well of a card; all motion is CSS (see Showcase.css, "v-*").

export type Kind = 'fixtures' | 'react' | 'pods' | 'browser' | 'nodes' | 'calendar' | 'jobs' | 'target' | 'now'

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties

// Lighting automation: stage fixtures sweeping their beams.
function Fixtures() {
  return (
    <div className="v-fixtures">
      {['a', 'b', 'c', 'b', 'a'].map((b, i) => (
        <div key={i} className="v-fixture">
          <span className={`v-beam v-beam-${b}`} />
          <span className="v-lamp" />
        </div>
      ))}
    </div>
  )
}

// JPMorgan: a React atom spinning while legacy page rows flip over one by one.
function ReactMigration() {
  const orbit = 'M40,0 A40,15 0 1,1 -40,0 A40,15 0 1,1 40,0'
  return (
    <div className="v-react">
      <svg className="v-atom" viewBox="-50 -50 100 100" aria-hidden="true">
        {[0, 60, 120].map((r, i) => (
          <g key={r} transform={`rotate(${r})`}>
            <ellipse rx="40" ry="15" />
            <circle r="3" className="v-electron">
              <animateMotion dur={`${2.4 + i * 0.5}s`} repeatCount="indefinite" path={orbit} />
            </circle>
          </g>
        ))}
        <circle r="7" className="v-nucleus" />
      </svg>
      <div className="v-pages">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="v-page" style={delay(i * 0.6)}>
            <span className="v-page-bar" style={{ ...delay(i * 0.6), width: `${[70, 52, 62, 44][i]}%` }} />
            <span className="v-page-check" style={delay(i * 0.6)}>✓</span>
          </div>
        ))}
        <span className="v-caption">legacy → react</span>
      </div>
    </div>
  )
}

// AWS Wickr: a cluster of EKS nodes lighting up in waves inside GovCloud.
function Pods() {
  const cells = Array.from({ length: 18 }, (_, i) => i)
  return (
    <div className="v-pods">
      <span className="v-region">us-gov-west-1</span>
      <div className="v-hexes">
        {cells.map(i => (
          <span key={i} className={`v-hex${Math.floor(i / 6) % 2 ? ' v-hex--odd' : ''}`} style={delay(((i * 7) % 11) * 0.22)} />
        ))}
      </div>
      <svg className="v-lock" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="3" y="7" width="10" height="7" rx="1.5" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" />
      </svg>
    </div>
  )
}

// Alexa AI: an agent's cursor fills a form, picks a slot and books it.
function Browser() {
  return (
    <div className="v-browser">
      <div className="v-chrome"><span /><span /><span /><i>partner-site.com/book</i></div>
      <div className="v-form">
        <span className="v-field"><span className="v-fill v-fill-1" /></span>
        <span className="v-field v-field--short"><span className="v-fill v-fill-2" /></span>
        <div className="v-slots">
          <span className="v-slot">9:00</span>
          <span className="v-slot v-slot--pick">11:30</span>
          <span className="v-slot">2:00</span>
        </div>
        <span className="v-book"><span className="v-book-a">Book</span><span className="v-book-b">booked ✓</span></span>
      </div>
      <svg className="v-cursor" viewBox="0 0 12 16" aria-hidden="true">
        <path d="M1 1l0 12 3.2-3 2.3 5 2-1-2.3-4.8 4.3-.2z" />
      </svg>
    </div>
  )
}

// ComfyUI: a node graph with data flowing into an output that denoises.
function Nodes() {
  return (
    <div className="v-nodes">
      <svg className="v-wires" viewBox="0 0 222 150" aria-hidden="true">
        <path d="M62 38 C 84 38, 80 72, 100 72" />
        <path d="M62 108 C 84 108, 80 80, 100 80" />
        <path d="M146 76 C 158 76, 156 76, 166 76" />
      </svg>
      <span className="v-node" style={{ left: 10, top: 26 }}>model</span>
      <span className="v-node" style={{ left: 10, top: 96 }}>prompt</span>
      <span className="v-node v-node--mid" style={{ left: 100, top: 62 }}>sampler</span>
      <div className="v-output">
        <div className="v-art">
          <span className="v-sun" />
          <span className="v-hill v-hill-1" />
          <span className="v-hill v-hill-2" />
        </div>
        <svg className="v-noise" aria-hidden="true">
          <filter id="v-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={1}>
              <animate attributeName="seed" values="1;2;3;4;5" dur="0.4s" repeatCount="indefinite" />
            </feTurbulence>
          </filter>
          <rect width="100%" height="100%" filter="url(#v-noise)" />
        </svg>
      </div>
    </div>
  )
}

// Schedule Portal: a scan line reads the schedule photo; shifts pop into the calendar.
const shifts = [0,1,0,0,1,1,0, 0,0,1,1,0,0,1, 1,0,0,1,0,1,0, 0,1,1,0,0,0,1]

function Calendar() {
  return (
    <div className="v-cal">
      <span className="v-cal-label">SHIFTS → CALENDAR</span>
      <div className="v-cal-grid">
        {shifts.map((on, i) => (
          <span key={i} className={on ? 'v-cal-on' : 'v-cal-off'} style={on ? delay(-0.35 + Math.floor(i / 7) * 0.53) : undefined} />
        ))}
        <span className="v-scan" />
      </div>
    </div>
  )
}

// Job Application Agent: postings get stamped APPLIED and fly off the stack.
function Jobs() {
  return (
    <div className="v-jobs">
      {[0, 1, 2].map(i => (
        <div key={i} className="v-job" style={delay(-i * 1.5)}>
          <span className="v-job-logo" />
          <span className="v-job-line" style={{ width: '62%' }} />
          <span className="v-job-line" style={{ width: '40%' }} />
          <span className="v-job-tags"><i /><i /><i /></span>
          <span className="v-stamp" style={delay(-i * 1.5)}>APPLIED</span>
        </div>
      ))}
      <span className="v-jobs-caption">tailor · apply · track</span>
    </div>
  )
}

// BowPress: arrows landing on a WA target face in a tightening group.
const hits: [number, number][] = [[14, -10], [-12, 8], [8, 12], [-6, -6], [4, 3], [-2, 1]]

function Target() {
  return (
    <div className="v-target-wrap">
      <svg className="v-target" viewBox="-50 -50 100 100" aria-hidden="true">
        {[
          [48, '#f4efe6'], [43, '#f4efe6'], [38, '#2b2320'], [33, '#2b2320'], [28, '#3b8fc4'],
          [23, '#3b8fc4'], [18, '#d9483b'], [13, '#d9483b'], [8, '#f2c94c'], [3.5, '#f2c94c'],
        ].map(([r, fill], i) => (
          <circle key={i} r={r} fill={fill as string} stroke="rgba(0,0,0,.18)" strokeWidth="0.4" />
        ))}
        {hits.map(([x, y], i) => (
          <g key={i} className="v-hit" style={delay(0.4 + i * 0.55)}>
            <circle cx={x} cy={y} r="2.6" />
          </g>
        ))}
      </svg>
      <div className="v-group">
        <span className="v-group-label">GROUP</span>
        <span className="v-group-ring" />
        <span className="v-group-label">tightening</span>
      </div>
    </div>
  )
}

// Coinbase: current role, with a line chart that keeps drawing itself.
function Now() {
  return (
    <div className="v-now">
      <span className="v-now-label">CURRENTLY</span>
      <svg className="v-spark" viewBox="0 0 190 50" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 L14 36 L26 38 L40 30 L52 33 L66 24 L80 27 L94 18 L108 22 L122 14 L136 17 L150 9 L164 12 L178 5 L190 7" />
      </svg>
      <span className="v-now-year">2026 —<span className="v-caret" /></span>
    </div>
  )
}

function Art({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'fixtures': return <Fixtures />
    case 'react':    return <ReactMigration />
    case 'pods':     return <Pods />
    case 'browser':  return <Browser />
    case 'nodes':    return <Nodes />
    case 'calendar': return <Calendar />
    case 'jobs':     return <Jobs />
    case 'target':   return <Target />
    case 'now':      return <Now />
  }
}

export default function Visual({ kind }: { kind: Kind }) {
  return <div className="v-root"><Art kind={kind} /></div>
}
