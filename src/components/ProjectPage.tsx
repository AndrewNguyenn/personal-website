import { useParams } from 'react-router-dom'
import { projectsBySlug } from './projects/index'
import NotFound from './NotFound'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = projectsBySlug[slug ?? '']

  if (!project?.component) return <NotFound />

  const Component = project.component
  return <Component />
}
