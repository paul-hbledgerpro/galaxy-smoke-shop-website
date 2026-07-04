// Galaxy Smoke Shop Admin API - Cloudflare Pages Advanced Mode
// Place this file at the ROOT of the Pages project: C:\galaxy_smoke_shop_site\_worker.js
// It handles /api/* requests and lets Cloudflare serve all static website files normally.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return onRequest({ request, env, ctx, next: () => env.ASSETS.fetch(request) });
    }
    return env.ASSETS.fetch(request);
  }
};

async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, '');

  try {
    if (request.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
    if (path === 'health') return json({ ok: true, message: 'Galaxy admin API is online' });
    if (path === 'admin/setup-status') return setupStatus(env);
    if (path === 'public/products') return getPublicProducts(env, url);

    if (path === 'admin/signup' && request.method === 'POST') return signup(request, env);
    if (path === 'admin/login' && request.method === 'POST') return login(request, env);

    const admin = await requireAdmin(request, env);
    if (path === 'admin/me') return json({ admin: publicAdmin(admin) });
    if (path === 'admin/logout' && request.method === 'POST') return logout(request, env);
    if (path === 'admin/stats') return adminStats(env);
    if (path === 'admin/products' && request.method === 'GET') return adminProducts(env, url);
    if (path === 'admin/products' && request.method === 'PUT') return saveProduct(request, env);
    if (path === 'admin/images/upload' && request.method === 'POST') return uploadImage(request, env);
    if (path === 'admin/images/object' && request.method === 'GET') return getR2Object(env, url);
    if (path === 'admin/images/import-workdrive' && request.method === 'POST') return importWorkdrive(request, env);
    return json({ error: 'Not found' }, 404);
  } catch (err) {
    return json({ error: err.message || 'Server error' }, err.status || 500);
  }
}

