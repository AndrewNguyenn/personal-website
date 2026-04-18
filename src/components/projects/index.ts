import type { ComponentType } from 'react'
import BowPress, { meta as bowpressMeta } from './bowpress'
import JobApplicationAgent, { meta as jobMeta } from './job-application-agent'
import AlexaExpertSDK, { meta as alexaMeta } from './alexa-expert-sdk'

export interface ProjectMeta {
  slug: string
  name: string
  tagline: string
  description: string
  tags: string[]
  url?: string  // external link (no detail page)
}

export interface ProjectEntry extends ProjectMeta {
  component?: ComponentType
}

// Ordered list — drives the Projects listing page
export const projectList: ProjectEntry[] = [
  { ...bowpressMeta, component: BowPress },
  { ...jobMeta, component: JobApplicationAgent },
  { ...alexaMeta, component: AlexaExpertSDK },
  {
    slug: 'schedule-portal',
    name: 'Schedule Portal',
    tagline: 'Hospital schedule photos → Google Calendar events',
    description:
      "My girlfriend is a DTR at a children's hospital. Every week her floor posts a new schedule — different shifts, different days — and she'd take a picture of it with her phone. Then every day she'd open her camera roll just to check when she worked next. So I built a portal where she uploads the photo, and it runs through Google Cloud Vision OCR, parses out her shifts, and automatically populates a shared Google Calendar.",
    tags: ['Python', 'Google Cloud Vision', 'Google Calendar API', 'GCP', 'OAuth 2.0'],
    url: 'https://github.com/AndrewNguyenn/schedule-portal',
  },
  {
    slug: 'comfyui-on-aws',
    name: 'ComfyUI on AWS',
    tagline: 'One-command cloud workstation for image generation',
    description:
      "I wanted to explore image generation but don't have the local hardware to run these models. So I built a CDK package that spins up the full infrastructure with a single command — giving you workstation-grade GPU power in the cloud without any manual setup. It includes model persistence via an EFS file system so your models survive instance restarts, and a built-in file browser to view and manage everything you've generated.",
    tags: ['AWS CDK', 'Python', 'ComfyUI', 'EFS', 'GPU'],
    url: 'https://github.com/AndrewNguyenn/aws-deployment-of-comfyui',
  },
]

// Slug → entry lookup for ProjectPage
export const projectsBySlug = Object.fromEntries(
  projectList.map(p => [p.slug, p])
)
