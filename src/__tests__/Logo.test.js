/* GSAP is mocked so the tests assert the animation schedule without running it */
import { render, screen } from '@testing-library/react'
import gsap from 'gsap'
import Logo from '../components/Home/Logo'

jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    to: jest.fn(),
    fromTo: jest.fn(),
  },
}))

describe('Logo', () => {
  test('renders the logo image with descriptive alt text', () => {
    render(<Logo />)
    expect(
      screen.getByRole('img', { name: 'Erik Moldovan logo' })
    ).toBeInTheDocument()
  })

  test('loads the image lazily, so phones which hide it never download it', () => {
    render(<Logo />)
    expect(
      screen.getByRole('img', { name: 'Erik Moldovan logo' })
    ).toHaveAttribute('loading', 'lazy')
  })

  test('renders the gear element', () => {
    const { container } = render(<Logo />)
    /* eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- The gear is decorative, so it has no role to query by */
    expect(container.querySelector('.gear .gear-rotate')).toBeInTheDocument()
  })

  test('fades the container in on mount', () => {
    render(<Logo />)
    expect(gsap.to).toHaveBeenCalledTimes(1)
    expect(gsap.to).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ duration: 1, opacity: 1 })
    )
  })

  test('schedules the gear fade-in at 4 seconds', () => {
    render(<Logo />)
    expect(gsap.fromTo).toHaveBeenCalledWith(
      expect.anything(),
      { opacity: 0 },
      expect.objectContaining({ opacity: 1, delay: 4, duration: 2 })
    )
  })

  test('schedules the logo fade-in at 5 seconds', () => {
    render(<Logo />)
    expect(gsap.fromTo).toHaveBeenCalledWith(
      expect.anything(),
      { opacity: 0 },
      expect.objectContaining({ opacity: 1, delay: 5, duration: 4 })
    )
  })
})