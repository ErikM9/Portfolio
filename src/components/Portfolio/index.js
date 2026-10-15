import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import { Link } from 'react-router-dom'
import './index.scss'

const Portfolio = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  /* Each entry is one card, and liveLabel sets its second button's text */
  const cardData = [
    {
      title: 'Nexus',
      description:
        'An E2E-encrypted Matrix client with device verification, file uploads and reactions. Built with Next.js, TypeScript and Tailwind CSS.',
      github: 'https://github.com/ErikM9/Nexus',
      live: 'https://erikm9-nexus.vercel.app/',
      liveLabel: 'Live Version',
    },
    {
      title: 'Puck',
      description:
        'A flashcard learning app designed to help users with studying through a variety of games. Built with Vite, React, TypeScript and MongoDB.',
      github: 'https://github.com/ErikM9/Puck',
      live: 'https://erikm9.github.io/Puck/',
      liveLabel: 'Live Version',
    },
    {
      title: 'Nabu',
      description:
        'Transcribes speech and translates to 200+ languages offline via WebAssembly. Built with Vite, React and Transformers.js.',
      github: 'https://github.com/ErikM9/Nabu',
      live: 'https://erikm9.github.io/Nabu/',
      liveLabel: 'Live Version',
    },
    {
      title: 'floodWatch',
      description:
        'An app which alerts users about floods in their area using location data. Built with Vite, React, TypeScript, and Tailwind CSS.',
      github: '',
      live: 'https://',
      liveLabel: 'Live Version',
    },
    {
      title: 'Blackjack Game',
      description:
        'A fantasy Blackjack game with jQuery animations, score tracking and win/loss/draw animations. Built with HTML, CSS and JavaScript.',
      github: 'https://github.com/ErikM9/blackjack-app/',
      live: 'https://erikm9.github.io/blackjack-app/',
      liveLabel: 'Live Version',
    },
    {
      title: 'Colour Picker',
      description:
        'A simple colour picker which displays HEX, RGB and HSL values and allows users to copy them. Built with HTML, CSS and JavaScript.',
      github: 'https://github.com/ErikM9/colour-picker-app/',
      live: 'https://erikm9.github.io/colour-picker-app/',
      liveLabel: 'Live Version',
    },
    {
      title: 'Memory Game',
      description:
        'A light-hearted animated card matching game with a smooth UI and a fun victory animation. Built with HTML, CSS and JavaScript.',
      github: 'https://github.com/ErikM9/memory-game-app/',
      live: 'https://erikm9.github.io/memory-game-app/',
      liveLabel: 'Live Version',
    },
    {
      title: 'Currency Converter',
      description:
        'A live currency converter app which uses real-time exchange rates fetched from a reliable API. Built with HTML, CSS and JavaScript.',
      github: 'https://github.com/ErikM9/currency-converter-app/',
      live: 'https://erikm9.github.io/currency-converter-app/',
      liveLabel: 'Live Version',
    },
    {
      title: 'Weather Dashboard',
      description:
        'A weather app with city search, autocomplete and geolocation. Pulls live weather via API. Built with HTML, CSS and JavaScript.',
      github: 'https://github.com/ErikM9/weather-dashboard-app/',
      live: 'https://erikm9.github.io/weather-dashboard-app/',
      liveLabel: 'Live Version',
    },
    {
      title: 'Calculator',
      description:
        'A calculator with correct operator precedence via the shunting-yard algorithm. Built with HTML, CSS and JavaScript.',
      github: 'https://github.com/ErikM9/calculator-app/',
      live: 'https://erikm9.github.io/calculator-app/',
      liveLabel: 'Live Version',
    },
  ]

  const renderButtonCards = () => (
    <ul className="code-list button-card-container">
      {cardData.map((item, i) => (
        <li className="button-card" key={item.title}>
          <div className="card-left">
            <h2 className="card-title">
              <AnimatedLetters
                letterClass={letterClass}
                strArray={item.title
                  .split('')
                  .map((c) => (c === ' ' ? '\u00A0' : c))}
                idx={40 + i * 4}
              />
            </h2>
            <div className="card-description fancy-description">
              {item.description}
            </div>
          </div>
          <div className="card-buttons">
            {/* An empty github url still renders the button, which then does nothing */}
            <button
              className="card-btn"
              aria-label={`See on GitHub: ${item.title}`}
              onClick={() =>
                item.github &&
                window.open(item.github, '_blank', 'noopener,noreferrer')
              }
            >
              See on GitHub
            </button>
            {item.live && (
              <button
                className="card-btn"
                aria-label={`${item.liveLabel}: ${item.title}`}
                onClick={() =>
                  window.open(item.live, '_blank', 'noopener,noreferrer')
                }
              >
                {item.liveLabel}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <div className="container portfolio-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Portfolio'.split('')}
              idx={15}
            />
          </h1>
          {renderButtonCards()}
          <Link to="/" className="flat-button">
            Return to homepage
          </Link>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Portfolio