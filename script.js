const PRODUCTS = window.GALAXY_PRODUCTS || [];
const STATS = window.GALAXY_STATS || { countsByTab: {}, tabs: {} };
const PRODUCT_TABS = ['vapes', 'mods', 'glass', 'vaporizers', 'smoking'];
const PAGE_IDS = {
  home: 'homePage',
  careers: 'careersPage',
  locations: 'locationsPage',
  about: 'aboutPage',
  contact: 'contactPage'
};
const LOCATIONS = {
  elgin: {
    name: 'Galaxy Smoke Shop Elgin',
    address: '20 S State St., Elgin, IL 60123',
    phone: '(224) 769-7934',
    tel: '+12247697934',
    maps: 'https://www.google.com/maps/dir/?api=1&destination=20+S+State+St.%2C+Elgin%2C+IL+60123'
  },
  hanover: {
    name: 'Galaxy Smoke Shop Hanover',
    address: '2000 Irving Park Rd, Hanover Park, IL 60133',
    phone: '(630) 855-4075',
    tel: '+16308554075',
    maps: 'https://www.google.com/maps/dir/?api=1&destination=2000+Irving+Park+Rd%2C+Hanover+Park%2C+IL+60133'
  },
  'elgin-tobacco': {
    name: 'Elgin Smoke and Tobacco Shop',
    address: '1350 E Chicago St. Unit 25, Elgin, IL 60120',
    phone: '(224) 856-5628',
    tel: '+12248565628',
    maps: 'https://www.google.com/maps/dir/?api=1&destination=1350+E+Chicago+St+Unit+25%2C+Elgin%2C+IL+60120'
  },
  schaumburg: {
    name: 'Galaxy Smoke Shop Schaumburg',
    address: '805 E Schaumburg Rd, Schaumburg, IL 60194',
    phone: '(847) 466-5844',
    tel: '+18474665844',
    maps: 'https://www.google.com/maps/dir/?api=1&destination=805+E+Schaumburg+Rd%2C+Schaumburg%2C+IL+60194'
  },
  carpentersville: {
    name: 'Galaxy Smoke Shop Carpentersville',
    address: '91 S Kennedy Dr., Unit I, Carpentersville, IL 60110',
    phone: '(224) 802-8111',
    tel: '+12248028111',
    maps: 'https://www.google.com/maps/dir/?api=1&destination=91+S+Kennedy+Dr+Unit+I%2C+Carpentersville%2C+IL+60110'
  },
  milkywave: {
    name: 'Milkywave Smoke and Vape',
    address: '1105 Maple Ave, Lisle, IL 60532',
    phone: '(630) 724-9790',
    tel: '+16307249790',
    maps: 'https://www.google.com/maps/dir/?api=1&destination=1105+Maple+Ave%2C+Lisle%2C+IL+60532'
  }
};


