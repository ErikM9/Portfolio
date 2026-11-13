/* Card titles and buttons carry each project's name for screen readers, so the tests find them by name */
import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Portfolio from '../components/Portfolio'

jest.mock('react-loaders', () => ({
  __esModule: true,
  default: () => <div data-testid="loader" />,
}))

const renderPortfolio = () =>
  render(
    <MemoryRouter>
      <Portfolio />
    </MemoryRouter>
  )

const projects = [
  'Nexus',
  'Puck',
  'Nabu',
  'floodWatch',
  'Blackjack Game',
  'Colour Picker',
  'Memory Game',
  'Currency Converter',
  'Weather Dashboard',
  'Calculator',
]

describe('Portfolio', () => {
  let openSpy

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
  })

  /* Spies come off before the real timers go back, so a spy on a fake timer cannot outlive its test */
  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test('renders the Portfolio heading', () => {
    renderPortfolio()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Portfolio' })
    ).toBeInTheDocument()
  })

  test('renders the loader', () => {
    renderPortfolio()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  test('lists the ten projects in order, one level below the page heading', () => {
    renderPortfolio()
    const titles = screen.getAllByRole('heading', { level: 2 })
    expect(titles).toHaveLength(projects.length)
    projects.forEach((name, i) => {
      expect(titles[i]).toBe(screen.getByRole('heading', { level: 2, name }))
    })
  })

  test('gives every card a See on GitHub and a Live Version button', () => {
    renderPortfolio()
    screen.getAllByRole('listitem').forEach((card) => {
      const buttons = within(card).getAllByRole('button')
      expect(buttons.map((button) => button.textContent)).toEqual([
        'See on GitHub',
        'Live Version',
      ])
    })
  })

  test.each([
    [
      'Nexus',
      'https://github.com/ErikM9/Nexus',
      'https://erikm9-nexus.vercel.app/',
    ],
    [
      'Puck',
      'https://github.com/ErikM9/Puck/',
      'https://erikm9.github.io/Puck/',
    ],
    [
      'Nabu',
      'https://github.com/ErikM9/Nabu/',
      'https://erikm9.github.io/Nabu/',
    ],
    [
      'floodWatch',
      'https://github.com/ErikM9/floodWatch/',
      'https://erikm9.github.io/floodWatch/',
    ],
    [
      'Blackjack Game',
      'https://github.com/ErikM9/blackjack-app/',
      'https://erikm9.github.io/blackjack-app/',
    ],
    [
      'Colour Picker',
      'https://github.com/ErikM9/colour-picker-app/',
      'https://erikm9.github.io/colour-picker-app/',
    ],
    [
      'Memory Game',
      'https://github.com/ErikM9/memory-game-app/',
      'https://erikm9.github.io/memory-game-app/',
    ],
    [
      'Currency Converter',
      'https://github.com/ErikM9/currency-converter-app/',
      'https://erikm9.github.io/currency-converter-app/',
    ],
    [
      'Weather Dashboard',
      'https://github.com/ErikM9/weather-dashboard-app/',
      'https://erikm9.github.io/weather-dashboard-app/',
    ],
    [
      'Calculator',
      'https://github.com/ErikM9/calculator-app/',
      'https://erikm9.github.io/calculator-app/',
    ],
  ])(
    '%s has named buttons which open its repository and its live version in new tabs',
    async (title, repository, live) => {
      renderPortfolio()

      await userEvent.click(
        screen.getByRole('button', { name: `See on GitHub: ${title}` })
      )
      expect(openSpy).toHaveBeenLastCalledWith(
        repository,
        '_blank',
        'noopener,noreferrer'
      )

      await userEvent.click(
        screen.getByRole('button', { name: `Live Version: ${title}` })
      )
      expect(openSpy).toHaveBeenLastCalledWith(
        live,
        '_blank',
        'noopener,noreferrer'
      )
    }
  )

  test('renders a return to homepage link', () => {
    renderPortfolio()
    expect(
      screen.getByRole('link', { name: /return to homepage/i })
    ).toHaveAttribute('href', '/')
  })

  test('switches the title letters to hover-only after 3.5 seconds', () => {
    jest.useFakeTimers()
    renderPortfolio()
    const heading = screen.getByRole('heading', { level: 1 })
    const firstLetter = within(heading).getByText('P')
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
    const { unmount } = renderPortfolio()
    const timerCall = setTimeoutSpy.mock.calls.findIndex(
      ([, delay]) => delay === 3500
    )
    const timerId = setTimeoutSpy.mock.results[timerCall].value
    unmount()
    expect(clearTimeoutSpy).toHaveBeenCalledWith(timerId)
  })
})