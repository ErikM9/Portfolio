import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import TechCube from '../TechCube'
import Logo from './Logo'
import './index.scss'

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const nameArray = [
    ' ',
    'E',
    'r',
    'i',
    'k',
    ' ',
    'M',
    'o',
    'l',
    'd',
    'o',
    'v',
    'a',
    'n',
    ',',
  ]
  const jobArray = [
    'S',
    'o',
    'f',
    't',
    'w',
    'a',
    'r',
    'e',
    ' ',
    'P',
    'r',
    'o',
    'f',
    'e',
    's',
    's',
    'i',
    'o',
    'n',
    'a',
    'l',
    '.',
  ]

  useEffect(() => {
    /* Switches to hover-only once the entrance finishes */
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 5500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="container home-page">
        <div className="text-zone">
          <h1>
            {/* Screen readers get the greeting as one sentence, while the animated letters are hidden from them */}
            <span className="visually-hidden">
              Hi, I'm Erik Moldovan, Software Professional.
            </span>
            <span aria-hidden="true">
              <span className={letterClass}>H</span>
              <span className={`${letterClass} _12`}>i</span>
              <span className={`${letterClass} _12`}>,</span>
              <br />
              <span className={`${letterClass} _13`}>I</span>
              <span className={`${letterClass} _14`}>'</span>
              <span className={`${letterClass} _14`}>m</span>
              <AnimatedLetters
                letterClass={letterClass}
                strArray={nameArray}
                idx={15}
              />
              <br />
              <AnimatedLetters
                letterClass={letterClass}
                strArray={jobArray}
                idx={22}
              />
            </span>
          </h1>
          <h2>
            Writing Code, Testing Quality &amp; Shipping Reliable Software — End
            to End
          </h2>

          <Link to="/about" className="flat-button">
            Let's get in touch
          </Link>

          <Link to="/portfolio" className="flat-button">
            Check out my projects
          </Link>
        </div>

        {/* The cube is hidden on desktop and shown on mobile in place of the logo */}
        <TechCube />
        <Logo />
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Home