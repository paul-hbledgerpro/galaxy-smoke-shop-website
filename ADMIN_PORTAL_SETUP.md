# Galaxy Smoke Shop Admin Portal Setup

This package adds a customer-facing website plus `/admin/` admin portal for Cloudflare Pages.

## Login / Sign Up

The admin portal now uses normal email/password accounts.

- Open `/admin/`
- Click **Sign Up**
- The first admin account becomes the owner account
- After the first admin account exists, additional signups require a Cloudflare Pages environment variable named `ADMIN_SIGNUP_CODE`

This prevents random public visitors from creating admin accounts after your first setup.

## D1 setup commands

Run these from the website folder:

```cmd
cd /d C:\galaxy_smoke_shop_site
npx -y wrangler@latest d1 execute galaxy-smoke-shop-db --remote --file=migrations/001_admin_schema.sql --yes
node tools/make-d1-seed.mjs
npx -y wrangler@latest d1 execute galaxy-smoke-shop-db --remote --file=migrations/002_seed_products.sql --yes
```

If you already ran the old schema and only need to add the new login tables, run:

```cmd
npx -y wrangler@latest d1 execute galaxy-smoke-shop-db --remote --file=migrations/003_admin_users.sql --yes
```

## Cloudflare Pages bindings

Add these under:

`Workers & Pages -> galaxy-smoke-shop-website -> Settings -> Functions -> Bindings`

- D1 binding name: `DB`
- D1 database: `galaxy-smoke-shop-db`
- R2 binding name: `PRODUCT_IMAGES`
- R2 bucket: `galaxy-product-images`

## Environment variables

Recommended:

- `ADMIN_SIGNUP_CODE` = a private code for adding future admins after the first admin exists
- `R2_PUBLIC_BASE_URL` = optional public URL for your R2 product images

The old `ADMIN_PASSWORD` / `ADMIN_TOKEN` system is no longer required.

## Deploy

Copy the full contents of `galaxy_smoke_shop_site` into your GitHub project folder, then:

```cmd
git status
git add .
git commit -m "Add admin email signup and login"
git pull --rebase origin main
git push origin main
```

Cloudflare Pages will redeploy from GitHub.
