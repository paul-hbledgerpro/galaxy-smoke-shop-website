# Galaxy Smoke Shop Website Preview

This is a static, display-only website generated from the uploaded CSV inventory and Galaxy Smoke Shop logo.

## Files

- `index.html` — main website
- `styles.css` — website styling
- `script.js` — navigation, product filtering, pagination, age gate, and contact-form preview behavior
- `products.js` — product data generated from `GALAXY ELGIN SMOKE SHOP (2).csv`
- `assets/galaxy-logo.png` — uploaded logo
- `product-image-sourcing-template.csv` — template for adding approved product image URLs later

## Product tab mapping

The website uses the CSV `Department Name` and `Category Name` values to place products under your requested tabs:

- **Vape's**: `NIC VAPES`, `VAPE JUICE`
- **Mods & Accessories**: `NIC VAPE KITS / ACCESSORIES`
- **Glass**: `GLASS`, `AMERICAN GLASS`, `METAL PIPE`
- **Vaporizers**: `VAPORIZERS ZONE`
- **Smoking Accessories**: `SMOKE'S`, `TOBACCO`, `HOOKAH`, `LIGHTERS`, `CLEANERS`, `BAGGIES`, `CIGARETTE ROLLING MACHINE`, `CIGARS`

## Product image workflow

The current site uses local preview placeholders for product cards. Each product card includes a **Source image** link that opens a web image search for that exact item and UPC. To use real product photos safely, add approved manufacturer/vendor image URLs into `products.js` or use `product-image-sourcing-template.csv` as a working file.

## Locations

The Locations tab includes five store cards with address, phone number, an embedded Google map, a **Get Directions** link, and a **Call Store** link.

## Before publishing

Update these sections in `index.html`:

- Email address
- Business hours
- Careers/application instructions
- Contact form backend or email integration

## Preview locally

Open `index.html` in a browser. The site works without a server because product data is embedded in `products.js`.

Generated products displayed: **6,886**

Updated locations at: 2026-06-26 14:31

## Locations included

- Galaxy Smoke Shop Elgin — 20 S State St., Elgin, IL 60123 — (224) 769-7934
- Galaxy Smoke Shop Hanover — 2000 Irving Park Rd, Hanover Park, IL 60133 — (630) 855-4075
- Elgin Smoke and Tobacco Shop — 1350 E Chicago St. Unit 25, Elgin, IL 60120 — (224) 856-5628
- Galaxy Smoke Shop Schaumburg — 805 E Schaumburg Rd, Schaumburg, IL 60194 — (847) 466-5844
- Milkywave Smoke and Vape — 1105 Maple Ave, Lisle, IL 60532 — (630) 724-9790

Each location card includes an embedded Google Map plus buttons for directions and calling the store.


Locations page update:
- The Locations tab now includes five store locations with address, phone number, Google Maps embed, Get Directions links, and Call Store links.
- Maps use public Google Maps embed URLs; no Google Maps API key is required for this static preview.


Update note: Cleaned up product records where UPC and item name were swapped or where the source item name was an unreadable concatenated value.
