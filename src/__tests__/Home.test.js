/* react-loaders and Logo are mocked so the tests run without the loader animation, the logo image or GSAP */
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../components/Home'

jest.mock('react-loaders', () => ({
  __esModule: true,
  default: () => <div data-testid="loader" />,
}))

jest.mock('../components/Home/Logo', () => () => <div data-testid="logo" />)

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

describe('Home', () => {
  /* Spies come off before the real timers go back, so a spy on a fake timer cannot outlive its test */
  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test('renders the greeting as the page heading, with the full name and title', () => {
    renderHome()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: "Hi, I'm Erik Moldovan, ISTQB Certified Tester.",
      })
    ).toBeInTheDocument()
  })

  test('renders the subheading', () => {
    renderHome()
    expect(
      screen.getByText(
        'Designing Tests, Finding Bugs & Shipping Reliable Software — End to End'
      )
    ).toBeInTheDocument()
  })

  test('renders the get in touch CTA link', () => {
    renderHome()
    expect(
      screen.getByRole('link', { name: /let's get in touch/i })
    ).toHaveAttribute('href', '/about')
  })

  test('renders the portfolio CTA link', () => {
    renderHome()
    expect(
      screen.getByRole('link', { name: /check out my projects/i })
    ).toHaveAttribute('href', '/portfolio')
  })

  test('renders the logo', () => {
    renderHome()
    expect(screen.getByTestId('logo')).toBeInTheDocument()
  })

  test('renders the loader', () => {
    renderHome()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  /* The cube is always rendered, as CSS decides where it shows, and its icons are hidden from screen readers */
  test("renders the tech cube's six icons", () => {
    renderHome()
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(6)
  })

  /* The last letter starts at 4.4s and bounces for a second, so the switch waits until 5.5s */
  test('switches the letters to hover-only after 5.5 seconds', () => {
    jest.useFakeTimers()
    renderHome()
    const firstLetter = screen.getByText('H')
    expect(firstLetter).toHaveClass('text-animate')

    act(() => {
      jest.advanceTimersByTime(5499)
    })
    expect(firstLetter).toHaveClass('text-animate')

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(firstLetter).toHaveClass('text-animate-hover')
    expect(firstLetter).not.toHaveClass('text-animate')
  })

  test('clears its timeout on unmount', () => {
    jest.useFakeTimers()
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const { unmount } = renderHome()
    const timerCall = setTimeoutSpy.mock.calls.findIndex(
      ([, delay]) => delay === 5500
    )
    const timerId = setTimeoutSpy.mock.results[timerCall].value
    unmount()
    expect(clearTimeoutSpy).toHaveBeenCalledWith(timerId)
  })
})