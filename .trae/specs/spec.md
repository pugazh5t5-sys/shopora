# Shopora - Product Requirements Document

> **Implementation status note — 28 October 2026:** This is an aspirational requirements document, not evidence that every requirement is currently met. The existing app is a static catalogue: all product entries use `dataIsLive: false`, the recorded date is 18 September 2026 (40 days old), and seller price/stock/delivery values do not have per-offer source URLs or capture timestamps. Ratings/review counts are unverified, and product images are generated illustrations rather than retailer photography. Do not describe the current catalogue as live or verified. The current code audit and launch blockers are in [`SHOPORA_AUDIT.md`](../../SHOPORA_AUDIT.md). The latest reviewed implementation is on the `audit/production-readiness-fixes` pull-request branch; it has not been merged into `main`.

## Overview
- **Summary**: Shopora is a price comparison web application that displays real-world consumer electronics products with verified current prices from multiple Indian retailers (Amazon, Flipkart, Croma, Reliance Digital), helping users find the lowest available price.
- **Purpose**: Build trust through transparency by using only real products with accurate pricing, eliminating fictional products and fake prices. Enable users to compare prices across retailers and navigate to actual deals.
- **Target Users**: Indian online shoppers looking for the best deals on smartphones, headphones, laptops, and consumer electronics.

## Goals
- Display 10–20 real products with verified real-world pricing (INR ₹) from Indian retailers
- Show price comparison across at least 2–4 sellers per product
- Automatically identify and highlight the lowest available price per product
- Provide transparent "Price updated" timestamps and clear disclaimers for non-live data
- Link every "View Deal" button to real retailer product pages (no fake URLs)
- Build an extensible architecture so live API data sources and additional products can be added later
- Deploy to GitHub under username pugazh

## Non-Goals
- Do not implement a backend server, database, or user accounts for MVP
- Do not implement live API integrations (architecture must support them, but MVP uses static verified data)
- Do not scrape retailer websites (use publicly displayed prices with clear attribution)
- Do not implement checkout, cart, or payment functionality
- Do not add user reviews, wishlists, or user-generated content for MVP
- Do not create fictional products, brands, or prices
- Do not label static data as "live price"

## Background & Context
The project is defined in `promp 2.md` which mandates:
- Real products only: Apple iPhone 15, Samsung Galaxy S24, OnePlus 12, Sony WH-1000XM5, JBL Tune 770NC, boAt Rockerz series, Lenovo IdeaPad, HP Pavilion, Dell Inspiron, ASUS Vivobook
- Real verified prices researched from 91mobiles, Flipkart, Amazon, Croma, price tracking sites (as of Sep 2026)
- Clear price transparency: MRP, discount, seller, availability, last updated
- MVP-first approach: smaller catalog with genuine info > large fake catalog

## Functional Requirements
- **FR-1**: Product catalog page showing all products with image, name, rating, best price, MRP, discount badge
- **FR-2**: Product search and category filtering (Smartphones, Headphones, Laptops)
- **FR-3**: Individual product detail page with full specs, rating, image gallery, MRP strike-through, current best price
- **FR-4**: Price comparison table per product showing all available sellers (sorted lowest→highest) with price, delivery estimate, and "View Deal" link
- **FR-5**: Automated lowest-price detection with 🏆 "Lowest Price: ₹XX,XXX" badge and "Price Difference: ₹XXX" calculation between lowest and highest offers
- **FR-6**: Every "View Deal" button opens the actual retailer product page in a new tab (Amazon.in, Flipkart.com, Croma.com product search URLs)
- **FR-7**: Price transparency footer on every product page: "Price updated: 18 Sep 2026" or "Price may have changed. Check retailer before purchasing."
- **FR-8**: Responsive design that works on mobile, tablet, and desktop
- **FR-9**: Navigation bar with Shopora logo, search bar, category links, and footer with disclaimer
- **FR-10**: Product data is loaded from a structured data layer (JSON file or module) that can be swapped for a live API later without rewriting UI components

## Non-Functional Requirements
- **NFR-1**: Page loads in under 3 seconds on a 4G connection (no heavy frameworks if avoidable)
- **NFR-2**: Clean, modern, visually polished UI consistent with Indian e-commerce price-comparison sites
- **NFR-3**: All prices formatted correctly as Indian Rupees (₹XX,XXX with comma separators)
- **NFR-4**: Zero fake retailer URLs — every deal link must point to a real search/product URL on Amazon.in, Flipkart.com, or Croma.com
- **NFR-5**: Product names, images, specs, and brands must match the real-world product exactly (no creative renaming)
- **NFR-6**: Code must be deployable as a static site (GitHub Pages / Vercel)
- **NFR-7**: Accessible: sufficient color contrast, semantic HTML, keyboard-navigable

