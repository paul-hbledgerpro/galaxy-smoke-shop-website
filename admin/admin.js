const API = '/api';
let token = localStorage.getItem('galaxyAdminToken') || '';
let products = [];
let deferredInstall = null;
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>[...document.querySelectorAll(s)];
function headers(json=true){const h={}; if(json) h['Content-Type']='application/json'; if(token) h.Authorization=`Bearer ${token}`; return h;}
function showApp(){ $('#loginPanel').classList.add('hidden'); $('#appPanel').classList.remove('hidden'); $('#logout').classList.remove('hidden'); loadStats(); }
async function api(path, opts={}){ const res=await fetch(API+path,{...opts,headers:{...headers(opts.json!==false),...(opts.headers||{})}}); const data=await res.json().catch(()=>({})); if(!res.ok) throw new Error(data.error||res.statusText); return data; }
$('#loginBtn').onclick=async()=>{try{const data=await api('/admin/login',{method:'POST',body:JSON.stringify({password:$('#password').value})}); token=data.token; localStorage.setItem('galaxyAdminToken',token); showApp();}catch(e){$('#loginMessage').textContent=e.message;}};
$('#logout').onclick=()=>{localStorage.removeItem('galaxyAdminToken'); location.reload();};
$$('nav button').forEach(b=>b.onclick=()=>{ $$('nav button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===b.dataset.panel)); $('#panelTitle').textContent=b.textContent; });
async function loadStats(){try{const s=await api('/admin/stats'); $('#statProducts').textContent=s.products; $('#statImages').textContent=s.withImages; $('#statMissing').textContent=s.products-s.withImages;}catch(e){$('#statProducts').textContent='Setup needed';}}
async function loadProducts(){const q=$('#productSearch').value; const tab=$('#tabFilter').value; const data=await api(`/admin/products?q=${encodeURIComponent(q)}&tab=${encodeURIComponent(tab)}`); products=data.products; renderProducts();}
function renderProducts(){ $('#productsTable').innerHTML=products.map(p=>`<tr data-id="${p.id}"><td><strong>${escapeHtml(p.name)}</strong><br><small>${escapeHtml(p.category||'')}</small></td><td>${escapeHtml(p.tab||'')}</td><td>$${Number(p.price||0).toFixed(2)}</td><td>${p.image_url?`<img class="thumb" src="${p.image_url}">`:'—'}</td></tr>`).join(''); $$('#productsTable tr').forEach(r=>r.onclick=()=>editProduct(products.find(p=>p.id===r.dataset.id)));}
function editProduct(p){ if(!p)return; $('#editId').value=p.id; $('#editName').value=p.name||''; $('#editPrice').value=p.price||0; $('#editTab').value=p.tab||'vapes'; $('#editDepartment').value=p.department||''; $('#editCategory').value=p.category||''; $('#editUpc').value=p.upc||''; $('#editImage').value=p.image_url||''; $('#uploadProductId').value=p.id; }
$('#loadProducts').onclick=loadProducts; $('#refreshBtn').onclick=()=>{loadStats(); if(document.querySelector('[data-view="products"]').classList.contains('active')) loadProducts();};
$('#productForm').onsubmit=async(e)=>{e.preventDefault(); const body={id:$('#editId').value,name:$('#editName').value,price:Number($('#editPrice').value||0),tab:$('#editTab').value,department:$('#editDepartment').value,category:$('#editCategory').value,upc:$('#editUpc').value,image_url:$('#editImage').value}; await api('/admin/products',{method:'PUT',body:JSON.stringify(body)}); await loadProducts(); await loadStats();};
$('#newProduct').onclick=()=>['editId','editName','editDepartment','editCategory','editUpc','editImage'].forEach(id=>$('#'+id).value='');
$('#uploadImageBtn').onclick=async()=>{try{const file=$('#uploadImageFile').files[0]; if(!file) throw new Error('Choose an image file.'); const id=$('#uploadProductId').value.trim(); if(!id) throw new Error('Choose/paste product ID.'); const fd=new FormData(); fd.append('image',file); fd.append('productId',id); const res=await fetch(API+'/admin/images/upload',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd}); const data=await res.json(); if(!res.ok) throw new Error(data.error||'Upload failed'); $('#uploadMessage').textContent='Uploaded and attached.'; await loadProducts();}catch(e){$('#uploadMessage').textContent=e.message;}};
$('#importWorkdriveBtn').onclick=async()=>{try{const body={url:$('#workdriveUrl').value,keyword:$('#workdriveKeyword').value}; const data=await api('/admin/images/import-workdrive',{method:'POST',body:JSON.stringify(body)}); $('#workdriveMessage').textContent=`Scan complete. Found ${data.found||0} candidate files and matched ${data.matched||0}.`; }catch(e){$('#workdriveMessage').textContent=e.message;}};
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault(); deferredInstall=e; $('#installApp').classList.remove('hidden');});
$('#installApp').onclick=async()=>{ if(deferredInstall){deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall=null;} };
if(token) showApp();
if('serviceWorker' in navigator) navigator.serviceWorker.register('/admin/sw.js').catch(()=>{});
