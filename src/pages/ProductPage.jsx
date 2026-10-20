import { Link, useParams } from 'react-router-dom'
import { getProductBySlug } from '../data/products'
import {
  formatINR,
  calculateDiscount,
  findBestSeller,
  findWorstSeller,
  sellersSortedAsc,
} from '../utils/format'

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty)
}

const sellerClassMap = {
  'Amazon': 'amazon',
  'Flipkart': 'flipkart',
  'Croma': 'croma',
  'Reliance Digital': 'reliance',
}

function ProductPage() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)

  if (!product) {
    return (
      <div className="container">
        <div className="notfound" role="alert">
          <h1>404</h1>
          <h2>Product not found</h2>
          <p>We couldn&apos;t find the product you&apos;re looking for.</p>
          <Link to="/" className="btn-primary">← Back to all products</Link>
        </div>
      </div>
    )
  }

  const sorted = sellersSortedAsc(product.sellers)
  const best = findBestSeller(product.sellers)
  const worst = findWorstSeller(product.sellers)
  const discount = calculateDiscount(product.mrp, best?.price ?? product.mrp)
  const savedAmt = product.mrp - (best?.price ?? product.mrp)
  const priceDiff = worst && best ? worst.price - best.price : 0
  const anyInStock = sorted.some((s) => s.inStock)

  return (
    <div className="container">
      <div className="product-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">← All products</Link>
          <span aria-hidden="true">/</span>
          <span>{product.category}</span>
          <span aria-hidden="true">/</span>
          <span style={{ color: 'var(--neutral-700)' }}>{product.brand}</span>
        </nav>

        <section className="product-layout" aria-labelledby="product-title">
          <div className="product-hero-image">
            <img
              src={product.image}
              alt={`${product.name} - ${product.brand} hero image`}
              loading="eager"
            />
          </div>

          <div className="product-info">
            <span className="product-brand-pill">{product.brand}</span>
            <h1 id="product-title" className="product-title">{product.name}</h1>

            <div className="product-rating-row" aria-label={`Rating ${product.rating} out of 5, ${product.reviews} reviews`}>
              <span className="stars" aria-hidden="true">{renderStars(product.rating)}</span>
              <span style={{ fontWeight: 600, color: 'var(--neutral-700)' }}>{product.rating}</span>
              <span>· {product.reviews.toLocaleString('en-IN')} reviews</span>
            </div>

            <div className="lowest-banner" role="note">
              <span aria-hidden="true">🏆</span>
              Lowest available price across {sorted.length} retailers
            </div>

            <span className={`stock-pill ${anyInStock ? 'in' : 'out'}`}>
              <span aria-hidden="true">{anyInStock ? '●' : '○'}</span>
              {anyInStock ? 'In stock' : 'Currently unavailable'}
            </span>

            <div className="product-price-block">
              <div className="price-row-top">
                <span className="price-mrp-strike" aria-label="MRP">{formatINR(product.mrp)}</span>
                {best && <span className="price-best-big" aria-label="Best price">{formatINR(best.price)}</span>}
                {discount > 0 && <span className="price-discount-pill">-{discount}%</span>}
              </div>
              {savedAmt > 0 && (
                <p className="savings-line">
                  You save <strong>{formatINR(savedAmt)}</strong> ({discount}% off MRP)
                </p>
              )}
              <p className="price-updated">
                Price updated: {new Date(product.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="cta-row">
              {best && (
                <a
                  className="btn-primary"
                  href={best.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View best deal on ${best.seller} for ${formatINR(best.price)} — opens in new tab`}
                >
                  <span aria-hidden="true">🛒</span>
                  View Best Deal
                  <span aria-hidden="true">↗</span>
                </a>
              )}
              <a
                className="btn-secondary"
                href="#compare-offers"
                aria-label="Scroll to compare all offers"
              >
                <span aria-hidden="true">📊</span>
                Compare All Offers
              </a>
            </div>
          </div>
        </section>

        {product.specs && product.specs.length > 0 && (
          <section className="specs-section" aria-labelledby="specs-heading">
            <h2 id="specs-heading">Key Specifications</h2>
            <ul className="specs-list">
              {product.specs.map((spec, i) => (
                <li key={i}>
                  <span className="spec-check" aria-hidden="true">✓</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="compare-section" id="compare-offers" aria-labelledby="compare-heading">
          <h2 id="compare-heading">Compare Prices</h2>
          <p className="compare-sub">Prices sorted from lowest to highest across {sorted.length} retailers</p>

          <div className="warning-box" role="note">
            <span className="warning-icon" aria-hidden="true">⚠️</span>
            <span className="warning-text">
              Price may have changed. Check retailer before purchasing.
              {!product.dataIsLive && ' Prices shown are static and were last updated on 18 September 2026.'}
            </span>
          </div>

          {best && worst && priceDiff > 0 && (
            <div className="price-summary">
              <div className="price-summary-item">
                Lowest Price
                <strong style={{ color: 'var(--in-stock-green)' }}>{formatINR(best.price)}</strong>
              </div>
              <div className="price-summary-item">
                Highest Price
                <strong style={{ color: 'var(--neutral-500)' }}>{formatINR(worst.price)}</strong>
              </div>
              <div className="price-summary-item">
                Price Difference
                <strong>{formatINR(priceDiff)}</strong>
              </div>
              <div className="price-summary-item">
                Savings vs MRP
                <strong style={{ color: 'var(--brand-indigo)' }}>
                  {formatINR(savedAmt)} ({discount}%)
                </strong>
              </div>
            </div>
          )}

          <div className="compare-table-wrap" role="region" aria-label="Price comparison table">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Seller</th>
                  <th scope="col">Price</th>
                  <th scope="col">Delivery</th>
                  <th scope="col">Availability</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((seller, idx) => (
                  <tr key={seller.seller + idx} className={idx === 0 ? 'lowest-row' : ''}>
                    <td>
                      <span className="seller-name">
                        <span className={`seller-dot ${sellerClassMap[seller.seller] || ''}`} aria-hidden="true"></span>
                        {seller.seller}
                        {idx === 0 && <span className="lowest-label"><span aria-hidden="true">🏆</span> Lowest</span>}
                        {idx === sorted.length - 1 && sorted.length > 1 && <span className="highest-label">Highest Price</span>}
                      </span>
                    </td>
                    <td><span className="seller-price">{formatINR(seller.price)}</span></td>
                    <td>{seller.delivery}</td>
                    <td>
                      <span className={`in-stock-cell ${seller.inStock ? '' : 'out'}`}>
                        <span aria-hidden="true">{seller.inStock ? '✓' : '✗'}</span>
                        {seller.inStock ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td>
                      <a
                        href={seller.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-deal-btn"
                        aria-label={`View deal on ${seller.seller} at ${formatINR(seller.price)} — opens in new tab`}
                      >
                        View Deal ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-seller-cards" role="list" aria-label="Price comparison cards">
            {sorted.map((seller, idx) => (
              <article
                key={seller.seller + '-card-' + idx}
                role="listitem"
                className={`seller-card ${idx === 0 ? 'lowest' : ''}`}
              >
                <div className="seller-card-header">
                  <span className="seller-name">
                    <span className={`seller-dot ${sellerClassMap[seller.seller] || ''}`} aria-hidden="true"></span>
                    <strong>{seller.seller}</strong>
                  </span>
                  {idx === 0 && <span className="lowest-label"><span aria-hidden="true">🏆</span> Lowest</span>}
                  {idx === sorted.length - 1 && sorted.length > 1 && <span className="highest-label">Highest</span>}
                </div>
                <div className="seller-card-price">{formatINR(seller.price)}</div>
                <div className="seller-card-meta">
                  <span>{seller.delivery}</span>
                  <span className={`in-stock-cell ${seller.inStock ? '' : 'out'}`}>
                    <span aria-hidden="true">{seller.inStock ? '✓' : '✗'}</span>
                    {seller.inStock ? 'In stock' : 'Out'}
                  </span>
                </div>
                <a
                  href={seller.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-deal-btn"
                  aria-label={`View deal on ${seller.seller} at ${formatINR(seller.price)} — opens in new tab`}
                >
                  View Deal ↗
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductPage
