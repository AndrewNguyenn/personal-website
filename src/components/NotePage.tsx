import './NotePage.css'

const content: Record<string, { title: string; date: string; body: string }> = {
  'job-application-agent': {
    title: 'Job Application Agent',
    date: 'April 2026',
    body: '',
  },
}

export default function NotePage({ slug }: { slug: string }) {
  const note = content[slug]

  if (!note) {
    return (
      <section id="note-page">
        <p>Note not found.</p>
      </section>
    )
  }

  return (
    <section id="note-page">
      <p className="note-page-date">{note.date}</p>
      <h2>{note.title}</h2>
      <div className="note-page-body">
        {note.body ? <p>{note.body}</p> : <p className="note-empty">Nothing here yet.</p>}
      </div>
    </section>
  )
}
