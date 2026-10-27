import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import { Link } from 'react-router-dom'
import TechCube from '../TechCube'
import './index.scss'

const About = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="container about-page">
        <div className="text-zone">
          {/* Screen readers get each heading as words, while the animated letters are hidden from them */}
          <h1>
            <span className="visually-hidden">About me</span>
            <span aria-hidden="true">
              <span className={letterClass}>A</span>
              <span className={`${letterClass} _12`}>b</span>
              <span className={`${letterClass} _13`}>o</span>
              <span className={`${letterClass} _14`}>u</span>
              <span className={`${letterClass} _15`}>t</span>
              <span className={`${letterClass} _16`}>&nbsp;</span>
              <span className={`${letterClass} _17`}>m</span>
              <span className={`${letterClass} _18`}>e</span>
            </span>
          </h1>

          <div className="about-text">
            <p>
              ISTQB Certified Tester with a strong focus on JavaScript and its
              ecosystem. Comfortable across the full stack, from React and
              TypeScript front ends to Node.js, Express and Koa back ends, with
              databases including MongoDB and relational SQL.
            </p>

            <p>
              Quality first, by habit as well as training: every project ships
              with a test suite spanning unit, integration and end-to-end
              coverage, built with tools like Jest, Vitest, Playwright, Cypress
              and Testing Library.
            </p>

            <p>
              Recent work includes a Matrix chat client with end-to-end
              encryption and an offline speech translator that runs models
              directly in the browser. Most of what I build ships with a test
              suite and documentation to match.
            </p>
          </div>

          {/* An h2 in the page outline, drawn like the h1 through the h1 class */}
          <h2 className="h1">
            <span className="visually-hidden">Contact me</span>
            <span aria-hidden="true">
              <span className={letterClass}>C</span>
              <span className={`${letterClass} _12`}>o</span>
              <span className={`${letterClass} _13`}>n</span>
              <span className={`${letterClass} _14`}>t</span>
              <span className={`${letterClass} _15`}>a</span>
              <span className={`${letterClass} _16`}>c</span>
              <span className={`${letterClass} _17`}>t</span>
              <span className={`${letterClass} _18`}>&nbsp;</span>
              <span className={`${letterClass} _19`}>m</span>
              <span className={`${letterClass} _20`}>e</span>
            </span>
          </h2>

          <div className="contact-text">
            <p>Email: erikmworkm@gmail.com</p>
            <p>Location: Abingdon, Oxfordshire, United Kingdom</p>
          </div>

          <Link to="/" className="flat-button">
            Return to homepage
          </Link>
        </div>

        <TechCube />
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default About