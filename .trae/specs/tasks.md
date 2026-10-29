> **Status note — 28 October 2026:** This file is the original implementation plan. Its `pending` labels were not maintained as a live task tracker and may not reflect implemented work. For current code, CI results, and outstanding blockers, see [`SHOPORA_AUDIT.md`](../../SHOPORA_AUDIT.md). The current branch has regression tests and a passing CI build, but live price feeds, dependency remediation, browser testing, and hosting deployment remain outstanding.

# Shopora - Implementation Plan

## Task 1: Scaffold Vite + React project and configure for static deployment
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Initialize Vite + React project in the webside directory
  - Install React Router DOM for client-side routing (homepage + product detail page)
  - Configure vite.config.js with correct base path for GitHub Pages compatibility
  - Add build/dev scripts to package.json
  - Create .gitignore for node_modules, dist, .env
  - Add index.html with proper meta tags, title "Shopora - Price Comparison India", and viewport
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `rule` TR-1.1: `npm install` completes with exit code 0 and no critical audit failures
  - `rule` TR-1.2: `npm run build` completes with exit code 0 and produces dist/ folder with index.html + assets
  - `rule` TR-1.3: Project root contains package.json, vite.config.js, .gitignore, index.html, src/ folder
- **Notes**: Use `npm create vite@latest . -- --template react` in the webside directory (be careful not to nest)

