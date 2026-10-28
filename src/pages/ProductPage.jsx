import { Link, useParams } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import { getProductBySlug } from '../data/products'
import {
  formatINR,
  calculateDiscount,
  findBestSeller,
  findWorstSeller,
  findLowestListedSeller,
  formatSnapshotDate,
  getSnapshotAgeDays,
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
  const lowestListed = findLowestListedSeller(product.sellers)
  const availableCount = sorted.filter((seller) => seller.inStock === true).length
  const discount = best ? calculateDiscount(product.mrp, best.price) : 0
  const savedAmt = best ? Math.max(0, product.mrp - best.price) : 0
  const priceDiff = worst && best ? worst.price - best.price : 0
  const anyInStock = availableCount > 0
  const snapshotAgeDays = getSnapshotAgeDays(product.lastUpdated)

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
            <ProductImage
              src={product.image}
              alt={`AI-generated illustrative image of ${product.name}, not an official retailer photograph`}
              loading="eager"
            />
          </div>

          <div className="product-info">
            <span className="product-brand-pill">{product.brand}</span>
            <h1 id="product-title" className="product-title">{product.name}</h1>

            <div className="product-rating-row" aria-label={`Unverified catalogue rating ${product.rating} out of 5; ${product.reviews.toLocaleString('en-IN')} reviews, not independently verified`}>
              <span className="stars" aria-hidden="true">{renderStars(product.rating)}</span>
              <span style={{ fontWeight: 600, color: 'var(--neutral-700)' }}>{product.rating}</span>
              <span>· {product.reviews.toLocaleString('en-IN')} reviews</span>
              <span className="rating-source-note">unverified snapshot</span>
            </div>

            <div className="lowest-banner" role="note">
              <span aria-hidden="true">{best ? '🏆' : 'ℹ️'}</span>
              {best ? `Lowest in-stock offer across ${availableCount} seller offer${availableCount === 1 ? '' : 's'}` : 'No seller offers are marked in stock in this snapshot'}
            </div>

            <span className={`stock-pill ${anyInStock ? 'in' : 'out'}`}>
              <span aria-hidden="true">{anyInStock ? '●' : '○'}</span>
              {anyInStock ? 'Marked in stock in snapshot' : 'No in-stock offer in snapshot'}
            </span>

            <div className="product-price-block">
              <div className="price-row-top">
                <span className="price-mrp-strike" aria-label="Reference price">Ref. {formatINR(product.mrp)}</span>
                {best ? <span className="price-best-big" aria-label="Lowest in-stock price">{formatINR(best.price)}</span> : lowestListed ? <span className="price-best-big unavailable-price">Lowest listed (unavailable) {formatINR(lowestListed.price)}</span> : null}
                {discount > 0 && <span className="price-discount-pill">-{discount}% vs ref.</span>}
              </div>
              {savedAmt > 0 && (
                <p className="savings-line">
                  Recorded offer is <strong>{formatINR(savedAmt)} below reference</strong> ({discount}% below reference price)
                </p>
              )}
              <p className="price-updated">
                Price snapshot: {formatSnapshotDate(product.lastUpdated)}{snapshotAgeDays != null ? ` · ${snapshotAgeDays} day${snapshotAgeDays === 1 ? '' : 's'} old` : ''}
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
                  Check Retailer Listing
                  <span aria-hidden="true">↗</span>
                </a>
              )}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => document.getElementById('compare-offers')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                aria-label="Scroll to compare all offers"
              >
                <span aria-hidden="true">📊</span>
                Compare All Offers
              </button>
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
          <p className="compare-sub">Recorded offers are sorted by price, with offers marked in stock listed first. {availableCount} of {sorted.length} offers were marked in stock in this snapshot.</p>

          <div className="warning-box" role="note">
            <span className="warning-icon" aria-hidden="true">⚠️</span>
            <span className="warning-text">
              Price may have changed. Check retailer before purchasing.
              {product.dataIsLive ? ` Last feed update: ${formatSnapshotDate(product.lastUpdated)}.` : ` These are static price snapshots, not live retailer feeds. Last recorded ${formatSnapshotDate(product.lastUpdated)}${snapshotAgeDays == null ? '' : ` (${snapshotAgeDays} days ago)`}.`}
            </span>
          </div>

          {best && worst && priceDiff > 0 && (
            <div className="price-summary">
              <div className="price-summary-item">
                Lowest in-stock offer
                <strong style={{ color: 'var(--in-stock-green)' }}>{formatINR(best.price)}</strong>
              </div>
              <div className="price-summary-item">
                Highest in-stock offer
                <strong style={{ color: 'var(--neutral-500)' }}>{formatINR(worst.price)}</strong>
              </div>
              <div className="price-summary-item">
                Price Difference
                <strong>{formatINR(priceDiff)}</strong>
              </div>
              <div className="price-summary-item">
                Difference vs reference
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
                  <tr key={seller.seller + idx} className={seller === best ? 'lowest-row' : ''}>
                    <td>
                      <span className="seller-name">
                        <span className={`seller-dot ${sellerClassMap[seller.seller] || ''}`} aria-hidden="true"></span>
                        {seller.seller}
                        {seller === best && <span className="lowest-label"><span aria-hidden="true">🏆</span> Lowest in-stock</span>}
                        {seller === worst && availableCount > 1 && <span className="highest-label">Highest in-stock</span>}
                      </span>
                    </td>
                    <td><span className="seller-price">{formatINR(seller.price)}</span></td>
                    <td>{seller.delivery}</td>
                    <td>
                      <span className={`in-stock-cell ${seller.inStock ? '' : 'out'}`}>
                        <span aria-hidden="true">{seller.inStock ? '✓' : '✗'}</span>
                        {seller.inStock ? 'Marked in stock' : 'Marked out of stock'}
                      </span>
                    </td>
                    <td>
                      <a
                        href={seller.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-deal-btn"
                        aria-label={`Check recorded listing on ${seller.seller} at ${formatINR(seller.price)} — opens in new tab`}
                      >
                        Check Listing ↗
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
                className={`seller-card ${seller === best ? 'lowest' : ''}`}
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
                    {seller.inStock ? 'Marked in stock' : 'Marked out'}
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
