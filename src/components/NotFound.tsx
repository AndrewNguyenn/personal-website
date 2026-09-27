import { Link, useLocation } from 'react-router-dom'
import { Atmosphere } from './Site'
import './styles/Site.css'

// 404, as a terminal error.
export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <div className="site not-found">
      <Atmosphere />
      <header className="site-nav">
        <Link to="/" className="site-logo mono">anduwu</Link>
      </header>
      <section className="nf-body">
        <span className="eyebrow mono ac">404</span>
        <h1>Nothing here. <span className="serif ac">Probably never was.</span></h1>
        <div className="term nf-term">
          <div className="tail-bar">
            <span className="tail-lights" aria-hidden="true"><span /><span /><span /></span>
            <span className="tail-title">zsh</span>
          </div>
          <div className="term-body mono">
            <div className="term-line"><span className="ac">andrew@anduwu</span> ~ % <span className="term-cmd">cd {pathname}</span></div>
            <div className="term-line">zsh: no such file or directory: {pathname}</div>
            <div className="term-line"><span className="ac">andrew@anduwu</span> ~ %<span className="caret" /></div>
          </div>
        </div>
        <div className="nf-links">
          <Link to="/" className="btn-p mono">take me home</Link>
          <Link to="/showcase" className="btn-s mono">open the showcase</Link>
        </div>
      </section>
    </div>
  )
}