const INSTAGRAM_FEED_ITEMS = [
  {
    "image": "assets/instagram/gallery-00.jpg",
    "account": "galaxyelgin20",
    "alt": "Instagram post from galaxyelgin20"
  },
  {
    "image": "assets/instagram/gallery-01.jpg",
    "account": "elginsmoke1350",
    "alt": "Instagram post from elginsmoke1350"
  },
  {
    "image": "assets/instagram/gallery-02.jpg",
    "account": "galaxysmoke2000",
    "alt": "Instagram post from galaxysmoke2000"
  },
  {
    "image": "assets/instagram/gallery-03.jpg",
    "account": "galaxycville",
    "alt": "Instagram post from galaxycville"
  },
  {
    "image": "assets/instagram/gallery-04.jpg",
    "account": "galaxysmokeshop805",
    "alt": "Instagram post from galaxysmokeshop805"
  },
  {
    "image": "assets/instagram/gallery-05.jpg",
    "account": "milkywavesmokeshop",
    "alt": "Instagram post from milkywavesmokeshop"
  },
  {
    "image": "assets/instagram/gallery-06.jpg",
    "account": "galaxyelgin20",
    "alt": "Instagram post from galaxyelgin20"
  },
  {
    "image": "assets/instagram/gallery-07.jpg",
    "account": "elginsmoke1350",
    "alt": "Instagram post from elginsmoke1350"
  },
  {
    "image": "assets/instagram/gallery-08.jpg",
    "account": "galaxysmoke2000",
    "alt": "Instagram post from galaxysmoke2000"
  },
  {
    "image": "assets/instagram/gallery-09.jpg",
    "account": "galaxycville",
    "alt": "Instagram post from galaxycville"
  },
  {
    "image": "assets/instagram/gallery-10.jpg",
    "account": "galaxysmokeshop805",
    "alt": "Instagram post from galaxysmokeshop805"
  },
  {
    "image": "assets/instagram/gallery-11.jpg",
    "account": "milkywavesmokeshop",
    "alt": "Instagram post from milkywavesmokeshop"
  },
  {
    "image": "assets/instagram/gallery-12.jpg",
    "account": "galaxyelgin20",
    "alt": "Instagram post from galaxyelgin20"
  },
  {
    "image": "assets/instagram/gallery-13.jpg",
    "account": "elginsmoke1350",
    "alt": "Instagram post from elginsmoke1350"
  },
  {
    "image": "assets/instagram/gallery-14.jpg",
    "account": "galaxysmoke2000",
    "alt": "Instagram post from galaxysmoke2000"
  },
  {
    "image": "assets/instagram/gallery-15.jpg",
    "account": "galaxycville",
    "alt": "Instagram post from galaxycville"
  },
  {
    "image": "assets/instagram/gallery-16.jpg",
    "account": "galaxysmokeshop805",
    "alt": "Instagram post from galaxysmokeshop805"
  },
  {
    "image": "assets/instagram/gallery-17.jpg",
    "account": "milkywavesmokeshop",
    "alt": "Instagram post from milkywavesmokeshop"
  },
  {
    "image": "assets/instagram/gallery-18.jpg",
    "account": "galaxyelgin20",
    "alt": "Instagram post from galaxyelgin20"
  },
  {
    "image": "assets/instagram/gallery-19.jpg",
    "account": "elginsmoke1350",
    "alt": "Instagram post from elginsmoke1350"
  },
  {
    "image": "assets/instagram/gallery-20.jpg",
    "account": "galaxysmoke2000",
    "alt": "Instagram post from galaxysmoke2000"
  },
  {
    "image": "assets/instagram/gallery-21.jpg",
    "account": "galaxycville",
    "alt": "Instagram post from galaxycville"
  },
  {
    "image": "assets/instagram/gallery-22.jpg",
    "account": "galaxysmokeshop805",
    "alt": "Instagram post from galaxysmokeshop805"
  },
  {
    "image": "assets/instagram/gallery-23.jpg",
    "account": "milkywavesmokeshop",
    "alt": "Instagram post from milkywavesmokeshop"
  },
  {
    "image": "assets/instagram/gallery-24.jpg",
    "account": "galaxyelgin20",
    "alt": "Instagram post from galaxyelgin20"
  },
  {
    "image": "assets/instagram/gallery-25.jpg",
    "account": "elginsmoke1350",
    "alt": "Instagram post from elginsmoke1350"
  },
  {
    "image": "assets/instagram/gallery-26.jpg",
    "account": "galaxysmoke2000",
    "alt": "Instagram post from galaxysmoke2000"
  },
  {
    "image": "assets/instagram/gallery-27.jpg",
    "account": "galaxycville",
    "alt": "Instagram post from galaxycville"
  },
  {
    "image": "assets/instagram/gallery-28.jpg",
    "account": "galaxysmokeshop805",
    "alt": "Instagram post from galaxysmokeshop805"
  },
  {
    "image": "assets/instagram/gallery-29.jpg",
    "account": "milkywavesmokeshop",
    "alt": "Instagram post from milkywavesmokeshop"
  },
  {
    "image": "assets/instagram/gallery-30.jpg",
    "account": "galaxyelgin20",
    "alt": "Instagram post from galaxyelgin20"
  },
  {
    "image": "assets/instagram/gallery-31.jpg",
    "account": "elginsmoke1350",
    "alt": "Instagram post from elginsmoke1350"
  },
  {
    "image": "assets/instagram/gallery-32.jpg",
    "account": "galaxysmoke2000",
    "alt": "Instagram post from galaxysmoke2000"
  },
  {
    "image": "assets/instagram/gallery-33.jpg",
    "account": "galaxycville",
    "alt": "Instagram post from galaxycville"
  },
  {
    "image": "assets/instagram/gallery-34.jpg",
    "account": "galaxysmokeshop805",
    "alt": "Instagram post from galaxysmokeshop805"
  },
  {
    "image": "assets/instagram/gallery-35.jpg",
    "account": "milkywavesmokeshop",
    "alt": "Instagram post from milkywavesmokeshop"
  },
  {
    "image": "assets/instagram/gallery-36.jpg",
    "account": "galaxyelgin20",
    "alt": "Instagram post from galaxyelgin20"
  },
  {
    "image": "assets/instagram/gallery-37.jpg",
    "account": "elginsmoke1350",
    "alt": "Instagram post from elginsmoke1350"
  },
  {
    "image": "assets/instagram/gallery-38.jpg",
    "account": "galaxysmoke2000",
    "alt": "Instagram post from galaxysmoke2000"
  },
  {
    "image": "assets/instagram/gallery-39.jpg",
    "account": "galaxycville",
    "alt": "Instagram post from galaxycville"
  },
  {
    "image": "assets/instagram/gallery-40.jpg",
    "account": "galaxysmokeshop805",
    "alt": "Instagram post from galaxysmokeshop805"
  },
  {
    "image": "assets/instagram/gallery-41.jpg",
    "account": "milkywavesmokeshop",
    "alt": "Instagram post from milkywavesmokeshop"
  }
];

