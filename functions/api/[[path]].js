export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, '');
  try {
    if (request.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
    if (path === 'health') return json({ ok: true });
    if (path === 'public/products') return getPublicProducts(env, url);
    if (path === 'admin/login' && request.method === 'POST') return login(request, env);
    await requireAdmin(request, env);
    if (path === 'admin/stats') return adminStats(env);
    if (path === 'admin/products' && request.method === 'GET') return adminProducts(env, url);
    if (path === 'admin/products' && request.method === 'PUT') return saveProduct(request, env);
    if (path === 'admin/images/upload' && request.method === 'POST') return uploadImage(request, env);
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
function json(data, status = 200) { return cors(new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })); }
function needDB(env) { if (!env.DB) throw Object.assign(new Error('D1 binding DB is not configured.'), { status: 500 }); return env.DB; }
async function requireAdmin(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const expected = env.ADMIN_TOKEN;
  if (!expected) throw Object.assign(new Error('ADMIN_TOKEN secret is not configured.'), { status: 500 });
  if (auth !== `Bearer ${expected}`) throw Object.assign(new Error('Unauthorized'), { status: 401 });
}
async function login(request, env) {
  const { password } = await request.json();
  if (!env.ADMIN_PASSWORD || !env.ADMIN_TOKEN) throw Object.assign(new Error('ADMIN_PASSWORD or ADMIN_TOKEN secret is not configured.'), { status: 500 });
  if (password !== env.ADMIN_PASSWORD) throw Object.assign(new Error('Invalid password'), { status: 401 });
  return json({ token: env.ADMIN_TOKEN });
}
async function getPublicProducts(env, url) {
  const db = needDB(env);
  const tab = url.searchParams.get('tab') || '';
  const q = `%${url.searchParams.get('q') || ''}%`;
  let stmt;
  if (tab) stmt = db.prepare('SELECT * FROM products WHERE active=1 AND tab=? AND name LIKE ? ORDER BY name LIMIT 7000').bind(tab, q);
  else stmt = db.prepare('SELECT * FROM products WHERE active=1 AND name LIKE ? ORDER BY name LIMIT 7000').bind(q);
  const { results } = await stmt.all();
  return json({ products: results.map(publicProduct) });
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
  return json({ products: p?.count || 0, withImages: i?.count || 0 });
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
async function importWorkdrive(request, env) {
  const db = needDB(env);
  const { url, keyword } = await request.json();
  if (!url) throw Object.assign(new Error('WorkDrive URL is required.'), { status: 400 });
  const html = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 GalaxySmokeShopImporter' } }).then(r => r.text());
  const candidates = [...new Set([...html.matchAll(/https?:\\?\/\\?\/[^"'<> ]+?\.(?:png|jpe?g|webp)(?:\?[^"'<> ]*)?/gi)].map(m => m[0].replace(/\\\//g, '/')))];
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
