import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Showcase from './components/Showcase'
import Projects from './components/Projects'
import Reading from './components/Reading'
import Notes from './components/Notes'
import NotePage from './components/NotePage'
import ProjectPage from './components/ProjectPage'
import EasterEggs from './components/EasterEggs'
import NotFound from './components/NotFound'

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
        <Route path="/" element={<Home />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:slug" element={<NotePageWrapper />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

// Pages not yet redesigned keep the old header and footer; every other page
// (home, showcase, project details, 404) brings its own.
const isLegacyPage = (pathname: string) =>
  ['/projects', '/reading', '/notes'].includes(pathname) || pathname.startsWith('/notes/')

function Shell() {
  const { pathname } = useLocation()
  const bare = !isLegacyPage(pathname)
  return (
    <>
      {!bare && <Header />}
      <main className={bare ? 'main-bare' : undefined}>
        <AnimatedRoutes />
      </main>
      {!bare && <Footer />}
      <EasterEggs />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}

export default App
