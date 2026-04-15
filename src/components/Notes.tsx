import { Link } from 'react-router-dom'
import './styles/Notes.css'

const notes = [
  {
    slug: 'job-application-agent',
    title: 'Job Application Agent',
    date: 'April 2026',
  },
]

export default function Notes() {
  return (
    <section id="notes">
      <h2>Notes</h2>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.slug}>
            <Link to={`/notes/${note.slug}`} className="note-row">
              <span className="note-title">{note.title}</span>
              <span className="note-date">{note.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
