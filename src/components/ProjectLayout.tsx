import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Kind } from './ShowcaseVisuals'
import { Atmosphere, CardVisual } from './Site'
import { useReveal } from './siteHooks'
import './styles/Site.css'
import './styles/ProjectLayout.css'

// Shared frame for the project detail pages, in the home page's design language.

type LinkOut = { label: string; href: string }
type Next = { to: string; num: string; kind: string; name: string; visual: Kind }

type Props = {
  slug: string
  num: string
  kind: string
  title: string
  tagline: string
  tags: string[]
  visual: Kind
  links?: LinkOut[]
  next: Next
  children: ReactNode
}

export default function ProjectLayout({ slug, num, kind, title, tagline, tags, visual, links = [], next, children }: Props) {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  return (
    <div className="site pp" ref={root}>
      <Atmosphere />

      <header className="site-nav">
        <Link to="/" className="site-logo mono">anduwu</Link>
        <nav className="site-links">
          <Link to="/#work">Work</Link>
          <Link to="/#projects">Projects</Link>
          <Link to="/showcase">Showcase</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
        <div className="site-actions">
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-s resume-btn mono">resume.pdf</a>
        </div>
      </header>

      <section className="pp-hero">
        <div className="pp-hero-copy">
          <Link to="/#projects" className="pp-back mono">← all projects</Link>
          <div className="pp-cmd mono"><span className="ac">andrew@anduwu</span> ~ % <span className="pp-cmd-text">cat projects/{slug}.md</span></div>
          <span className="eyebrow mono ac rise d1">{num} — {kind}</span>
          <h1 className="rise d2">{title}</h1>
          <p className="serif pp-tagline rise d2">{tagline}</p>
          <div className="card-tags rise d3">{tags.map(t => <span key={t} className="n-tag">{t}</span>)}</div>
          {links.length > 0 && (
            <div className="pp-links rise d4">
              {links.map((l, i) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`${i === 0 ? 'btn-p' : 'btn-s'} mono`}>
                  {l.label} <span>↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="pp-screen rise d3">
          <div className="tail-bar">
            <span className="tail-lights" aria-hidden="true"><span /><span /><span /></span>
            <span className="tail-title">~/projects/{slug}</span>
          </div>
          <CardVisual kind={visual} scale={2} />
        </div>
      </section>

      <article className="pp-body">{children}</article>

      <section className="pp-after reveal">
        <Link to={next.to} className="card pp-next">
          <span className="sweep" />
          <div className="pp-next-copy">
            <span className="card-kind mono"><span className="idx">{next.num}</span><span>NEXT PROJECT · {next.kind}</span></span>
            <span className="card-name card-name--lg">{next.name} <span className="pp-next-arrow">→</span></span>
          </div>
          <div className="pp-next-visual"><CardVisual kind={next.visual} scale={1} /></div>
        </Link>
        <footer className="site-foot mono">
          <span>© {new Date().getFullYear()} Andrew Nguyen · Irvine, CA</span>
          <Link to="/#projects" className="navlink">← all projects</Link>
          <Link to="/#contact" className="navlink">say hi →</Link>
        </footer>
      </section>
    </div>
  )
}

export function ProjectSection({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children: ReactNode }) {
  return (
    <section className="pp-section reveal">
      <span className="eyebrow mono ac">{eyebrow}</span>
      <h2>{title}</h2>
      <div className="pp-prose">{children}</div>
    </section>
  )
}
