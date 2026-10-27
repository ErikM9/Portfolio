/* react-loaders is mocked so the pacman animation does not run in jsdom */
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from '../components/About'

jest.mock('react-loaders', () => ({
  __esModule: true,
  default: () => <div data-testid="loader" />,
}))

const renderAbout = () =>
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  )

describe('About', () => {
  /* Spies come off before the real timers go back, so a spy on a fake timer cannot outlive its test */
  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test('renders the About me heading', () => {
    renderAbout()
    expect(
      screen.getByRole('heading', { level: 1, name: 'About me' })
    ).toBeInTheDocument()
  })

  test('renders the Contact me heading one level below it', () => {
    renderAbout()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Contact me' })
    ).toBeInTheDocument()
  })

  test('renders the professional bio paragraphs', () => {
    renderAbout()
    expect(
      screen.getByText(
        /ISTQB Certified Tester with a strong focus on JavaScript/i
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Quality first, by habit as well as training/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Recent work includes a Matrix chat client/i)
    ).toBeInTheDocument()
  })

  test('renders contact email', () => {
    renderAbout()
    expect(screen.getByText(/erikmworkm@gmail.com/i)).toBeInTheDocument()
  })

  test('renders contact location', () => {
    renderAbout()
    expect(screen.getByText(/Oxfordshire/i)).toBeInTheDocument()
  })

  /* The cube's icons are hidden from screen readers */
  test("renders the tech cube's six icons", () => {
    renderAbout()
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(6)
  })

  test('renders the loader', () => {
    renderAbout()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  test('renders a return to homepage link', () => {
    renderAbout()
    expect(
      screen.getByRole('link', { name: /return to homepage/i })
    ).toHaveAttribute('href', '/')
  })

  test('switches the letters to hover-only after 3.5 seconds', () => {
    jest.useFakeTimers()
    renderAbout()
    const firstLetter = screen.getByText('A')
    expect(firstLetter).toHaveClass('text-animate')

    act(() => {
      jest.advanceTimersByTime(3499)
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
    const { unmount } = renderAbout()
    const timerCall = setTimeoutSpy.mock.calls.findIndex(
      ([, delay]) => delay === 3500
    )
    const timerId = setTimeoutSpy.mock.results[timerCall].value
    unmount()
    expect(clearTimeoutSpy).toHaveBeenCalledWith(timerId)
  })
})