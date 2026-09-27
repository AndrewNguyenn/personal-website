import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CUE_EVENT, LIGHTS_EVENT } from './siteHooks'
import { unlockAudio } from './lightsScore'

// A small pretend shell that swaps in for the hero's live feed.

type Entry = { id: number; prompt?: string; body: ReactNode }

const PROMPT = 'andrew@anduwu ~ %'
const COMMANDS = ['help', 'whoami', 'projects', 'showcase', 'contact', 'resume', 'clear', 'exit'] as const

const projects: { name: string; blurb: string; to?: string; href?: string }[] = [
  { name: 'bowpress',              blurb: 'iOS app — tune smarter, shoot better',            to: '/projects/bowpress' },
  { name: 'job-application-agent', blurb: 'an agent that handles the job search',            to: '/projects/job-application-agent' },
  { name: 'alexa-expert-sdk',      blurb: 'natural-language SDK for Alexa partners',         to: '/projects/alexa-expert-sdk' },
  { name: 'schedule-portal',       blurb: 'schedule photos → Google Calendar',               href: 'https://github.com/AndrewNguyenn/schedule-portal' },
  { name: 'comfyui-on-aws',        blurb: 'one-command GPU workstation',                     href: 'https://github.com/AndrewNguyenn/aws-deployment-of-comfyui' },
]

const TARGET = String.raw`      .-~~~-.
    .' .-~-. '.
   / .' .-. '. \
  | |  ( x )  | |
   \ '. '-' .' /
    '. '-~-' .'
      '-~~~-'`

const lastLogin = new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })

