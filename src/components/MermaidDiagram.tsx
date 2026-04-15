import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import './MermaidDiagram.css'

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'base',
  flowchart: {
    useMaxWidth: false,
    htmlLabels: false,
    padding: 20,
  },
  themeVariables: {
    primaryColor: '#f0ebe0',
    primaryTextColor: '#2e1f0e',
    primaryBorderColor: '#c4692a',
    lineColor: '#c4692a',
    secondaryColor: '#f5f0e8',
    tertiaryColor: '#f5f0e8',
    edgeLabelBackground: '#f9fafb',
    fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
    fontSize: '14px',
    nodeBorder: '#c4692a',
    clusterBkg: '#f5f0e8',
  },
})

interface Props {
  chart: string
}

export default function MermaidDiagram({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const id = `mermaid-${Math.random().toString(36).slice(2)}`

    document.fonts.ready.then(() => mermaid.render(id, chart)).then(({ svg }) => {
      if (!ref.current) return
      ref.current.innerHTML = svg

      const svgEl = ref.current.querySelector('svg')
      if (!svgEl) return

      svgEl.removeAttribute('height')
      svgEl.removeAttribute('width')
      svgEl.style.overflow = 'visible'

      requestAnimationFrame(() => {
        // Fix foreignObject dimensions — Mermaid measures before fonts load so
        // nodes are too narrow and multi-line nodes are too short.
        svgEl.querySelectorAll<SVGForeignObjectElement>('.label foreignObject').forEach(fo => {
          const labelG = fo.closest<SVGGElement>('.label')
          if (!labelG) return

          // Snapshot original state before touching anything
          const origW = parseFloat(fo.getAttribute('width') ?? '0')
          const origH = parseFloat(fo.getAttribute('height') ?? '0')
          const t = labelG.getAttribute('transform') ?? ''
          const m = t.match(/translate\(\s*([^,)]+),\s*([^)]+)\)/)
          if (!m) return
          const origX = parseFloat(m[1])
          const origY = parseFloat(m[2])
          // Mermaid positions the label group so foreignObject is centered on the node.
          // Recover that center point before we resize anything.
          const centerX = origX + origW / 2
          const centerY = origY + origH / 2

          const innerDiv = fo.querySelector<HTMLElement>('div')
          if (!innerDiv) return

          // Unconstrain the foreignObject so the inner div can report its true size
          fo.setAttribute('width', '1000')
          fo.setAttribute('height', '1000')
          const contentW = innerDiv.scrollWidth
          const contentH = innerDiv.scrollHeight

          const newW = contentW + 8   // small horizontal breathing room
          const newH = Math.max(origH, contentH + 4)
          fo.setAttribute('width', String(newW))
          fo.setAttribute('height', String(newH))

          // Re-center the label group on the original node-center point
          const newX = centerX - newW / 2
          const newY = centerY - newH / 2
          labelG.setAttribute('transform', `translate(${newX}, ${newY})`)
        })

        // Recalculate viewBox from actual content bounding box
        const g = svgEl.querySelector<SVGGElement>(':scope > g')
        if (!g) return

        const transform = g.getAttribute('transform') ?? ''
        const match = transform.match(/translate\(\s*([^,)]+)(?:,\s*([^)]+))?\)/)
        const tx = match ? parseFloat(match[1]) : 0
        const ty = match ? parseFloat(match[2] ?? '0') : 0

        const bbox = g.getBBox()
        if (bbox.width === 0) return

        const pad = 16
        svgEl.setAttribute('viewBox', `${bbox.x + tx - pad} ${bbox.y + ty - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`)
        svgEl.style.width = '100%'
        svgEl.style.height = 'auto'
      })
    })
  }, [chart])

  return <div className="mermaid-wrap" ref={ref} />
}