function cors(res) {
  const h = new Headers(res.headers);
  h.set('Access-Control-Allow-Origin', '*');
  h.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(res.body, { status: res.status, headers: h });
}
function json(data, status = 200) {
  return cors(new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }));
}
function needDB(env) {
  if (!env.DB) throw Object.assign(new Error('D1 binding DB is not configured on this Pages project.'), { status: 500 });
  return env.DB;
}
function publicAdmin(a) { return { id: a.id, email: a.email, role: a.role || 'admin' }; }
function normalizeEmail(email) { return String(email || '').trim().toLowerCase(); }
function sqlDate(ms) { return new Date(ms).toISOString().replace('T', ' ').slice(0, 19); }
function base64Url(bytes) { let bin=''; for (const b of bytes) bin += String.fromCharCode(b); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,''); }
function randomToken(bytes=32) { const arr = new Uint8Array(bytes); crypto.getRandomValues(arr); return base64Url(arr); }
async function passwordHash(password, salt) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(String(password || '')), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 120000, hash: 'SHA-256' }, key, 256);
  return base64Url(new Uint8Array(bits));
}
function safeEqual(a, b) {
  a = String(a || ''); b = String(b || '');
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function ensureAuthSchema(env) {
  const db = needDB(env);
  await db.prepare(`CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    active INTEGER NOT NULL DEFAULT 1,
    last_login TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)').run();

  let sessionColumns = [];
  try {
    const info = await db.prepare('PRAGMA table_info(admin_sessions)').all();
    sessionColumns = (info.results || []).map((r) => r.name);
  } catch (_) {}
  const goodSessionTable = ['token', 'admin_id', 'expires_at'].every((c) => sessionColumns.includes(c));
  if (!goodSessionTable) {
    await db.prepare('DROP TABLE IF EXISTS admin_sessions').run();
    await db.prepare(`CREATE TABLE admin_sessions (
      token TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    )`).run();
  }
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at)').run();
  return db;
}

async function setupStatus(env) {
  const db = await ensureAuthSchema(env);
  let products = 0;
  try {
    const p = await db.prepare('SELECT COUNT(*) count FROM products').first();
    products = Number(p?.count || 0);
  } catch (_) {}
  const admins = await db.prepare('SELECT COUNT(*) count FROM admins WHERE active=1').first();
  return json({ ok: true, dbConfigured: true, adminCount: Number(admins?.count || 0), productCount: products });
}

async function createSession(db, adminId) {
  const token = randomToken(40);
  const expires = sqlDate(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await db.prepare('INSERT INTO admin_sessions (token, admin_id, expires_at, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)').bind(token, adminId, expires).run();
  return token;
}
async function requireAdmin(request, env) {
  const db = await ensureAuthSchema(env);
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  const row = await db.prepare(`SELECT a.id, a.email, a.role, a.active, s.token
    FROM admin_sessions s JOIN admins a ON a.id=s.admin_id
    WHERE s.token=? AND s.expires_at > CURRENT_TIMESTAMP AND a.active=1`).bind(token).first();
  if (!row) throw Object.assign(new Error('Unauthorized or session expired'), { status: 401 });
  return row;
}
async function signup(request, env) {
  const db = await ensureAuthSchema(env);
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const signupCode = String(body.signupCode || '');
  if (!email || !email.includes('@')) throw Object.assign(new Error('Valid email is required.'), { status: 400 });
  if (password.length < 8) throw Object.assign(new Error('Password must be at least 8 characters.'), { status: 400 });
  const existing = await db.prepare('SELECT COUNT(*) count FROM admins WHERE active=1').first();
  const adminCount = Number(existing?.count || 0);
  if (adminCount > 0) {
    if (!env.ADMIN_SIGNUP_CODE) throw Object.assign(new Error('Admin signup is closed after the first account. Set ADMIN_SIGNUP_CODE in Cloudflare or use the first admin login.'), { status: 403 });
    if (!safeEqual(signupCode, env.ADMIN_SIGNUP_CODE)) throw Object.assign(new Error('Invalid signup code.'), { status: 403 });
  }
  const dupe = await db.prepare('SELECT id FROM admins WHERE email=?').bind(email).first();
  if (dupe) throw Object.assign(new Error('An admin account with that email already exists. Use Login instead.'), { status: 409 });
  const id = crypto.randomUUID();
  const salt = randomToken(18);
  const hash = await passwordHash(password, salt);
  const role = adminCount === 0 ? 'owner' : 'admin';
  await db.prepare(`INSERT INTO admins (id, email, password_hash, password_salt, role, active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`).bind(id, email, hash, salt, role).run();
  const token = await createSession(db, id);
  return json({ ok: true, token, admin: { id, email, role } });
}
async function login(request, env) {
  const db = await ensureAuthSchema(env);
  const body = await request.json().catch(() => ({}));
  const cleanEmail = normalizeEmail(body.email);
  const admin = await db.prepare('SELECT * FROM admins WHERE email=? AND active=1').bind(cleanEmail).first();
  if (!admin) throw Object.assign(new Error('Invalid email or password.'), { status: 401 });
  const hash = await passwordHash(String(body.password || ''), admin.password_salt || '');
  if (!safeEqual(hash, admin.password_hash)) throw Object.assign(new Error('Invalid email or password.'), { status: 401 });
  await db.prepare('UPDATE admins SET last_login=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(admin.id).run();
  const token = await createSession(db, admin.id);
  return json({ ok: true, token, admin: publicAdmin(admin) });
}
async function logout(request, env) {
  const db = await ensureAuthSchema(env);
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token) await db.prepare('DELETE FROM admin_sessions WHERE token=?').bind(token).run();
  return json({ ok: true });
}

async function getPublicProducts(env, url) {
  const db = needDB(env);
  const tab = url.searchParams.get('tab') || '';
  const q = `%${url.searchParams.get('q') || ''}%`;
  let stmt;
  if (tab) stmt = db.prepare('SELECT * FROM products WHERE active=1 AND tab=? AND name LIKE ? ORDER BY name LIMIT 7000').bind(tab, q);
  else stmt = db.prepare('SELECT * FROM products WHERE active=1 AND name LIKE ? ORDER BY name LIMIT 7000').bind(q);
  const { results } = await stmt.all();
  return json({ products: (results || []).map(publicProduct) });
}
function publicProduct(r) {
  return {
    id: r.id, tab: r.tab, name: r.name, price: Number(r.price || 0), department: r.department || '',
    category: r.category || '', subCategory: r.sub_category || '', pack: r.pack || '', size: r.size || '',
    upc: r.upc || '', quantity: 0, stockStatus: 'Check availability', imageUrl: r.image_url || '', imageSearchUrl: ''
  };
}
async function adminStats(env) {
  const db = needDB(env);
  const p = await db.prepare('SELECT COUNT(*) count FROM products').first();
  const i = await db.prepare("SELECT COUNT(*) count FROM products WHERE image_url IS NOT NULL AND image_url != ''").first();
  return json({ products: Number(p?.count || 0), withImages: Number(i?.count || 0) });
}
async function adminProducts(env, url) {
  const db = needDB(env);
  const tab = url.searchParams.get('tab') || '';
  const q = `%${url.searchParams.get('q') || ''}%`;
  let stmt;
  if (tab) stmt = db.prepare('SELECT * FROM products WHERE tab=? AND (name LIKE ? OR upc LIKE ? OR category LIKE ?) ORDER BY name LIMIT 500').bind(tab, q, q, q);
  else stmt = db.prepare('SELECT * FROM products WHERE name LIKE ? OR upc LIKE ? OR category LIKE ? ORDER BY name LIMIT 500').bind(q, q, q);
  const { results } = await stmt.all();
  return json({ products: results || [] });
}
async function saveProduct(request, env) {
  const db = needDB(env);
  const p = await request.json();
  const id = p.id || crypto.randomUUID();
  await db.prepare(`INSERT INTO products (id, tab, name, price, department, category, upc, image_url, active, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET tab=excluded.tab, name=excluded.name, price=excluded.price, department=excluded.department,
      category=excluded.category, upc=excluded.upc, image_url=excluded.image_url, updated_at=CURRENT_TIMESTAMP`)
    .bind(id, p.tab || 'vapes', p.name || '', Number(p.price || 0), p.department || '', p.category || '', p.upc || '', p.image_url || '').run();
  return json({ ok: true, id });
}
async function uploadImage(request, env) {
  const db = needDB(env);
  if (!env.PRODUCT_IMAGES) throw Object.assign(new Error('R2 binding PRODUCT_IMAGES is not configured.'), { status: 500 });
  const form = await request.formData();
  const file = form.get('image');
  const productId = String(form.get('productId') || '');
  if (!file || !productId) throw Object.assign(new Error('productId and image are required.'), { status: 400 });
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  const key = `products/${productId}/${Date.now()}.${ext}`;
  await env.PRODUCT_IMAGES.put(key, file.stream(), { httpMetadata: { contentType: file.type || 'image/png' } });
  const publicBase = env.R2_PUBLIC_BASE_URL || '';
  const imageUrl = publicBase ? `${publicBase.replace(/\/$/, '')}/${key}` : `/api/admin/images/object?key=${encodeURIComponent(key)}`;
  await db.prepare('UPDATE products SET image_url=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(imageUrl, productId).run();
  return json({ ok: true, key, imageUrl });
}
async function getR2Object(env, url) {
  if (!env.PRODUCT_IMAGES) throw Object.assign(new Error('R2 binding PRODUCT_IMAGES is not configured.'), { status: 500 });
  const key = url.searchParams.get('key');
  if (!key) throw Object.assign(new Error('key is required.'), { status: 400 });
  const obj = await env.PRODUCT_IMAGES.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000');
  return cors(new Response(obj.body, { headers }));
}
async function importWorkdrive(request, env) {
  const db = needDB(env);
  const { url, keyword } = await request.json();
  if (!url) throw Object.assign(new Error('WorkDrive URL is required.'), { status: 400 });
  const html = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 GalaxySmokeShopImporter' } }).then(r => r.text());
  const candidates = [...new Set([...html.matchAll(/https?:\\?\/\\?\/[^"'<> ]+?\.(?:png|jpe?g|webp)(?:\?[^"'<> ]*)?/gi)].map(m => m[0].replace(/\\\//g, '/')))].slice(0, 2000);
  let matched = 0;
  for (const imageUrl of candidates) {
    const nameGuess = decodeURIComponent(imageUrl.split('/').pop().split('?')[0]).replace(/[-_]+/g, ' ').replace(/\.(png|jpe?g|webp)$/i, '');
    const like = `%${(keyword || nameGuess).split(/\s+/).slice(0, 4).join('%')}%`;
    const product = await db.prepare('SELECT id, name FROM products WHERE name LIKE ? ORDER BY LENGTH(name) LIMIT 1').bind(like).first();
    if (product) {
      await db.prepare('UPDATE products SET image_url=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(imageUrl, product.id).run();
      matched++;
    }
  }
  return json({ ok: true, found: candidates.length, matched });
}
