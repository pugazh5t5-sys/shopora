# Shopora

Shopora is a React + Vite product catalogue that compares recorded offer snapshots for selected products sold by Indian retailers. It is a discovery tool, not a checkout or fulfilment platform.

## Capabilities

- Product catalogue with category filters and search
- Product detail pages with specifications and recorded seller offers
- In-stock-aware price recommendations
- Retailer links that open in a new tab
- Snapshot dates and freshness warnings
- Responsive layout and a local image fallback that supports project subpaths
- About, privacy-information, terms-of-use, and not-found routes
- Automated price-selection and catalogue regression tests

## Important limitations

**Prices are not live.** All current records use `dataIsLive: false` and a snapshot date of 18 September 2026. Prices, stock, delivery and seller data may be stale. Retailer URLs are search pages rather than guaranteed variant-specific product pages. Confirm the current listing with the retailer before purchase.

**Ratings and review counts are not shown.** The original catalogue numbers lacked per-retailer source URLs and capture timestamps, so they have been removed instead of being displayed as if they were trustworthy. Product images are AI-generated illustrations, not official retailer photographs; they may not accurately represent the exact variant.

Before presenting Shopora as a live price-comparison service, add a permitted retailer feed/API, save a source URL and capture timestamp per offer, schedule refreshes, monitor freshness and failures, and display data provenance. Do not scrape websites or claim offers are verified unless the source and its terms allow that use.

This repository currently has no backend, customer accounts, checkout, payment processing, live inventory, or server-side API. Privacy and terms pages are starter notices and must be reviewed against the actual hosting, analytics, affiliate links and data-processing setup before public commercial launch.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Local development

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test
npm run build
npm run preview
```

## Product data

Products are stored in `src/data/products.js`. Keep `lastUpdated` and `dataIsLive` accurate. Do not mark records live unless they come from a current, permitted feed. Add source URLs and capture timestamps for every product price, stock status, rating and review count before relying on that information.

## Continuous integration and deployment

GitHub Actions runs locked dependency installation, tests, a Vite production build, and uploads `dist/` as an artifact. It intentionally does not deploy to a hosting account because no valid target application or deployment credentials were configured. The Vite base and local image fallback are set up for subpath hosting, but the final host still needs its SPA fallback/rewrite rules tested.
