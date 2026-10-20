import { useMemo } from 'react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

const categories = ['All', 'Smartphones', 'Headphones', 'Laptops']

const featuredCategories = [
  { key: 'Smartphones', label: 'Smartphones', blurb: 'iPhone, Samsung, OnePlus — compare flagship prices', icon: '📱', cls: 'smartphones' },
  { key: 'Headphones',  label: 'Headphones',  blurb: 'Sony, JBL, boAt, Nothing — ANC, over-ear, wireless', icon: '🎧', cls: 'headphones' },
  { key: 'Laptops',     label: 'Laptops',     blurb: 'Lenovo, HP, Dell, ASUS — OLED, Ryzen, Snapdragon X', icon: '💻', cls: 'laptops' },
]

function HomePage({ searchQuery, onSearchChange, activeCategory, onCategoryChange }) {
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return products.filter((p) => {
      const catMatch = activeCategory === 'All' || p.category === activeCategory
      if (!catMatch) return false
      if (!q) return true
      const hay = [p.name, p.brand, ...(p.specs || [])].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [searchQuery, activeCategory])

  const hasFilters = searchQuery.trim().length > 0 || activeCategory !== 'All'

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-inner">
          <h1 id="hero-heading">Compare real prices. Save real money.</h1>
          <p className="hero-sub">
            Shopora aggregates the latest prices from Amazon, Flipkart, Croma and Reliance Digital
            so you always know exactly where to buy — with 100% real products and verified INR prices.
          </p>
          <div className="hero-badges" role="list">
            <div role="listitem" className="hero-badge"><span aria-hidden="true">✅</span> 15 real products</div>
            <div role="listitem" className="hero-badge"><span aria-hidden="true">🏷️</span> Prices as of 18 Sep 2026</div>
            <div role="listitem" className="hero-badge"><span aria-hidden="true">🛒</span> 4 trusted retailers</div>
            <div role="listitem" className="hero-badge"><span aria-hidden="true">🇮🇳</span> Made in India</div>
          </div>
        </div>
      </section>

      <section className="filters-bar" aria-label="Filters">
        <div className="container">
          <div className="filters-inner">
            <span className="filters-title">Category</span>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => onCategoryChange(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
            <span className="count-badge" aria-live="polite">
              Showing {filtered.length} of {products.length} products
            </span>
            {hasFilters && (
              <button
                className="clear-btn"
                onClick={() => { onSearchChange(''); onCategoryChange('All') }}
                aria-label="Clear all filters"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        <section className="featured" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="section-title">Shop by Category</h2>
          <div className="featured-grid">
            {featuredCategories.map((f) => (
              <button
                key={f.key}
                className="featured-card"
                onClick={() => onCategoryChange(f.key)}
                aria-label={`Browse ${f.label}`}
              >
                <div className={`featured-icon ${f.cls}`} aria-hidden="true">{f.icon}</div>
                <div className="featured-info">
                  <h3>{f.label}</h3>
                  <p>{f.blurb}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="products-section" aria-labelledby="products-heading">
          <h2 id="products-heading" className="section-title">
            {activeCategory === 'All' ? 'All Products' : activeCategory}
          </h2>

          {filtered.length === 0 ? (
            <div className="empty-state" role="status">
              <div className="empty-state-icon" aria-hidden="true">🔍</div>
              <h2>No products found</h2>
              <p>Try a different search term or clear your filters.</p>
              <button
                className="btn-primary"
                onClick={() => { onSearchChange(''); onCategoryChange('All') }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default HomePage
