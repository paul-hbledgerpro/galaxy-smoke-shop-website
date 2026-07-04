# Galaxy Smoke Shop Admin Portal Setup

This package adds a customer-facing admin portal at:

```text
/admin/
```

It is designed for Cloudflare Pages + Pages Functions + D1 + R2.

## 1. Create Cloudflare D1 database

Cloudflare D1 is Cloudflare's managed serverless database with SQLite semantics and access from Workers/Pages Functions.

Suggested database name:

```text
galaxy-smoke-shop-db
```

Run the schema:

```bash
npx wrangler d1 execute galaxy-smoke-shop-db --file=migrations/001_admin_schema.sql
```

Seed the current products from `products.js`:

```bash
node tools/make-d1-seed.mjs
npx wrangler d1 execute galaxy-smoke-shop-db --file=migrations/002_seed_products.sql
```

## 2. Create Cloudflare R2 bucket

Cloudflare R2 is object storage for images/files. Suggested bucket:

```text
galaxy-product-images
```

Bind it to the Pages project as:

```text
PRODUCT_IMAGES
```

## 3. Add Pages Function bindings

In Cloudflare Dashboard:

```text
Workers & Pages → galaxy-smoke-shop-website → Settings → Functions → Bindings
```

Add:

```text
D1 binding name: DB
R2 binding name: PRODUCT_IMAGES
```

## 4. Add admin secrets

In Cloudflare Pages project settings, add environment variables/secrets:

```text
ADMIN_PASSWORD = your private admin password
ADMIN_TOKEN = a long random secret string
R2_PUBLIC_BASE_URL = your public R2 image base URL, optional
```

## 5. Deploy

```bash
git add .
git commit -m "Add Galaxy admin portal with D1 and R2 management"
git pull --rebase origin main
git push origin main
```

## 6. Install as desktop app

Open your site:

```text
https://yourdomain.com/admin/
```

In Microsoft Edge or Chrome, choose:

```text
Install this site as an app
```

The app opens like a desktop program but runs from your Cloudflare-hosted admin portal.

## 7. Important

The admin portal requires the D1 database and R2 bucket bindings before the Products and Image tools work.
