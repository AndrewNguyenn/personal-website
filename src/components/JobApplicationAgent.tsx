import { Link } from 'react-router-dom'
import './JobApplicationAgent.css'

export default function JobApplicationAgent() {
  return (
    <article id="job-agent">
      <Link to="/projects" className="back-link">← Projects</Link>

      <header className="agent-header">
        <p className="agent-date">April 2026</p>
        <h2>Job Application Agent</h2>
        <p className="agent-subtitle">
          An agent that searches, filters, tailors, and applies — so the only thing
          left to do is show up to the interview.
        </p>
      </header>

      <div className="agent-body">

        <h3>Why</h3>
        <p>
          Job searching is mostly logistics. Find a posting, decide if it's worth applying, tweak
          a resume, fill out the same form for the hundredth time. None of that is the hard part —
          the hard part is the conversation once you get in the room. The agent handles everything
          before that.
        </p>

        <h3>What It Does</h3>
        <p>
          Each session the agent runs a set of targeted searches across job boards, filters results
          against a defined criteria set, tailors a resume for each match, submits the application,
          and logs everything to a local SQLite database. At the end it sends a push notification
          summarizing what it applied to, what it skipped, and why.
        </p>
        <p>
          A separate morning briefing agent runs daily: it scans both email inboxes for application
          updates, maps them back to rows in the database, updates statuses, and pushes a summary
          to my phone — interviews, rejections, calendar events, and anything that needs a response.
          No polling. It comes to me.
        </p>

        <h3>Search Criteria</h3>
        <p>
          The agent targets a defined set of role types — Software Engineer, AI Engineer, Platform
          Engineer, Backend Engineer — at mid to late-stage companies with 200+ employees. Machine
          learning and data roles are explicitly excluded; so are companies already in the interview
          loop.
        </p>
        <p>
          Experience level is weighted 70/30 toward mid-level over senior, with explicit rules
          for when a Senior title is acceptable (smaller company, reads like an inflated mid-level
          JD) and when to skip it (8+ years required, architect-level expectations, team
          management). Staff roles are skipped by default with narrow exceptions.
        </p>
        <p>
          Compensation uses midpoint logic — a $140K–$180K range has a midpoint of $160K, so it
          qualifies. A role is only skipped if the top of the range falls below the target, not the
          floor. If no comp is listed, it applies anyway and lets the process determine fit.
        </p>

        <h3>Staying Under Context Budget</h3>
        <p>
          The expensive part of running an agent across dozens of job listings in a single session
          is context growth. Two things prevent bloat:
        </p>
        <p>
          First, the dedup set is loaded once at session start — a full snapshot of every
          company/role/URL already in the database — and held in working memory. No mid-session
          re-queries. Any listing that matches is skipped immediately without reading the full
          posting.
        </p>
        <p>
          Second, search results are extracted with a tight JS snippet that pulls only three
          fields per listing — title, company, URL — and discards everything else. Full page
          content is only read for listings that clear the dedup filter.
        </p>

        <h3>Resume Tailoring</h3>
        <p>
          Every application gets a role-specific resume compiled from a LaTeX master. The agent
          copies the master fresh each time — never building on a previous tailored version, since
          drift compounds. It makes light, targeted edits: surfacing the most relevant bullets
          first, echoing the JD's language where the meaning stays the same, and adding adjacent
          technologies from the job description only where they're genuinely applicable.
        </p>
        <p>
          After compiling, it checks the page count. If the output is more than one page, it trims
          in priority order — least relevant bullets from older roles first — and recompiles until
          it fits. The Amazon role is untouched unless there's no other option.
        </p>

        <h3>Two-Track Application</h3>
        <p>
          LinkedIn Easy Apply stays within the browser — fast form filling via JavaScript field
          introspection, one verification screenshot per page. External ATS platforms (Workday,
          Greenhouse, Lever) get a Playwright session: one snapshot per form page, all fields
          filled in a single pass, resume uploaded via file chooser. The rule is to never
          screenshot to discover fields — always introspect the DOM first, then fill.
        </p>

        <h3>The Database</h3>
        <p>
          SQLite at the center. Every application — applied or skipped — gets a row with company,
          role, URL, ATS system, salary range if listed, status, and notes. The morning briefing
          agent reads the same database to match incoming emails to existing rows and update
          statuses: <code>Applied → Interview → Offer</code> or <code>Rejected</code>. The session
          log table tracks what each run did so the next session has context without re-reading
          prior conversations.
        </p>

        <h3>Morning Briefing</h3>
        <p>
          Each morning the briefing agent scans both inboxes, cross-references anything
          job-related against the database, updates statuses, checks the day's calendar for
          interviews or deadlines, and sends a push notification to my phone. The format is a
          concise summary — what's on the calendar, what moved in the pipeline, what needs a
          response. If something urgent arrives mid-day, a follow-up notification gets pushed
          immediately. I don't check the database or my inbox for job status; the status comes to
          me.
        </p>

        <h3>Result</h3>
        <p>
          The logistics are handled. The only job left is preparing for the conversations — which
          is the part that actually matters.
        </p>

      </div>
    </article>
  )
}
