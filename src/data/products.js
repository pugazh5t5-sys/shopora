/*
 * ============================================================
 * Shopora - Product Data Source
 * ============================================================
 *
 * HOW TO ADD A NEW PRODUCT:
 * 1. Add a new object to the `products` array below, following the schema.
 * 2. Required fields:
 *    - id:           string, unique kebab-case id, e.g. "new-phone-128gb"
 *    - slug:         string, URL-safe slug used in /product/:slug routes, e.g. "brand-new-phone-128gb"
 *    - name:         string, FULL EXACT real product name + variant
 *    - brand:        string, real brand name (Apple, Samsung, Sony, etc.)
 *    - category:     "Smartphones" | "Headphones" | "Laptops"  (extend enum as needed)
 *    - image:        string, URL to an AI-generated illustrative image (not an official product photo)
 *    - imagePrompt:  string, text_to_image prompt used to generate the image (for reproducibility)
 *    - specs:        array of strings — key specification bullets
 *    - mrp:          number, integer rupees, NO DECIMALS (MRP / launch price in INR)
 *    - rating/reviews: add only after a verified source URL and capture timestamp are available; currently omitted
 *    - lastUpdated:  ISO date string YYYY-MM-DD of the price data snapshot
 *    - dataIsLive:   boolean — true if prices come from live API refresh; false (MVP) = static researched snapshot
 *    - sellers:      array of objects:
 *          {
 *            seller:   "Amazon" | "Flipkart" | "Croma" | "Reliance Digital",
 *            price:    number, integer rupees, historical/indicative snapshot value (not a live price)
 *            delivery: string, e.g. "2–3 days", "1–2 days", "Delivery by 22 Sep"
 *            url:      string, FULL HTTPS URL to the REAL retailer search/product page
 *                      Amazon: https://www.amazon.in/s?k=<encoded>
 *                      Flipkart: https://www.flipkart.com/search?q=<encoded>
 *                      Croma: https://www.croma.com/search?q=<encoded>
 *                      Reliance: https://www.reliancedigital.in/search?q=<encoded>
 *                      DO NOT USE placeholder / "#" / "example.com" / relative paths
 *            inStock:  boolean
 *          }
 *       Must include AT LEAST 2 sellers per product. Sorting done by UI.
 *
 * HOW TO SWAP IN A LIVE DATA API:
 *   1. Replace the default export below with an async fetching function:
 *
 *        export async function fetchProducts() {
 *          const res = await fetch('https://feed-provider.invalid/in/products')
 *          const feed = await res.json()
 *          return feed.map(normalizeFeedItem)  // map external schema to the SAME schema above
 *        }
 *
 *   2. Integrate the async loader into page state, add loading/error/retry states, and
 *      keep the same normalized schema for cards and details. The existing UI components
 *      currently consume a synchronous static array, so fetching requires page-level changes.
 *
 * PRICE RESEARCH SOURCES (snapshot 2026-09-18):
 *   - 91mobiles.com (price listings)
 *   - Flipkart.com (public product / search listings)
 *   - Amazon.in (public product / search listings)
 *   - Croma.com (public product pages)
 *   - Price tracking aggregators (price-history.in, mysmartprice.com, gadgetcrisp.com)
 *   These were intended as indicative public-listing snapshots, but no per-offer source URL/timestamp is stored here.
 *   Therefore do not treat them as verified; re-check every offer before publication.
 * ============================================================
 */

const encode = (s) => encodeURIComponent(s)

const amzSearch = (q) => `https://www.amazon.in/s?k=${encode(q)}`
const fkSearch = (q) => `https://www.flipkart.com/search?q=${encode(q)}`
const crSearch = (q) => `https://www.croma.com/search?q=${encode(q)}`
const rdSearch = (q) => `https://www.reliancedigital.in/search?q=${encode(q)}`

const IMG = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image'
const imgUrl = (prompt) => `${IMG}?prompt=${encodeURIComponent(prompt)}&image_size=landscape_4_3`