const BEST_SELLER_GROUPS = [
  {
    key: 'geekbar-pulse',
    label: 'Geek Bar Pulse',
    match: (p) => /^GEEKBAR PULSE\b/i.test(p.name) && !/^GEEKBAR PULSE X\b/i.test(p.name),
    limit: 4
  },
  {
    key: 'geekbar-pulsex',
    label: 'Geek Bar Pulse X',
    match: (p) => /^GEEKBAR PULSE X\b/i.test(p.name),
    limit: 4
  },
  {
    key: 'geekvape-raz',
    label: 'Geekvape RAZ',
    match: (p) => /GEEKVAPE RAZ/i.test(p.name),
    limit: 4
  },
  {
    key: 'foger-kits',
    label: 'Foger Kits',
    match: (p) => /FOGER/i.test(p.name) && /KIT/i.test(p.name),
    limit: 4
  },
  {
    key: 'foger-pods',
    label: 'Foger Pods',
    match: (p) => /FOGER/i.test(p.name) && /POD/i.test(p.name),
    limit: 4
  },
  {
    key: 'puffco-peak',
    label: 'Puffco Peak',
    match: (p) => /PUFFCO PEAK/i.test(p.name) && !/CHAMBER|CAP|GLASS|ATTACHMENT/i.test(p.name),
    limit: 4
  },
  {
    key: 'puffco-3d-chamber',
    label: 'Peak Pro 3D Chamber',
    match: (p) => /PUFFCO PEAK PRO 3D CHAMBER/i.test(p.name),
    limit: 2
  },
  {
    key: 'puffco-pivot',
    label: 'Pivot Sapphire',
    match: (p) => /PUFFCO PIVOT/i.test(p.name),
    manualItems: [{ name: 'PUFFCO PIVOT SAPPHIRE', price: 0, department: 'VAPORIZERS ZONE', category: 'VAPORIZERS', imageUrl: 'assets/product-images/cutwm_cutout_puffco-pivot-sapphire.png' }],
    limit: 4
  }
];

function stableProductScore(product, salt) {
  const text = `${salt}:${product.name}:${product.upc || ''}`;
  let score = 0;
  for (let i = 0; i < text.length; i++) score = (score * 31 + text.charCodeAt(i)) % 1000003;
  return score;
}

function bestSellerItems(group) {
  const manual = group.manualItems || [];
  const matches = PRODUCTS
    .filter(group.match)
    .sort((a, b) => Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl)) || stableProductScore(a, group.key) - stableProductScore(b, group.key));
  return [...manual, ...matches].slice(0, group.limit);
}

function bestSellerCard(product, group) {
  const img = product.imageUrl || '';
  const image = img
    ? `<img class="product-cutout" src="${safeText(img)}" alt="${safeText(product.name)}" loading="lazy" />`
    : placeholderHTML(product);
  return `
    <article class="best-seller-card">
      <div class="best-seller-image">${image}</div>
      <div class="best-seller-body">
        <span>${safeText(group.label)}</span>
        <h3>${safeText(product.name)}</h3>
        <strong>${Number(product.price || 0) > 0 ? money(product.price) : 'Check in store'}</strong>
        <button class="btn primary small availability-trigger" data-product="${safeText(product.name)}">Check availability</button>
      </div>
    </article>`;
}

