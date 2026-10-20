export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateDiscount(mrp, price) {
  if (!mrp || mrp <= 0) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

export function findBestSeller(sellers) {
  if (!sellers || sellers.length === 0) return null
  return [...sellers].sort((a, b) => a.price - b.price)[0]
}

export function findWorstSeller(sellers) {
  if (!sellers || sellers.length === 0) return null
  return [...sellers].sort((a, b) => b.price - a.price)[0]
}

export function sellersSortedAsc(sellers) {
  if (!sellers) return []
  return [...sellers].sort((a, b) => a.price - b.price)
}
