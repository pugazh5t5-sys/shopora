import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import { formatINR, calculateDiscount, findBestSeller, findLowestListedSeller } from '../utils/format'

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty)
}

function ProductCard({ product }) {
  const best = findBestSeller(product.sellers)
  const lowestListed = findLowestListedSeller(product.sellers)
  const displayPrice = best?.price ?? lowestListed?.price
  const discount = best ? calculateDiscount(product.mrp, best.price) : 0
  return <Link to={'/product/' + product.slug} className="product-card" aria-label={'View recorded price comparison for ' + product.name}>
    <div className="product-card-image-wrap">
      {discount > 0 && <span className="product-card-badge">-{discount}% vs ref.</span>}
      {!best && <span className="product-card-unavailable">No in-stock offer</span>}
      {best && <span className="product-card-lowest"><span aria-hidden="true">🏆</span> Lowest in-stock</span>}
      <span className="product-card-brand">{product.brand}</span>
      <ProductImage src={product.image} alt={'AI-generated illustrative image of ' + product.name + ', not an official retailer photograph'} loading="lazy" />
    </div>
    <div className="product-card-body"><h3 className="product-card-name">{product.name}</h3>
      <div className="product-card-rating" aria-label={'Unverified catalogue rating ' + product.rating + ' out of 5; ' + product.reviews + ' reviews, not independently verified'}><span className="stars" aria-hidden="true">{renderStars(product.rating)}</span><span>{product.rating} · {product.reviews.toLocaleString('en-IN')} reviews</span><span className="rating-source-note">unverified</span></div>
      <div className="product-card-price-row">{best ? <span className="price-best">{formatINR(best.price)}</span> : displayPrice != null ? <span className="price-best unavailable-price">Lowest listed (unavailable) {formatINR(displayPrice)}</span> : <span className="price-best unavailable-price">Price unavailable</span>}<span className="price-mrp">Ref. {formatINR(product.mrp)}</span></div>
    </div>
  </Link>
}

export default ProductCard