## Constraints
- **Technical**: Static frontend stack (HTML/CSS/JS or lightweight framework like React/Vite) suitable for GitHub Pages deployment
- **Business**: All 10–20 products must be real with real Sep-2026 researched prices; no inventing prices
- **Dependencies**: No paid APIs for MVP; use static JSON data file compiled from publicly researched prices
- **Deployment**: GitHub repository at github.com/pugazh (user-provided GitHub username)

## Assumptions
- GitHub account "pugazh" exists and user will provide authentication/push access (or user will push the final code)
- For MVP, retailer links point to product search pages on the real retailer sites (e.g., amazon.in/s?k=Sony+WH-1000XM5) since exact product page URLs can change
- Image URLs use Unsplash / retailer CDN public product images that do not require authentication
- 10–15 products in MVP catalog is acceptable and meets the 10–20 product requirement
- 18 September 2026 is the seeded snapshot date, not the current date; on 28 October 2026 the snapshot is 40 days old

## Acceptance Criteria

### AC-1: Real product catalog with verified pricing
- **Type**: `rule`
- **Given**: The user opens the Shopora homepage
- **When**: They browse the product catalog
- **Then**: Every product (≥10, ≤20) is a real existing product (Apple iPhone 15, Samsung Galaxy S24, OnePlus 12, Sony WH-1000XM5, JBL Tune 770NC, boAt Rockerz, Lenovo IdeaPad, HP Pavilion, Dell Inspiron, ASUS Vivobook, etc.), with correct brand, model name, and real INR prices researched from Sep 2026 retailer data
- **Pass Condition**: All products have real model names; all prices fall within ranges verified by Sep-2026 web price sources (91mobiles, Flipkart, Amazon, Croma listings); no product is fictional
- **Evidence**: Visual inspection of catalog; cross-check product list against real product existence; spot-check 3 prices against research data in the data source JSON comments

### AC-2: Multi-seller price comparison table
- **Type**: `rule`
- **Given**: User is on a product detail page
- **When**: They scroll to the "Compare Prices" section
- **Then**: A table (or card grid) shows ≥2 seller offers per product, sorted from lowest to highest price. Each row shows Seller name (Amazon/Flipkart/Croma/Reliance Digital), Price (₹ formatted), Delivery estimate (text), and a "View Deal" button
- **Pass Condition**: ≥14 of 15 products have ≥2 seller rows; rows are sorted ascending by price; table has the four required columns
- **Evidence**: Open 3 random product pages and count/compare seller rows + sort order

### AC-3: Lowest price badge and price difference
- **Type**: `rule`
- **Given**: A product has multiple seller offers at different prices
- **When**: The product page loads
- **Then**: A clear 🏆 badge shows "Lowest Price: ₹XX,XXX" for the cheapest offer. The page also displays a "Price Difference: ₹XXX" value (highest offer − lowest offer) and strikes through the MRP with a discount % shown
- **Pass Condition**: 100% of multi-seller products display the lowest-price badge, price difference, MRP strike-through, and discount percentage matching the actual offer arithmetic
- **Evidence**: Manually verify badge math on Sony WH-1000XM5 (lowest ~₹27,949 vs MRP ₹34,990 → discount ~20%) and Samsung S24 (Croma ₹49,994 vs MRP ₹79,999 → ~37.5% off)

### AC-4: Real retailer links (no fake URLs)
- **Type**: `rule`
- **Given**: Any "View Deal" button on any product
- **When**: The user clicks it (or inspects href)
- **Then**: It opens a real retailer domain URL (amazon.in, flipkart.com, croma.com) for that product — never a fictional domain, localhost, or placeholder path
- **Pass Condition**: 100% of "View Deal" href values start with https://www.amazon.in, https://www.flipkart.com, https://www.croma.com, or https://www.reliancedigital.in (or their /s?k= search pages)
- **Evidence**: Grep all hrefs for "View Deal" buttons; verify none contain "example", "#", "placeholder", "localhost", or "/" only

