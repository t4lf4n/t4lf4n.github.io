#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(ROOT, "index.html");
const CATALOGS = [
  ["LS", "catalog-data.js", "LS_CATALOG"],
  ["CADIVI", "cadivi-catalog-data.js", "CADIVI_CATALOG"],
  ["MITSUBISHI", "mitsubishi-catalog-data.js", "MITSUBISHI_CATALOG"],
  ["MENNEKES", "mennekes-catalog-data.js", "MENNEKES_CATALOG"],
  ["CHINT", "chint-catalog-data.js", "CHINT_CATALOG"],
  ["AUTONICS", "autonics-catalog-data.js", "AUTONICS_CATALOG"],
  ["SCHNEIDER", "schneider-catalog-data.js", "SCHNEIDER_CATALOG"],
  ["NANOCO", "nanoco-catalog-data.js", "NANOCO_CATALOG"]
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function usage() {
  console.log([
    "Tạo trang HTML báo giá sẵn cho một sản phẩm.",
    "",
    "Cách dùng:",
    "  node scripts/generate_product_page.js <mã-hàng> [--brand HÃNG] [--quantity SL] [--output file.html] [--dry-run]",
    "",
    "Ví dụ:",
    "  node scripts/generate_product_page.js NMBP50 --brand NANOCO",
    "  node scripts/generate_product_page.js LC1D09M7 --brand SCHNEIDER --output lc1d09m7.html"
  ].join("\n"));
}

function parseArgs(argv) {
  const result = {query: "", brand: "", quantity: 1, output: ""};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--brand") result.brand = String(argv[++index] || "").toUpperCase();
    else if (value === "--quantity") result.quantity = Number(argv[++index]);
    else if (value === "--output") result.output = String(argv[++index] || "");
    else if (value === "--dry-run") result.dryRun = true;
    else if (value === "--help" || value === "-h") result.help = true;
    else if (!result.query) result.query = value;
    else throw new Error(`Tham số không hợp lệ: ${value}`);
  }
  if (!Number.isInteger(result.quantity) || result.quantity < 1 || result.quantity > 100000) {
    throw new Error("Số lượng phải là số nguyên từ 1 đến 100000.");
  }
  return result;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function slug(value) {
  return String(value || "product")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadProducts() {
  const context = {window: {}};
  vm.createContext(context);
  const products = [];
  for (const [brand, filename, variable] of CATALOGS) {
    const filePath = path.join(ROOT, filename);
    if (!fs.existsSync(filePath)) continue;
    vm.runInContext(fs.readFileSync(filePath, "utf8"), context, {filename});
    const rows = Array.isArray(context.window[variable]) ? context.window[variable] : [];
    rows.forEach(product => products.push({...product, brand: product.brand || brand}));
  }
  return products;
}

function findProduct(products, query, brand) {
  const wanted = normalize(query);
  const matches = products.filter(product =>
    (!brand || product.brand.toUpperCase() === brand) &&
    (normalize(product.code) === wanted || normalize(product.id) === wanted)
  );
  if (matches.length === 0) {
    throw new Error(`Không tìm thấy mã "${query}"${brand ? ` của ${brand}` : ""}.`);
  }
  const unique = new Map(matches.map(product => [
    [product.brand, product.code, product.price, product.spec || ""].join("\u0000"),
    product
  ]));
  if (unique.size > 1) {
    const options = [...unique.values()].map(product =>
      `  ${product.brand} · ${product.id} · ${product.code} · ${Number(product.price).toLocaleString("vi-VN")} đ`
    );
    throw new Error(`Mã này có nhiều kết quả. Hãy dùng đúng product ID:\n${options.join("\n")}`);
  }
  return [...unique.values()][0];
}

function outputPath(filename, product) {
  const defaultName = `${slug(product.brand)}-${slug(product.code || product.id)}.html`;
  const requested = filename || defaultName;
  if (path.isAbsolute(requested)) throw new Error("--output chỉ nhận tên file trong thư mục dự án.");
  const resolved = path.resolve(ROOT, requested);
  if (path.dirname(resolved) !== ROOT) {
    throw new Error("File xuất phải nằm trực tiếp trong thư mục dự án.");
  }
  if (path.extname(resolved).toLowerCase() !== ".html") {
    throw new Error("File xuất phải có đuôi .html.");
  }
  if (resolved === TEMPLATE_PATH) throw new Error("Không được ghi đè index.html.");
  return resolved;
}

function makePage(product, quantity) {
  const title = `${product.brand} ${product.code || product.name}`;
  const detail = [product.name, product.spec, product.technical].filter(Boolean).join(" · ");
  const displayPrice = Number(product.price).toLocaleString("vi-VN");
  const heading = `Giá tham khảo ${title}`;
  const preselect = {
    brand: product.brand,
    productId: product.id,
    quantity,
    heading
  };
  let html = fs.readFileSync(TEMPLATE_PATH, "utf8");
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(heading)}</title>`);
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${escapeHtml(title)}</h1>`);
  html = html.replace(
    /<div class="icon" aria-hidden="true">[\s\S]*?<\/div>/,
    `<div class="icon" aria-hidden="true">${escapeHtml(product.brand.slice(0, 2))}</div>`
  );
  html = html.replace("Sản phẩm đã chọn", "Sản phẩm đang xem");
  html = html.replace(
    "Tự động cập nhật theo cuộc hội thoại",
    `${escapeHtml(detail || product.code)} · ${quantity} ${escapeHtml(product.unit || "cái")} · ${displayPrice} đ/${escapeHtml(product.unit || "cái")}`
  );
  html = html.replace("<span>Tạm tính</span>", "<span>Giá tham khảo</span>");
  html = html.replace(
    '<script src="app.js"></script>',
    `<script>\n  window.QUOTE_PRESELECT = ${JSON.stringify(preselect, null, 2)};\n</script>\n<script src="app.js"></script>`
  );
  return html;
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    fail(error.message);
    usage();
    return;
  }
  if (options.help || !options.query) {
    usage();
    if (!options.help) process.exitCode = 1;
    return;
  }
  try {
    const product = findProduct(loadProducts(), options.query, options.brand);
    const destination = outputPath(options.output, product);
    if (options.dryRun) {
      console.log(`Sẽ tạo ${path.basename(destination)}`);
      console.log(`${product.brand} · ${product.code} · ${Number(product.price).toLocaleString("vi-VN")} đ/${product.unit || "cái"}`);
      return;
    }
    if (fs.existsSync(destination)) {
      throw new Error(`File đã tồn tại: ${path.basename(destination)}. Hãy đổi --output để tránh ghi đè.`);
    }
    fs.writeFileSync(destination, makePage(product, options.quantity), "utf8");
    console.log(`Đã tạo ${path.basename(destination)}`);
    console.log(`${product.brand} · ${product.code} · ${Number(product.price).toLocaleString("vi-VN")} đ/${product.unit || "cái"}`);
  } catch (error) {
    fail(error.message);
  }
}

main();
