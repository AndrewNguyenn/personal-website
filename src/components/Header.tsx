import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header>
      <NavLink to="/" className="logo">Andrew Nguyen</NavLink>
      <nav>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/reading">Currently Reading</NavLink>
      </nav>
    </header>
  )
}
