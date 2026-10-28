# Shopora — Code and Production-Readiness Audit

**Audit date:** 28 October 2026  
**Scope:** Uploaded source archive and GitHub pull request branch  
**Verdict:** Improved, but **not ready to be marketed as a live price-comparison service**.

## Executive summary

Shopora is a client-side React/Vite catalogue with 15 static product records. There is no live retailer feed, backend, scheduled price refresh, inventory check, checkout or payment flow. All current offers are marked as static and share the snapshot date 18 September 2026, 40 days before the audit date. Retailer links are search pages, not guaranteed variant-specific product pages.

The original UI used “latest” and “verified” wording unsupported by its code. The PR replaces that wording with snapshot/freshness labels and makes best-buy logic depend on offers marked in stock.

## Findings and fixes

| Severity | Finding | Status |
|---|---|---|
| P1 — launch blocker | Static prices have no per-offer source URL, capture timestamp, provenance or refresh | UI calls them snapshots and warns shoppers. Authorized feeds, provenance and refresh monitoring remain unimplemented. |
| P1 — dependency security | The original lockfile resolved old Vite and React Router releases; the initial dependency install reported 5 vulnerabilities (3 moderate, 2 high) | Upgraded to Vite 8.3.5, `@vitejs/plugin-react` 6.1.2, and `react-router-dom` 7.18.5. After lockfile regeneration, GitHub Actions `npm audit` reported 0 vulnerabilities. CI now gates on `npm audit --audit-level=moderate`. |
| P1 — catalogue trust | Product ratings/review counts lack source URLs and capture timestamps; imagery is generated, not official retailer photography | Removed unverified rating/review numbers from the data and UI, and disclosed that product images are AI-generated illustrations. Only add ratings/reviews back with source URLs and capture timestamps; replace or license images before a real shopping launch. |
| P1 — product specification accuracy | Sony WH-CH520 had unsupported ANC wording; Sony WH-1000XM5 had a false microphone-count claim; Galaxy S24 processor was generalized incorrectly for India; boAt 650 Pro water-resistance rating (corrected to IPX4), ASUS Vivobook panel/wireless claims, Lenovo Slim 3 memory type, Dell 14 Plus GPU/ports, HP Pavilion Plus model name/display/camera/ports/memory claims, unsupported Dell Dolby claims, and ASUS S16 color gamut were inaccurate | Corrected the known claims against manufacturer references, including Dell 14 Plus DB14255 Radeon 840M/ports, Lenovo Slim 3 LPDDR5 memory, ASUS S3407QA 2.5K display/Wi-Fi 6E, and ASUS S3607QA Wi-Fi 6E. The HP Pavilion Plus 14-ey0789AU was corrected to the full model name, 2.8K OLED, 48–120Hz, 100% DCI-P3, LPDDR5X-6400 memory, 5MP IR camera and USB-C 10Gbps; ASUS S16 OLED gamut was corrected to 95% DCI-P3, and unsupported Dell Dolby Vision/Atmos claims were removed. Official sources are linked below. Other catalog specs and all historical seller prices still need source-by-source review. |
| P1 — deployment workflow | Previous Azure workflow contained a placeholder app name and did not represent a configured deployment | Replaced by CI that installs dependencies, runs tests/build, and uploads the build artifact. Real hosting is not configured. |
| P2 — price ranking | An out-of-stock offer could be selected as the best deal | Best/worst purchase recommendations now consider only valid, in-stock offers. Unavailable offers remain visible but are not recommended. |
| P2 — asset paths | Favicon and image fallback used root-relative public URLs, which can break when hosted under a project path such as GitHub Pages | Favicon uses Vite's `%BASE_URL%` token and image fallback uses `import.meta.env.BASE_URL`. Test at the final host before launch. |
| P2 — navigation | Footer policy links returned home, unknown routes had no catch-all, and the comparison fragment interacted badly with HashRouter | Added About/Privacy/Terms/404 routes and a button that scrolls to the comparison section without changing the router hash. |
| P2 — accessibility/resilience | Broken external images and keyboard focus styling were weak | Added a local image fallback, accessible image descriptions, visible keyboard focus, and rating-data disclosures. |
| P2 — maintenance | No tests and minimal documentation | Added Node tests for stock-aware price selection, invalid dates, retailer URLs, and known product-spec corrections; expanded README and audit report. |

## Source references reviewed