export default function Terminal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<Entry[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState<number | null>(null)
  const nextId = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const print = (body: ReactNode, prompt?: string) =>
    setEntries(e => [...e, { id: nextId.current++, prompt, body }])

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [entries])

  // Echo the light show's cue list as it runs, like a lighting desk.
  useEffect(() => {
    const onCue = (e: Event) => {
      const label = (e as CustomEvent<string>).detail
      setEntries(es => [...es, { id: nextId.current++, body: <span className="tty-dim">  {label}</span> }])
    }
    window.addEventListener(CUE_EVENT, onCue)
    return () => window.removeEventListener(CUE_EVENT, onCue)
  }, [])

  const run = (raw: string) => {
    const line = raw.trim()
    const cmd = line.split(/\s+/)[0]
    const rest = line.slice(cmd.length).trim()
    print(line, PROMPT)
    if (line) setHistory(h => [...h, line])
    setCursor(null)
    setInput('')

    switch (cmd.toLowerCase()) {
      case '':
        return
      case 'help':
        return print(
          <div className="tty-help">
            {[
              ['whoami', 'who is this guy'],
              ['projects', 'things I built'],
              ['showcase', 'open the 3D timeline'],
              ['contact', 'ways to reach me'],
              ['resume', 'open my resume'],
              ['clear', 'clear the screen'],
              ['exit', 'close the terminal'],
            ].map(([c, d]) => (
              <div key={c}>
                <button type="button" className="tty-cmd" onClick={() => run(c)}>{c}</button>
                <span className="tty-dim">{d}</span>
              </div>
            ))}
            <div className="tty-dim tty-footnote">there are a few more. they're not important.</div>
          </div>,
        )
      case 'whoami':
        return print(
          <div>
            <div>Andrew Nguyen — Sr. Software Engineer at Coinbase, Irvine, CA.</div>
            <div className="tty-dim">Programmed stage lighting for live TV in New York, then found code.</div>
            <div className="tty-dim">Shipped at JPMorgan, AWS Wickr and Alexa; now in financial engineering at Coinbase.</div>
            <div className="tty-dim">I build tools for the people around me, and occasionally for everyone else.</div>
          </div>,
        )
      case 'projects':
      case 'ls':
        if (cmd === 'ls' && rest.includes('-a')) print(<span className="tty-dim">.  ..  .secrets</span>)
        return print(
          <div className="tty-list">
            {projects.map(p => (
              <div key={p.name}>
                {p.to
                  ? <Link to={p.to} className="tty-link" onClick={onClose}>{p.name}</Link>
                  : <a href={p.href} target="_blank" rel="noopener noreferrer" className="tty-link">{p.name}</a>}
                <span className="tty-dim">{p.blurb}</span>
              </div>
            ))}
          </div>,
        )
      case 'showcase':
        print(<span className="tty-dim">launching showcase --3d-timeline…</span>)
        window.setTimeout(() => navigate('/showcase', { state: { from: 'home-scroll' } }), 600)
        return
      case 'contact':
        return print(
          <div className="tty-list">
            <div><span className="tty-key">email</span><a href="mailto:andrewcnguyen01@gmail.com" className="tty-link">andrewcnguyen01@gmail.com</a></div>
            <div><span className="tty-key">github</span><a href="https://github.com/AndrewNguyenn" target="_blank" rel="noopener noreferrer" className="tty-link">github.com/AndrewNguyenn</a></div>
            <div><span className="tty-key">linkedin</span><a href="https://www.linkedin.com/in/andrewconannguyen/" target="_blank" rel="noopener noreferrer" className="tty-link">in/andrewconannguyen</a></div>
          </div>,
        )
      case 'resume':
        print(<span className="tty-dim">opening resume.pdf…</span>)
        window.open('/resume.pdf', '_blank', 'noopener')
        return
      case 'clear':
        return setEntries([])
      case 'exit':
        return onClose()
      // ── Not listed in help. ────────────────────────────────────────────────
      case 'sudo':
        return print('andrew is not in the sudoers file. This incident will be reported.')
      case 'rm':
        return print('absolutely not.')
      case 'hire':
        print('excellent decision. drafting the email…')
        window.setTimeout(() => { window.location.href = 'mailto:andrewcnguyen01@gmail.com?subject=Hello%20Andrew' }, 700)
        return
      case 'man':
        return print(rest.toLowerCase() === 'andrew'
          ? "No manual entry for andrew. He's figuring it out as he goes."
          : rest ? `No manual entry for ${rest}` : 'What manual page do you want?')
      case 'pwd':
        return print('/home/andrew/probably-overthinking-it')
      case 'cd':
        return print("there's nowhere to go. you're already home.")
      case 'cat':
        return print(rest === '.secrets'
          ? 'there are no secrets. just a half marathon training plan.'
          : `cat: ${rest || 'nothing'}: No such file or directory`)
      case 'git':
        return print(rest.startsWith('blame') ? "it was me. it's always me." : 'working tree clean. mostly.')
      case 'coffee':
        return print("error 418: I'm a teapot.")
      case 'vim':
      case 'vi':
        return print(<span>you're in vim now. good luck. <span className="tty-dim">(:q, apparently)</span></span>)
      case ':q':
      case ':wq':
      case ':q!':
        return print('you escaped. few do.')
      case 'bullseye':
        return print(<div><pre className="tty-pre">{TARGET}</pre><div>X-ring. obviously.</div></div>)
      case 'lights': {
        const sound = !/(^|\s)(--mute|-m)(\s|$)/.test(rest)
        if (sound) unlockAudio() // inside the keypress, so the browser allows playback
        print(<span><span className="tty-dim">standby lights{sound ? ' · sound' : ' · muted'} · cue list loaded ·</span> GO.</span>)
        window.dispatchEvent(new CustomEvent(LIGHTS_EVENT, { detail: { sound } }))
        return
      }
      case 'hi':
      case 'hello':
      case 'hey':
        return print("hi. you found the terminal. most people don't.")
      case 'ping':
        return print('pong.')
      case 'date':
        return print(new Date().toString())
      case 'echo':
        return print(rest)
      case 'history':
        return print(
          <div className="tty-list">
            {[...history, line].map((h, i) => <div key={i}><span className="tty-dim">{String(i + 1).padStart(4)}</span><span>{h}</span></div>)}
          </div>,
        )
      default:
        return print(
          <span>
            zsh: command not found: {cmd}. Try{' '}
            <button type="button" className="tty-cmd" onClick={() => run('help')}>help</button>
          </span>,
        )
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
    } else if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = cursor === null ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(i)
      setInput(history[i])
    } else if (e.key === 'ArrowDown' && cursor !== null) {
      e.preventDefault()
      const i = cursor + 1
      if (i >= history.length) { setCursor(null); setInput('') }
      else { setCursor(i); setInput(history[i]) }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = COMMANDS.filter(c => c.startsWith(input.trim().toLowerCase()))
      if (input.trim() && match.length === 1) setInput(match[0])
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setEntries([])
    }
  }

  return (
    <div className="tty" role="region" aria-label="Terminal" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="tail-bar">
        <span className="tail-lights" aria-hidden="true"><span /><span /><span /></span>
        <span className="tail-title">zsh — andrew@anduwu</span>
        <button type="button" className="tty-close" onClick={onClose}>esc</button>
      </div>
      <div className="tty-body" ref={bodyRef}>
        <div className="tty-dim">Last login: {lastLogin} on ttys001</div>
        <div className="tty-dim">
          Type <button type="button" className="tty-cmd" onClick={() => run('help')}>help</button> to see what you can do.
        </div>
        {entries.map(entry => (
          <div key={entry.id} className="tty-entry">
            {entry.prompt !== undefined
              ? <div><span className="ac">{PROMPT}</span> {entry.body}</div>
              : entry.body}
          </div>
        ))}
        <label className="tty-input-line">
          <span className="ac">{PROMPT}</span>
          <input
            ref={inputRef}
            className="tty-input"
            value={input}
            onChange={e => { setInput(e.target.value); setCursor(null) }}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </label>
      </div>
    </div>
  )
}
