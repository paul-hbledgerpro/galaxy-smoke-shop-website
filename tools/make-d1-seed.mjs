import fs from 'node:fs';
import vm from 'node:vm';
const productsJs = fs.readFileSync('products.js','utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(productsJs, sandbox);
const products = sandbox.window.GALAXY_PRODUCTS || [];
function esc(v){ return String(v ?? '').replaceAll("'", "''"); }
let out = '';
for (const p of products) {
  out += `INSERT OR REPLACE INTO products (id, tab, name, price, department, category, sub_category, pack, size, upc, image_url, active, updated_at) VALUES ('${esc(p.id)}','${esc(p.tab)}','${esc(p.name)}',${Number(p.price||0)},'${esc(p.department)}','${esc(p.category)}','${esc(p.subCategory)}','${esc(p.pack)}','${esc(p.size)}','${esc(p.upc)}','${esc(p.imageUrl)}',1,CURRENT_TIMESTAMP);\n`;
}
fs.writeFileSync('migrations/002_seed_products.sql', out);
console.log(`Wrote migrations/002_seed_products.sql with ${products.length} products.`);
