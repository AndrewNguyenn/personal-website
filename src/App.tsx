import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Projects from './components/Projects'
import Reading from './components/Reading'
import Notes from './components/Notes'
import NotePage from './components/NotePage'
import ProjectPage from './components/ProjectPage'

function NotePageWrapper() {
  const { slug } = useParams<{ slug: string }>()
  return <NotePage slug={slug ?? ''} />
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:slug" element={<NotePageWrapper />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
