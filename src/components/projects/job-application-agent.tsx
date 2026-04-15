import { Link } from 'react-router-dom'
import MermaidDiagram from '../MermaidDiagram'
import type { ProjectMeta } from './index'
import '../styles/ProjectPage.css'

export const meta: ProjectMeta = {
  slug: 'job-application-agent',
  name: 'Job Application Agent',
  tagline: "An agent that handles the job search so you don't have to",
  description:
    'Applying for jobs is repetitive, draining, and mostly mechanical. This agent automates the pipeline — finding relevant postings, tailoring application materials, and tracking status — so the focus stays on the conversations that actually matter.',
  tags: ['AI Agents', 'LLM', 'Automation', 'Python'],
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

export default function JobApplicationAgent() {
  return (
    <article id="project-page">
      <Link to="/projects" className="back-link">← Projects</Link>
      <div className="project-page-header">
        <h2>Job Application Agent</h2>
        <p className="project-page-subtitle">
          An agent that searches, filters, tailors, and applies — so the only thing left is the interview.
        </p>
      </div>
      <div className="project-page-body">
        <p>
          Applying for jobs is one of those things that feels like it should take five minutes and
          somehow takes all day. You find a role, you upload your resume, and then the form asks
          you to type in everything that's already on your resume. Then there's a dropdown for
          years of experience. Then a free-text box asking why you're interested in the company.
          Then work authorization. Then demographic questions. Every. Single. Time.
        </p>
        <p>
          The workflow is so defined it's almost insulting to do manually. Find a posting that
          matches your criteria, check if you've already applied, tailor the resume slightly for
          the role, fill out the form, submit, log it somewhere so you don't apply twice. That's
          it. There's no judgment call in there — it's just execution. So I stopped doing it
          myself.
        </p>
        <p>
          Each session starts by loading the full history out of SQLite — every company, role, and
          URL already applied to — into memory. Then it searches LinkedIn across multiple role
          types and locations, deduplicating on the fly and scoring each result against criteria:
          role type, experience level, compensation midpoint. Anything that doesn't clear all three
          gets skipped without ever reading the full posting.
        </p>
        <MermaidDiagram chart={DIAGRAM_SEARCH} />
        <p>
          For each role that makes the cut, it reads the job description, copies the LaTeX master
          resume fresh, and makes targeted edits — surfacing relevant bullets, echoing the JD's
          language, adding adjacent technologies where applicable. Then compiles to PDF and checks
          the page count. If it overflows, it trims in priority order until it's one page. LinkedIn
          Easy Apply fills forms with JavaScript field introspection directly in the browser.
          External ATS platforms like Workday, Greenhouse, and Lever get a Playwright session: one
          snapshot per page, all fields in a single pass.
        </p>
        <MermaidDiagram chart={DIAGRAM_APPLY} />
        <p>
          After each application, a row goes into SQLite — company, role, URL, ATS system, salary
          range, status. At the end of the session a Pushover notification lands on my phone
          summarizing everything applied to, skipped, and why. A separate morning briefing agent
          runs daily: scans both email inboxes, matches anything job-related back to rows in the
          database, and updates statuses automatically. Interview. Rejected. Offer. Then pushes a
          summary. I don't poll for status — it comes to me.
        </p>
        <MermaidDiagram chart={DIAGRAM_TRACK} />
        <p>
          The whole point is that I'm not spending mental energy on logistics anymore. The agent
          handles the pipeline. I just prepare for the conversations.
        </p>
      </div>
    </article>
  )
}
