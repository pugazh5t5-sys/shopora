function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>Shopora</h3>
            <p>
              Real products. Real prices. Compare smartphones, headphones and laptops
              across Amazon, Flipkart, Croma and Reliance Digital India.
              Save money with verified lowest prices.
            </p>
          </div>
          <div className="footer-links">
            <h4>Shopora</h4>
            <a href="#/" aria-label="About Shopora">About</a>
            <a href="#/" aria-label="Privacy policy">Privacy</a>
            <a href="#/" aria-label="Terms of use">Terms</a>
          </div>
          <div className="footer-links">
            <h4>Categories</h4>
            <a href="#/" aria-label="Smartphones">Smartphones</a>
            <a href="#/" aria-label="Headphones">Headphones</a>
            <a href="#/" aria-label="Laptops">Laptops</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Shopora. Made in India 🇮🇳</div>
          <div className="footer-bottom-disclaimer">
            Prices as of 18 September 2026. Prices may have changed since last update.
            Always check the retailer's website for the latest price before purchasing.
            Product names, logos and brands are property of their respective owners.
            Shopora is a price-comparison tool and does not sell products directly.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
