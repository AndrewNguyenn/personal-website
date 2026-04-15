import { Link } from 'react-router-dom'
import { projectList } from './projects/index'
import './styles/Projects.css'

export default function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="project-list">
        {projectList.map((project) => {
          const inner = (
            <>
              <div className="project-header">
                <span className="project-name">{project.name}</span>
                {(project.url || project.component) && (
                  <svg className="project-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p className="project-tagline">{project.tagline}</p>
              <p className="project-description">{project.description}</p>
            </>
          )

          if (project.component) {
            return (
              <Link key={project.slug} to={`/projects/${project.slug}`} className="project-card">
                {inner}
              </Link>
            )
          }
          if (project.url) {
            return (
              <a key={project.slug} href={project.url} target="_blank" rel="noopener noreferrer" className="project-card">
                {inner}
              </a>
            )
          }
          return <div key={project.slug} className="project-card">{inner}</div>
        })}
      </div>
    </section>
  )
}