- Sony's [WH-CH520 official page](https://www.sony.co.in/headphones/products/wh-ch520) and [headphone catalogue](https://www.sony.co.in/headphones/headband) for features and reference MRP.
- Sony's [WH-1000XM5 page](https://www.sony.co.in/headphones/products/wh-1000xm5) for call-microphone wording.
- Samsung's [processor showcase](https://semiconductor.samsung.com/processor/showcase/smartphone/) lists Galaxy S24 with Exynos 2400; processor choice differs by region.
- boAt's [Rockerz 650 Pro official listing](https://www.boat-lifestyle.com/products/rockerz-650-pro) documents 80-hour playback and IPX4 water resistance; the official page was used to correct the earlier IPX5 claim.
- ASUS's official [S14 S3407QA technical specifications](https://www.asus.com/in/laptops/for-home/vivobook/asus-vivobook-s14-s3407q/techspec/) list the documented S14 configuration's 2.5K LED-backlit panel and Wi-Fi 6E; the [S16 S3607QA technical specifications](https://www.asus.com/in/laptops/for-home/vivobook/asus-vivobook-s16-s3607q/techspec/) list the FHD+ OLED panel and Wi-Fi 6E. Exact configurations should still be checked by SKU.
- HP's [Pavilion Plus 14-ey0000 specifications](https://support.hp.com/gb-en/document/ish_9174005-9174073-16) list 2.8K OLED options for the Ryzen 7 7840U; HP's [specification PDF](https://cdn.cs.1worldsync.com/syndication/mediaserverredirect/64f51c619a57f10b778bd1ab4d496453/original.pdf) identifies the 14-ey0789AU display, memory, storage and graphics. These were used to correct the former WUXGA/USB4 claims.
- Dell's [14 Plus DB14255 product page](https://www.dell.com/en-us/shop/dell-laptops/spd/dellplus14laptopdb14255) lists Radeon 840M for Ryzen AI 5 340 and the USB-C 3.2 Gen 2 / HDMI 1.4 ports; the older internal product naming and Radeon 760M / USB4 claims were inaccurate.
- Lenovo's [IdeaPad Slim 3 15IAH8 PSREF](https://psref.lenovo.com/WDProduct/IdeaPad/IdeaPad_Slim_3_15IAH8?MT=83ER) lists soldered LPDDR5-4800 memory and display options that vary by configuration. Lenovo's [IdeaPad Slim 5i 14IRH10 catalog](https://www.lenovo.com/in/outletin/en/p/laptops/ideapad/ideapad-s-series/lenovo-ideapad-slim-5i-gen-10-14-inch-intel/83hrr000r0) matches the documented i5-13420H / OLED config and FHD IR camera.
- Nothing's [Headphone (1) official page](https://in.nothing.tech/products/headphone-1) and [Business Standard launch coverage](https://www.business-standard.com/technology/tech-news/nothing-headphone-1-with-kef-tuning-launched-in-india-check-price-offers-125070200356_1.html) were used for feature copy and launch reference price. A later [Gadgets 360 price listing](https://www.gadgets360.com/nothing-headphone-1-price-in-india-133349) shows the old ₹7,999–₹8,499 offers need rechecking; it does not prove the historic September price.

## Dependency-security references

- [Vite advisory GHSA-rq7h-c2jc-7f22](https://github.com/vitejs/vite/security/advisories/GHSA-rq7h-c2jc-7f22)
- [Vite advisory GHSA-8g5g-mxqh-grgj](https://github.com/vitejs/vite/security/advisories/GHSA-8g5g-mxqh-grgj)
- [React Router security advisory](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6)

The first local `npm audit` request failed with DNS error `EAI_AGAIN registry.npmjs.org`. The dependency lockfile has since been regenerated on GitHub Actions after upgrading Vite to 8.3.5, `@vitejs/plugin-react` to 6.1.2, and React Router DOM to 7.18.5; that run's `npm audit` reported **0 vulnerabilities**. The permanent CI workflow now runs `npm audit --audit-level=moderate`. Security results reflect the current lockfile at audit time and must be rerun as dependencies change.

## Verification

- The latest [GitHub Actions validation run](https://github.com/pugazh5t5-sys/shopora/actions/runs/40617725384) on commit `f677684b5474d33515b14c586a7e58667814c5ed` passed locked dependency installation, `npm audit --audit-level=moderate` (**0 vulnerabilities**), all 11 Node tests, the Vite production build, and artifact upload.
- Browser/visual/accessibility tests have not been run.
- No hosting deployment has been attempted.

## Required before real-user launch

1. Keep dependencies current and pass the permanent CI gate: `npm ci`, `npm audit --audit-level=moderate`, `npm test`, and `npm run build`.
2. Revalidate every product spec, reference MRP, seller price, stock label, delivery estimate, rating and review count with authoritative sources; store per-offer source URLs and capture timestamps.
3. Replace generated pictures with licensed/authorized variant-correct imagery, or keep the illustrative disclosure prominent.
4. Implement authorized live data retrieval, scheduled refresh, stale-data handling, monitoring and provenance display if Shopora is to be marketed as live pricing.
5. Configure the actual host and test subpath asset resolution, SPA fallback, HTTPS, headers, caching and error monitoring.
6. Review starter privacy/terms text for hosting, analytics and affiliate use; add disclosures where applicable.
7. Add browser-level smoke tests plus mobile/desktop accessibility and performance checks.
