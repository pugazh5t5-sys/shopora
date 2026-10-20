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
 *    - image:        string, full absolute URL to product image (https://...)
 *    - imagePrompt:  string, text_to_image prompt used to generate the image (for reproducibility)
 *    - specs:        array of strings — key specification bullets
 *    - mrp:          number, integer rupees, NO DECIMALS (MRP / launch price in INR)
 *    - rating:       number, 0-5 (e.g. 4.6)
 *    - reviews:      integer, total number of user reviews on retailers
 *    - lastUpdated:  ISO date string YYYY-MM-DD of the price data snapshot
 *    - dataIsLive:   boolean — true if prices come from live API refresh; false (MVP) = static researched snapshot
 *    - sellers:      array of objects:
 *          {
 *            seller:   "Amazon" | "Flipkart" | "Croma" | "Reliance Digital",
 *            price:    number, integer rupees, current listed selling price
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
 *          const res = await fetch('https://your-product-feed.example.com/in/products')
 *          const feed = await res.json()
 *          return feed.map(normalizeFeedItem)  // map external schema to the SAME schema above
 *        }
 *
 *   2. UI components already read data via a single import. Swap to the async loader
 *      in the page components and add a loading state. Schema compatibility means
 *      NO component code changes are required.
 *
 * PRICE RESEARCH SOURCES (snapshot 2026-09-18):
 *   - 91mobiles.com (price listings)
 *   - Flipkart.com (public product / search listings)
 *   - Amazon.in (public product / search listings)
 *   - Croma.com (public product pages)
 *   - Price tracking aggregators (price-history.in, mysmartprice.com, gadgetcrisp.com)
 *   These are INDICATIVE prices from public listings; always re-verify on retailer.
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
    rating: 4.6,
    reviews: 26366,
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
      'Samsung Exynos 2400 / Snapdragon 8 Gen 3, 8GB LPDDR5X, 256GB UFS',
      '50MP (OIS) + 12MP ultra-wide + 10MP 3x optical telephoto (OIS) triple rear',
      '12MP front camera, 4K video recording',
      '4000 mAh battery, 25W wired, 15W wireless charging, IP68',
      'Android 14 with One UI, 7 years OS/security updates, Circle to Search',
    ],
    mrp: 79999,
    rating: 4.5,
    reviews: 7855,
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
    rating: 4.6,
    reviews: 2050,
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
      'Industry-leading dual-processor ANC (QN1 + V1), 8 beamforming microphones',
      '30mm Carbon Fibre Composite drivers, LDAC Hi-Res Wireless Audio',
      'Battery: 30 hrs (ANC on) / 40 hrs (ANC off), USB-C quick charge (3 min = 3 hrs play)',
      'Multipoint Bluetooth 5.2 (2 devices simultaneous), Auto NC Optimizer',
      'Bone conduction sensor + 4 beamforming mics = crystal clear hands-free calls',
      'Lightweight 250g, speak-to-chat, adaptive sound control, Sony Headphones Connect app',
    ],
    mrp: 34990,
    rating: 4.6,
    reviews: 12456,
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
    rating: 4.3,
    reviews: 4120,
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
      'IPX4 splash resistant, 3.5mm AUX port (wired mode supported)',
    ],
    mrp: 8990,
    rating: 4.0,
    reviews: 3200,
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
      'Up to 20 hours playback on a single charge, fast USB charging',
      'Bluetooth 5.0, 3.5mm AUX input (dual connectivity wired/wireless)',
      'Adjustable padded headband + cushioned ear cups for long wear comfort',
      'boAt Rockerz signature sound: bass boosted for Bollywood, EDM, hip-hop',
      'Built-in HD mic with voice assistance support (Siri / Google Assistant)',
    ],
    mrp: 5990,
    rating: 4.2,
    reviews: 8910,
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
    name: 'Lenovo IdeaPad Slim 5 (13th Gen i5-13420H, 16GB, 1TB SSD, 14" OLED)',
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
      'Backlit keyboard, 720p webcam, dual speakers with Dolby Audio',
      'Windows 11 Home, lightweight ~1.5 kg, 2x USB-A + 2x USB-C + HDMI ports',
    ],
    mrp: 95000,
    rating: 4.4,
    reviews: 1680,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Flipkart',
        price: 76990,
        delivery: '3–4 days',
        url: fkSearch('Lenovo IdeaPad Slim 5 i5 13420H OLED 16GB 1TB'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 78990,
        delivery: '3 days',
        url: amzSearch('Lenovo IdeaPad Slim 5 13th Gen i5 OLED 16GB 1TB'),
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
      '15.6-inch FHD (1920×1080) IPS LCD anti-glare display, 60Hz',
      '12th Gen Intel Core i5-12450H 8-core processor (4 Performance + 4 Efficient)',
      '8GB DDR4 RAM (upgradable), 512GB M.2 PCIe NVMe SSD',
      'Integrated Intel UHD graphics, quiet cooling, everyday office performance',
      'Full-size keyboard with numpad, USB-C, 2x USB-A, HDMI, SD card reader',
      'Windows 11 Home, HD 720p webcam, dual 2W speakers, ~1.7 kg weight',
    ],
    mrp: 69990,
    rating: 4.2,
    reviews: 2310,
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
    name: 'HP Pavilion 14-ey0789AU (Ryzen 7 7840U, 16GB, 1TB SSD, 14" OLED)',
    brand: 'HP',
    category: 'Laptops',
    image: imgUrl('HP Pavilion 14 silver laptop, open display showing keyboard and touchpad, studio e-commerce photo front-angled, pure white background, realistic product shot, HP logo on screen lid'),
    imagePrompt:
      'HP Pavilion 14 silver laptop, open display showing keyboard and touchpad, studio e-commerce photo front-angled, pure white background, realistic product shot, HP logo on screen lid',
    specs: [
      '14-inch WUXGA (1920×1200) OLED 16:10 display, true blacks, 400+ nits',
      'AMD Ryzen 7 7840U 8-core / 16-thread, up to 5.1 GHz boost, Radeon 780M iGPU',
      '16GB LPDDR5 6400MHz RAM, 1TB PCIe NVMe M.2 SSD storage',
      'Full-size backlit keyboard, precision glass touchpad, IR FHD webcam for Windows Hello',
      'USB4 Type-C (PD + DP), 2x USB-A, HDMI 2.1, Wi-Fi 6E + BT 5.3',
      'Windows 11 Home, B&O tuned dual speakers, ~1.4 kg, 65W USB-C charging',
    ],
    mrp: 99999,
    rating: 4.3,
    reviews: 620,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Flipkart',
        price: 88856,
        delivery: '3 days',
        url: fkSearch('HP Pavilion 14 ey0789AU Ryzen 7 7840U OLED 16GB 1TB'),
        inStock: true,
      },
      {
        seller: 'Amazon',
        price: 89990,
        delivery: '3–4 days',
        url: amzSearch('HP Pavilion 14 AMD Ryzen 7 7840U OLED 16GB 1TB'),
        inStock: true,
      },
    ],
  },
  {
    id: 'dell-inspiron-14-plus-ryzen-ai',
    slug: 'dell-inspiron-14-plus-ryzen-ai',
    name: 'Dell Inspiron 14 Plus (AMD Ryzen AI 5, 16GB, 512GB SSD, 14")',
    brand: 'Dell',
    category: 'Laptops',
    image: imgUrl('Dell Inspiron 14 Plus laptop, slightly open showing 14-inch screen and chiclet keyboard, silver chassis, studio product photo white background, realistic e-commerce style, Dell logo'),
    imagePrompt:
      'Dell Inspiron 14 Plus laptop, slightly open showing 14-inch screen and chiclet keyboard, silver chassis, studio product photo white background, realistic e-commerce style, Dell logo',
    specs: [
      '14-inch WUXGA (1920×1200) 16:10 IPS LCD, 300 nits anti-glare ComfortView Plus',
      'AMD Ryzen AI 5 340 6-core processor, NPU for AI acceleration, up to 4.8 GHz',
      '16GB DDR5 5600MHz dual-channel RAM, 512GB PCIe NVMe SSD',
      'AMD Radeon 760M integrated graphics, Dolby Vision + Dolby Atmos',
      'Backlit keyboard, fingerprint power button, FHD 1080p IR Windows Hello webcam',
      'USB4 Type-C, 2x USB-A, HDMI 2.0, microSD, Wi-Fi 6, ~1.5 kg, 65W charger',
    ],
    mrp: 84990,
    rating: 4.0,
    reviews: 310,
    lastUpdated: '2026-09-18',
    dataIsLive: false,
    sellers: [
      {
        seller: 'Amazon',
        price: 73490,
        delivery: '3 days',
        url: amzSearch('Dell Inspiron 14 Plus AMD Ryzen AI 5 16GB 512GB'),
        inStock: true,
      },
      {
        seller: 'Reliance Digital',
        price: 74990,
        delivery: '4–5 days',
        url: rdSearch('Dell Inspiron 14 Plus Ryzen AI 5 16GB 512GB'),
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
      '14-inch WUXGA (1920×1200) IPS LCD display, 16:10, 300 nits',
      'Qualcomm Snapdragon X X1-26-100 8-core ARM processor, 45 TOPS NPU for AI tasks',
      '16GB LPDDR5X unified memory, 512GB SSD storage',
      'Qualcomm Adreno integrated GPU, Copilot+ PC AI features',
      'Fanless silent cooling, all-day battery life up to 22 hours on a charge',
      'Windows 11, Wi-Fi 7, USB-C PD charging, lightweight 1.39 kg MIL-STD-810H durable body',
    ],
    mrp: 74990,
    rating: 4.5,
    reviews: 1563,
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
      '16-inch FHD+ (1920×1200) OLED display, true blacks, 100% DCI-P3, Pantone validated',
      'Qualcomm Snapdragon X X1-26-100 Octa-core ARM SoC, 45 TOPS AI NPU',
      '16GB LPDDR5X RAM, 512GB PCIe SSD storage',
      'Qualcomm Adreno GPU, huge 32+ hours video playback battery life',
      'Copilot+ PC: Recall, Cocreator, Live Captions / Translate on-device AI features',
      'Fanless design, 1.6 kg, Wi-Fi 7, USB-C PD, 180° lay-flat hinge, MIL-STD-810H',
    ],
    mrp: 82990,
    rating: 4.5,
    reviews: 1563,
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
    name: 'Sony WH-CH520 Wireless Headphones with Basic Noise Cancellation',
    brand: 'Sony',
    category: 'Headphones',
    image: imgUrl('Sony WH-CH520 matte black wireless on-ear headphones, front view, studio product photo white background, realistic e-commerce render, Sony logo, compact foldable design'),
    imagePrompt:
      'Sony WH-CH520 matte black wireless on-ear headphones, front view, studio product photo white background, realistic e-commerce render, Sony logo, compact foldable design',
    specs: [
      '30mm dynamic drivers, Sony DSEE music upscaling, balanced sound signature',
      'Lightweight on-ear design, soft padded ear cups for long comfort',
      'Battery life up to 50 hours (ANC off), 5 min USB-C charge = 90 min playback',
      'Bluetooth 5.2 multipoint (connect 2 devices simultaneously), SBC / AAC codecs',
      'Ambient sound passthrough mode, built-in mics for clear calls and voice assistant',
      'Sony Headphones Connect app EQ customization, foldable flat for travel',
    ],
    mrp: 6990,
    rating: 4.2,
    reviews: 5800,
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
      'Signature Nothing transparent earcups design with Glyph interface LED',
      '40mm Beryllium-coated dynamic drivers, warm neutral tuning by Nothing audio team',
      'Hybrid Active Noise Cancellation up to 45 dB depth, adaptive transparency mode',
      'Battery 35 hrs (ANC off) / 25 hrs (ANC on), USB-C 10 min charge = 6 hrs play',
      'Bluetooth 5.3, dual-device multipoint, low-latency Gaming mode',
      '3 HD beamforming microphones for calls, Nothing X App EQ, 3.5mm AUX support',
    ],
    mrp: 9999,
    rating: 4.1,
    reviews: 980,
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