export const products = [
  {
    id: 'apple-iphone-15-128gb',
    slug: 'apple-iphone-15-128gb',
    name: 'Apple iPhone 15 (128GB)',
    brand: 'Apple',
    category: 'Smartphones',
    image: imgUrl('Apple iPhone 15 Black color, front view with screen off, subtle Dynamic Island, studio product shot on clean white background, realistic e-commerce photo, high detail, soft shadow'),
    imagePrompt:
      'Apple iPhone 15 Black color, front view with screen off, subtle Dynamic Island, studio product shot on clean white background, realistic e-commerce photo, high detail, soft shadow',
    specs: [
      '6.1-inch Super Retina XDR OLED, 60Hz, 2000 nits peak brightness',
      'Apple A16 Bionic chip, 6GB RAM, 128GB internal storage',
      '48MP main (f/1.6 OIS) + 12MP ultra-wide rear camera',
      '12MP TrueDepth front camera with Autofocus',
      'USB-C charging, 20W wired, 15W MagSafe, IP68 water/dust resistance',
      'Dynamic Island, iOS with long-term software support',
    ],
    mrp: 79900,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Flipkart',
        price: 57900,
        delivery: '2–3 days',
        url: fkSearch('Apple iPhone 15 128GB'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 59900,
        delivery: '2 days',
        url: amzSearch('Apple iPhone 15 128GB'),
        inStock: true,
      },
      {
        seller: 'Croma',
        price: 59900,
        delivery: '3–4 days',
        url: crSearch('Apple iPhone 15 128 GB'),
        inStock: true,
      },
    ],
  },
  {
    id: 'samsung-galaxy-s24-256gb',
    slug: 'samsung-galaxy-s24-256gb',
    name: 'Samsung Galaxy S24 5G (8GB RAM, 256GB)',
    brand: 'Samsung',
    category: 'Smartphones',
    image: imgUrl('Samsung Galaxy S24 Marble Gray color, front view flat edge design, screen off showing punch-hole camera, studio e-commerce photo, clean white background, soft shadows, realistic'),
    imagePrompt:
      'Samsung Galaxy S24 Marble Gray color, front view flat edge design, screen off showing punch-hole camera, studio e-commerce photo, clean white background, soft shadows, realistic',
    specs: [
      '6.2-inch Dynamic AMOLED 2X, FHD+, 120Hz adaptive, 2600 nits peak',
      'Samsung Exynos 2400 (India-market Galaxy S24); 8GB LPDDR5X, 256GB UFS',
      '50MP (OIS) + 12MP ultra-wide + 10MP 3x optical telephoto (OIS) triple rear',
      '12MP front camera, 4K video recording',
      '4000 mAh battery, 25W wired, 15W wireless charging, IP68',
      'Android 14 with One UI, 7 years OS/security updates, Circle to Search',
    ],
    mrp: 79999,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Croma',
        price: 49994,
        delivery: '3–5 days',
        url: crSearch('Samsung Galaxy S24 5G 8GB 256GB Marble Gray'),
        inStock: true,
      },
      {
        seller: 'Flipkart',
        price: 49999,
        delivery: '2 days',
        url: fkSearch('Samsung Galaxy S24 5G 256GB'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 59449,
        delivery: '2–3 days',
        url: amzSearch('Samsung Galaxy S24 5G 8GB 256GB'),
        inStock: true,
      },
    ],
  },
  {
    id: 'oneplus-12-256gb',
    slug: 'oneplus-12-256gb',
    name: 'OnePlus 12 5G (12GB RAM, 256GB Storage)',
    brand: 'OnePlus',
    category: 'Smartphones',
    image: imgUrl('OnePlus 12 Silky Black color, back view with Hasselblad circular camera module, studio product photography, clean white background, high resolution realistic e-commerce render, soft shadow'),
    imagePrompt:
      'OnePlus 12 Silky Black color, back view with Hasselblad circular camera module, studio product photography, clean white background, high resolution realistic e-commerce render, soft shadow',
    specs: [
      '6.82-inch LTPO AMOLED 2K QHD+, 1-120Hz adaptive, 4500 nits peak',
      'Qualcomm Snapdragon 8 Gen 3, 12GB LPDDR5X, 256GB UFS 4.0',
      '50MP Sony LYT-808 main (OIS) + 48MP ultra-wide + 64MP 3x periscope telephoto (OIS)',
      'Hasselblad Natural Colour Calibration, 32MP selfie',
      '5400 mAh dual-cell battery, 100W SuperVOOC wired, 50W AIRVOOC wireless',
      'OxygenOS 14 (Android 14), IP65 dust/splash resistant, Alert Slider',
    ],
    mrp: 64999,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Flipkart',
        price: 53999,
        delivery: '2–3 days',
        url: fkSearch('OnePlus 12 5G 12GB 256GB'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 54990,
        delivery: '2 days',
        url: amzSearch('OnePlus 12 5G 12GB 256GB'),
        inStock: true,
      },
      {
        seller: 'Reliance Digital',
        price: 55999,
        delivery: '3–4 days',
        url: rdSearch('OnePlus 12 5G 12GB 256GB'),
        inStock: true,
      },
    ],
  },
  {
    id: 'sony-wh-1000xm5-black',
    slug: 'sony-wh-1000xm5-black',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)',
    brand: 'Sony',
    category: 'Headphones',
    image: imgUrl('Sony WH-1000XM5 black over-ear headphones, angled side view showing earcups and slim headband, studio product photography, pure white background, soft shadows, realistic e-commerce shot, crisp details'),
    imagePrompt:
      'Sony WH-1000XM5 black over-ear headphones, angled side view showing earcups and slim headband, studio product photography, pure white background, soft shadows, realistic e-commerce shot, crisp details',
    specs: [
      'Dual processors (HD Noise Cancelling Processor QN1 and Integrated Processor V1) for active noise cancellation',
      '30mm Carbon Fibre Composite drivers, LDAC Hi-Res Wireless Audio',
      'Battery: 30 hrs (ANC on) / 40 hrs (ANC off), USB-C quick charge (3 min = 3 hrs play)',
      'Multipoint Bluetooth 5.2 (2 devices simultaneous), Auto NC Optimizer',
      'Four beamforming microphones and Precise Voice Pickup Technology for hands-free calls',
      'Lightweight 250g, speak-to-chat, adaptive sound control, Sony Headphones Connect app',
    ],
    mrp: 34990,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Amazon',
        price: 27949,
        delivery: '2 days',
        url: amzSearch('Sony WH-1000XM5 Black'),
        inStock: true,
      },
      {
        seller: 'Flipkart',
        price: 27990,
        delivery: '2–3 days',
        url: fkSearch('Sony WH 1000XM5 Wireless Headphones Black'),
        inStock: true,
      },
      {
        seller: 'Croma',
        price: 29990,
        delivery: '3 days',
        url: crSearch('Sony WH-1000XM5 Black'),
        inStock: true,
      },
    ],
  },
  {
    id: 'jbl-tune-770nc',
    slug: 'jbl-tune-770nc',
    name: 'JBL Tune 770NC Adaptive Noise Cancelling Wireless Headphones',
    brand: 'JBL',
    category: 'Headphones',
    image: imgUrl('JBL Tune 770NC matte black over-ear wireless headphones, front view, studio product shot on plain white background, realistic e-commerce photo with soft shadow, JBL logo visible on earcup'),
    imagePrompt:
      'JBL Tune 770NC matte black over-ear wireless headphones, front view, studio product shot on plain white background, realistic e-commerce photo with soft shadow, JBL logo visible on earcup',
    specs: [
      'Adaptive Active Noise Cancellation with Ambient Aware & TalkThru modes',
      '40mm dynamic drivers, JBL Pure Bass Sound signature tuning',
      'Battery life: 70 hrs (ANC off) / 44 hrs (ANC on), USB-C fast charge',
      'Bluetooth 5.3, multi-point connection (2 devices simultaneously)',
      'Dual microphones for crisp calls, lightweight foldable design 232g',
      'JBL Headphones App for EQ presets and ANC customization, 3.5mm cable included',
    ],
    mrp: 7999,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Amazon',
        price: 3999,
        delivery: '2 days',
        url: amzSearch('JBL Tune 770NC Wireless ANC Headphones'),
        inStock: true,
      },
      {
        seller: 'Flipkart',
        price: 4499,
        delivery: '2–3 days',
        url: fkSearch('JBL Tune 770NC Adaptive Noise Cancelling'),
        inStock: true,
      },
      {
        seller: 'Croma',
        price: 4999,
        delivery: '3 days',
        url: crSearch('JBL Tune 770NC'),
        inStock: true,
      },
    ],
  },
  {
    id: 'boat-rockerz-650-pro',
    slug: 'boat-rockerz-650-pro',
    name: 'boAt Rockerz 650 Pro Bluetooth Headphones (80h Playback)',
    brand: 'boAt',
    category: 'Headphones',
    image: imgUrl('boAt Rockerz 650 Pro matte black over-ear headphones, front-angled view, studio product photography white background, realistic e-commerce style, boAt branding visible on headband, soft lighting'),
    imagePrompt:
      'boAt Rockerz 650 Pro matte black over-ear headphones, front-angled view, studio product photography white background, realistic e-commerce style, boAt branding visible on headband, soft lighting',
    specs: [
      '40mm dynamic drivers, boAt signature bass-heavy tuning',
      'Massive 80 hours battery life, ASAP Charge (10 min = 10 hrs playtime)',
      'Bluetooth 5.3 with instant auto-pairing, low-latency BEAST mode for gaming',
      'Dual ENx microphones for environmental noise cancellation on calls',
      'Foldable design with plush ear cushions, adjustable padded headband',
      'IPX4 water resistance, 3.5mm AUX port (wired mode supported)',
    ],
    mrp: 8990,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Amazon',
        price: 2299,
        delivery: '2–3 days',
        url: amzSearch('boAt Rockerz 650 Pro Bluetooth Headphones 80h'),
        inStock: true,
      },
      {
        seller: 'Croma',
        price: 2499,
        delivery: '3 days',
        url: crSearch('boAt Rockerz 650 Pro'),
        inStock: true,
      },
      {
        seller: 'Flipkart',
        price: 2599,
        delivery: '2–3 days',
        url: fkSearch('boAt Rockerz 650 Pro 80 hours'),
        inStock: true,
      },
    ],
  },
  {
    id: 'boat-rockerz-550',
    slug: 'boat-rockerz-550',
    name: 'boAt Rockerz 550 Bluetooth Wireless Headphones',
    brand: 'boAt',
    category: 'Headphones',
    image: imgUrl('boAt Rockerz 550 black and red over-ear headphones, side view showing earcup logo, studio e-commerce photo, clean white background, realistic product render with soft shadow'),
    imagePrompt:
      'boAt Rockerz 550 black and red over-ear headphones, side view showing earcup logo, studio e-commerce photo, clean white background, realistic product render with soft shadow',
    specs: [
      '50mm large dynamic drivers for punchy bass and loud volume',
      'Up to 20 hours playback per charge',
      'Bluetooth 5.0, 3.5mm AUX input (dual connectivity wired/wireless)',
      'Adjustable padded headband + cushioned ear cups for long wear comfort',
      'boAt Rockerz signature sound: bass boosted for Bollywood, EDM, hip-hop',
      'Built-in HD mic with voice assistance support (Siri / Google Assistant)',
    ],
    mrp: 5990,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Flipkart',
        price: 1799,
        delivery: '2 days',
        url: fkSearch('boAt Rockerz 550 Wireless Headphones'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 1899,
        delivery: '2–3 days',
        url: amzSearch('boAt Rockerz 550 Over Ear Bluetooth'),
        inStock: true,
      },
    ],
  },
  {
    id: 'lenovo-ideapad-slim-5-oled',
    slug: 'lenovo-ideapad-slim-5-oled',
    name: 'Lenovo IdeaPad Slim 5i 14IRH10 (Core i5-13420H, 16GB, 1TB SSD, 14" OLED)',
    brand: 'Lenovo',
    category: 'Laptops',
    image: imgUrl('Lenovo IdeaPad Slim 5 laptop, open at 120 degrees showing 14-inch screen and keyboard, silver finish, studio product shot front-angled view, clean white background, realistic e-commerce photo, Lenovo logo below screen'),
    imagePrompt:
      'Lenovo IdeaPad Slim 5 laptop, open at 120 degrees showing 14-inch screen and keyboard, silver finish, studio product shot front-angled view, clean white background, realistic e-commerce photo, Lenovo logo below screen',
    specs: [
      '14-inch WUXGA (1920×1200) 16:10 OLED display, true blacks, vibrant colors',
      '13th Gen Intel Core i5-13420H 8-core / 12-thread H-class processor, up to 4.6 GHz',
      '16GB DDR5-5600 RAM (2x SO-DIMM, upgradable), 1TB PCIe 4.0 NVMe SSD',
      'Intel UHD integrated graphics, USB-C PowerDelivery charging support',
      'Backlit keyboard, FHD 1080p IR webcam with privacy shutter, dual 2W speakers with Dolby Audio',
      'Windows 11 Home, lightweight ~1.5 kg, 2x USB-A + 2x USB-C + HDMI ports',
    ],
    mrp: 95000,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Flipkart',
        price: 76990,
        delivery: '3–4 days',
        url: fkSearch('Lenovo IdeaPad Slim 5i 14IRH10 i5-13420H OLED 16GB 1TB'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 78990,
        delivery: '3 days',
        url: amzSearch('Lenovo IdeaPad Slim 5i 14IRH10 i5-13420H OLED 16GB 1TB'),
        inStock: true,
      },
    ],
  },
  {
    id: 'lenovo-ideapad-slim-3-15iah8',
    slug: 'lenovo-ideapad-slim-3-15iah8',
    name: 'Lenovo IdeaPad Slim 3 15IAH8 (12th Gen Core i5, 8GB, 512GB SSD, 15.6")',
    brand: 'Lenovo',
    category: 'Laptops',
    image: imgUrl('Lenovo IdeaPad Slim 3 15.6-inch laptop, front view slightly open, dark grey body, studio product photography, plain white background, realistic e-commerce render, Lenovo logo visible'),
    imagePrompt:
      'Lenovo IdeaPad Slim 3 15.6-inch laptop, front view slightly open, dark grey body, studio product photography, plain white background, realistic e-commerce render, Lenovo logo visible',
    specs: [
      '15.6-inch FHD (1920×1080) anti-glare display; panel type and brightness vary by SKU',
      '12th Gen Intel Core i5-12450H 8-core processor (4 Performance + 4 Efficient)',
      '8GB soldered LPDDR5-4800 memory (not upgradeable on the 8GB configuration), 512GB M.2 PCIe NVMe SSD',
      'Integrated Intel UHD graphics, quiet cooling, everyday office performance',
      'Full-size keyboard with numpad, USB-C, 2x USB-A, HDMI output, microSD card reader',
      'Windows 11 Home, HD 720p webcam, stereo speakers, about 1.62 kg; wireless/keyboard options vary by SKU',
    ],
    mrp: 69990,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Amazon',
        price: 49990,
        delivery: '2–3 days',
        url: amzSearch('Lenovo IdeaPad Slim 3 15IAH8 12th Gen i5 8GB 512GB'),
        inStock: true,
      },
      {
        seller: 'Croma',
        price: 51990,
        delivery: '3–4 days',
        url: crSearch('Lenovo IdeaPad Slim 3 15IAH8 Core i5 12th Gen'),
        inStock: true,
      },
    ],
  },
  {
    id: 'hp-pavilion-14-ey0789au',
    slug: 'hp-pavilion-14-ey0789au',
    name: 'HP Pavilion Plus 14-ey0789AU (Ryzen 7 7840U, 16GB, 1TB SSD, 14" OLED)',
    brand: 'HP',
    category: 'Laptops',
    image: imgUrl('HP Pavilion Plus 14-ey0789AU silver laptop, open display showing keyboard and touchpad, AI-generated illustrative product image on white background'),
    imagePrompt:
      'HP Pavilion Plus 14-ey0789AU silver laptop, open display showing keyboard and touchpad, AI-generated illustrative product image on white background',
    specs: [
      '14-inch 2.8K (2880×1800) OLED 16:10 display, 48–120Hz VRR, 400-nit SDR / 500-nit HDR, 100% DCI-P3',
      'AMD Ryzen 7 7840U 8-core / 16-thread, up to 5.1 GHz boost, Radeon 780M iGPU',
      '16GB LPDDR5X-6400 onboard memory, 1TB PCIe Gen 4 NVMe M.2 SSD storage',
      'Full-size backlit keyboard, precision touchpad, HP Wide Vision 5MP IR camera with temporal noise reduction',
      '2x USB-C (10Gbps, Power Delivery, DisplayPort 1.4), 2x USB-A, HDMI 2.1, Wi-Fi 6E, Bluetooth 5.3',
      'Windows 11 Home, B&O tuned dual speakers, ~1.4 kg, 65W USB-C charging',
    ],
    mrp: 99999,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Flipkart',
        price: 88856,
        delivery: '3 days',
        url: fkSearch('HP Pavilion Plus 14-ey0789AU Ryzen 7 7840U OLED 16GB 1TB'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 89990,
        delivery: '3–4 days',
        url: amzSearch('HP Pavilion Plus 14-ey0789AU AMD Ryzen 7 7840U OLED 16GB 1TB'),
        inStock: true,
      },
    ],
  },
  {
    id: 'dell-inspiron-14-plus-ryzen-ai',
    slug: 'dell-inspiron-14-plus-ryzen-ai',
    name: 'Dell 14 Plus DB14255 (AMD Ryzen AI 5 340, 16GB, 512GB SSD, 14")',
    brand: 'Dell',
    category: 'Laptops',
    image: imgUrl('Dell 14 Plus DB14255 laptop, slightly open showing 14-inch screen and chiclet keyboard, ice blue chassis, AI-generated product illustration on white background, Dell logo'),
    imagePrompt:
      'Dell Inspiron 14 Plus laptop, slightly open showing 14-inch screen and chiclet keyboard, silver chassis, studio product photo white background, realistic e-commerce style, Dell logo',
    specs: [
      '14-inch FHD+ (1920×1200) IPS WVA anti-glare display; panel options vary by configuration',
      'AMD Ryzen AI 5 340 6-core processor, NPU for AI acceleration, up to 4.8 GHz',
      '16GB LPDDR5X onboard memory (speed varies by configuration), 512GB PCIe NVMe SSD',
      'AMD Radeon 840M integrated graphics',
      'Backlit keyboard, fingerprint power button, FHD 1080p IR Windows Hello webcam',
      '2x USB-C 3.2 Gen 2 with DisplayPort/Power Delivery, USB-A, HDMI 1.4, Wi-Fi 7, Bluetooth; about 1.52 kg, 65W USB-C charger (ports vary by configuration)',
    ],
    mrp: 84990,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Amazon',
        price: 73490,
        delivery: '3 days',
        url: amzSearch('Dell 14 Plus DB14255 Ryzen AI 5 340 16GB 512GB'),
        inStock: true,
      },
      {
        seller: 'Reliance Digital',
        price: 74990,
        delivery: '4–5 days',
        url: rdSearch('Dell 14 Plus DB14255 Ryzen AI 5 340 16GB 512GB'),
        inStock: true,
      },
    ],
  },
  {
    id: 'asus-vivobook-s14-snapdragon',
    slug: 'asus-vivobook-s14-snapdragon',
    name: 'ASUS Vivobook S14 S3407QA (Snapdragon X, 16GB, 512GB SSD, 14")',
    brand: 'ASUS',
    category: 'Laptops',
    image: imgUrl('ASUS Vivobook S14 thin and light laptop, open view, neutral grey body, 14-inch screen, studio product photography white background, realistic e-commerce render, ASUS Vivobook logo visible'),
    imagePrompt:
      'ASUS Vivobook S14 thin and light laptop, open view, neutral grey body, 14-inch screen, studio product photography white background, realistic e-commerce render, ASUS Vivobook logo visible',
    specs: [
      '14-inch 2.5K (2560 × 1600) LED-backlit anti-glare display for the documented S3407QA configuration',
      'Qualcomm Snapdragon X X1-26-100 8-core ARM processor, 45 TOPS NPU for AI tasks',
      '16GB LPDDR5X unified memory, 512GB SSD storage',
      'Qualcomm Adreno integrated GPU, Copilot+ PC AI features',
      '70Wh battery; battery life varies with workload and configuration',
      'Windows 11, Wi-Fi 6E (802.11ax), Bluetooth 5.3, USB-C PD charging; exact weight varies by SKU',
    ],
    mrp: 74990,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Flipkart',
        price: 65990,
        delivery: '3 days',
        url: fkSearch('ASUS Vivobook S14 S3407QA Snapdragon X 16GB 512GB'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 66990,
        delivery: '3–4 days',
        url: amzSearch('ASUS Vivobook S14 Snapdragon X 14 16GB 512GB'),
        inStock: true,
      },
    ],
  },
  {
    id: 'asus-vivobook-s16-snapdragon-oled',
    slug: 'asus-vivobook-s16-snapdragon-oled',
    name: 'ASUS Vivobook S16 S3607QA (Snapdragon X, 16GB, 512GB SSD, 16" OLED)',
    brand: 'ASUS',
    category: 'Laptops',
    image: imgUrl('ASUS Vivobook S16 16-inch large screen laptop, open front view, OLED display visible, silver chassis, studio e-commerce product shot, clean white background, realistic lighting, ASUS logo'),
    imagePrompt:
      'ASUS Vivobook S16 16-inch large screen laptop, open front view, OLED display visible, silver chassis, studio e-commerce product shot, clean white background, realistic lighting, ASUS logo',
    specs: [
      '16-inch FHD+ (1920×1200) OLED display, 95% DCI-P3 color gamut',
      'Qualcomm Snapdragon X X1-26-100 Octa-core ARM SoC, 45 TOPS AI NPU',
      '16GB LPDDR5X RAM, 512GB PCIe SSD storage',
      'Qualcomm Adreno GPU; 70Wh battery with runtime varying by workload and configuration',
      'Copilot+ PC: Recall, Cocreator, Live Captions / Translate on-device AI features',
      'Wi-Fi 6E (802.11ax), Bluetooth 5.3, USB-C PD charging; 70Wh battery, weight and other details vary by SKU',
    ],
    mrp: 98990,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Amazon',
        price: 72990,
        delivery: '3–4 days',
        url: amzSearch('ASUS Vivobook S16 S3607QA Snapdragon X OLED 16GB 512GB'),
        inStock: true,
      },
      {
        seller: 'Croma',
        price: 74990,
        delivery: '4 days',
        url: crSearch('ASUS Vivobook S16 16 inch OLED Snapdragon'),
        inStock: true,
      },
    ],
  },
  {
    id: 'sony-wh-ch520',
    slug: 'sony-wh-ch520',
    name: 'Sony WH-CH520 Wireless Headphones',
    brand: 'Sony',
    category: 'Headphones',
    image: imgUrl('Sony WH-CH520 matte black wireless on-ear headphones, front view, studio product photo white background, realistic e-commerce render, Sony logo, compact foldable design'),
    imagePrompt:
      'Sony WH-CH520 matte black wireless on-ear headphones, front view, studio product photo white background, realistic e-commerce render, Sony logo, compact foldable design',
    specs: [
      '30mm dynamic drivers, Sony DSEE music upscaling, balanced sound signature',
      'Lightweight on-ear design, soft padded ear cups for long comfort',
      'Battery life up to 50 hours; a 3-minute quick charge provides about 90 minutes of playback',
      'Bluetooth 5.2 multipoint (connect 2 devices simultaneously), SBC / AAC codecs',
      'Built-in microphone for hands-free calls and voice assistant access; this model does not offer active noise cancellation',
      'Sony Headphones Connect app EQ customization, foldable flat for travel',
    ],
    mrp: 5990,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Flipkart',
        price: 3999,
        delivery: '2 days',
        url: fkSearch('Sony WH-CH520 Wireless Headphones'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 4299,
        delivery: '2–3 days',
        url: amzSearch('Sony WH CH520 Bluetooth Wireless Headphones'),
        inStock: true,
      },
    ],
  },
  {
    id: 'nothing-headphone-1',
    slug: 'nothing-headphone-1',
    name: 'Nothing Headphone (1) Wireless ANC Over-Ear',
    brand: 'Nothing',
    category: 'Headphones',
    image: imgUrl('Nothing Headphone 1 transparent clear earcups with white body, side view showing transparent design, studio product photography white background, realistic e-commerce photo, Nothing dot-matrix logo visible'),
    imagePrompt:
      'Nothing Headphone 1 transparent clear earcups with white body, side view showing transparent design, studio product photography white background, realistic e-commerce photo, Nothing dot-matrix logo visible',
    specs: [
      'Transparent earcup design with tactile roller, paddle and button controls',
      '40mm dynamic drivers designed for detailed, full-range sound',
      'Active Noise Cancellation with a transparency mode for hearing your surroundings',
      'Battery life up to 80 hours with ANC off or 35 hours with ANC on; a 5-minute quick charge provides up to 5 hours of playback',
      'Bluetooth 5.3, dual-device multipoint, low-latency Gaming mode',
      'Four microphones for calls, Nothing X app EQ, USB-C audio and 3.5mm audio connection',
    ],
    mrp: 21999,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Croma',
        price: 7999,
        delivery: '3 days',
        url: crSearch('Nothing Headphone 1 Wireless ANC'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 8499,
        delivery: '2–3 days',
        url: amzSearch('Nothing Headphone 1 Over Ear Wireless ANC'),
        inStock: true,
      },
    ],
  },
]

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug)
}

export function getCategories() {
  return [...new Set(products.map((p) => p.category))]
}

export default products