function renderBestSellers(groupKey = BEST_SELLER_GROUPS[0]?.key) {
  const tabs = $('#bestSellerTabs');
  const track = $('#bestSellerTrack');
  if (!tabs || !track || !BEST_SELLER_GROUPS.length) return;
  const current = BEST_SELLER_GROUPS.find((group) => group.key === groupKey) || BEST_SELLER_GROUPS[0];
  tabs.innerHTML = BEST_SELLER_GROUPS.map((group) => `
    <button type="button" class="${group.key === current.key ? 'active' : ''}" data-best-seller-tab="${safeText(group.key)}">${safeText(group.label)}</button>
  `).join('');
  const items = bestSellerItems(current);
  track.innerHTML = items.length
    ? items.map((item) => bestSellerCard(item, current)).join('')
    : `<div class="empty-state"><h3>No matching products found.</h3><p>This brand group can be updated after the next inventory import.</p></div>`;
  tabs.querySelectorAll('[data-best-seller-tab]').forEach((button) => {
    button.addEventListener('click', () => renderBestSellers(button.dataset.bestSellerTab));
  });
  wireAvailabilityButtons();
}

const state = {
  tab: 'vapes',
  page: 1,
  pageSize: 24,
  query: '',
  category: 'all',
  sort: 'featured'
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
}

function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[ch]));
}

function iconFor(tab, category = '') {
  const c = category.toLowerCase();
  if (tab === 'vapes') return '💨';
  if (tab === 'mods') return '⚡';
  if (tab === 'glass') return '✦';
  if (tab === 'vaporizers') return '♨';
  if (c.includes('lighter')) return '🔥';
  if (c.includes('paper') || c.includes('wrap') || c.includes('cone')) return '◒';
  if (c.includes('hookah')) return '♢';
  return '✧';
}

function placeholderHTML(product) {
  return `<div class="placeholder-art"><div class="placeholder-title">Product image coming soon</div><div class="placeholder-meta">Galaxy curated image slot</div></div>`;
}

function productCard(product) {
  const image = product.imageUrl
    ? `<img class="product-cutout" src="${safeText(product.imageUrl)}" alt="${safeText(product.name)}" loading="lazy" onerror="this.parentElement.innerHTML='${placeholderHTML(product).replace(/'/g, "&#039;")}'" />`
    : placeholderHTML(product);
  const packSize = [product.pack, product.size].filter(Boolean).join(' · ');
  const upcLine = product.upc ? `<span>UPC: ${safeText(product.upc)}</span>` : '';
  return `
    <article class="product-card">
      <div class="product-image">${image}</div>
      <div class="product-body">
        <div class="product-topline">
          <h3>${safeText(product.name)}</h3>
          <span class="price">${money(product.price)}</span>
        </div>
        <div class="product-meta">
          <span>${safeText(product.department || 'Department')}</span>
          <span>${safeText(product.category || 'Category')}</span>
          ${packSize ? `<span>${safeText(packSize)}</span>` : ''}
          ${upcLine}
        </div>
        <div class="card-actions stack-on-mobile">
          <button class="btn primary small availability-trigger" data-product="${safeText(product.name)}">Check availability</button>
        </div>
      </div>
    </article>`;
}

function productsForCurrentState() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter((p) => p.tab === state.tab);
  if (q) {
    list = list.filter((p) => [p.name, p.department, p.category, p.subCategory, p.upc].join(' ').toLowerCase().includes(q));
  }
  if (state.category !== 'all') list = list.filter((p) => p.category === state.category);
  const sorted = [...list];
  if (state.sort === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (state.sort === 'price-asc') sorted.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
  if (state.sort === 'price-desc') sorted.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
  if (state.sort === 'featured') sorted.sort((a, b) => Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl)) || a.name.localeCompare(b.name));
  return sorted;
}

