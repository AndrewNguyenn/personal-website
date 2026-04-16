import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
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

function AnimatedRoutes() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [stage, setStage] = useState<'in' | 'out'>('in')

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage('out')
    }
  }, [location.pathname])

  return (
    <div
      className={`page-${stage}`}
      onAnimationEnd={() => {
        if (stage === 'out') {
          setDisplayLocation(location)
          setStage('in')
        }
      }}
    >
      <Routes location={displayLocation}>
        <Route path="/" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:slug" element={<NotePageWrapper />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
