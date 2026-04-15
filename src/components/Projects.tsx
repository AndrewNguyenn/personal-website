import { Link } from 'react-router-dom'
import './Projects.css'

const projects = [
  {
    name: 'Job Application Agent',
    tagline: 'An agent that handles the job search so you don\'t have to',
    description:
      'Applying for jobs is repetitive, draining, and mostly mechanical. This agent automates the pipeline — finding relevant postings, tailoring application materials, and tracking status — so the focus stays on the conversations that actually matter.',
    tags: ['AI Agents', 'LLM', 'Automation', 'Python'],
    url: '',
    internalUrl: '/projects/job-application-agent',
  },
  {
    name: 'Alexa Expert SDK & Developer Platform',
    tagline: 'Natural-language SDK for third-party services to integrate with Alexa',
    description:
      'Built on the Alexa Developer AI tech team, this work spanned two layers: an SDK that let third-party partners — like Thumbtack and TaskRabbit — onboard their services as Alexa skills, enabling Alexa to navigate their websites in natural language and make reservation requests on behalf of customers; and a developer platform that gave the broader Alexa expert teams CDK libraries, shared service infrastructure, and documented patterns to accelerate how quickly new experts could be built and deployed.',
    tags: ['Alexa', 'AWS CDK', 'NLP', 'SDK', 'Java'],
    url: '',
    internalUrl: '/projects/alexa-expert-sdk',
  },
  {
    name: 'ComfyUI on AWS',
    tagline: 'One-command cloud workstation for image generation',
    description:
      "I wanted to explore image generation but don't have the local hardware to run these models. So I built a CDK package that spins up the full infrastructure with a single command — giving you workstation-grade GPU power in the cloud without any manual setup. It includes model persistence via an EFS file system so your models survive instance restarts, and a built-in file browser to view and manage everything you've generated.",
    tags: ['AWS CDK', 'Python', 'ComfyUI', 'EFS', 'GPU'],
    url: 'https://github.com/AndrewNguyenn/aws-deployment-of-comfyui',
    internalUrl: '',
  },
]

export default function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="project-list">
        {projects.map((project) => {
          const inner = (
            <>
              <div className="project-header">
                <span className="project-name">{project.name}</span>
                {(project.url || project.internalUrl) && (
                  <svg className="project-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p className="project-tagline">{project.tagline}</p>
              <p className="project-description">{project.description}</p>
            </>
          )

          if (project.internalUrl) {
            return <Link key={project.name} to={project.internalUrl} className="project-card">{inner}</Link>
          }
          if (project.url) {
            return <a key={project.name} href={project.url} target="_blank" rel="noopener noreferrer" className="project-card">{inner}</a>
          }
          return <div key={project.name} className="project-card">{inner}</div>
        })}
      </div>
    </section>
  )
}
