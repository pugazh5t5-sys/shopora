> **Historical build prompt — 28 October 2026:** The example prices and star ratings below are illustrative requirements, not verified current values. The implementation uses static price snapshots dated 18 September 2026, and rating/review figures have been removed until source URLs and capture timestamps can substantiate them. See [`SHOPORA_AUDIT.md`](SHOPORA_AUDIT.md) for current status.

## CRITICAL: USE REAL PRODUCTS AND REAL CURRENT PRICES

Shopora must display **real-world products that actually exist** and, when live data is available, show their **current real selling prices in Indian Rupees (₹)**.

### DO NOT

* Do not create fictional products.
* Do not invent brands.
* Do not invent prices and label them as current.
* Do not make fake Amazon/Flipkart product links.
* Do not show "live price" when the price is actually static demo data.

### PRODUCTS

Use real products such as:

* Apple iPhone 15
* Samsung Galaxy S24
* OnePlus 12
* Sony WH-1000XM5
* JBL Tune 770NC
* boAt Rockerz series
* Lenovo IdeaPad
* HP Pavilion
* Dell Inspiron
* ASUS Vivobook

The product name, brand, image, specifications and model must correspond to the actual product.

### REAL PRICE

Display prices in Indian Rupees:

**₹49,999**

**₹29,990**

**₹2,499**

Show:

* Current selling price
* MRP when available
* Discount
* Availability
* Seller/store
* Last updated time

### LIVE DATA

Build the application so product data comes from a legitimate live API, product feed, affiliate feed, or other authorized source whenever possible.

Do not scrape retailer websites in a way that violates their terms.

For example, a product data source may provide fields such as product title, image, availability, price, MRP and product URL. Google's Merchant API supports product price, MRP for India, availability, images, product links and other product attributes.

### PRICE COMPARISON

For each product, show:

**Best Available Price**

Then compare available seller offers:

Amazon — ₹XX,XXX — View Deal
Flipkart — ₹XX,XXX — View Deal
Croma — ₹XX,XXX — View Deal
Reliance Digital — ₹XX,XXX — View Deal

Automatically identify the lowest available offer.

Display:

🏆 **Lowest Price: ₹XX,XXX**

Also calculate:

**Price Difference: ₹XXX**

### PRODUCT PAGE

Example layout:

Sony WH-1000XM5

⭐ 4.6 (12,456 reviews)

~~₹34,990~~
**₹29,990**

**🏆 Lowest available price**

[View Best Deal]

Then:

### Compare Prices

| Seller  |   Price | Delivery | Action    |
| ------- | ------: | -------- | --------- |
| Store A | ₹29,990 | 2–3 days | View Deal |
| Store B | ₹30,499 | 2–4 days | View Deal |
| Store C | ₹31,999 | 1–3 days | View Deal |

Sort offers from lowest to highest price.

### LINKS

Every "View Deal" button must lead to the **actual product page supplied by the data source**.

Never generate fake retailer URLs.

### PRICE TRANSPARENCY

Every live price should display:

**Price updated: [date/time]**

If the source is not live, clearly display:

**Price may have changed. Check retailer before purchasing.**

Do not claim that static fallback prices are live.

### IMPORTANT MVP APPROACH

Start with **10–20 real products** and make the data flow work correctly.

A smaller catalog with genuine product information and trustworthy pricing is much better than hundreds of fake products.

Build the architecture so additional products and live data sources can be added later.

### FINAL EXPERIENCE

The main Shopora experience should be:

**Search real product → See real product → See current price → Compare sellers → Find lowest available price → Click actual retailer link**

This price-comparison capability is one of the core features of Shopora.
