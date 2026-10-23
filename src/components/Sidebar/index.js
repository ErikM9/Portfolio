import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faHome,
  faAddressBook,
  faBriefcase,
  faBars,
  faClose,
} from '@fortawesome/free-solid-svg-icons'
import { NavLink, useLocation } from 'react-router-dom'
import './index.scss'

const Sidebar = () => {
  const [showNav, setShowNav] = useState(false)
  const navRef = useRef(null)
  const openButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const { pathname } = useLocation()

  /* Any change of page, the browser's Back button included, closes the mobile menu */
  useEffect(() => {
    setShowNav(false)
  }, [pathname])

  /* The open menu focuses its close button, keeps Tab inside and closes on Escape, handing focus back to the menu button */
  useEffect(() => {
    if (!showNav) return
    const openButton = openButtonRef.current
    closeButtonRef.current.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowNav(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = navRef.current.querySelectorAll('a, button')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!navRef.current.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      openButton.focus()
    }
  }, [showNav])

  /* The social links render twice, in the desktop bottom strip and in the mobile overlay */
  const socialLinks = (
    <ul>
      <li>
        <a
          href="https://www.linkedin.com/in/erik-moldovan-399754305/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
        >
          <FontAwesomeIcon
            icon={faLinkedin}
            color="#4a6080"
            className="anchor-icon"
          />
        </a>
      </li>
      <li>
        <a
          href="https://github.com/ErikM9"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
        >
          <FontAwesomeIcon
            icon={faGithub}
            color="#4a6080"
            className="anchor-icon"
          />
        </a>
      </li>
    </ul>
  )

  return (
    <header className="nav-bar">
      <nav className={showNav ? 'mobile-show' : ''} ref={navRef}>
        <NavLink
          to="/"
          aria-label="Home"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faHome} color="#4a6080" />
        </NavLink>

        <NavLink
          to="/about"
          aria-label="About"
          className={({ isActive }) =>
            isActive ? 'active about-link' : 'about-link'
          }
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faAddressBook} color="#4a6080" />
        </NavLink>

        <NavLink
          to="/portfolio"
          aria-label="Projects"
          className={({ isActive }) =>
            isActive ? 'active portfolio-link' : 'portfolio-link'
          }
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faBriefcase} color="#4a6080" />
        </NavLink>

        {/* These social icons show in the mobile overlay only */}
        <div className="mobile-social">{socialLinks}</div>

        <button
          type="button"
          className="close-icon"
          aria-label="Close menu"
          ref={closeButtonRef}
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faClose} color="#00d4ff" size="3x" />
        </button>
      </nav>

      {socialLinks}

      <button
        type="button"
        className="hamburger-icon"
        aria-label="Open menu"
        aria-expanded={showNav}
        ref={openButtonRef}
        onClick={() => setShowNav(true)}
      >
        <FontAwesomeIcon icon={faBars} color="#00d4ff" size="3x" />
      </button>
    </header>
  )
}

export default Sidebar