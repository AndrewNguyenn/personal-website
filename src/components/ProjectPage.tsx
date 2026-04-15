import { useParams, Link } from 'react-router-dom'
import MermaidDiagram from './MermaidDiagram'
import './ProjectPage.css'

type Block =
  | { type: 'p'; text: string }
  | { type: 'diagram'; chart: string }

interface ProjectContent {
  title: string
  subtitle: string
  blocks: Block[]
}

const DIAGRAM_SEARCH = `
flowchart LR
    A([Session Start]) --> B[Load SQLite\\ndedup + session log]
    B --> C[Search LinkedIn\\nby role & location]
    C --> D{Seen before?}
    D -- Yes --> C
    D -- No --> E{Role · Level\\nComp match?}
    E -- No --> C
    E -- Yes --> F([Candidate list])
`

const DIAGRAM_APPLY = `
flowchart LR
    A([Candidate]) --> B[Read JD]
    B --> C[Copy LaTeX\\nmaster resume]
    C --> D[Tailor bullets\\n& skills to JD]
    D --> E[Compile PDF\\nverify 1 page]
    E --> F{Apply track?}
    F -- Easy Apply --> G[JS form fill\\nin browser]
    F -- External ATS --> H[Playwright\\nWorkday · Greenhouse · Lever]
    G --> I([Applied])
    H --> I
`

const DIAGRAM_TRACK = `
flowchart LR
    A([Applied]) --> B[Write row\\nto SQLite]
    B --> C([Pushover\\nsummary to phone])

    D([Morning briefing]) --> E[Scan both inboxes]
    E --> F[Match emails\\nto DB rows]
    F --> G[Update status\\nInterview · Rejected · Offer]
    G --> H([Push notification\\nto phone])
`

const projects: Record<string, ProjectContent> = {
  'alexa-expert-sdk': {
    title: 'Alexa Expert SDK & Developer Platform',
    subtitle: 'Natural-language SDK for third-party services to integrate with Alexa',
    blocks: [
      {
        type: 'p',
        text: "The premise was straightforward: a customer asks Alexa to book a handyman, and Alexa handles everything — finding a provider, navigating the booking flow, and confirming the reservation — without the customer ever leaving the conversation. Getting there required building the infrastructure that made it possible for third-party services to participate.",
      },
      {
        type: 'p',
        text: "On the Developer AI tech team, I built the SDK that allowed external partners to onboard their services as Alexa skills with natural language. Partners like Thumbtack and TaskRabbit could register their service endpoints and define how Alexa should interact with their platform. From there, Alexa could navigate their websites in natural language — interpreting available slots, surfacing options to the customer, and submitting reservation requests on their behalf. The challenge was making that navigation general enough to work across structurally different partner surfaces while keeping the integration lightweight for the partner side.",
      },
      {
        type: 'p',
        text: "The second piece was a developer platform built for the Alexa expert teams internally. Creating a new expert — a domain-specific skill — required solving the same infrastructure problems every time: service scaffolding, deployment pipelines, data access patterns, monitoring. The platform consolidated those into CDK libraries and reusable service templates, so teams could start from a working foundation instead of rebuilding it. Part of the work was understanding what the different expert teams actually needed: sitting with them, identifying where they were duplicating effort, and encoding the right abstractions without over-engineering the common case.",
      },
      {
        type: 'p',
        text: "The two workstreams were connected by the same underlying goal — reduce the surface area between an idea for an Alexa capability and a working integration. For external partners, that meant an SDK that handled the complexity of natural-language navigation. For internal teams, that meant a platform that handled the complexity of standing up a new expert. Both were about making the path to production shorter.",
      },
    ],
  },
  'job-application-agent': {
    title: 'Job Application Agent',
    subtitle: 'An agent that searches, filters, tailors, and applies — so the only thing left is the interview.',
    blocks: [
      {
        type: 'p',
        text: "Applying for jobs is one of those things that feels like it should take five minutes and somehow takes all day. You find a role, you upload your resume, and then the form asks you to type in everything that's already on your resume. Then there's a dropdown for years of experience. Then a free-text box asking why you're interested in the company. Then work authorization. Then demographic questions. Every. Single. Time.",
      },
      {
        type: 'p',
        text: "The workflow is so defined it's almost insulting to do manually. Find a posting that matches your criteria, check if you've already applied, tailor the resume slightly for the role, fill out the form, submit, log it somewhere so you don't apply twice. That's it. There's no judgment call in there — it's just execution. So I stopped doing it myself.",
      },
      {
        type: 'p',
        text: "Each session starts by loading the full history out of SQLite — every company, role, and URL already applied to — into memory. Then it searches LinkedIn across multiple role types and locations, deduplicating on the fly and scoring each result against criteria: role type, experience level, compensation midpoint. Anything that doesn't clear all three gets skipped without ever reading the full posting.",
      },
      {
        type: 'diagram',
        chart: DIAGRAM_SEARCH,
      },
      {
        type: 'p',
        text: "For each role that makes the cut, it reads the job description, copies the LaTeX master resume fresh, and makes targeted edits — surfacing relevant bullets, echoing the JD's language, adding adjacent technologies where applicable. Then compiles to PDF and checks the page count. If it overflows, it trims in priority order until it's one page. LinkedIn Easy Apply fills forms with JavaScript field introspection directly in the browser. External ATS platforms like Workday, Greenhouse, and Lever get a Playwright session: one snapshot per page, all fields in a single pass.",
      },
      {
        type: 'diagram',
        chart: DIAGRAM_APPLY,
      },
      {
        type: 'p',
        text: "After each application, a row goes into SQLite — company, role, URL, ATS system, salary range, status. At the end of the session a Pushover notification lands on my phone summarizing everything applied to, skipped, and why. A separate morning briefing agent runs daily: scans both email inboxes, matches anything job-related back to rows in the database, and updates statuses automatically. Interview. Rejected. Offer. Then pushes a summary. I don't poll for status — it comes to me.",
      },
      {
        type: 'diagram',
        chart: DIAGRAM_TRACK,
      },
      {
        type: 'p',
        text: "The whole point is that I'm not spending mental energy on logistics anymore. The agent handles the pipeline. I just prepare for the conversations.",
      },
    ],
  },
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects[slug ?? '']

  if (!project) {
    return (
      <article id="project-page">
        <Link to="/projects" className="back-link">← Projects</Link>
        <p>Project not found.</p>
      </article>
    )
  }

  return (
    <article id="project-page">
      <Link to="/projects" className="back-link">← Projects</Link>
      <div className="project-page-header">
        <h2>{project.title}</h2>
        <p className="project-page-subtitle">{project.subtitle}</p>
      </div>
      <div className="project-page-body">
        {project.blocks.map((block, i) =>
          block.type === 'diagram'
            ? <MermaidDiagram key={i} chart={block.chart} />
            : <p key={i}>{block.text}</p>
        )}
      </div>
    </article>
  )
}
