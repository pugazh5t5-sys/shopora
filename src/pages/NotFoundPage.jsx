import { Link } from 'react-router-dom'

function NotFoundPage() {
  return <div className="container"><section className="notfound" role="alert"><h1>404</h1><h2>Page not found</h2><p>We couldn&apos;t find the Shopora page you&apos;re looking for.</p><Link to="/" className="btn-primary">← Back to all products</Link></section></div>
}

export default NotFoundPage
