const API = '/api';
let token = localStorage.getItem('galaxyAdminToken') || '';
let adminUser = null;
let products = [];
let deferredInstall = null;

function $(selector) { return document.querySelector(selector); }
function $$(selector) { return [...document.querySelectorAll(selector)]; }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c])); }
function setMessage(text, type = '') {
  const el = $('#loginMessage');
  if (!el) return;
  el.textContent = text || '';
  el.className = `message ${type}`.trim();
}
function setButtonLoading(button, loadingText) {
  if (!button) return () => {};
  const original = button.textContent;
  button.disabled = true;
  button.textContent = loadingText;
  return () => { button.disabled = false; button.textContent = original; };
}
function headers(json = true) {
  const h = {};
  if (json) h['Content-Type'] = 'application/json';
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}
async function api(path, opts = {}) {
  let res;
  try {
    res = await fetch(API + path, { ...opts, headers: { ...headers(opts.json !== false), ...(opts.headers || {}) } });
  } catch (err) {
    throw new Error('Admin API is not reachable. Test on your Cloudflare Pages URL, or run local testing with Wrangler instead of Python http.server.');
  }
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (_) {
    if (res.status === 404) throw new Error('Admin API returned 404. Make sure the /functions folder was pushed to GitHub and Cloudflare redeployed.');
    throw new Error(`Admin API returned non-JSON response (${res.status}). Open /api/health to verify Pages Functions are deployed.`);
  }
  if (!res.ok) throw new Error(data.error || res.statusText || `Request failed (${res.status})`);
  return data;
}

function showApp() {
  $('#authPanel')?.classList.add('hidden');
  $('#appPanel')?.classList.remove('hidden');
  $('#logout')?.classList.remove('hidden');
  if (adminUser && $('#adminIdentity')) $('#adminIdentity').textContent = `Logged in as ${adminUser.email}`;
  loadStats();
}
function showAuth() {
  $('#authPanel')?.classList.remove('hidden');
  $('#appPanel')?.classList.add('hidden');
  $('#logout')?.classList.add('hidden');
}
function switchAuth(mode) {
  const login = mode === 'login';
  $('#loginTab')?.classList.toggle('active', login);
  $('#signupTab')?.classList.toggle('active', !login);
  $('#loginForm')?.classList.toggle('active', login);
  $('#signupForm')?.classList.toggle('active', !login);
  setMessage('');
}

async function checkApiStatus() {
  try {
    const health = await api('/health');
    setMessage(health.ok ? '' : 'Admin API health check failed.', health.ok ? '' : 'error');
  } catch (err) {
    setMessage(err.message, 'error');
  }
}

async function verifySession() {
  if (!token) { showAuth(); await checkApiStatus(); return; }
  try {
    const data = await api('/admin/me');
    adminUser = data.admin;
    showApp();
  } catch (err) {
    localStorage.removeItem('galaxyAdminToken');
    token = '';
    showAuth();
    setMessage('Please log in. ' + err.message, 'error');
  }
}
async function loadStats() {
  try {
    const s = await api('/admin/stats');
    $('#statProducts').textContent = s.products;
    $('#statImages').textContent = s.withImages;
    $('#statMissing').textContent = Number(s.products || 0) - Number(s.withImages || 0);
  } catch (e) {
    $('#statProducts').textContent = 'Setup needed';
    $('#statImages').textContent = '—';
    $('#statMissing').textContent = '—';
  }
}
async function loadProducts() {
  try {
    const q = $('#productSearch').value;
    const tab = $('#tabFilter').value;
    const data = await api(`/admin/products?q=${encodeURIComponent(q)}&tab=${encodeURIComponent(tab)}`);
    products = data.products || [];
    renderProducts();
  } catch (err) {
    $('#productsTable').innerHTML = `<tr><td colspan="4">${escapeHtml(err.message)}</td></tr>`;
  }
}
function renderProducts() {
  $('#productsTable').innerHTML = products.map(p => `<tr data-id="${escapeHtml(p.id)}"><td><strong>${escapeHtml(p.name)}</strong><br><small>${escapeHtml(p.category || '')}</small></td><td>${escapeHtml(p.tab || '')}</td><td>$${Number(p.price || 0).toFixed(2)}</td><td>${p.image_url ? `<img class="thumb" src="${escapeHtml(p.image_url)}">` : '—'}</td></tr>`).join('');
  $$('#productsTable tr').forEach(r => r.onclick = () => editProduct(products.find(p => p.id === r.dataset.id)));
}
function editProduct(p) {
  if (!p) return;
  $('#editId').value = p.id;
  $('#editName').value = p.name || '';
  $('#editPrice').value = p.price || 0;
  $('#editTab').value = p.tab || 'vapes';
  $('#editDepartment').value = p.department || '';
  $('#editCategory').value = p.category || '';
  $('#editUpc').value = p.upc || '';
  $('#editImage').value = p.image_url || '';
  $('#uploadProductId').value = p.id;
}

