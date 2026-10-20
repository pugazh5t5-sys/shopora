import { Link } from 'react-router-dom'
import { formatINR, calculateDiscount, findBestSeller } from '../utils/format'

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty)
}

function ProductCard({ product }) {
  const best = findBestSeller(product.sellers)
  const discount = calculateDiscount(product.mrp, best?.price ?? product.mrp)

  return (
    <Link
      to={`/product/${product.slug}`}
      className="product-card"
      aria-label={`View price comparison for ${product.name}`}
    >
      <div className="product-card-image-wrap">
        {discount > 0 && (
          <span className="product-card-badge">-{discount}% off</span>
        )}
        {best && (
          <span className="product-card-lowest">
            <span aria-hidden="true">🏆</span> Lowest
          </span>
        )}
        <span className="product-card-brand">{product.brand}</span>
        <img
          src={product.image}
          alt={`${product.name} - ${product.brand} product image`}
          loading="lazy"
        />
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-rating" aria-label={`Rating ${product.rating} out of 5, ${product.reviews} reviews`}>
          <span className="stars" aria-hidden="true">{renderStars(product.rating)}</span>
          <span>{product.rating} · {product.reviews.toLocaleString('en-IN')} reviews</span>
        </div>
        <div className="product-card-price-row">
          {best && <span className="price-best">{formatINR(best.price)}</span>}
          <span className="price-mrp">{formatINR(product.mrp)}</span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