## Task 2: Create structured product data module (JSON/JS) with 15 real products
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Create `src/data/products.js` (or .json) exporting an array of 15 products with the full schema:
    - Required fields per product: id, slug, name, brand, category ("Smartphones" | "Headphones" | "Laptops"), image, imagePrompt, specs (array of key spec strings), mrp (number, INR), rating (0-5), reviews (number count), lastUpdated (ISO date string, today = 2026-09-18), dataIsLive (boolean, false for MVP)
    - sellers array: each seller has { seller ("Amazon" | "Flipkart" | "Croma" | "Reliance Digital"), price (number), delivery (string like "2–3 days"), url (real https:// retailer search URL), inStock (boolean) }
  - Include these exact 15 products with Sep-2026 researched prices:
    1. Apple iPhone 15 (128GB) — MRP ₹79,900, best ~₹57,900 (Flipkart), ~₹59,900 (Amazon)
    2. Samsung Galaxy S24 (8GB+256GB) — MRP ₹79,999, best ₹49,994 (Croma), ₹49,999 (Flipkart), ₹59,449 (Amazon)
    3. OnePlus 12 (12GB+256GB) — MRP ₹64,999, best ~₹50,599 (Flipkart), ₹53,999 (Amazon)
    4. Sony WH-1000XM5 (Black) — MRP ₹34,990, best ₹27,949 (Amazon), ₹27,990 (Flipkart)
    5. JBL Tune 770NC — MRP ₹7,999, best ₹3,999 (Amazon), ₹4,499 (Flipkart), ₹4,999 (Croma)
    6. boAt Rockerz 650 Pro — MRP ₹8,990, best ₹2,499 (Croma), ₹2,299 (Amazon)
    7. boAt Rockerz 550 — MRP ₹5,990, best ₹1,799 (Flipkart), ₹1,899 (Amazon)
    8. Lenovo IdeaPad Slim 5 (i5-13420H, 16GB, 1TB SSD, OLED) — MRP ₹95,000, best ₹76,990 (Flipkart)
    9. Lenovo IdeaPad Slim 3 (15IAH8, Core i5, 8GB, 512GB SSD) — MRP ₹69,990, best ₹49,990 (Amazon)
    10. HP Pavilion 14-ey0789AU (Ryzen 7, 16GB, 1TB SSD, OLED) — MRP ₹99,999, best ₹88,856 (Flipkart)
    11. Dell Inspiron 14 Plus (Ryzen AI 5, 16GB, 512GB SSD) — MRP ₹84,990, best ₹73,490 (Amazon)
    12. ASUS Vivobook S14 S3407QA (Snapdragon X, 16GB, 512GB SSD) — MRP ₹74,990, best ₹65,990 (Flipkart)
    13. ASUS Vivobook S16 S3607QA (Snapdragon X, 16GB, 512GB SSD, OLED) — MRP ₹82,990, best ₹72,990 (Amazon)
    14. Sony WH-CH520 (Basic ANC) — MRP ₹6,990, best ₹3,999 (Flipkart), ₹4,299 (Amazon)
    15. Nothing Headphone (1) — MRP ₹9,999, best ₹7,999 (Croma), ₹8,499 (Amazon)
  - Add a header comment block in products.js describing how to add a new product (schema rules) and how to swap in a live data fetch (API endpoint, data shape mapping)
- **Acceptance Criteria Addressed**: AC-1, AC-8
- **Test Requirements**:
  - `rule` TR-2.1: products.js exports an array of exactly 15 items; every item has all required fields with correct types (id=string, mrp=number, sellers=array of ≥2 objects)
  - `rule` TR-2.2: At least 14 of 15 products have ≥2 seller entries; sellers[].url all start with "https://www.amazon.in", "https://www.flipkart.com", "https://www.croma.com", or "https://www.reliancedigital.in" (no fake/relative URLs)
  - `rule` TR-2.3: Samsung Galaxy S24 mrp = 79999 and at least one seller has price = 49994 (Croma verified); Sony WH-1000XM5 best seller ≤ 28000; prices are integers in ₹ (no decimals)
  - `rubric` TR-2.4: Data quality and schema completeness; scale 1-5; anchors 1=missing 3+ fields / <10 products, 3=complete schema but many specs arrays empty, 5=every product has ≥5 detailed specs, ≥2 sellers, valid imagePrompt, realistic delivery strings
- **Notes**: Product search URLs: Amazon = https://www.amazon.in/s?k=URL_ENCODED_NAME ; Flipkart = https://www.flipkart.com/search?q=URL_ENCODED_NAME ; Croma = https://www.croma.com/search?q=URL_ENCODED_NAME

## Task 3: Generate real product images via text_to_image and build image asset layer
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - For each of the 15 products in products.js, generate a product image using the approved API endpoint with a detailed, realistic prompt
  - Image sizes: use `landscape_4_3` for category cards, or `square` for product detail hero — document the choice and apply consistently
  - Store image URLs directly in products[].image (the full absolute https://coresg-normal.trae.ai URL)
  - Prompt examples: "Apple iPhone 15 Black color, front view with screen off, studio product shot on white background, realistic e-commerce photo, high detail" ; "Sony WH-1000XM5 black over-ear headphones, studio product photography, white background, soft shadows"
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `rule` TR-3.1: All 15 products[].image values are non-empty full URLs starting with https://coresg-normal.trae.ai (no empty string, no relative path)
  - `rubric` TR-3.2: Visual realism of generated images; scale 1-5; anchors 1=images clearly not matching product / cartoonish, 3=acceptable generic device renders, 5=images look like real e-commerce product photos matching the product name, brand, and colorway
- **Notes**: Generate in batches of 5 to avoid rate issues; reuse imagePrompt field in products.js for traceability

## Task 4: Build shared layout components (Navbar, Footer, ProductCard)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2, Task 3
- **Description**:
  - Create `src/components/Navbar.jsx`: Shopora logo (text + icon), search input field (controlled component, onSubmit / onChange triggers filter), category chips (All / Smartphones / Headphones / Laptops) that filter product grid. Sticky top, dark accent color.
  - Create `src/components/Footer.jsx`: Contains: "Prices as of 18 September 2026 • Prices may have changed. Check retailer before purchasing." Shopora copyright, About / Privacy links (anchor stubs), "Made in India 🇮🇳" microcopy.
  - Create `src/components/ProductCard.jsx`: Card component used in homepage grid. Displays: product image, brand label (uppercase pill), name (truncate 2 lines), ⭐ rating stars + "(n reviews)", MRP strikethrough (₹ formatted), best seller price highlighted big, discount % pill in red ("-XX% off"), 🏆 "Best Price" micro-badge. Clicking the card navigates to `/product/:slug`.
  - Create `src/utils/format.js`: Helper to format INR prices `formatINR(59900) → "₹59,900"`, `calculateDiscount(mrp, price) → percent integer`, `findBestSeller(sellers) → seller object with lowest price`. 100% unit-testable pure functions.
  - Create `src/index.css` + reset: Design tokens in CSS variables — colors (primary indigo/purple gradient for Shopora, secondary for accents, neutral grays, red for discount, green for in-stock), font stack Inter/system sans, font sizes, box-shadow presets, border-radius 12px standard.
- **Acceptance Criteria Addressed**: AC-6, AC-5, NFR-2, NFR-7
- **Test Requirements**:
  - `rule` TR-4.1: formatINR produces correct comma formatting for 59900→₹59,900, 1799→₹1,799, 200000→₹2,00,000 (Indian numbering: last 3 comma then 2); calculateDiscount(79999, 49994) returns 37 (37.51 floor)
  - `rule` TR-4.2: ProductCard shows all 7 required elements (image, brand, name, rating, mrp strike, best price, discount pill); clicking navigates to correct slug route
  - `rule` TR-4.3: Footer component contains the exact disclaimer text "Prices as of 18 September 2026" or "Prices may have changed. Check retailer before purchasing." (string match)
  - `rubric` TR-4.4: Component visual polish; scale 1-5; anchors 1=no CSS/broken, 3=functional grid utilitarian, 5=gradient navbar, card shadows, hover lift transitions, discount pill with icon, star ratings are solid stars not text chars

## Task 5: Build Homepage (catalog grid + search + filters)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - Create `src/pages/HomePage.jsx`: Hero section with headline "Find the Lowest Price on Real Products — Shopora India", subcopy "Compare prices across Amazon, Flipkart, Croma & Reliance Digital. No fake products. No fake prices." and accent CTA button "Browse All Products"
  - Below hero: Filter bar: search box + category pill tabs (All | Smartphones | Headphones | Laptops). Show "Showing N of 15 products" count badge and "Clear filters" button when active.
  - Product grid: responsive CSS grid (1 col mobile / 2 col tablet / 4 col desktop), map over products → ProductCard
  - Filter logic: pure functions. Search is case-insensitive substring match on name + brand + specs[] strings. Category filter is exact match on product.category. When both are active, AND them.
  - Empty state: if 0 results, show friendly "No products match your filters. Try clearing filters or searching differently."
  - "Featured categories" section above grid or below hero: 3 big cards (Smartphones 📱, Headphones 🎧, Laptops 💻) with clickable filter buttons.
- **Acceptance Criteria Addressed**: AC-1, AC-6, AC-7, AC-10
- **Test Requirements**:
  - `rule` TR-5.1: Searching "iphone" shows ≥1 cards; searching "WH-1000XM5" shows exactly Sony card; searching "xyz123nope" shows empty state, not broken grid
  - `rule` TR-5.2: Clicking "Laptops" category filters to ≥4 laptop-only products (Lenovo x2, HP, Dell, ASUS x2 = 6 laptops total); count badge says "Showing 6 of 15 products"
  - `rule` TR-5.3: Clear filters restores grid to 15 products and search input empties
  - `rubric` TR-5.4: Homepage layout quality; scale 1-5; anchors 1=no hero, cards stacked raw, 3=decent 2-col grid basic hero, 5=hero with gradient background or device mock image, filter bar with pill hover states, 4-col desktop grid with even spacing, featured section

## Task 6: Build Product Detail Page (product info + price comparison table)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4, Task 3
- **Description**:
  - Create `src/pages/ProductPage.jsx`: Route `/product/:slug`. Uses useParams() to find product in data.
  - 404 handling: if slug not found, show "Product not found. Return to Shopora homepage." link
  - Page layout: Two columns on desktop (image left / info right), stacked on mobile. Left column: big hero image. Right column: Brand label, Product Name (H1), ⭐ rating with review count, MRP strikethrough ₹, BIG best price display, 🏆 gold banner "🏆 Lowest available price" with formatINR. Next to it small green/red pill "In Stock" / "Out of Stock".
  - Below price: discount calculation line "You save ₹XX,XXX (XX% off MRP)". Price transparency line: "Price updated: 18 September 2026 • dataIsLive ? 'Live' : 'Prices may vary at checkout'".
  - CTA button: PRIMARY — "View Best Deal" → links to bestSeller.url, target="_blank" rel="noopener noreferrer". SECONDARY — "Compare All Offers" anchor to price table below.
  - "Key Specifications" section: unordered list of specs[] with checkmark icons.
  - "### Compare Prices" section: H2. Table (or card grid on mobile) with columns: Seller, Price, Delivery, Availability, Action. Rows sorted ascending by price (lowest first). First row gets a 🏆 "Lowest" badge in Seller column. Last row gets "Highest Price" faint annotation. After the table: "Price Difference: ₹X,XXX" calc (highest − lowest). "Savings vs MRP: ₹X,XXX (XX%)"
  - Every seller "View Deal" row button: same target=_blank + rel=noopener pattern. Seller names styled with logo colors (Amazon orange, Flipkart blue, Croma green, Reliance red).
  - Below compare table: Price transparency box — if dataIsLive=false, prominently display **"Price may have changed. Check retailer before purchasing."** in a yellow warning style box.
  - "Back to all products" breadcrumb link at top of page.
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `rule` TR-6.1: Sony WH-1000XM5 product page shows compare table with ≥2 rows, sorted ascending; row 1 price ≤ row 2 price; 🏆 badge on row 1; "Price Difference" equals exact arithmetic (max-min) of seller prices
  - `rule` TR-6.2: All "View Deal" buttons (primary CTA + per-seller action buttons) have href starting with https:// and target="_blank" rel="noopener noreferrer" (grep via browser dev tools or test)
  - `rule` TR-6.3: Warning text "Price may have changed. Check retailer before purchasing." appears (exact string) on the product detail page (dataIsLive=false path)
  - `rule` TR-6.4: "You save ₹X (Y% off MRP)" matches: X = mrp − bestPrice; Y = Math.round(((mrp − bestPrice) / mrp) * 100). Test on Samsung S24 (mrp 79999, best 49994 → save 30005, 38%)
  - `rubric` TR-6.5: Product page polish; scale 1-5; anchors 1=raw paragraphs stacked, 3=two-column works basic table, 5=seller badges with brand colors, row hover highlight, primary CTA is big gradient button, 🏆 banner has gradient, warning box is amber bordered, specs list with icons

## Task 7: Wire routing and App.jsx entry
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 5, Task 6
- **Description**:
  - Update `src/App.jsx`: import BrowserRouter (createHashRouter for better GitHub Pages compatibility — choose one and document why), Routes with "/" → HomePage, "/product/:slug" → ProductPage, catch-all "*" redirect to "/"
  - Wrap with Navbar at top + Footer at bottom, main content in between
  - Add scroll-to-top on route change (useEffect on location.pathname → window.scrollTo(0,0))
  - Import index.css design tokens into App
- **Acceptance Criteria Addressed**: All (routing prerequisite)
- **Test Requirements**:
  - `rule` TR-7.1: Home route "/" renders Navbar + grid + Footer
  - `rule` TR-7.2: Deep link "/product/apple-iphone-15-128gb" (or correct slug) resolves to the iPhone product page without 404
  - `rule` TR-7.3: Deep link "/product/nonexistent-slug-xyz" shows 404 friendly message

## Task 8: Final styling pass, responsive fixes, accessibility audit
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 7
- **Description**:
  - Mobile breakpoint (≤640px): product grid → 1 col, product page → stacked, price comparison table becomes card grid (seller name big top, price big, delivery small, View Deal button full width below)
  - Tablet (641–1023px): grid 2 col, product page 2 col narrow
  - Desktop (≥1024px): grid 4 col
  - Accessibility: Add aria-labels to search input ("Search products"), all buttons have accessible names, contrast on discount pill white-on-red ≥ AA, heading hierarchy: Home has H1 (hero) → H2 (Featured / Results), Product page has H1 (name) → H2 (Key Specs / Compare Prices), no skipped heading levels
  - Touch targets: all clickable cards/buttons ≥44x44px on mobile
  - Keyboard: Tab order is natural (navbar → search → filters → products → footer); Enter activates focused product card or button
- **Acceptance Criteria Addressed**: AC-7, NFR-7
- **Test Requirements**:
  - `rule` TR-8.1: At 375px viewport width, there is no horizontal scrollbar (document.documentElement.scrollWidth ≤ clientWidth)
  - `rule` TR-8.2: Tab key navigates the homepage in logical order; hitting Enter on a focused ProductCard triggers navigation to that product
  - `rubric` TR-8.3: Responsive behavior polish; scale 1-5; anchors 1=breakage on mobile, 3=works but no table→cards conversion on small screens, 5=breakpoints perfect at every size, table→cards graceful, no overflow anywhere

## Task 9: Create README, verify build, prepare for GitHub deployment
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 8
- **Description**:
  - Write README.md in project root:
    - Title: "Shopora — Real Product Price Comparison India"
    - Screenshot placeholder / "Screenshots coming after first deploy" line
    - "About Shopora" paragraph summarizing (real products, real prices, compare Amazon/Flipkart/Croma, no fakes)
    - "Tech Stack": Vite, React 18, React Router, CSS variables (no UI library)
    - "How to run locally": `npm install` → `npm run dev` → open http://localhost:5173
    - "How to build for production": `npm run build` → output in `dist/`, deploy dist folder to GitHub Pages / Vercel / Netlify
    - "Products & Data Source": "15 real consumer-electronics products. Prices researched September 18, 2026 from publicly listed prices on 91mobiles, Flipkart, Amazon, and Croma. Product data lives in `src/data/products.js` — see comments inside that file to add products or swap in a live API."
    - "Disclaimer": "All prices are indicative and collected from public listings. Shopora is a comparison tool, not a retailer. Always verify final price on the retailer's website before purchase. All product names, brands, and logos are property of their respective owners."
    - "Deploy to GitHub Pages": Short section: (1) create repo at github.com/pugazh/shopora, (2) push project, (3) enable Pages on main branch / docs or use gh-pages script, (4) adjust vite base path if needed (already configured)
  - Run final `npm run build` and fix any warnings
  - Run dev server and smoke-test all 15 product pages, homepage search, 3 categories
  - Double-check NO placeholder URLs remain in seller links (no "example.com", no "#", no "")
- **Acceptance Criteria Addressed**: AC-9, NFR-6
- **Test Requirements**:
  - `rule` TR-9.1: README.md exists in project root, contains the 7 sections listed above (About, Tech Stack, Run locally, Build, Data Source, Disclaimer, Deploy) — presence of each heading
  - `rule` TR-9.2: `npm run build` exits with code 0, no "ERROR" in output
  - `rule` TR-9.3: Grep for "example.com", "PLACEHOLDER", "TODO", "href=\"#\"" across src/ returns zero matches (except README TODO=0 allowed only if not there)
  - `rubric` TR-9.4: Production readiness; scale 1-5; anchors 1=build broken / hardcoded localhost links, 3=builds fine but no disclaimer, 5=builds clean, README is comprehensive, seller links verified, .gitignore correct, no build warnings

## Task 10: Initialize Git repo and push to GitHub (pugazh username)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 9
- **Description**:
  - Init git repo: `git init` in webside directory
  - Create initial commit: standard message "feat: initial Shopora MVP — 15 real products, price comparison, responsive UI"
  - Default branch: `main`
  - Document in task completion evidence the git steps the user needs OR push to github.com/pugazh/shopora if auth is available
  - If push auth unavailable: Output clear copy-paste instructions for user:
    ```
    git remote add origin https://github.com/pugazh/shopora.git
    git branch -M main
    git push -u origin main
    ```
  - Add "Enable GitHub Pages" instructions pointing to `dist/` folder OR suggest adding `gh-pages` npm package for auto-deploy
- **Acceptance Criteria Addressed**: User-requested GitHub deliverable
- **Test Requirements**:
  - `rule` TR-10.1: `git status` shows a clean tree or expected untracked dist/ (dist/ should be in .gitignore)
  - `rule` TR-10.2: `git log -1` exists with a sensible commit message
  - `rubric` TR-10.3: Git + GitHub readiness; scale 1-5; anchors 1=.git doesn't exist / secret files staged, 3=repo init'd commit made, 5=remote configured OR clear 3-line instructions provided, branch named main, .gitignore correct, no secrets in commit history
- **Notes**: We cannot actually push without user auth, so we will do local init+commit and give exact instructions. Also mention Vercel deploy option for the user as an alternative to GH Pages.