function init() {
  $('#loginTab')?.addEventListener('click', () => switchAuth('login'));
  $('#signupTab')?.addEventListener('click', () => switchAuth('signup'));

  $('#loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const stop = setButtonLoading(e.submitter, 'Signing in...');
    setMessage('Signing in...');
    try {
      const data = await api('/admin/login', { method: 'POST', body: JSON.stringify({ email: $('#loginEmail').value, password: $('#loginPassword').value }) });
      token = data.token;
      adminUser = data.admin;
      localStorage.setItem('galaxyAdminToken', token);
      setMessage('Login successful.', 'success');
      showApp();
    } catch (err) {
      setMessage(err.message, 'error');
    } finally { stop(); }
  });

  $('#signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = $('#signupPassword').value;
    if (password !== $('#signupConfirm').value) { setMessage('Passwords do not match.', 'error'); return; }
    const stop = setButtonLoading(e.submitter, 'Creating account...');
    setMessage('Creating admin account...');
    try {
      const data = await api('/admin/signup', { method: 'POST', body: JSON.stringify({ email: $('#signupEmail').value, password, signupCode: $('#signupCode').value }) });
      token = data.token;
      adminUser = data.admin;
      localStorage.setItem('galaxyAdminToken', token);
      setMessage('Admin account created.', 'success');
      showApp();
    } catch (err) {
      setMessage(err.message, 'error');
    } finally { stop(); }
  });

  $('#logout')?.addEventListener('click', async () => {
    try { if (token) await api('/admin/logout', { method: 'POST' }); } catch (_) {}
    localStorage.removeItem('galaxyAdminToken'); token = ''; adminUser = null; location.reload();
  });

  $$('nav button').forEach(b => b.addEventListener('click', () => {
    $$('nav button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    $$('.view').forEach(v => v.classList.toggle('active', v.dataset.view === b.dataset.panel));
    $('#panelTitle').textContent = b.textContent;
  }));

  $('#loadProducts')?.addEventListener('click', loadProducts);
  $('#refreshBtn')?.addEventListener('click', () => { loadStats(); if (document.querySelector('[data-view="products"].active')) loadProducts(); });
  $('#newProduct')?.addEventListener('click', () => { $('#productForm').reset(); $('#editId').value = ''; });
  $('#productForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const stop = setButtonLoading(e.submitter, 'Saving...');
    try {
      const body = { id: $('#editId').value, name: $('#editName').value, price: $('#editPrice').value, tab: $('#editTab').value, department: $('#editDepartment').value, category: $('#editCategory').value, upc: $('#editUpc').value, image_url: $('#editImage').value };
      const data = await api('/admin/products', { method: 'PUT', body: JSON.stringify(body) });
      $('#editId').value = data.id;
      await loadProducts(); await loadStats();
    } catch (err) { alert(err.message); } finally { stop(); }
  });
  $('#uploadImageBtn')?.addEventListener('click', async () => {
    try {
      const file = $('#uploadImageFile').files[0]; if (!file) throw new Error('Choose an image file.');
      const id = $('#uploadProductId').value.trim(); if (!id) throw new Error('Choose/paste product ID.');
      const fd = new FormData(); fd.append('image', file); fd.append('productId', id);
      const res = await fetch(API + '/admin/images/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json().catch(() => ({})); if (!res.ok) throw new Error(data.error || 'Upload failed');
      $('#uploadMessage').textContent = 'Uploaded and attached.'; await loadProducts(); await loadStats();
    } catch (e) { $('#uploadMessage').textContent = e.message; }
  });
  $('#importWorkdriveBtn')?.addEventListener('click', async () => {
    try {
      const body = { url: $('#workdriveUrl').value, keyword: $('#workdriveKeyword').value };
      const data = await api('/admin/images/import-workdrive', { method: 'POST', body: JSON.stringify(body) });
      $('#workdriveMessage').textContent = `Scan complete. Found ${data.found || 0} candidate files and matched ${data.matched || 0}.`;
    } catch (e) { $('#workdriveMessage').textContent = e.message; }
  });

  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; $('#installApp')?.classList.remove('hidden'); });
  $('#installApp')?.addEventListener('click', async () => { if (deferredInstall) { deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; } });
  verifySession();
}

window.addEventListener('error', (event) => setMessage(`JavaScript error: ${event.message}`, 'error'));
document.addEventListener('DOMContentLoaded', init);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/admin/sw.js').catch(() => {});
