CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  tab TEXT NOT NULL DEFAULT 'vapes',
  name TEXT NOT NULL,
  price REAL DEFAULT 0,
  department TEXT,
  category TEXT,
  sub_category TEXT,
  pack TEXT,
  size TEXT,
  upc TEXT,
  image_url TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_tab ON products(tab);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_upc ON products(upc);
CREATE TABLE IF NOT EXISTS pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  map_url TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS image_imports (
  id TEXT PRIMARY KEY,
  source TEXT,
  source_url TEXT,
  matched_product_id TEXT,
  image_url TEXT,
  status TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
