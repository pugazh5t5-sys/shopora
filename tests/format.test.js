import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateDiscount,
  findBestSeller,
  findLowestListedSeller,
  findWorstSeller,
  formatINR,
  formatSnapshotDate,
  getSnapshotAgeDays,
  sellersSortedAsc,
} from '../src/utils/format.js'

test('calculateDiscount handles normal and invalid inputs', () => {
  assert.equal(calculateDiscount(1000, 750), 25)
  assert.equal(calculateDiscount(1000, 1200), 0)
  assert.equal(calculateDiscount(0, 100), 0)
  assert.equal(calculateDiscount(1000, Number.NaN), 0)
})

test('best offer ignores lower-priced offers marked out of stock', () => {
  const offers = [
    { seller: 'Out of stock', price: 500, inStock: false },
    { seller: 'Available high', price: 900, inStock: true },
    { seller: 'Available low', price: 800, inStock: true },
  ]
  assert.equal(findBestSeller(offers).seller, 'Available low')
  assert.equal(findWorstSeller(offers).seller, 'Available high')
  assert.equal(findLowestListedSeller(offers).seller, 'Out of stock')
})

test('no in-stock seller returns no best-buy recommendation', () => {
  assert.equal(findBestSeller([{ seller: 'Unavailable', price: 10, inStock: false }]), null)
  assert.equal(findWorstSeller([{ seller: 'Unavailable', price: 10, inStock: false }]), null)
})

test('seller sorting puts available offers first and sorts price within each group', () => {
  const sorted = sellersSortedAsc([
    { seller: 'Out low', price: 100, inStock: false },
    { seller: 'In high', price: 300, inStock: true },
    { seller: 'In low', price: 200, inStock: true },
    { seller: 'Out high', price: 400, inStock: false },
  ])
  assert.deepEqual(sorted.map((offer) => offer.seller), ['In low', 'In high', 'Out low', 'Out high'])
})

test('price formatter does not render invalid values as a real price', () => {
  assert.equal(formatINR(Number.NaN), 'Price unavailable')
  assert.equal(formatINR(-5), 'Price unavailable')
  assert.match(formatINR(12345), /12,345/)
})

test('snapshot helpers reject malformed and impossible calendar dates', () => {
  assert.equal(formatSnapshotDate('invalid'), 'Date unavailable')
  assert.equal(formatSnapshotDate('2026-02-31'), 'Date unavailable')
  assert.equal(getSnapshotAgeDays('invalid'), null)
  assert.equal(getSnapshotAgeDays('2026-02-31'), null)
  assert.equal(getSnapshotAgeDays('2026-10-27', new Date('2026-10-28T12:00:00Z')), 1)
  assert.equal(getSnapshotAgeDays('2026-10-29', new Date('2026-10-28T12:00:00Z')), 0)
})
