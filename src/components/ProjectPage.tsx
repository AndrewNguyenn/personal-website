import { useParams, Link } from 'react-router-dom'
import { projectsBySlug } from './projects/index'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = projectsBySlug[slug ?? '']

  if (!project?.component) {
    return (
      <article id="project-page">
        <Link to="/projects" className="back-link">← Projects</Link>
        <p>Project not found.</p>
      </article>
    )
  }

  const Component = project.component
  return <Component />
}
