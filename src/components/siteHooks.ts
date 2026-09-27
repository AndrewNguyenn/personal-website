import { useEffect, type RefObject } from 'react'

// Fired by the terminal's `lights` command; EasterEggs dims the house.
export const LIGHTS_EVENT = 'anduwu:lights'
// Fired by the light show as each cue starts; detail is the cue label.
export const CUE_EVENT = 'anduwu:cue'

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Adds .is-in to every .reveal inside root as it scrolls into view.
export function useReveal(root: RefObject<HTMLElement | null>) {
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
  }, [root])
}
