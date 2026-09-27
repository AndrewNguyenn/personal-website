import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './styles/BuildFeed.css'

const Status = {
  Building:     'building',
  Shipped:      'shipped',
  Learning:     'learning',
  Ideating:     'ideating',
  InProgress:   'in-progress',
  Training:     'training',
  Failed:       'failed',
  Retrying:     'retrying',
  Deploying:    'deploying',
  Passed:       'passed',
  SigningOffer: 'signing-offer',
} as const

type Status = typeof Status[keyof typeof Status]

type Activity = { name: string; status: Status; ships?: true; deploys?: true }
type Item     = {
  id:          number
  name:        string
  status:      Status
  time:        string
  isPending:   boolean
  isNew:       boolean
  isShipping:  boolean
  isFailing:   boolean
  isRetrying:  boolean
  isDeploying: boolean
  isPassing:   boolean
}

const activities: Activity[] = [
  { name: 'AI Engineering',                  status: Status.Learning  },
  { name: 'Job Application Agent',           status: Status.Building,   ships: true },
  { name: 'Model Post Training Pipeline',    status: Status.Building,   ships: true },
  { name: 'Interviewing',                    status: Status.InProgress },
  { name: 'AWS Wickr Console',               status: Status.Building,   ships: true },
  { name: 'BowPress',                        status: Status.Building,   deploys: true },
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

const MAX      = 5
const SLIDE_MS = 360
const blankFlags = { isPending: false, isNew: false, isShipping: false, isFailing: false, isRetrying: false, isDeploying: false, isPassing: false }

// ── Module-level persistent state ─────────────────────────────────────────────
// Survives component unmount/remount so the feed never resets on navigation.

const clock = () => new Date().toTimeString().slice(0, 8)

let moduleItems: Item[] = activities.slice(0, MAX).map((a, i) => ({
  id: i, name: a.name, status: a.status, time: clock(), ...blankFlags,
}))
let moduleNextId  = 10
let moduleNextIdx = MAX

const subscribers = new Set<() => void>()

function updateItems(updater: (prev: Item[]) => Item[]) {
  moduleItems = updater(moduleItems)
  subscribers.forEach(fn => fn())
}

function tick() {
  const id       = moduleNextId++
  const activity = activities[moduleNextIdx % activities.length]
  moduleNextIdx++

  // Phase 1: add invisible placeholder so existing rows FLIP-slide down
  updateItems(prev => [
    { id, name: activity.name, status: activity.status, time: clock(), ...blankFlags, isPending: true },
    ...prev,
  ].slice(0, MAX))

  // Phase 2: after slide finishes, bubble the new item in
  setTimeout(() => {
    updateItems(prev => prev.map(item => item.id === id ? { ...item, isPending: false, isNew: true } : item))
    setTimeout(() => {
      updateItems(prev => prev.map(item => item.id === id ? { ...item, isNew: false } : item))
    }, 500)
  }, 200)

  if (activity.deploys) {
    const deployDelay = 1500 + Math.random() * 2500
    setTimeout(() => {
      updateItems(prev => prev.map(item => item.id === id ? { ...item, status: Status.Deploying, isDeploying: true } : item))
      setTimeout(() => {
        updateItems(prev => prev.map(item => item.id === id ? { ...item, isDeploying: false } : item))
      }, 700)
    }, deployDelay)
  }

  if (activity.ships) {
    const shipDelay = 800 + Math.random() * 8000
    setTimeout(() => {
      updateItems(prev => prev.map(item => item.id === id ? { ...item, status: Status.Shipped, isShipping: true } : item))
      setTimeout(() => {
        updateItems(prev => prev.map(item => item.id === id ? { ...item, isShipping: false } : item))
      }, 700)
    }, shipDelay)
  }

  if (activity.name === 'Interviewing' && Math.random() < 0.99) {
    setTimeout(() => {
      updateItems(prev => prev.map(item => item.id === id ? { ...item, status: Status.Passed, isPassing: true } : item))
      setTimeout(() => {
        updateItems(prev => prev.map(item => item.id === id ? { ...item, isPassing: false } : item))
      }, 700)
      setTimeout(() => {
        updateItems(prev => prev.map(item => item.id === id ? { ...item, status: Status.SigningOffer, isRetrying: true } : item))
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

export default function BuildFeed({ id }: { id?: string }) {
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
    <div id={id} className="tail">
      <div className="tail-bar">
        <span className="tail-lights" aria-hidden="true"><span /><span /><span /></span>
        <span className="tail-title">tail -f ~/in-progress.log</span>
        <span className="tail-live"><span className="now-dot" />live</span>
      </div>
      <div className="tail-body">
        {items.map((item) => {
          const done = item.status === Status.Shipped || item.status === Status.Passed
          const flash = item.isShipping || item.isPassing || item.isDeploying || item.isRetrying
          return (
            <div
              key={item.id}
              ref={(el) => {
                if (el) rowRefs.current.set(item.id, el)
                else    rowRefs.current.delete(item.id)
              }}
              className={[
                'tail-row',
                item.isPending ? 'tail-row--pending' : '',
                item.isNew     ? 'tail-row--new'     : '',
              ].filter(Boolean).join(' ')}
            >
              <span className="tail-time">{item.time}</span>
              <span className="tail-name">{item.name}</span>
              <span className={`tail-badge tail-badge--${done ? 'done' : 'active'}${flash ? ' tail-badge--pop' : ''}`}>
                {done
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6.5L4.8 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : <span className="spinner" />}
                {formatStatus(item.status)}
              </span>
            </div>
          )
        })}
      </div>
      <div className="tail-prompt"><span className="ac">andrew@anduwu</span>&nbsp;~ %<span className="caret" /></div>
    </div>
  )
}
