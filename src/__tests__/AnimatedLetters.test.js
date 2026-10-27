/* AnimatedLetters renders one classed span per character, hidden from screen readers behind the whole text */
import { render, screen } from '@testing-library/react'
import AnimatedLetters from '../components/AnimatedLetters'

const lettersIn = (container) =>
  /* eslint-disable-next-line testing-library/no-node-access -- AnimatedLetters renders only spans, which have no role to query by */
  Array.from(container.querySelectorAll('[aria-hidden="true"] > span'))

describe('AnimatedLetters', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('renders one span per character in order, spaces and punctuation included', () => {
    const strArray = ['H', 'i', ',', ' ', 'a', 'l', 'l', '!']
    const { container } = render(
      <AnimatedLetters letterClass="text-animate" strArray={strArray} idx={0} />
    )
    expect(lettersIn(container).map((span) => span.textContent)).toEqual(
      strArray
    )
  })

  test('classes each span with letterClass and a delay class counted from idx', () => {
    const { container } = render(
      <AnimatedLetters
        letterClass="text-animate"
        strArray={['H', 'e', 'y']}
        idx={10}
      />
    )
    expect(lettersIn(container).map((span) => span.className)).toEqual([
      'text-animate _10',
      'text-animate _11',
      'text-animate _12',
    ])
  })

  test('swaps the class on every span when letterClass changes', () => {
    const { container, rerender } = render(
      <AnimatedLetters
        letterClass="text-animate"
        strArray={['H', 'e', 'y']}
        idx={10}
      />
    )
    rerender(
      <AnimatedLetters
        letterClass="text-animate-hover"
        strArray={['H', 'e', 'y']}
        idx={10}
      />
    )
    expect(lettersIn(container).map((span) => span.className)).toEqual([
      'text-animate-hover _10',
      'text-animate-hover _11',
      'text-animate-hover _12',
    ])
  })

  /* Titles with spaces arrive with non-breaking spaces, which screen readers get back as plain ones */
  test('gives screen readers the whole text instead of single letters', () => {
    const nbsp = String.fromCharCode(160)
    render(
      <h1>
        <AnimatedLetters
          letterClass="text-animate"
          strArray={['H', 'i', nbsp, 'y', 'o', 'u']}
          idx={0}
        />
      </h1>
    )
    expect(screen.getByRole('heading', { name: 'Hi you' })).toBeInTheDocument()
  })

  test('renders no letters for an empty array', () => {
    const { container } = render(
      <AnimatedLetters letterClass="text-animate" strArray={[]} idx={10} />
    )
    expect(lettersIn(container)).toHaveLength(0)
  })

  /* React reports duplicate keys through console.error */
  test('gives repeated characters keys of their own', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    render(
      <AnimatedLetters
        letterClass="text-animate"
        strArray={['l', 'l', 'l']}
        idx={0}
      />
    )
    expect(consoleError).not.toHaveBeenCalled()
  })
})