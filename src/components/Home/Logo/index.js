import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import LogoEM from '../../../assets/images/logo.png'
import './index.scss'

const Logo = () => {
  const bgRef = useRef()
  const solidLogoRef = useRef()
  const gearRef = useRef()

  useEffect(() => {
    /* GSAP fades in the container, then the gear, then the logo image */
    gsap.to(bgRef.current, {
      duration: 1,
      opacity: 1,
    })

    gsap.fromTo(
      gearRef.current,
      { opacity: 0 },
      { opacity: 1, delay: 4, duration: 2 }
    )

    gsap.fromTo(
      solidLogoRef.current,
      { opacity: 0 },
      { opacity: 1, delay: 5, duration: 4 }
    )
  }, [])

  return (
    <>
      {/* The gear sits outside the logo container, so it is positioned from the headline */}
      <div className="gear" ref={gearRef}>
        <div className="gear-rotate"></div>
      </div>

      <div className="logo-container" ref={bgRef}>
        <img
          className="solid-logo"
          ref={solidLogoRef}
          src={LogoEM}
          alt="Erik Moldovan logo"
          loading="lazy"
        />
      </div>
    </>
  )
}

export default Logo