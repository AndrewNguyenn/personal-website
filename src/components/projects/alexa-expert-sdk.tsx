import { Link } from 'react-router-dom'
import type { ProjectMeta } from './index'
import '../styles/ProjectPage.css'

export const meta: ProjectMeta = {
  slug: 'alexa-expert-sdk',
  name: 'Alexa Expert SDK & Developer Platform',
  tagline: 'Natural-language SDK for third-party services to integrate with Alexa',
  description:
    'Built on the Alexa Developer AI tech team, this work spanned two layers: an SDK that let third-party partners — like Thumbtack and TaskRabbit — onboard their services as Alexa skills, enabling Alexa to navigate their websites in natural language and make reservation requests on behalf of customers; and a developer platform that gave the broader Alexa expert teams CDK libraries, shared service infrastructure, and documented patterns to accelerate how quickly new experts could be built and deployed.',
  tags: ['Alexa', 'AWS CDK', 'NLP', 'SDK', 'Java'],
}

export default function AlexaExpertSDK() {
  return (
    <article id="project-page">
      <Link to="/projects" className="back-link">← Projects</Link>
      <div className="project-page-header">
        <h2>Alexa Expert SDK & Developer Platform</h2>
        <p className="project-page-subtitle">Natural-language SDK for third-party services to integrate with Alexa</p>
      </div>
      <div className="project-page-body">
        <p>
          The premise was straightforward: a customer asks Alexa to book a handyman, and Alexa
          handles everything — finding a provider, navigating the booking flow, and confirming the
          reservation — without the customer ever leaving the conversation. Getting there required
          building the infrastructure that made it possible for third-party services to participate.
        </p>
        <p>
          On the Developer AI tech team, I built the SDK that allowed external partners to onboard
          their services as Alexa skills with natural language. Partners like Thumbtack and
          TaskRabbit could register their service endpoints and define how Alexa should interact
          with their platform. From there, Alexa could navigate their websites in natural language
          — interpreting available slots, surfacing options to the customer, and submitting
          reservation requests on their behalf. The challenge was making that navigation general
          enough to work across structurally different partner surfaces while keeping the
          integration lightweight for the partner side.
        </p>
        <p>
          The second piece was a developer platform built for the Alexa expert teams internally.
          Creating a new expert — a domain-specific skill — required solving the same
          infrastructure problems every time: service scaffolding, deployment pipelines, data
          access patterns, monitoring. The platform consolidated those into CDK libraries and
          reusable service templates, so teams could start from a working foundation instead of
          rebuilding it. Part of the work was understanding what the different expert teams
          actually needed: sitting with them, identifying where they were duplicating effort, and
          encoding the right abstractions without over-engineering the common case.
        </p>
        <p>
          The two workstreams were connected by the same underlying goal — reduce the surface area
          between an idea for an Alexa capability and a working integration. For external partners,
          that meant an SDK that handled the complexity of natural-language navigation. For
          internal teams, that meant a platform that handled the complexity of standing up a new
          expert. Both were about making the path to production shorter.
        </p>
      </div>
    </article>
  )
}
