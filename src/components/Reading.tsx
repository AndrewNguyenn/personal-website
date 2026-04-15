import React from 'react'
import './styles/Reading.css'

const books = [
  {
    title: 'AI Engineering: Building Applications with Foundation Models',
    author: 'Chip Huyen',
    isbn: '1098166302',
    amazonUrl: 'https://www.amazon.com/AI-Engineering-Building-Applications-Foundation/dp/1098166302',
    thought: 'Data-intensive applications are now ingesting massive amounts of metadata from AI agents and customers alike — and feeding that back into the product loop. AI Engineering maps out exactly how to build on top of foundation models in a way that is production-ready, not just prototype-ready.',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '1449373321',
    amazonUrl: 'https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321',
    thought: 'The principles here have never been more relevant. Modern AI products are fundamentally data pipelines at scale — the same challenges of reliability, consistency, and throughput now apply to the streams of behavioral and inference data flowing through agent-driven systems.',
  },
]

export default function Reading() {
  return (
    <section id="reading">
      <h2>Currently Reading</h2>
      <p className="reading-subtitle">
        Both of these books speak to the same underlying shift: data-intensive applications are now
        ingesting enormous volumes of metadata from AI agents and customers, and that data is being
        used to continuously improve AI product engineering.
      </p>
      <div className="book-list">
        {books.map((book, i) => (
          <a
            key={book.isbn}
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="book-card"
            style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}
          >
            <img
              src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
              alt={`${book.title} cover`}
              className="book-cover"
            />
            <div className="book-info">
              <span className="book-title">{book.title}</span>
              <span className="book-author">{book.author}</span>
              <p className="book-thought">{book.thought}</p>
              <span className="book-link">View on Amazon ↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
