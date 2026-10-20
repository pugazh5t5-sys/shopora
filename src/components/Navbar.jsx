import { Link, useNavigate } from 'react-router-dom'

function Navbar({ searchQuery, onSearchChange, activeCategory, onCategoryChange }) {
  const navigate = useNavigate()
  const categories = ['All', 'Smartphones', 'Headphones', 'Laptops']

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/')
    }
  }

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" aria-label="Shopora Home">
          <span className="navbar-logo-icon" aria-hidden="true">S</span>
          <span>Shopora</span>
        </Link>

        <div className="navbar-search">
          <input
            type="search"
            placeholder="Search smartphones, headphones, laptops…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search products"
          />
          <span className="navbar-search-icon" aria-hidden="true">🔍</span>
        </div>

        <nav className="navbar-pills" aria-label="Categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => { onCategoryChange(cat); navigate('/') }}
              aria-pressed={activeCategory === cat}
            >
              <span>{cat}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
