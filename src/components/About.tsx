import './styles/About.css'
import avatar from '/avatar.png'

export default function About() {
  return (
    <section id="about">
      <div className="avatar-stage">
        <div className="avatar-name">Andrew Nguyen</div>
        <img src={avatar} alt="Andrew" className="avatar" />
        <div className="avatar-shelf" />
      </div>
      <div className="about-body">
        <p>
          Software engineer, six years in, currently building agents at Alexa.
          A friend handed me an AI engineering book and it unlocked a world of possibilities.
          Now I spend most of my time thinking about how to build the infrastructure that
          makes AI agents actually do what you want them to do. Always learning.
        </p>
      </div>
    </section>
  )
}