function populateCategoryFilter() {
  const select = $('#categoryFilter');
  const categories = [...new Set(PRODUCTS.filter((p) => p.tab === state.tab).map((p) => p.category || 'Uncategorized'))]
    .sort((a, b) => a.localeCompare(b));
  select.innerHTML = `<option value="all">All categories</option>` + categories.map((c) => `<option value="${safeText(c)}">${safeText(c)}</option>`).join('');
  select.value = state.category;
}

function wireAvailabilityButtons() {
  $$('.availability-trigger').forEach((btn) => {
    btn.addEventListener('click', () => openAvailabilityModal(btn.dataset.product || 'Selected Product'));
  });
}

function renderProducts() {
  const list = productsForCurrentState();
  const totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
  state.page = Math.min(Math.max(1, state.page), totalPages);
  const start = (state.page - 1) * state.pageSize;
  const pageItems = list.slice(start, start + state.pageSize);
  $('#productGrid').innerHTML = pageItems.length ? pageItems.map(productCard).join('') : `<div class="empty-state"><h3>No products found.</h3><p>Try another search or category filter.</p></div>`;
  wireAvailabilityButtons();
  const showingStart = list.length ? start + 1 : 0;
  const showingEnd = Math.min(start + state.pageSize, list.length);
  $('#resultSummary').textContent = `Showing ${showingStart}-${showingEnd} of ${list.length.toLocaleString()} items in ${STATS.tabs[state.tab]?.label || 'Products'}.`;
  $('#pager').innerHTML = `
    <button class="btn secondary" ${state.page <= 1 ? 'disabled' : ''} id="prevPage">Previous</button>
    <span>Page ${state.page} of ${totalPages}</span>
    <button class="btn secondary" ${state.page >= totalPages ? 'disabled' : ''} id="nextPage">Next</button>`;
  $('#prevPage')?.addEventListener('click', () => { state.page -= 1; renderProducts(); window.scrollTo({ top: $('#productPage').offsetTop, behavior: 'smooth' }); });
  $('#nextPage')?.addEventListener('click', () => { state.page += 1; renderProducts(); window.scrollTo({ top: $('#productPage').offsetTop, behavior: 'smooth' }); });
}

function showProductTab(tab) {
  state.tab = tab;
  state.page = 1;
  state.query = '';
  state.category = 'all';
  state.sort = 'featured';
  $('.page.active')?.classList.remove('active');
  $('#productPage').classList.add('active');
  const tabDef = STATS.tabs[tab] || { label: 'Products', headline: 'Products', dek: '' };
  $('#productEyebrow').textContent = 'Catalog';
  $('#productTitle').textContent = tabDef.headline;
  $('#productDek').textContent = tabDef.dek;
  $('#productSearch').value = '';
  $('#sortFilter').value = 'featured';
  populateCategoryFilter();
  renderProducts();
}

function showPage(page) {
  $('.page.active')?.classList.remove('active');
  const id = PAGE_IDS[page] || 'homePage';
  $('#' + id).classList.add('active');
}

