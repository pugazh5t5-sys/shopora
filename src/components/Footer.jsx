import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { formatSnapshotDate } from '../utils/format'

function Footer({ onCategoryChange }) {
  const dates = products.map((product) => product.lastUpdated).filter((date) => typeof date === 'string' && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)).sort()
  const latestSnapshotDate = dates.at(-1)
  const selectCategory = (category) => onCategoryChange?.(category)
  return <footer className="footer" role="contentinfo"><div className="container">
    <div className="footer-inner">
      <div className="footer-brand"><h3>Shopora</h3><p>Compare recorded prices for smartphones, headphones and laptops. Prices and availability are static snapshots, so confirm today&apos;s listing with the retailer.</p></div>
      <div className="footer-links"><h4>Shopora</h4><Link to="/about">About</Link><Link to="/privacy">Privacy information</Link><Link to="/terms">Terms of use</Link></div>
      <div className="footer-links"><h4>Browse categories</h4><Link to="/" onClick={() => selectCategory('Smartphones')}>Smartphones</Link><Link to="/" onClick={() => selectCategory('Headphones')}>Headphones</Link><Link to="/" onClick={() => selectCategory('Laptops')}>Laptops</Link><Link to="/" onClick={() => selectCategory('All')}>All products</Link></div>
    </div>
    <div className="footer-bottom"><div>© {new Date().getFullYear()} Shopora.</div><div className="footer-bottom-disclaimer">Catalogue snapshot: {formatSnapshotDate(latestSnapshotDate)}. Prices and availability can change; verify the retailer&apos;s final listing before purchase. Ratings and review counts are omitted until source data can be verified. Product images are AI-generated illustrations, not retailer photographs. Product names, logos and brands belong to their respective owners. Shopora does not sell products directly.</div></div>
  </div></footer>
}

export default Footer
