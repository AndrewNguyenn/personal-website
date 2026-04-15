import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './styles/BuildFeed.css'

const Status = {
  Building:   'building',
  Shipped:    'shipped',
  Learning:   'learning',
  Ideating:   'ideating',
  InProgress: 'in-progress',
  Training:   'training',
  Failed:     'failed',
  Retrying:   'retrying',
} as const

type Status = typeof Status[keyof typeof Status]

type Activity = { name: string; status: Status; ships?: true }
type Item     = {
  id:         number
  name:       string
  status:     Status
  isNew:      boolean
  isShipping: boolean
  isFailing:  boolean
  isRetrying: boolean
}

const activities: Activity[] = [
  { name: 'AI Engineering',                  status: Status.Learning  },
  { name: 'Job Application Agent',           status: Status.Building,   ships: true },
  { name: 'Model Post Training Pipeline',    status: Status.Building,   ships: true },
  { name: 'Interviewing',                    status: Status.InProgress },
  { name: 'AWS Wickr Console',               status: Status.Building,   ships: true },
  { name: 'Distributed Inference',           status: Status.Learning  },
  { name: 'Context Engineering',             status: Status.Learning  },
  { name: 'Image Processing Pipeline',       status: Status.Building,   ships: true },
  { name: 'AI Productivity Acceleration',    status: Status.Ideating  },
  { name: 'Agent Self-Healing',              status: Status.Ideating,   ships: true },
  { name: 'ComfyUI on AWS',                  status: Status.Building,   ships: true },
  { name: 'Designing Data-intensive Systems',status: Status.Learning  },
  { name: 'Half Marathon',                   status: Status.Training  },
  { name: 'Agent Platform',                  status: Status.Building,   ships: true },
  { name: 'Strands Agent SDK',               status: Status.Learning  },
  { name: 'Alexa Expert SDK',                status: Status.Building,   ships: true },
  { name: 'AWS Wickr Billing Service',       status: Status.Building,   ships: true },
  { name: 'Long-running Workflow Execution', status: Status.Learning  },
  { name: 'Job Scheduler',                   status: Status.Building,   ships: true },
]

const formatStatus = (s: Status) =>
  s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

const MAX      = 3
const SLIDE_MS = 360
const blankFlags = { isNew: false, isShipping: false, isFailing: false, isRetrying: false }

// ── Module-level persistent state ─────────────────────────────────────────────
// Survives component unmount/remount so the feed never resets on navigation.

let moduleItems: Item[] = activities.slice(0, 3).map((a, i) => ({
  id: i, name: a.name, status: a.status, ...blankFlags,
}))
let moduleNextId  = 10
let moduleNextIdx = 3

const subscribers = new Set<() => void>()

function updateItems(updater: (prev: Item[]) => Item[]) {
  moduleItems = updater(moduleItems)
  subscribers.forEach(fn => fn())
}

function tick() {
  const id       = moduleNextId++
  const activity = activities[moduleNextIdx % activities.length]
  moduleNextIdx++

  updateItems(prev => [
    { id, name: activity.name, status: activity.status, ...blankFlags, isNew: true },
    ...prev,
  ].slice(0, MAX))

  setTimeout(() => {
    updateItems(prev => prev.map(item => item.id === id ? { ...item, isNew: false } : item))
  }, SLIDE_MS + 20)

  if (activity.ships) {
    setTimeout(() => {
      updateItems(prev => prev.map(item => item.id === id ? { ...item, status: Status.Shipped, isShipping: true } : item))
      setTimeout(() => {
        updateItems(prev => prev.map(item => item.id === id ? { ...item, isShipping: false } : item))
      }, 700)
    }, 1800)
  }

  if (activity.name === 'Interviewing' && Math.random() < 0.95) {
    setTimeout(() => {
      updateItems(prev => prev.map(item => item.id === id ? { ...item, status: Status.Failed, isFailing: true } : item))
      setTimeout(() => {
        updateItems(prev => prev.map(item => item.id === id ? { ...item, isFailing: false } : item))
      }, 700)
      setTimeout(() => {
        updateItems(prev => prev.map(item => item.id === id ? { ...item, status: Status.Retrying, isRetrying: true } : item))
        setTimeout(() => {
          updateItems(prev => prev.map(item => item.id === id ? { ...item, isRetrying: false } : item))
        }, 700)
      }, 2500)
    }, 2000)
  }
}

// Start the ticker once at module load — keeps running across navigations.
setInterval(tick, 3200)

// ── Component ──────────────────────────────────────────────────────────────────

export default function BuildFeed() {
  const [items, setItems] = useState<Item[]>(() => moduleItems)

  const rowRefs   = useRef<Map<number, HTMLDivElement>>(new Map())
  const snapshots = useRef<Map<number, number> | null>(null)

  // Subscribe to module-level updates, capturing FLIP snapshots before each render.
  useEffect(() => {
    const handler = () => {
      const positions = new Map<number, number>()
      rowRefs.current.forEach((el, id) => {
        positions.set(id, el.getBoundingClientRect().top)
      })
      snapshots.current = positions
      setItems(moduleItems)
    }
    subscribers.add(handler)
    return () => { subscribers.delete(handler) }
  }, [])

  // FLIP: slide existing rows down after a new item is prepended.
  useLayoutEffect(() => {
    if (!snapshots.current) return
    const before = snapshots.current
    snapshots.current = null

    rowRefs.current.forEach((el, id) => {
      const oldTop = before.get(id)
      if (oldTop === undefined) return
      const delta = oldTop - el.getBoundingClientRect().top
      if (delta === 0) return

      el.style.transition = 'none'
      el.style.transform  = `translateY(${delta}px)`
      void el.offsetHeight
      el.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
      el.style.transform  = ''
      el.addEventListener('transitionend', () => { el.style.transition = '' }, { once: true })
    })
  }, [items])

  return (
    <section id="build-feed">
      <div className="feed-header">
        <h2>In Progress</h2>
        <p className="feed-subtitle">Something's always happening...</p>
      </div>
      <div className="feed-panel">
        {items.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) rowRefs.current.set(item.id, el)
              else    rowRefs.current.delete(item.id)
            }}
            className={[
              'feed-row',
              item.status !== Status.Shipped && item.status !== Status.Failed ? 'feed-row--active' : '',
              item.status === Status.Failed ? 'feed-row--failed' : '',
              item.isNew      ? 'feed-row--new'      : '',
              item.isShipping ? 'feed-row--shipping'  : '',
              item.isFailing  ? 'feed-row--failing'   : '',
              item.isRetrying ? 'feed-row--retrying'  : '',
            ].filter(Boolean).join(' ')}
          >
            <span className="feed-name">{item.name}</span>
            <span className={`feed-badge feed-badge--${
              item.status === Status.Shipped ? 'shipped' :
              item.status === Status.Failed  ? 'retrying' :
              'active'
            }`}>
              {item.status === Status.Shipped
                ? <><span className="feed-check">✓</span>Shipped</>
                : item.status === Status.Failed
                  ? <><span className="feed-x">✕</span>Failed</>
                  : <><span className="feed-spinner" />{formatStatus(item.status)}</>
              }
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