function route() {
  const hash = (location.hash || '#home').slice(1).toLowerCase();
  $$('.main-nav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === hash));
  if (PRODUCT_TABS.includes(hash)) showProductTab(hash);
  else showPage(hash);
  $('#mainNav')?.classList.remove('open');
  $('#navToggle')?.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initCounts() {
  for (const tab of PRODUCT_TABS) {
    const el = document.getElementById(`count-${tab}`);
    if (el) el.textContent = (STATS.countsByTab?.[tab] || 0).toLocaleString();
  }
}

function initAgeGate() {
  const gate = $('#ageGate');
  // Always show the age gate on each new page load.
  // Add ?preview=1 only when testing and you want to bypass it temporarily.
  const params = new URLSearchParams(location.search);
  if (params.get('preview') === '1') {
    gate?.classList.add('hidden');
  } else {
    gate?.classList.remove('hidden');
  }
  $('#confirmAge')?.addEventListener('click', () => {
    gate?.classList.add('hidden');
  });
}

function openAvailabilityModal(productName) {
  const modal = $('#availabilityModal');
  $('#selectedProductName').textContent = productName;
  $('#availabilityLocationSelect').value = '';
  updateSelectedLocation('');
  modal?.classList.remove('hidden');
  modal?.setAttribute('aria-hidden', 'false');
}

function closeAvailabilityModal() {
  const modal = $('#availabilityModal');
  modal?.classList.add('hidden');
  modal?.setAttribute('aria-hidden', 'true');
}

function updateSelectedLocation(locationKey) {
  const info = LOCATIONS[locationKey];
  const card = $('#selectedLocationCard');
  const callBtn = $('#callSelectedLocation');
  const directionsBtn = $('#directionsSelectedLocation');
  if (!info) {
    card?.classList.add('hidden');
    callBtn?.classList.add('disabled-link');
    directionsBtn?.classList.add('disabled-link');
    callBtn?.setAttribute('href', '#');
    directionsBtn?.setAttribute('href', '#');
    callBtn?.setAttribute('aria-disabled', 'true');
    directionsBtn?.setAttribute('aria-disabled', 'true');
    return;
  }
  $('#selectedLocationName').textContent = info.name;
  $('#selectedLocationAddress').textContent = info.address;
  const phoneLink = $('#selectedLocationPhone');
  phoneLink.textContent = info.phone;
  phoneLink.setAttribute('href', `tel:${info.tel}`);
  card?.classList.remove('hidden');
  callBtn?.classList.remove('disabled-link');
  directionsBtn?.classList.remove('disabled-link');
  callBtn?.setAttribute('href', `tel:${info.tel}`);
  directionsBtn?.setAttribute('href', info.maps);
  callBtn?.setAttribute('aria-disabled', 'false');
  directionsBtn?.setAttribute('aria-disabled', 'false');
}



function initHeroBanners() {
  const slides = $$('#heroBanners .hero-banner-slide');
  const dotsWrap = $('#heroBannerDots');
  if (!slides.length) return;
  let current = 0;
  const dots = [];
  function show(index) {
    current = index;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.type = "button";
      btn.setAttribute('aria-label', `Show banner ${idx + 1}`);
      btn.addEventListener('click', () => show(idx));
      dotsWrap.appendChild(btn);
      dots.push(btn);
    });
  }
  show(0);
  setInterval(() => show((current + 1) % slides.length), 5000);
}


function initInstagramGrid() {
  const grid = $('#instagramRotatingGrid');
  if (!grid || !Array.isArray(INSTAGRAM_FEED_ITEMS) || !INSTAGRAM_FEED_ITEMS.length) return;
  const visibleCount = 21;
  let offset = 0;
  function render() {
    const items = [];
    for (let i = 0; i < visibleCount; i += 1) {
      items.push(INSTAGRAM_FEED_ITEMS[(offset + i) % INSTAGRAM_FEED_ITEMS.length]);
    }
    grid.classList.add('is-changing');
    setTimeout(() => {
      grid.innerHTML = items.map((item) => `
        <article class="instagram-post-card instagram-image-card" data-account="@${safeText(item.account)}">
          <img src="${safeText(item.image)}" alt="${safeText(item.alt || ('Instagram post from ' + item.account))}" loading="lazy" />
        </article>`).join('');
      grid.classList.remove('is-changing');
    }, 180);
    offset = (offset + visibleCount) % INSTAGRAM_FEED_ITEMS.length;
  }
  render();
  setInterval(render, 5000);
}

function initControls() {
  $('#productSearch')?.addEventListener('input', (e) => { state.query = e.target.value; state.page = 1; renderProducts(); });
  $('#categoryFilter')?.addEventListener('change', (e) => { state.category = e.target.value; state.page = 1; renderProducts(); });
  $('#sortFilter')?.addEventListener('change', (e) => { state.sort = e.target.value; state.page = 1; renderProducts(); });
  $('#navToggle')?.addEventListener('click', () => {
    const nav = $('#mainNav');
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    $('#navToggle').setAttribute('aria-expanded', String(open));
  });
  $('#contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#formNote').textContent = 'Form preview only. Connect this to email, CRM, or backend before launch.';
  });
  $('#footerContactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#footerFormNote').textContent = 'Form preview only. Connect this to your email/backend before launch.';
  });
  $('#availabilityLocationSelect')?.addEventListener('change', (e) => updateSelectedLocation(e.target.value));
  $('#availabilityClose')?.addEventListener('click', closeAvailabilityModal);
  $('#availabilityBackdrop')?.addEventListener('click', closeAvailabilityModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#availabilityModal')?.classList.contains('hidden')) closeAvailabilityModal();
  });
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  initCounts();
  initHeroBanners();
  initControls();
  renderBestSellers();
  initInstagramGrid();
  route();
});