### AC-5: Price transparency disclaimers
- **Type**: `rule`
- **Given**: User views any product detail page
- **When**: They look near the price block or footer
- **Then**: One of two labels is present: (a) "Price updated: 18 September 2026" with a matching timestamp OR (b) "Price may have changed. Check retailer before purchasing." with distinct styling
- **Pass Condition**: Every product page displays one of the two exact disclaimer strings; homepage catalog cards also display a "Prices as of 18 Sep 2026 • Check retailer" footer
- **Evidence**: Text search in rendered output for both strings; confirm at least one appears on every product page

### AC-6: Search and category filtering
- **Type**: `rule`
- **Given**: User is on the homepage with ≥10 products across 3 categories (Smartphones, Headphones, Laptops)
- **When**: They type "iPhone" in the search bar OR click the "Headphones" category filter
- **Then**: The product grid filters to only matching products (name contains search string, or matches category tag). A "Clear filters" option returns to full catalog.
- **Pass Condition**: Search "iPhone" returns ≥1 result (iPhone 15); clicking Headphones returns ≥3 results (Sony, JBL, boAt); both clearable
- **Evidence**: Manual UI test of search + 2 category filters

### AC-7: Responsive layout
- **Type**: `rubric`
- **Dimension**: Responsive design quality across mobile (320px), tablet (768px), desktop (1280px)
- **Scale**: 1-5
- **Anchors**: 1 = major breakage/horizontal scroll on mobile; 3 = functional but cramped on one breakpoint; 5 = polished, no overflow, grids reflow correctly, touch targets ≥44px on mobile
- **Pass Threshold**: >= 4
- **Evidence**: Chrome DevTools responsive mode screenshots / manual resize of 3 widths; check for horizontal scrollbars, overlapping text, or broken grids

### AC-8: Extensible data architecture
- **Type**: `rule`
- **Given**: A developer wants to add a new product or swap the static data for a live API
- **When**: They examine the codebase structure
- **Then**: Product data lives in a single dedicated module/JSON file (e.g., src/data/products.js or products.json) with a clear schema (id, name, brand, category, image, specs, mrp, rating, sellers[]). UI components import data from this module rather than hardcoding products. A comment/README in the data file describes how to add a product or wire up an API.
- **Pass Condition**: Grep returns zero products hardcoded inside JSX/HTML components; data module exists with schema containing at least: id, name, brand, category, image, specs array, mrp, rating, reviews, sellers array of {seller, price, delivery, url, inStock}
- **Evidence**: File tree inspection + grep for hardcoded product names; confirm data file matches schema

### AC-9: Deployable static build and GitHub repo structure
- **Type**: `rule`
- **Given**: The implementation is complete
- **When**: User runs the standard build command (or opens index.html for vanilla)
- **Then**: A production-ready static output is generated (or static files exist), with a README.md describing setup, and the repo is pushable to github.com/pugazh/shopora (the repo root is the project root, no nested weirdness)
- **Pass Condition**: Build runs with exit code 0 (if framework); no uncommitted secrets; package.json scripts are valid; README has "How to run locally" section; .gitignore excludes node_modules, dist, env
- **Evidence**: `npm run build` (or equivalent) exit code; ls of project root showing standard files

### AC-10: Overall UI polish
- **Type**: `rubric`
- **Dimension**: Visual quality of the Shopora experience vs real Indian price-comparison sites
- **Scale**: 1-5
- **Anchors**: 1 = raw unstyled HTML with tables; 3 = functional Bootstrap-like styling, decent grid, no major UX flaws; 5 = polished: consistent design system, gradient accents, hover states, product cards with shadow, rating stars, discount pills, smooth transitions, looks comparable to 91mobiles or PriceHunt catalog pages
- **Pass Threshold**: >= 4
- **Evidence**: Screenshot review of homepage, product card grid, product detail page, price comparison table; subjective assessment against anchor descriptions

## Open Questions
- [ ] Does the user prefer a vanilla HTML/CSS/JS static site or a React/Vite SPA? (Assumption: Vite + React for component reusability and maintainability, deployable to GitHub Pages/Vercel.)
- [ ] Will the user provide GitHub authentication to push, or will they push the code manually? (Assumption: We build locally and instruct user how to push, or use provided credentials.)
- [ ] Are Reliance Digital links required, or is Amazon + Flipkart + Croma acceptable for MVP? (Assumption: Include Reliance Digital links where possible, otherwise use Amazon/Flipkart/Croma minimum 2 sellers.)
- [ ] Should product images be sourced from Unsplash/Pexels public URLs, or does the user have a preferred CDN? (Assumption: Use the text_to_image endpoint for product-specific images per the Image Guidelines, with real product prompts.)
