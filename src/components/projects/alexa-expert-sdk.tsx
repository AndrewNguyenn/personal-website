import { Link } from 'react-router-dom'
import MermaidDiagram from '../MermaidDiagram'
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

const DIAGRAM_ROUTING = `
flowchart LR
    A([Customer]) --> B[Alexa NLU\nhome services intent]
    B --> C{Route to\nexpert?}
    C -- Home Services --> D([Home Services Agent\nlong-running workflow])
`

const DIAGRAM_AGENT = `
flowchart LR
    A([Session start]) --> B[Account linking\n& customer context]
    B --> C[API Gateway\npartner lookup]
    C --> D[Navigate partner\nwebsite]
    D --> E[Submit booking\nrequest]
    E --> F([Persist\nworkflow state])
`

const DIAGRAM_OUTCOME = `
flowchart LR
    A([Workflow state]) --> B{Booking\noutcome?}
    B -- Confirmed --> C([Async notify:\nbooking confirmed])
    B -- Needs action --> D[Pending\ncustomer action]
    D --> E([Async notify:\naction required])
`

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
          The premise was straightforward: a customer asks Alexa to book a plumber, and Alexa
          handles everything — finding a provider, navigating the booking flow, and confirming the
          reservation — without the customer ever leaving the conversation. Getting there required
          building the infrastructure that made it possible for third-party services to participate.
          When a home services intent comes in, Alexa's NLU layer routes it to the Home Services
          Agent — a long-running workflow that takes over from there.
        </p>
        <MermaidDiagram chart={DIAGRAM_ROUTING} />
        <p>
          The agent starts by checking the customer's account linking state and loading their
          metadata: prior requests, preferences, and whether they have an established relationship
          with a specific provider. That context shapes what happens next. It queries an API
          gateway to find the right third-party partner — a home services marketplace like
          Thumbtack or TaskRabbit — then navigates that partner's website on the customer's behalf,
          finds availability, and submits the booking request.
        </p>
        <MermaidDiagram chart={DIAGRAM_AGENT} />
        <p>
          The response is asynchronous. Once the booking resolves, the agent persists the workflow
          state and pushes a notification back through Alexa. If the booking is confirmed, the
          customer gets a summary. If something needs their attention — the requested time isn't
          available, the provider needs more information — the workflow moves into a pending state
          and the notification tells them exactly what action is needed. The conversation doesn't
          end at the first response; it stays open until the job is actually scheduled.
        </p>
        <MermaidDiagram chart={DIAGRAM_OUTCOME} />
        <p>
          On the Developer AI tech team, I built the SDK that made this pattern possible for
          external partners. Partners like Thumbtack and TaskRabbit could register their service
          endpoints and define how Alexa should interact with their platform. From there, Alexa
          could navigate their websites in natural language — interpreting available slots,
          surfacing options to the customer, and submitting reservation requests on their behalf.
          The challenge was making that navigation general enough to work across structurally
          different partner surfaces while keeping the integration lightweight for the partner side.
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
