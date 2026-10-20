import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            }
          />
          <Route path="/product/:slug" element={<ProductPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
