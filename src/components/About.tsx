import './About.css'
import avatar from '/avatar.png'

export default function About() {
  return (
    <section id="about">
      <div className="avatar-stage">
        <img src={avatar} alt="Andrew" className="avatar" />
        <div className="avatar-shelf" />
      </div>
      <div className="about-body">
        <p>
          Software engineer, six years in, no CS degree — just figured it out as I went.
          A friend at Anthropic handed me an AI engineering book and it kind of broke my brain in a
          good way. Now I spend most of my time thinking about how to build the infrastructure that
          makes AI agents actually do what you want them to do. Still figuring it out, honestly.
        </p>
      </div>
    </section>
  )
}
