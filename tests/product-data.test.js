import test from 'node:test'
import assert from 'node:assert/strict'
import { products, getProductBySlug } from '../src/data/products.js'

const allowedHosts = new Set([
  'amazon.in', 'www.amazon.in', 'flipkart.com', 'www.flipkart.com',
  'croma.com', 'www.croma.com', 'reliancedigital.in', 'www.reliancedigital.in',
])

function isValidDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

test('product identifiers and slugs are unique', () => {
  assert.ok(products.length > 0)
  assert.equal(new Set(products.map((product) => product.id)).size, products.length)
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length)
})

test('product records contain required fields and valid retailer URLs', () => {
  for (const product of products) {
    assert.ok(product.id && product.slug && product.name && product.brand)
    assert.ok(['Smartphones', 'Headphones', 'Laptops'].includes(product.category))
    assert.ok(Number.isFinite(product.mrp) && product.mrp > 0)
    assert.equal(Object.hasOwn(product, 'rating'), false, 'unverified ratings must not be shown or stored')
    assert.equal(Object.hasOwn(product, 'reviews'), false, 'unverified review counts must not be shown or stored')
    assert.ok(Array.isArray(product.specs))
    assert.ok(Array.isArray(product.sellers) && product.sellers.length >= 2)
    assert.ok(isValidDateOnly(product.lastUpdated), `valid snapshot date: ${product.slug}`)
    assert.equal(typeof product.dataIsLive, 'boolean')
    for (const seller of product.sellers) {
      assert.ok(seller.seller)
      assert.ok(Number.isFinite(seller.price) && seller.price > 0)
      assert.equal(typeof seller.inStock, 'boolean')
      assert.ok(typeof seller.delivery === 'string' && seller.delivery.length > 0)
      const url = new URL(seller.url)
      assert.equal(url.protocol, 'https:')
      assert.ok(allowedHosts.has(url.hostname), `unexpected retailer host: ${url.hostname}`)
    }
  }
})

test('product slug lookup returns the matching record', () => {
  for (const product of products) assert.equal(getProductBySlug(product.slug), product)
  assert.equal(getProductBySlug('missing-product'), undefined)
})

test('Sony WH-CH520 copy does not promise active noise cancellation', () => {
  const product = getProductBySlug('sony-wh-ch520')
  assert.ok(product)
  assert.doesNotMatch(product.name, /noise cancellation/i)
  assert.ok(product.specs.some((spec) => /does not offer active noise cancellation/i.test(spec)))
})

test('manufacturer-specific product copy avoids known specification mistakes', () => {
  const galaxyS24 = getProductBySlug('samsung-galaxy-s24-256gb')
  assert.ok(galaxyS24)
  assert.ok(galaxyS24.specs.some((spec) => /Exynos 2400.*India-market Galaxy S24/i.test(spec)))
  assert.doesNotMatch(galaxyS24.specs.join(' '), /Snapdragon 8 Gen 3/i)

  const sonyXm5 = getProductBySlug('sony-wh-1000xm5-black')
  assert.ok(sonyXm5)
  assert.doesNotMatch(sonyXm5.specs.join(' '), /bone conduction|8 beamforming microphones/i)
  assert.ok(sonyXm5.specs.some((spec) => /four beamforming microphones/i.test(spec)))

  const boat650 = getProductBySlug('boat-rockerz-650-pro')
  assert.ok(boat650)
  assert.ok(boat650.specs.some((spec) => /IPX4 water resistance/i.test(spec)))

  const asusS14 = getProductBySlug('asus-vivobook-s14-snapdragon')
  assert.ok(asusS14)
  assert.ok(asusS14.specs.some((spec) => /2.5K.*LED-backlit anti-glare/i.test(spec)))
  assert.ok(asusS14.specs.some((spec) => /Wi-Fi 6E/i.test(spec)))
  assert.doesNotMatch(asusS14.specs.join(' '), /FHD OLED|Wi-Fi 7|fanless|22 hours/i)

  const asusS16 = getProductBySlug('asus-vivobook-s16-snapdragon-oled')
  assert.ok(asusS16)
  assert.equal(asusS16.mrp, 98990, 'reference price matches the current ASUS India listing reviewed in the audit')
  assert.ok(asusS16.specs.some((spec) => /95% DCI-P3/i.test(spec)))
  assert.ok(asusS16.specs.some((spec) => /Wi-Fi 6E/i.test(spec)))
  assert.doesNotMatch(asusS16.specs.join(' '), /32\+ hours|Wi-Fi 7|fanless design|180° lay-flat/i)

  const dell = getProductBySlug('dell-inspiron-14-plus-ryzen-ai')
  assert.ok(dell)
  assert.match(dell.name, /Dell 14 Plus DB14255/)
  assert.doesNotMatch(dell.specs.join(' '), /Dolby Vision|Dolby Atmos/)
  assert.ok(dell.specs.some((spec) => /Radeon 840M/i.test(spec)))
  assert.doesNotMatch(dell.specs.join(' '), /Radeon 760M|USB4|microSD/i)
  assert.ok(dell.specs.some((spec) => /Wi-Fi 7/i.test(spec)))

  const lenovoSlim3 = getProductBySlug('lenovo-ideapad-slim-3-15iah8')
  assert.ok(lenovoSlim3)
  assert.ok(lenovoSlim3.specs.some((spec) => /LPDDR5-4800/i.test(spec)))
  assert.doesNotMatch(lenovoSlim3.specs.join(' '), /DDR4 RAM/i)

  const lenovoSlim5 = getProductBySlug('lenovo-ideapad-slim-5-oled')
  assert.ok(lenovoSlim5)
  assert.match(lenovoSlim5.name, /14IRH10/)
  assert.ok(lenovoSlim5.specs.some((spec) => /FHD 1080p IR webcam/i.test(spec)))

  const hpPavilion = getProductBySlug('hp-pavilion-14-ey0789au')
  assert.ok(hpPavilion)
  assert.ok(hpPavilion.specs.some((spec) => /2.8K.*2880×1800.*OLED/i.test(spec)))
  assert.ok(hpPavilion.specs.some((spec) => /100% DCI-P3/i.test(spec)))
  assert.ok(hpPavilion.specs.some((spec) => /5MP IR camera with temporal noise reduction/i.test(spec)))
  assert.match(hpPavilion.name, /Pavilion Plus 14-ey0789AU/)
  assert.ok(hpPavilion.specs.some((spec) => /LPDDR5X-6400/i.test(spec)))
  assert.ok(hpPavilion.specs.some((spec) => /2x USB-C.*10Gbps/i.test(spec)))
  assert.doesNotMatch(hpPavilion.specs.join(' '), /WUXGA.*OLED|USB4 Type-C|LPDDR5 6400MHz/i)
})
