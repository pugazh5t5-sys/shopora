import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import InfoPage from './pages/InfoPage'
import NotFoundPage from './pages/NotFoundPage'
import { getProductBySlug } from './data/products'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const location = useLocation()
  useEffect(() => {
    const match = location.pathname.match(/^\/product\/([^/]+)$/)
    const product = match ? getProductBySlug(match[1]) : null
    const titles = { '/': 'Shopora — Compare Listed Product Prices in India', '/about': 'About Shopora', '/privacy': 'Privacy Information — Shopora', '/terms': 'Terms of Use — Shopora' }
    document.title = product ? product.name + ' Price Comparison | Shopora' : (titles[location.pathname] || 'Page Not Found | Shopora')
  }, [location.pathname])
  return <>
    <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
    <main><Routes>
      <Route path="/" element={<HomePage searchQuery={searchQuery} onSearchChange={setSearchQuery} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/about" element={<InfoPage page="about" />} />
      <Route path="/privacy" element={<InfoPage page="privacy" />} />
      <Route path="/terms" element={<InfoPage page="terms" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes></main>
    <Footer onCategoryChange={setActiveCategory} />
  </>
}

export default App
