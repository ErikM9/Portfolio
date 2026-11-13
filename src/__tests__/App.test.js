/* The pages and Layout are stubbed, so the tests check only which page the router renders for each path */
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

jest.mock('../components/Home', () => () => <div>Home Page</div>)
jest.mock('../components/About', () => () => <div>About Page</div>)
jest.mock('../components/Portfolio', () => () => <div>Portfolio Page</div>)
jest.mock('../components/Layout', () => {
  const { Outlet } = require('react-router-dom')
  return () => (
    <div>
      <nav>Layout</nav>
      <Outlet />
    </div>
  )
})

const renderWithRouter = (initialEntry = '/') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>
  )

describe('App routing', () => {
  test('renders Home at /', () => {
    renderWithRouter('/')
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  test('renders About at /about', () => {
    renderWithRouter('/about')
    expect(screen.getByText('About Page')).toBeInTheDocument()
  })

  test('renders Portfolio at /portfolio', () => {
    renderWithRouter('/portfolio')
    expect(screen.getByText('Portfolio Page')).toBeInTheDocument()
  })

  test('sends any other path to Home', () => {
    renderWithRouter('/projects')
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })
})