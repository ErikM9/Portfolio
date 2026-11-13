/* The Sidebar is mocked so the tests cover Layout on its own */
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'

jest.mock('../components/Sidebar', () => () => <div data-testid="sidebar" />)

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Child Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

describe('Layout', () => {
  test('renders the sidebar', () => {
    renderLayout()
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  test('renders the html open tag', () => {
    renderLayout()
    expect(screen.getByText('<html>')).toBeInTheDocument()
  })

  test('renders the body open tag', () => {
    renderLayout()
    expect(screen.getByText('<body>')).toBeInTheDocument()
  })

  test('renders the body close tag', () => {
    renderLayout()
    expect(screen.getByText('</body>')).toBeInTheDocument()
  })

  test('renders the html close tag', () => {
    renderLayout()
    expect(screen.getByText('</html>')).toBeInTheDocument()
  })

  test('hides the tag decorators from screen readers', () => {
    renderLayout()
    expect(screen.getByText('<html>')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('<body>')).toHaveAttribute('aria-hidden', 'true')
    const closingTags = screen.getByText('</body>')
    expect(closingTags).toHaveAttribute('aria-hidden', 'true')
    expect(closingTags).toContainElement(screen.getByText('</html>'))
  })

  test('renders the child route through the Outlet, inside the main landmark', () => {
    renderLayout()
    expect(screen.getByRole('main')).toContainElement(
      screen.getByText('Child Content')
    )
  })
})

/* jsdom has no layout, so these tests set the window size and read the zoom Layout writes on .App */
describe('Layout zoom', () => {
  const resizeTo = (width, height) => {
    window.innerWidth = width
    window.innerHeight = height
  }

  const renderAt = (width, height) => {
    resizeTo(width, height)
    const { container, unmount } = renderLayout()
    /* eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- The zoom is written on .App, which has no role to query by */
    return { app: container.querySelector('.App'), unmount }
  }

  afterEach(() => {
    resizeTo(1024, 768)
    jest.restoreAllMocks()
  })

  test('scales a desktop screen to the 1807px reference width', () => {
    const { app } = renderAt(1500, 900)
    expect(Number(app.style.zoom)).toBeCloseTo(0.8301, 4)
    expect(app.style.getPropertyValue('--wide-scale')).toBe('')
    expect(app.style.getPropertyValue('--mobile-vh')).toBe('')
  })

  test.each([
    [1920, 650, 0.8125],
    [1366, 560, 0.7],
  ])(
    'fits a short %ix%i desktop window to the 800px reference height',
    (width, height, zoom) => {
      const { app } = renderAt(width, height)
      expect(Number(app.style.zoom)).toBeCloseTo(zoom, 4)
    }
  )

  test.each([
    [1900, 1.0515],
    [2400, 1.15],
  ])(
    'keeps a %ipx desktop at full size and scales the logo and cube by %f',
    (width, wideScale) => {
      const { app } = renderAt(width, 1200)
      expect(app.style.zoom).toBe('1')
      expect(Number(app.style.getPropertyValue('--wide-scale'))).toBeCloseTo(
        wideScale,
        4
      )
    }
  )

  test('leaves a 390x844 phone at its native scale', () => {
    const { app } = renderAt(390, 844)
    expect(app.style.zoom).toBe('')
    expect(app.style.getPropertyValue('--mobile-vh')).toBe('')
  })

  test('fits a smaller phone to the 390x844 reference', () => {
    const { app } = renderAt(360, 740)
    expect(Number(app.style.zoom)).toBeCloseTo(0.8768, 4)
    expect(app.style.getPropertyValue('--mobile-vh')).toBe('844px')
  })

  test.each([
    [820, 1180, 1.5769, '748px'],
    [820, 1100, 1.5581, '706px'],
  ])(
    'fits an %ix%i portrait tablet to the content box',
    (width, height, zoom, mobileVh) => {
      const { app } = renderAt(width, height)
      expect(Number(app.style.zoom)).toBeCloseTo(zoom, 4)
      expect(app.style.getPropertyValue('--mobile-vh')).toBe(mobileVh)
    }
  )

  test('fits a phone held sideways to its height', () => {
    const { app } = renderAt(740, 360)
    expect(Number(app.style.zoom)).toBeCloseTo(0.9231, 4)
    expect(app.style.getPropertyValue('--mobile-vh')).toBe('390px')
  })

  test('caps the zoom of a tablet held sideways at 1.6', () => {
    const { app } = renderAt(1180, 820)
    expect(app.style.zoom).toBe('1.6')
    expect(app.style.getPropertyValue('--mobile-vh')).toBe('513px')
  })

  /* The sizes come in an order which makes Layout clear every value it sets at least once */
  test('recalculates the zoom as the window is resized', () => {
    const { app } = renderAt(2400, 1200)
    const resizeAndRead = (width, height) => {
      resizeTo(width, height)
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
      return {
        zoom: app.style.zoom && Number(app.style.zoom).toFixed(4),
        wideScale: app.style.getPropertyValue('--wide-scale'),
        mobileVh: app.style.getPropertyValue('--mobile-vh'),
      }
    }
    const tablet = {
      zoom: '1.5769',
      wideScale: '',
      mobileVh: '748px',
    }

    expect(resizeAndRead(820, 1180)).toEqual(tablet)
    expect(resizeAndRead(390, 844)).toEqual({
      zoom: '',
      wideScale: '',
      mobileVh: '',
    })
    expect(resizeAndRead(820, 1180)).toEqual(tablet)
    expect(resizeAndRead(2400, 1200)).toEqual({
      zoom: '1.0000',
      wideScale: '1.15',
      mobileVh: '',
    })
    expect(resizeAndRead(1500, 900)).toEqual({
      zoom: '0.8301',
      wideScale: '',
      mobileVh: '',
    })
  })

  test('stops listening for resizes on unmount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener')
    const removeSpy = jest.spyOn(window, 'removeEventListener')
    const { unmount } = renderAt(1500, 900)
    const [, onResize] = addSpy.mock.calls.find(([type]) => type === 'resize')
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('resize', onResize)
  })
})