import { useLayoutEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/'
import './index.scss'

/* Zooming .App fits every screen to a reference layout, 1807x800 on desktop and 390x844 on phones */
const REFERENCE_WIDTH = 1807
const REFERENCE_HEIGHT = 800 /* The About page, the tallest, fits this height with room for its decorators */
const MOBILE_BREAKPOINT = 1201
const MOBILE_REF_WIDTH = 390
const MOBILE_REF_HEIGHT = 844
const LANDSCAPE_MAX_ZOOM = 1.6
const WIDE_SCALE_CAP = 1.15
/* Portrait tablets and foldables past this effective width fit to the content box, so the page fills both axes without pillarboxing */
const WIDE_EFF_THRESHOLD = 540
const WIDE_REF_WIDTH = 520 /* Matches the greeting's width plus its hanging <h1>/</h1> decorators */
const WIDE_REF_HEIGHT = 706 /* Keeps the page from overflowing vertically on the shortest tablets */

const Layout = () => {
  const appRef = useRef(null)

  useLayoutEffect(() => {
    const el = appRef.current
    if (!el) return

    const applyZoom = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      if (w >= MOBILE_BREAKPOINT) {
        el.style.zoom = String(
          Math.min(w / REFERENCE_WIDTH, h / REFERENCE_HEIGHT, 1)
        )
        el.style.removeProperty('--mobile-vh')
        el.classList.remove('eff-wide')
        if (w > REFERENCE_WIDTH) {
          el.style.setProperty(
            '--wide-scale',
            String(Math.min(w / REFERENCE_WIDTH, WIDE_SCALE_CAP))
          )
        } else {
          el.style.removeProperty('--wide-scale')
        }
        return
      }

      el.style.removeProperty('--wide-scale')

      /* Fits the page inside the phone reference */
      const baseZoom =
        h >= w
          ? Math.min(w / MOBILE_REF_WIDTH, h / MOBILE_REF_HEIGHT)
          : Math.min(
              w / MOBILE_REF_WIDTH,
              h / MOBILE_REF_WIDTH,
              LANDSCAPE_MAX_ZOOM
            )

      /* Portrait screens far wider than a phone use the content-box reference, so the page fills the viewport */
      const isWide = h >= w && w / baseZoom >= WIDE_EFF_THRESHOLD
      const zoom = isWide
        ? Math.min(w / WIDE_REF_WIDTH, h / WIDE_REF_HEIGHT)
        : baseZoom

      el.classList.toggle('eff-wide', isWide)

      if (Math.abs(zoom - 1) < 0.001) {
        /* Reference-sized phones stay at native scale */
        el.style.zoom = ''
        el.style.removeProperty('--mobile-vh')
      } else {
        el.style.zoom = String(zoom)
        /* --mobile-vh carries the true viewport height since viewport units are unreliable inside a zoomed element */
        el.style.setProperty('--mobile-vh', `${Math.round(h / zoom)}px`)
      }
    }

    applyZoom()
    window.addEventListener('resize', applyZoom)
    return () => window.removeEventListener('resize', applyZoom)
  }, [])

  return (
    <div className="App" ref={appRef}>
      <Sidebar />
      <main className="page">
        <span className="tags top-tag-html" aria-hidden="true">
          &lt;html&gt;
        </span>
        <span className="tags top-tags" aria-hidden="true">
          &lt;body&gt;
        </span>
        <Outlet />
        <span className="tags bottom-tags" aria-hidden="true">
          &lt;/body&gt;
          <br />
          <span className="bottom-tag-html">&lt;/html&gt;</span>
        </span>
      </main>
    </div>
  )
}

export default Layout