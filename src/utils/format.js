const validSellers = (sellers) =>
  Array.isArray(sellers)
    ? sellers.filter((seller) => seller && Number.isFinite(seller.price) && seller.price > 0)
    : []

export function formatINR(amount) {
  if (!Number.isFinite(amount) || amount < 0) return 'Price unavailable'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateDiscount(mrp, price) {
  if (!Number.isFinite(mrp) || mrp <= 0 || !Number.isFinite(price) || price < 0 || price >= mrp) {
    return 0
  }
  return Math.round(((mrp - price) / mrp) * 100)
}

// A recommended buy-now offer must be marked in stock.
export function findBestSeller(sellers) {
  return validSellers(sellers)
    .filter((seller) => seller.inStock === true)
    .sort((a, b) => a.price - b.price)[0] ?? null
}

// Use for display only; this may include unavailable offers.
export function findLowestListedSeller(sellers) {
  return validSellers(sellers).sort((a, b) => a.price - b.price)[0] ?? null
}

export function findWorstSeller(sellers) {
  return validSellers(sellers)
    .filter((seller) => seller.inStock === true)
    .sort((a, b) => b.price - a.price)[0] ?? null
}

// Available offers appear first, sorted low-to-high within each group.
export function sellersSortedAsc(sellers) {
  return validSellers(sellers).sort((a, b) => {
    if (Boolean(a.inStock) !== Boolean(b.inStock)) return a.inStock ? -1 : 1
    return a.price - b.price
  })
}

function isValidDateOnly(dateString) {
  if (typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false

  const [year, month, day] = dateString.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day
}

export function formatSnapshotDate(dateString) {
  if (!isValidDateOnly(dateString)) return 'Date unavailable'
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getSnapshotAgeDays(dateString, now = new Date()) {
  if (!isValidDateOnly(dateString)) return null
  const updatedAt = Date.parse(`${dateString}T00:00:00Z`)
  if (!Number.isFinite(updatedAt) || Number.isNaN(now.getTime())) return null
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.max(0, Math.floor((today - updatedAt) / 86400000))
}
