import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Layout from './components/Layout'
import Portfolio from './components/Portfolio'
import './App.scss'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        {/* Any other address leads back to the home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App