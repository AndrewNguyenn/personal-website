import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BuildFeed from './BuildFeed'
import CommandPalette from './CommandPalette'
import './styles/Home.css'

// ── Timeline ──────────────────────────────────────────────────────────────────
// Track spans 2018 → 2028 (10 years). Positions are in "track px" (104 per year)
// and rendered as percentages so the track can flex with the viewport.

const TRACK = 1040
const YEAR_PX = TRACK / 10
const pct = (px: number) => `${(px / TRACK) * 100}%`

const now = new Date()
const nowPx = (now.getFullYear() + now.getMonth() / 12 - 2018) * YEAR_PX
const nowLabel = `NOW · ${now.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${now.getFullYear()}`

type Lane = { name: string; role: string; dates: string; left: number; width: number; label: string; current?: true }

const lanes: Lane[] = [
  { name: 'Coinbase',            role: 'Financial engineering',             dates: '2026 — now', left: 832, width: Math.max(nowPx - 832, 48), label: '2026 —', current: true },
  { name: 'Amazon · Alexa AI',   role: 'SDE, Developer Tech — web agents',  dates: '2025 — 26',  left: 728, width: 121, label: '2025 — 26 · SDK' },
  { name: 'AWS Wickr',           role: 'SDE — EKS, GovCloud, billing',      dates: '2022 — 25',  left: 416, width: 312, label: '2022 — 25 · Platform, Billing' },
  { name: 'JPMorgan Chase',      role: 'Sr. Associate SWE — Chase.com',     dates: '2021 — 22',  left: 287, width: 163, label: '2021 — 22 · Chase.com' },
  { name: 'Lighting automation', role: 'NFL Network · ViacomCBS · Disney',  dates: '2018 — 21',  left: 0,   width: 312, label: '2018 — 21 · NYC, contract programming' },
]

const years = Array.from({ length: 10 }, (_, i) => 2018 + i)

// ── Projects ──────────────────────────────────────────────────────────────────

type Project = {
  num: string
  kind: string
  name: string
  to?: string
  href?: string
  blurb: string
  tags: string[]
  extra?: ReactNode
}

const smallProjects: Project[] = [
  {
    num: '03', kind: 'SDK · PLATFORM', name: 'Alexa Expert SDK', to: '/projects/alexa-expert-sdk',
    blurb: 'Let partners like Thumbtack and TaskRabbit onboard as Alexa skills in natural language, plus the CDK platform Alexa expert teams build on.',
    tags: ['Alexa', 'AWS CDK', 'Java'],
  },
  {
    num: '02', kind: 'WEB · OCR', name: 'Schedule Portal', href: 'https://github.com/AndrewNguyenn/schedule-portal',
    blurb: "Hospital schedule photos become Google Calendar events: Cloud Vision OCR parses the shifts and fills a shared calendar. Built for my girlfriend's weekly rota.",
    tags: ['Python', 'Cloud Vision', 'GCP'],
  },
  {
    num: '01', kind: 'INFRA · OPEN SOURCE', name: 'ComfyUI on AWS', href: 'https://github.com/AndrewNguyenn/aws-deployment-of-comfyui',
    blurb: 'One command spins up a GPU workstation for image generation, with EFS model persistence and a built-in file browser.',
    tags: ['AWS CDK', 'EFS', 'GPU'],
    extra: <div className="card-cmd"><span className="ac">$</span> cdk deploy ComfyUIStack</div>,
  },
]

