import { NavLink } from 'react-router-dom'
import './styles/Header.css'

export default function Header() {
  return (
    <header>
      <NavLink to="/" className="logo">
        <img src="/logo.svg" alt="Anduwu" />
      </NavLink>
      <nav>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/reading">Currently Reading</NavLink>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
      </nav>
    </header>
  )
}
