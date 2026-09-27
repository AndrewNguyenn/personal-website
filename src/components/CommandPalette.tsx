import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Entry =
  | { group: 'Sections'; key: string; label: string; section: string }
  | { group: 'Pages'; key: string; label: string; route: string }
  | { group: 'Elsewhere'; key: string; label: string; href: string }

const entries: Entry[] = [
  { group: 'Sections',  key: '↑',  label: 'In progress',     section: 'now' },
  { group: 'Sections',  key: '01', label: 'Work timeline',   section: 'work' },
  { group: 'Sections',  key: '02', label: 'Projects',        section: 'projects' },
  { group: 'Sections',  key: '03', label: 'Contact',         section: 'contact' },
  { group: 'Pages',     key: '3d', label: 'Showcase',        route: '/showcase' },
  { group: 'Elsewhere', key: 'gh', label: 'GitHub',          href: 'https://github.com/AndrewNguyenn' },
  { group: 'Elsewhere', key: 'in', label: 'LinkedIn',        href: 'https://www.linkedin.com/in/andrewconannguyen/' },
  { group: 'Elsewhere', key: '@',  label: 'Email Andrew',    href: 'mailto:andrewcnguyen01@gmail.com' },
]

export default function CommandPalette({ onClose, onJump }: { onClose: () => void; onJump: (id: string) => void }) {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()

  const run = (entry: Entry) => {
    onClose()
    if ('section' in entry) onJump(entry.section)
    else if ('route' in entry) navigate(entry.route)
    else window.open(entry.href, entry.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => (a + 1) % entries.length) }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => (a - 1 + entries.length) % entries.length) }
      else if (e.key === 'Enter')     { e.preventDefault(); run(entries[active]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="pal-root">
      <button type="button" className="pal-scrim" aria-label="Close command palette" onClick={onClose} />
      <div className="pal" role="dialog" aria-label="Jump to">
        <div className="pal-input">
          <span className="ac">&gt;</span><span className="pal-placeholder">jump to…</span><span className="caret" />
          <button type="button" className="kbtn pal-esc" onClick={onClose}>esc</button>
        </div>
        <div className="pal-list">
          {entries.map((entry, i) => (
            <div key={entry.label}>
              {(i === 0 || entries[i - 1].group !== entry.group) && <span className="pal-group">{entry.group.toUpperCase()}</span>}
              <button
                type="button"
                className={`pal-item${i === active ? ' pal-item--active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => run(entry)}
              >
                <span className="pal-key">{entry.key}</span>
                <span className="pal-label">{entry.label}</span>
                <span className="pal-go">{'href' in entry ? '↗' : '↵'}</span>
              </button>
            </div>
          ))}
        </div>
        <div className="pal-foot"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div>
      </div>
    </div>
  )
}
