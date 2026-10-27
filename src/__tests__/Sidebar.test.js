/* Covers the page links, the social links, the mobile menu with its keyboard handling, and the active page */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

/* Stands in for any change of page which does not come from the sidebar, such as the Back button */
const GoElsewhere = () => {
  const navigate = useNavigate()
  return <button onClick={() => navigate('/about')}>Go elsewhere</button>
}

const renderSidebar = (initialEntries = ['/']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Sidebar />
      <GoElsewhere />
    </MemoryRouter>
  )

const openMenu = () =>
  userEvent.click(screen.getByRole('button', { name: 'Open menu' }))

describe('Sidebar', () => {
  test('sits in the page header, around the navigation', () => {
    renderSidebar()
    expect(screen.getByRole('banner')).toContainElement(
      screen.getByRole('navigation')
    )
  })

  test('links Home, About and Projects to their pages', () => {
    renderSidebar()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    )
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    )
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'href',
      '/portfolio'
    )
  })

  /* The social links appear twice, in the bar and in the mobile menu */
  test('links to the LinkedIn and GitHub profiles only, in new tabs', () => {
    renderSidebar()
    const profiles = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href').startsWith('https://'))
    expect(profiles.map((link) => link.getAttribute('href'))).toEqual([
      'https://www.linkedin.com/in/erik-moldovan-399754305/',
      'https://github.com/ErikM9',
      'https://www.linkedin.com/in/erik-moldovan-399754305/',
      'https://github.com/ErikM9',
    ])
    profiles.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  test('names the profile links for screen readers', () => {
    renderSidebar()
    expect(
      screen.getAllByRole('link', { name: 'LinkedIn profile' })
    ).toHaveLength(2)
    expect(
      screen.getAllByRole('link', { name: 'GitHub profile' })
    ).toHaveLength(2)
  })

  test('starts with the mobile menu closed', () => {
    renderSidebar()
    expect(screen.getByRole('navigation')).not.toHaveClass('mobile-show')
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  test('opens the mobile menu from the menu button and moves focus to its close button', async () => {
    renderSidebar()
    await openMenu()
    expect(screen.getByRole('navigation')).toHaveClass('mobile-show')
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus()
  })

  test('closes the mobile menu from the close button and puts focus back on the menu button', async () => {
    renderSidebar()
    await openMenu()
    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    const openButton = screen.getByRole('button', { name: 'Open menu' })
    expect(screen.getByRole('navigation')).not.toHaveClass('mobile-show')
    expect(openButton).toHaveAttribute('aria-expanded', 'false')
    expect(openButton).toHaveFocus()
  })

  test('closes the mobile menu on Escape and puts focus back on the menu button', async () => {
    renderSidebar()
    await openMenu()
    await userEvent.keyboard('{Escape}')
    expect(screen.getByRole('navigation')).not.toHaveClass('mobile-show')
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  test('keeps Tab inside the open mobile menu', async () => {
    renderSidebar()
    await openMenu()
    await userEvent.tab()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus()
    await userEvent.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus()
  })

  test('brings Tab back into the open mobile menu from elsewhere on the page', async () => {
    renderSidebar()
    await openMenu()
    screen.getByRole('button', { name: 'Go elsewhere' }).focus()
    await userEvent.tab()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus()
  })

  test('leaves Tab and Escape alone while the mobile menu is closed', async () => {
    renderSidebar()
    screen.getByRole('button', { name: 'Go elsewhere' }).focus()
    await userEvent.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Go elsewhere' })).toHaveFocus()
    await userEvent.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  test('closes the mobile menu when a page link is chosen', async () => {
    renderSidebar()
    for (const name of ['Home', 'About', 'Projects']) {
      await openMenu()
      await userEvent.click(screen.getByRole('link', { name }))
      expect(screen.getByRole('navigation')).not.toHaveClass('mobile-show')
    }
  })

  test('closes the mobile menu whenever the page changes, as with the Back button', async () => {
    renderSidebar()
    await openMenu()
    await userEvent.click(screen.getByRole('button', { name: 'Go elsewhere' }))
    expect(screen.getByRole('navigation')).not.toHaveClass('mobile-show')
  })

  test('marks only the link to the current page as active', () => {
    renderSidebar(['/about'])
    expect(screen.getByRole('link', { name: 'About' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Projects' })).not.toHaveClass(
      'active'
    )
  })
})