function CardLink({ project, className, children }: { project: Pick<Project, 'to' | 'href'>; className: string; children: ReactNode }) {
  if (project.to) return <Link to={project.to} className={className}>{children}</Link>
  return <a href={project.href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
}

const Arrow = () => (
  <svg className="card-arrow" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Tags = ({ tags }: { tags: string[] }) => (
  <div className="card-tags">{tags.map(t => <span key={t} className="n-tag">{t}</span>)}</div>
)

// ── Page ──────────────────────────────────────────────────────────────────────

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
}

// Scrolling past the bottom of the page fills a bar; a full bar opens the showcase.
const SHOWCASE_STATE = { from: 'home-scroll' }

function useScrollToShowcase() {
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let value = 0
    let idle: number | undefined
    // Overscroll only counts for a gesture that starts once the page is already
    // at the bottom, so a fast fling down the page (and its momentum) doesn't
    // fall straight through into the showcase.
    let armed = false
    let lastWheel = 0
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    const onScroll = () => {
      if (!atBottom()) armed = false
    }

    const push = (amount: number) => {
      window.clearTimeout(idle)
      if (!armed) return
      if (amount <= 0 || !atBottom()) value = 0
      else value = Math.min(1, value + amount)
      setProgress(value)
      if (value >= 1) {
        navigate('/showcase', { state: SHOWCASE_STATE })
        return
      }
      idle = window.setTimeout(() => { value = 0; setProgress(0) }, 900)
    }

    let touchY: number | null = null
    const onWheel = (e: WheelEvent) => {
      const t = Date.now()
      const newGesture = t - lastWheel > 250
      lastWheel = t
      if (newGesture && atBottom()) armed = true
      push(e.deltaY / 900)
    }
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
      if (atBottom()) armed = true
    }
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return
      const y = e.touches[0].clientY
      push((touchY - y) / 260)
      touchY = y
    }
    const onKey = (e: KeyboardEvent) => {
      if (!['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) return
      if (atBottom()) armed = true
      push(0.34)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(idle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [navigate])

  return progress
}

export default function Home() {
  const [palette, setPalette] = useState(false)
  const runProgress = useScrollToShowcase()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.classList.add('night')
    return () => document.body.classList.remove('night')
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette(p => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Reveal sections as they scroll into view.
  useEffect(() => {
    const els = root.current?.querySelectorAll('.reveal') ?? []
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const onAnchor = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    jump(id)
  }

  return (
    <div className="home" ref={root}>
      <header className="home-nav">
        <a href="#top" className="home-logo mono" onClick={onAnchor('top')}>anduwu<span className="caret" /></a>
        <nav className="home-links">
          <a href="#now" onClick={onAnchor('now')}>Now</a>
          <a href="#work" onClick={onAnchor('work')}>Work</a>
          <a href="#projects" onClick={onAnchor('projects')}>Projects</a>
          <a href="#contact" onClick={onAnchor('contact')}>Contact</a>
        </nav>
        <div className="home-actions">
          <button type="button" className="kbtn jump-btn mono" onClick={() => setPalette(true)} aria-label="Jump to (Command K)">
            <span className="jump-label">Jump to</span>
            <span className="keys"><kbd>⌘</kbd><kbd>K</kbd></span>
          </button>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-s resume-btn mono">resume.pdf</a>
        </div>
      </header>

      <section id="top" className="hero dots">
        <div className="hero-copy">
          <div className="hero-prompt mono">
            <div><span className="ac">andrew@anduwu</span> ~ % <span className="typed">whoami</span><span className="caret" /></div>
            <div className="rise d1 hero-whoami">software engineer · financial engineering @ coinbase · irvine, ca</div>
          </div>
          <h1 className="rise d2">
            Building the infrastructure that makes AI agents <span className="serif ac">actually do what you want.</span>
          </h1>
          <p className="rise d3 hero-bio">
            I started out programming lights for live TV at <span className="chip">NFL Network</span> and <span className="chip">Disney</span>.
            Then I found code. Six years later I've shipped at <span className="chip">JPMorgan</span>, <span className="chip">AWS Wickr</span> and <span className="chip">Alexa</span>,
            and now I work in financial engineering at <span className="chip chip-ac">Coinbase</span>. Nights and weekends, I build agents.
          </p>
          <div className="rise d4 hero-ctas">
            <a href="#contact" className="btn-p mono" onClick={onAnchor('contact')}>Open terminal <span>&gt;_</span></a>
            <a href="mailto:andrewcnguyen01@gmail.com" className="btn-s mono">Say hi</a>
            <Link to="/showcase" className="navlink mono">Open showcase <span className="ac">↗</span></Link>
          </div>
        </div>
        <div className="rise d3">
          <BuildFeed id="now" />
        </div>
      </section>

      <section id="work" className="section reveal">
        <div className="section-head">
          <div className="section-title">
            <span className="eyebrow mono ac">01 — WORK</span>
            <h2>From lighting rigs to <span className="serif">agent rigs.</span></h2>
          </div>
          <Link to="/showcase" className="navlink mono section-aside">2018 → now · <span className="ac">view as 3D showcase →</span></Link>
        </div>

        <div className="tl">
          {lanes.map((lane, i) => (
            <div key={lane.name} className="lane">
              <div className="lane-meta">
                <span className="lane-name">{lane.name}</span>
                <span className="lane-role">{lane.role}</span>
              </div>
              <div className="lane-track">
                <div
                  className={`bar mono ${lane.current ? 'bar-now' : 'bar-past'}`}
                  style={{ left: pct(lane.left), width: pct(lane.width), animationDelay: `${0.1 + i * 0.15}s` }}
                >
                  {lane.label}
                </div>
                {lane.current && <div className="bar-future" style={{ left: pct(nowPx + 4), right: 0 }} />}
              </div>
            </div>
          ))}
          <div className="lane lane-axis">
            <span />
            <div className="axis mono">
              {years.map(y => <span key={y} className={y === now.getFullYear() ? 'axis-now' : undefined}>{y}</span>)}
            </div>
          </div>
          <div className="now-marker" style={{ '--now': pct(nowPx) } as CSSProperties}>
            <div className="now-line" />
            <div className="now-label mono ac"><span className="now-dot" />{nowLabel}</div>
          </div>
        </div>

        <ol className="tl-list">
          {lanes.map(lane => (
            <li key={lane.name} className={lane.current ? 'tl-item tl-item--now' : 'tl-item'}>
              <span className={`tl-dot${lane.current ? ' now-dot' : ''}`} />
              <span className={`tl-dates mono${lane.current ? ' ac' : ''}`}>{lane.dates.toUpperCase()}</span>
              <span className="lane-name">{lane.name}</span>
              <span className="lane-role">{lane.role}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="projects" className="section reveal">
        <div className="section-head">
          <div className="section-title">
            <span className="eyebrow mono ac">02 — PROJECTS</span>
            <h2>Things I built <span className="serif">because I wanted them.</span></h2>
          </div>
          <span className="mono section-aside">05 projects · newest first</span>
        </div>

        <div className="cards">
          <CardLink project={{ to: '/projects/bowpress' }} className="card card-feature">
            <span className="sweep" />
            <div className="card-feature-copy">
              <div className="card-kind mono"><span className="idx">05</span><span>iOS APP · SIDE PROJECT</span></div>
              <span className="card-name card-name--xl">BowPress</span>
              <span className="serif card-serif">Tune smarter. Shoot better.</span>
              <p className="card-blurb">An iOS app for archers who want quantifiable data behind every bow adjustment. Configurations get snapshotted, arrows get plotted on a real WA target face, and over time it surfaces what to tune next.</p>
              <Tags tags={['SwiftUI', 'Cloudflare Workers', 'SQLite', 'Vector Search']} />
            </div>
            <div className="card-phones">
              <img className="shot-a" src="/projects/bowpress/session.png" alt="BowPress session screen" />
              <img className="shot-b" src="/projects/bowpress/analytics-overview.png" alt="BowPress analytics overview screen" />
            </div>
            <Arrow />
          </CardLink>

          <CardLink project={{ to: '/projects/job-application-agent' }} className="card card-tall">
            <span className="sweep" />
            <div className="card-kind mono"><span className="idx">04</span><span>AGENT</span></div>
            <span className="card-name card-name--lg">Job Application Agent</span>
            <span className="serif card-serif card-serif--sm">An agent that handles the job search so you don't have to.</span>
            <div className="card-steps mono">
              <div><span className="ac">→</span> find relevant postings</div>
              <div><span className="ac">→</span> tailor application materials</div>
              <div><span className="ac">→</span> track status<span className="caret" /></div>
            </div>
            <Tags tags={['AI Agents', 'LLM', 'Python']} />
            <Arrow />
          </CardLink>

          {smallProjects.map(p => (
            <CardLink key={p.name} project={p} className="card">
              <span className="sweep" />
              <div className="card-kind mono"><span className="idx">{p.num}</span><span>{p.kind}</span></div>
              <span className="card-name">{p.name}</span>
              <p className="card-blurb">{p.blurb}</p>
              {p.extra}
              <Tags tags={p.tags} />
              <Arrow />
            </CardLink>
          ))}
        </div>
      </section>

      <section id="contact" className="contact dots reveal">
        <div className="contact-grid">
          <div className="contact-copy">
            <span className="eyebrow mono ac">03 — CONTACT</span>
            <h2 className="serif contact-title">Say hi.</h2>
            <p>Always up for talking about agents, infrastructure, or whatever you're building.</p>
          </div>
          <div className="term">
            <div className="tail-bar">
              <span className="tail-lights" aria-hidden="true"><span /><span /><span /></span>
              <span>zsh — contact</span>
            </div>
            <div className="term-body mono">
              <div className="term-line"><span className="ac">andrew@anduwu</span> ~ % <span className="term-cmd">contact --list</span></div>
              <a href="mailto:andrewcnguyen01@gmail.com" className="term-link"><span className="term-key">email</span><span>andrewcnguyen01@gmail.com</span></a>
              <a href="https://github.com/AndrewNguyenn" target="_blank" rel="noopener noreferrer" className="term-link"><span className="term-key">github</span><span>github.com/AndrewNguyenn</span></a>
              <a href="https://www.linkedin.com/in/andrewconannguyen/" target="_blank" rel="noopener noreferrer" className="term-link"><span className="term-key">linkedin</span><span>in/andrewconannguyen</span></a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="term-link"><span className="term-key">resume</span><span>resume.pdf</span></a>
              <div className="term-line term-line--end"><span className="ac">andrew@anduwu</span> ~ %<span className="caret" /></div>
            </div>
          </div>
        </div>
        <footer className="home-foot mono">
          <span>© {now.getFullYear()} Andrew Nguyen · Irvine, CA</span>
          <span className="home-build"><span className="now-dot" />build {__COMMIT__} · main</span>
          <a href="#top" className="navlink" onClick={onAnchor('top')}>back to top ↑</a>
        </footer>
      </section>

      <Link to="/showcase" state={SHOWCASE_STATE} className="run-showcase dots">
        <span className="mono run-cmd"><span className="ac">andrew@anduwu</span> ~ % showcase --3d-timeline<span className="caret" /></span>
        <span className="run-title">Every job and project on <span className="serif">one 3D timeline.</span></span>
        <span className="mono run-hint">{runProgress > 0 ? 'keep scrolling…' : 'scroll to run ↓'}</span>
        <span className="run-track" aria-hidden="true"><span className="run-fill" style={{ transform: `scaleX(${runProgress})` }} /></span>
      </Link>

      {palette && <CommandPalette onClose={() => setPalette(false)} onJump={jump} />}
    </div>
  )
}
