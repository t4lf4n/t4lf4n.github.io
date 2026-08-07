function splitSharedAmpOptions(spec) {
  const normalized = String(spec || "").trim();
  if (!/^[\d.,\s~\-àvA]+$/i.test(normalized) || !/A$/i.test(normalized)) return [];

  const sharedGroups = normalized.includes(",")
    ? normalized.split(",")
    : /\s+và\s+/i.test(normalized)
      ? normalized.split(/\s+và\s+/i)
      : [];
  if (sharedGroups.length > 1) {
    const options = sharedGroups.map(group => {
      const cleaned = group.trim().replace(/\s*([~-])\s*/g, "$1");
      return /A$/i.test(cleaned) ? cleaned : `${cleaned}A`;
    });
    const valid = options.every(option =>
      /^\d+(?:\.\d+)?(?:[~-]\d+(?:\.\d+)?)?A$/i.test(option)
    );
    return valid ? [...new Set(options)] : [];
  }

  if (!/^[\d.\s-]+A$/i.test(normalized)) return [];
  const values = normalized.match(/\d+(?:[.,]\d+)?/g) || [];
  if (values.length < 2) return [];
  return [...new Set(values.map(value => `${value.replace(",", ".")}A`))];
}

function expandLsCatalog(products) {
  return products.flatMap(product => {
    const ratings = splitSharedAmpOptions(product.spec);
    if (ratings.length === 0) return [product];
    return ratings.map(rating => ({
      ...product,
      id: `${product.id}-${rating.replace(/[^\dA-Z]/gi, "_")}`,
      baseProductId: product.id,
      sourceSpec: product.spec,
      spec: rating
    }));
  });
}

const APP_CONFIG = window.APP_CONFIG || {};
const CATALOG_SOURCES = {
  LS: {
    brand: "LS",
    label: "LS Electric",
    effectiveDate: "15-04-2026",
    currency: "VND",
    vatIncluded: false,
    document: "Bang gia LS ap dung ngay 15-04-2026.pdf",
    pages: 8,
    stats: window.LS_CATALOG_STATS || {},
    familyOrder: [
      "MCCB & ELCB",
      "Thiết bị tép & chống sét",
      "Khởi động từ & rơ le",
      "ACB Metasol",
      "MCCB Susol",
      "Điều khiển & đo lường",
      "Phụ kiện"
    ],
    products: expandLsCatalog(
      Array.isArray(window.LS_CATALOG) ? window.LS_CATALOG : []
    )
      .map(product => ({
        ...product,
        brand: "LS",
        unit: product.unit || "cái",
        effectiveDate: "15-04-2026",
        sourceDocument: "Bang gia LS ap dung ngay 15-04-2026.pdf"
      }))
  },
  CADIVI: {
    brand: "CADIVI",
    label: "CADIVI",
    effectiveDate: "06-04-2026",
    currency: "VND",
    vatIncluded: false,
    document: "CADIVI T4 2026.pdf",
    pages: 118,
    stats: window.CADIVI_CATALOG_STATS || {},
    familyOrder: [
      "Dây điện dân dụng",
      "Cáp điện lực hạ thế",
      "Cáp điện trung thế",
      "Cáp điều khiển",
      "Cáp chống cháy & LSHF",
      "Dây dẫn trần",
      "Phụ kiện & thiết bị điện",
      "Cáp năng lượng mặt trời",
      "Cáp truyền số liệu"
    ],
    products: (Array.isArray(window.CADIVI_CATALOG) ? window.CADIVI_CATALOG : [])
      .map(product => ({
        ...product,
        brand: "CADIVI",
        unit: product.unit || "mét",
        effectiveDate: product.effectiveDate || "06-04-2026",
        sourceDocument: product.sourceDocument || "CADIVI T4 2026.pdf"
      }))
  },
  MITSUBISHI: {
    brand: "MITSUBISHI",
    label: "Mitsubishi Electric",
    effectiveDate: "F1/2026",
    currency: "VND",
    vatIncluded: false,
    document: "MITSUBISHI F1 2026.xlsm",
    pages: 8,
    stats: window.MITSUBISHI_CATALOG_STATS || {},
    familyOrder: [
      "MCCB",
      "MCCB bảo vệ động cơ",
      "ELCB",
      "MCB, RCCB & RCBO",
      "Khởi động từ & rơ-le"
    ],
    products: (
      Array.isArray(window.MITSUBISHI_CATALOG)
        ? window.MITSUBISHI_CATALOG
        : []
    ).map(product => ({
      ...product,
      brand: "MITSUBISHI",
      unit: product.unit || "cái",
      sourcePage: product.sourcePage || 1,
      effectiveDate: "F1/2026",
      sourceDocument: "MITSUBISHI F1 2026.xlsm"
    }))
  },
  MENNEKES: {
    brand: "MENNEKES",
    label: "MENNEKES",
    effectiveDate: "2025",
    currency: "VND",
    vatIncluded: false,
    document: "Pricelist Mennekes 2025.pdf",
    pages: 8,
    stats: window.MENNEKES_CATALOG_STATS || {},
    familyOrder: [
      "Ổ cắm CEE",
      "Phích cắm CEE",
      "Đầu nối CEE",
      "Ổ cắm CEE liên động",
      "SCHUKO"
    ],
    products: (
      Array.isArray(window.MENNEKES_CATALOG)
        ? window.MENNEKES_CATALOG
        : []
    ).map(product => ({
      ...product,
      brand: "MENNEKES",
      unit: product.unit || "cái",
      sourcePage: product.sourcePage || 1,
      effectiveDate: "2025",
      sourceDocument: "Pricelist Mennekes 2025.pdf"
    }))
  },
  CHINT: {
    brand: "CHINT",
    label: "CHINT",
    effectiveDate: "2026",
    currency: "VND",
    vatIncluded: false,
    document: "Bảng giá Chint niêm yết của hãng.pdf",
    pages: 76,
    stats: window.CHINT_CATALOG_STATS || {},
    familyOrder: [
      "Thiết bị điện dân dụng",
      "ACB & phụ kiện",
      "MCCB & phụ kiện",
      "ATS",
      "Cầu chì & đồng hồ đo",
      "Khởi động từ & bảo vệ động cơ",
      "Khởi động mềm & biến tần",
      "Nút nhấn, đèn báo & công tắc",
      "Rơ le",
      "Thiết bị điều khiển công nghiệp"
    ],
    products: (
      Array.isArray(window.CHINT_CATALOG)
        ? window.CHINT_CATALOG
        : []
    ).map(product => ({
      ...product,
      brand: "CHINT",
      unit: product.unit || "cái",
      sourcePage: product.sourcePage || 1,
      effectiveDate: "2026",
      sourceDocument: "Bảng giá Chint niêm yết của hãng.pdf"
    }))
  },
  AUTONICS: {
    brand: "AUTONICS",
    label: "Autonics",
    effectiveDate: "2026",
    currency: "VND",
    vatIncluded: false,
    document: "Bảng giá Autonics 2026.pdf",
    pages: 12,
    stats: window.AUTONICS_CATALOG_STATS || {},
    familyOrder: [
      "Bộ đếm & định thời",
      "Bộ điều khiển",
      "Hiển thị & đo lường",
      "Cảm biến",
      "Bộ nguồn",
      "Bộ mã hóa vòng quay",
      "Điều khiển chuyển động",
      "Phụ kiện"
    ],
    products: (
      Array.isArray(window.AUTONICS_CATALOG)
        ? window.AUTONICS_CATALOG
        : []
    ).map(product => ({
      ...product,
      brand: "AUTONICS",
      unit: product.unit || "cái",
      sourcePage: product.sourcePage || 1,
      effectiveDate: "2026",
      sourceDocument: "Bảng giá Autonics 2026.pdf"
    }))
  },
  SCHNEIDER: {
    brand: "SCHNEIDER",
    label: "Schneider Electric",
    effectiveDate: "05.2026",
    currency: "VND",
    vatIncluded: false,
    document: "schneider [Small size] CAP NHAT GIA - BANG GIA DAI LY 57 TRANG.pdf",
    pages: 57,
    stats: window.SCHNEIDER_CATALOG_STATS || {},
    familyOrder: [
      "Công tắc, ổ cắm & điều khiển dân dụng",
      "Phích cắm & ổ cắm công nghiệp",
      "Thiết bị phân phối điện dân dụng",
      "MCCB, ACB & chuyển nguồn",
      "Thiết bị điều khiển công nghiệp"
    ],
    products: (
      Array.isArray(window.SCHNEIDER_CATALOG)
        ? window.SCHNEIDER_CATALOG
        : []
    ).map(product => ({
      ...product,
      brand: "SCHNEIDER",
      unit: product.unit || "cái",
      sourcePage: product.sourcePage || 1,
      effectiveDate: product.effectiveDate || "05.2026",
      sourceDocument: product.sourceDocument || "schneider [Small size] CAP NHAT GIA - BANG GIA DAI LY 57 TRANG.pdf"
    }))
  },
  NANOCO: {
    brand: "NANOCO",
    label: "Nanoco",
    effectiveDate: "07.2026",
    currency: "VND",
    vatIncluded: false,
    document: "CATALOGUE NANOCO - UPDATE 072026.pdf + CATALOGUE NANOCO GIA DUNG - UPDATE 072026.pdf",
    pages: 108,
    stats: window.NANOCO_CATALOG_STATS || {},
    familyOrder: [
      "Công tắc & ổ cắm",
      "Thiết bị điện & phân phối",
      "Ống luồn, phụ kiện & công nghiệp",
      "Quạt & thông gió",
      "Điện gia dụng",
      "Máy nước nóng & máy bơm",
      "Chiếu sáng"
    ],
    products: (
      Array.isArray(window.NANOCO_CATALOG)
        ? window.NANOCO_CATALOG
        : []
    ).map(product => ({
      ...product,
      brand: "NANOCO",
      unit: product.unit || "cái",
      sourcePage: product.sourcePage || 1,
      effectiveDate: product.effectiveDate || "07.2026",
      sourceDocument: product.sourceDocument || "CATALOGUE NANOCO - UPDATE 072026.pdf"
    }))
  }
};
const AVAILABLE_SOURCES = Object.values(CATALOG_SOURCES)
  .filter(source => source.products.length > 0);
const PRODUCTS = AVAILABLE_SOURCES.flatMap(source => source.products);

const chat = document.getElementById("chat");
const cartBox = document.getElementById("cart");
const lineCount = document.getElementById("lineCount");
const unitCount = document.getElementById("unitCount");
const grandTotal = document.getElementById("grandTotal");
const mobileCount = document.getElementById("mobileCount");
const resetButton = document.getElementById("reset");
const catalogCount = document.getElementById("catalogCount");

const state = {
  brand: null,
  family: null,
  category: null,
  product: null,
  variant: null,
  phone: null,
  cart: []
};

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

function activeSource() {
  return state.brand ? CATALOG_SOURCES[state.brand] : null;
}

function activeProducts() {
  const source = activeSource();
  return source ? source.products : [];
}

function productTitle(product) {
  return [product.code, product.name].filter(Boolean).join(" - ");
}

function productUnit(product) {
  return product.unit || (product.brand === "CADIVI" ? "mét" : "cái");
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi")
    .replace(/[×*]/g, "x")
    .replace(/[-_/\\]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchQuery(value) {
  const text = normalizeSearch(value);
  return {
    text,
    compact: text.replace(/\s+/g, ""),
    tokens: text.split(" ").filter(Boolean)
  };
}

function productSearchKeys(product) {
  const fields = [
    product.code,
    product.name,
    product.spec,
    product.technical,
    product.category,
    product.family,
    product.brand
  ]
    .filter(Boolean)
    .map(normalizeSearch);
  return {
    text: fields.join(" "),
    compact: fields.map(field => field.replace(/\s+/g, "")).join(" ")
  };
}

function matchesProductSearch(entry, query) {
  if (!query.text) return true;
  return (
    entry.text.includes(query.text) ||
    entry.compact.includes(query.compact) ||
    query.tokens.every(token =>
      entry.text.includes(token) || entry.compact.includes(token)
    )
  );
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function scrollBottom() {
  requestAnimationFrame(() => {
    chat.scrollTop = chat.scrollHeight;
  });
}

function focusControl(element) {
  if (!element) return;
  try {
    element.focus({preventScroll: true});
  } catch {
    element.focus();
  }
  requestAnimationFrame(() => {
    element.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
  });
}

function removeControls() {
  chat.querySelectorAll(
    ".choices,.qty-panel,.select-panel,.search-panel,.phone-panel"
  ).forEach(element => element.remove());
}

function message(type, content, tone = "", rowClass = "") {
  const row = document.createElement("div");
  row.className = `row ${type} ${rowClass}`.trim();
  const bubble = document.createElement("div");
  bubble.className = `bubble ${tone}`.trim();
  bubble.innerHTML = content;
  row.appendChild(bubble);
  chat.appendChild(row);
  scrollBottom();
  return row;
}

function bot(content, tone = "", rowClass = "") {
  return message("bot", content, tone, rowClass);
}

function user(text) {
  return message("user", esc(text));
}

function choices(items) {
  removeControls();
  const box = document.createElement("div");
  box.className = "choices";
  items.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice ${item.className || ""}`.trim();
    button.innerHTML = item.html ?? esc(item.label);
    button.onclick = item.onClick;
    box.appendChild(button);
  });
  chat.appendChild(box);
  scrollBottom();
  focusControl(box.querySelector("button"));
}

function pagedChoices(items, toChoice, options = {}) {
  const pageSize = options.pageSize || 30;
  let visibleCount = Math.min(pageSize, items.length);

  function render() {
    const rendered = items.slice(0, visibleCount).map(toChoice);
    if (visibleCount < items.length) {
      rendered.push({
        html:
          `<strong>Xem thêm</strong> ` +
          `<span class="choice-note">${(items.length - visibleCount).toLocaleString("vi-VN")} lựa chọn còn lại</span>`,
        className: "more-choice",
        onClick: () => {
          visibleCount = Math.min(visibleCount + pageSize, items.length);
          render();
        }
      });
    }
    if (typeof options.onBack === "function") {
      rendered.push({
        label: options.backLabel || "← Quay lại",
        className: "back-choice",
        onClick: options.onBack
      });
    }
    if (typeof options.onQuickSearch === "function") {
      rendered.push({
        label: "← Quay lại tìm nhanh",
        className: "back-choice",
        onClick: options.onQuickSearch
      });
    }
    choices(rendered);
  }

  render();
}

function selectProduct(items, onSelect, options = {}) {
  removeControls();
  const panel = document.createElement("div");
  panel.className = "search-panel";

  const toolbar = document.createElement("div");
  toolbar.className = "search-toolbar";
  const input = document.createElement("input");
  input.type = "search";
  input.autocomplete = "off";
  input.setAttribute("aria-label", "Tìm theo mã hoặc tên sản phẩm");
  input.placeholder = options.placeholder || "Nhập mã, tên hoặc thông số sản phẩm";

  const status = document.createElement("div");
  status.className = "search-status";
  status.setAttribute("aria-live", "polite");

  const list = document.createElement("div");
  list.className = "product-list";
  list.setAttribute("role", "listbox");

  const sortedItems = [...items]
    .sort((a, b) => {
      const byName = a.name.localeCompare(b.name, "vi", {numeric: true});
      return (
        byName ||
        String(a.spec || "").localeCompare(String(b.spec || ""), "vi", {numeric: true}) ||
        a.price - b.price
      );
    });
  const searchIndex = sortedItems.map(product => ({
    product,
    ...productSearchKeys(product)
  }));
  const resultLimit = options.resultLimit || 60;

  function chooseProduct(product) {
    if (!product) return;
    onSelect(product);
  }

  function renderResults() {
    const query = searchQuery(input.value);
    const matches = query.text
      ? searchIndex
        .filter(entry => matchesProductSearch(entry, query))
        .sort((a, b) => {
          const aCode = searchQuery(a.product.code);
          const bCode = searchQuery(b.product.code);
          const aName = searchQuery(a.product.name);
          const bName = searchQuery(b.product.name);
          const aScore =
            (aCode.text === query.text || aCode.compact === query.compact
              ? 0
              : aCode.text.startsWith(query.text) || aCode.compact.startsWith(query.compact)
                ? 1
                : aName.text === query.text || aName.compact === query.compact
                  ? 2
                  : aName.text.startsWith(query.text) || aName.compact.startsWith(query.compact)
                    ? 3
                    : 4);
          const bScore =
            (bCode.text === query.text || bCode.compact === query.compact
              ? 0
              : bCode.text.startsWith(query.text) || bCode.compact.startsWith(query.compact)
                ? 1
                : bName.text === query.text || bName.compact === query.compact
                  ? 2
                  : bName.text.startsWith(query.text) || bName.compact.startsWith(query.compact)
                    ? 3
                    : 4);
          return aScore - bScore;
        })
      : searchIndex;
    const visible = matches.slice(0, resultLimit);
    list.innerHTML = "";

    visible.forEach(entry => {
      const product = entry.product;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "product-option";
      button.setAttribute("role", "option");
      const meta = [
        product.spec,
        technicalLabel(product),
        product.category
      ].filter(Boolean).join(" · ");
      button.innerHTML = `
        <span class="product-option-main">${esc(productTitle(product))}</span>
        <span class="product-option-meta">${esc(meta)}</span>
        <span class="product-option-price">${money.format(product.price)}/${esc(productUnit(product))}</span>`;
      button.onclick = () => chooseProduct(product);
      list.appendChild(button);
    });

    if (matches.length === 0) {
      list.innerHTML =
        '<div class="search-empty">Không tìm thấy sản phẩm phù hợp. Thử mã hoặc từ khóa khác.</div>';
    }
    status.textContent = matches.length > resultLimit
      ? `Hiển thị ${resultLimit.toLocaleString("vi-VN")} / ${matches.length.toLocaleString("vi-VN")} kết quả`
      : `${matches.length.toLocaleString("vi-VN")} kết quả`;
  }

  input.addEventListener("input", renderResults);
  input.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    const firstResult = list.querySelector(".product-option");
    if (firstResult) firstResult.click();
  });
  toolbar.appendChild(input);

  if (typeof options.onGuidedSelect === "function") {
    const guided = document.createElement("button");
    guided.type = "button";
    guided.className = "choice";
    guided.textContent = "Chọn theo từng bước";
    guided.onclick = options.onGuidedSelect;
    toolbar.appendChild(guided);
  }

  panel.append(toolbar, status, list);
  chat.appendChild(panel);
  renderResults();
  scrollBottom();
  focusControl(input);
}

function technicalLabel(product) {
  if (!product.technical) return "";
  if (/k[av]/i.test(product.technical)) return product.technical;
  if (/MCCB|MCB|ELCB|RCBO|RCCB|ACB/i.test(product.category)) {
    return `Icu ${product.technical}kA`;
  }
  return product.technical;
}

function productOptionLabel(product) {
  const parts = [
    product.code,
    product.name,
    product.spec,
    technicalLabel(product)
  ].filter(Boolean);
  return `${parts.join(" · ")} — ${money.format(product.price)}`;
}

function variantOptions(product) {
  return product.spec ? [product.spec] : [];
}

function groupLsModels(products) {
  const groups = new Map();
  products.forEach(product => {
    const key = [product.name, product.code || "", product.technical || ""].join("\u0000");
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: product.name,
        code: product.code || "",
        technical: product.technical || "",
        products: []
      });
    }
    groups.get(key).products.push(product);
  });
  return [...groups.values()]
    .map(group => ({
      ...group,
      products: group.products.sort((a, b) =>
        String(a.spec || "").localeCompare(String(b.spec || ""), "vi", {numeric: true}) ||
        a.price - b.price
      )
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, "vi", {numeric: true}) ||
      a.technical.localeCompare(b.technical, "vi", {numeric: true})
    );
}

function modelPriceLabel(products) {
  const prices = [...new Set(products.map(product => product.price))].sort((a, b) => a - b);
  return prices.length === 1
    ? money.format(prices[0])
    : `${money.format(prices[0])} – ${money.format(prices.at(-1))}`;
}

function start(clearCart = true) {
  state.brand = null;
  state.family = null;
  state.category = null;
  state.product = null;
  state.variant = null;
  state.phone = null;
  if (clearCart) state.cart = [];
  chat.innerHTML = "";
  renderCart();

  if (AVAILABLE_SOURCES.length === 0) {
    bot("Không tải được dữ liệu bảng giá. Hãy kiểm tra các file catalog.", "error");
    return;
  }

  bot(
    `Xin chào. Tôi có <strong>${PRODUCTS.length.toLocaleString("vi-VN")}</strong> lựa chọn sản phẩm từ ` +
    `<strong>${AVAILABLE_SOURCES.length} nhãn hàng</strong>. Hãy chọn nhãn hàng để bắt đầu.`
  );
  askBrand();
}

function startPreselectedQuote(config) {
  const configuredItems =
    Array.isArray(config.items) && config.items.length > 0
      ? config.items
      : [config];
  const resolvedItems = configuredItems.map(itemConfig => {
    const brand = String(itemConfig.brand || config.brand || "").toUpperCase();
    const source = CATALOG_SOURCES[brand];
    const product = source && source.products.find(item =>
      (itemConfig.productId && item.id === itemConfig.productId) ||
      (
        !itemConfig.productId &&
        normalizeSearch(item.name) === normalizeSearch(itemConfig.name) &&
        normalizeSearch(item.spec) === normalizeSearch(itemConfig.spec)
      )
    );
    if (!product) return null;

    const requestedQuantity = Number(itemConfig.quantity);
    const quantity =
      Number.isInteger(requestedQuantity) &&
      requestedQuantity > 0 &&
      requestedQuantity <= 100000
        ? requestedQuantity
        : 1;
    return {
      product,
      variant: product.spec || "",
      quantity
    };
  });

  if (resolvedItems.some(item => !item)) {
    start(true);
    bot(
      "Không tìm thấy một hoặc nhiều sản phẩm được cài sẵn cho trang này. Vui lòng chọn lại từ catalog.",
      "error"
    );
    return;
  }

  const firstItem = resolvedItems[0];
  state.brand = firstItem.product.brand;
  state.family = firstItem.product.family;
  state.category = firstItem.product.category;
  state.product = firstItem.product;
  state.variant = firstItem.variant;
  state.phone = null;
  state.cart = resolvedItems;
  chat.innerHTML = "";
  renderCart();

  const productLines = resolvedItems.map(item => {
    const product = item.product;
    const details = [
      product.category,
      item.variant,
      technicalLabel(product)
    ].filter(Boolean).join(" · ");
    return (
      `${esc(productTitle(product))}${details ? ` · ${esc(details)}` : ""}` +
      `<br>Số lượng: <strong>${item.quantity} ${esc(productUnit(product))}</strong> · ` +
      `Đơn giá tham khảo: <strong>${money.format(product.price)}/${esc(productUnit(product))}</strong>.`
    );
  }).join("<br><br>");
  const total = resolvedItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );
  bot(
    `<strong>${esc(config.heading || "Báo giá tham khảo đã sẵn sàng")}</strong><br>` +
    `${productLines}` +
    (resolvedItems.length > 1
      ? `<br><br>Tổng giá trị tham khảo: <strong>${money.format(total)}</strong>.`
      : "")
  );
  askPhone();
}

function askBrand() {
  state.brand = null;
  state.family = null;
  state.category = null;
  state.product = null;
  state.variant = null;
  bot("<strong>Bước 1:</strong> Chọn nhãn hàng.");
  choices(AVAILABLE_SOURCES.map(source => ({
    html:
      `<strong>${esc(source.label)}</strong> ` +
      `<span class="choice-note">${source.products.length.toLocaleString("vi-VN")} lựa chọn · ` +
      `${esc(source.effectiveDate)}</span>`,
    onClick: () => {
      user(source.label);
      state.brand = source.brand;
      askBrandEntry();
    }
  })));
}

function askBrandEntry() {
  const source = activeSource();
  if (!source) {
    askBrand();
    return;
  }
  state.family = null;
  state.category = null;
  state.product = null;
  state.variant = null;
  bot(
    `Nếu đã biết sản phẩm cần mua, hãy tìm nhanh theo <strong>mã, tên hoặc thông số</strong> ` +
    `trong danh sách ${esc(source.label)} bên dưới. Nếu chưa, bạn có thể chọn theo từng bước.`
  );
  selectProduct(
    source.products,
    product => {
      state.family = product.family;
      state.category = product.category;
      state.product = product;
      user(productOptionLabel(product));
      askVariant();
    },
    {
      placeholder: `Tìm trong ${source.products.length.toLocaleString("vi-VN")} lựa chọn ${source.label}`,
      resultLimit: 60,
      onGuidedSelect: () => {
        user("Chọn theo từng bước");
        askFamily();
      }
    }
  );
}

function askFamily() {
  const source = activeSource();
  if (!source) {
    askBrand();
    return;
  }
  state.family = null;
  state.category = null;
  state.product = null;
  state.variant = null;
  bot(`<strong>Bước 2:</strong> Chọn nhóm sản phẩm ${esc(source.label)}.`);
  const products = activeProducts();
  const availableFamilies = new Set(products.map(product => product.family));
  const families = [
    ...source.familyOrder.filter(family => availableFamilies.has(family)),
    ...[...availableFamilies]
      .filter(family => !source.familyOrder.includes(family))
      .sort((a, b) => a.localeCompare(b, "vi", {numeric: true}))
  ];
  choices(families.map(family => {
    const count = products.filter(product => product.family === family).length;
    return {
      html:
        `${esc(family)} ` +
        `<span class="choice-note">${count.toLocaleString("vi-VN")} lựa chọn</span>`,
      onClick: () => {
        user(family);
        state.family = family;
        askCategory();
      }
    };
  }));
}

function askCategory() {
  const products = activeProducts()
    .filter(product => product.family === state.family);
  const categories = [...new Set(products.map(product => product.category))]
    .sort((a, b) => a.localeCompare(b, "vi", {numeric: true}));
  bot(`<strong>Bước 3:</strong> Chọn loại sản phẩm trong nhóm ${esc(state.family)}.`);
  choices(categories.map(category => {
    const count = products.filter(product => product.category === category).length;
    return {
      html: `${esc(category)} <span class="choice-note">${count}</span>`,
      onClick: () => {
        user(category);
        state.category = category;
        askProduct();
      }
    };
  }));
}

function askProduct() {
  const products = activeProducts().filter(product =>
    product.family === state.family && product.category === state.category
  );
  const returnToQuickSearch = () => {
    user("Quay lại tìm nhanh");
    askBrandEntry();
  };

  if (state.brand === "LS") {
    const models = groupLsModels(products);
    bot(
      `<strong>Bước 4:</strong> Chọn mã hàng. ` +
      `<small>Mỗi mã chỉ hiển thị một lần; thông số sẽ được chọn ở bước kế tiếp.</small>`
    );
    pagedChoices(
      models,
      model => ({
        html:
          `<strong>${esc([model.code, model.name].filter(Boolean).join(" - "))}</strong>` +
          `<span class="choice-note">` +
          `${model.products.length.toLocaleString("vi-VN")} thông số` +
          `${model.technical ? ` · ${esc(technicalLabel(model.products[0]))}` : ""}` +
          ` · ${modelPriceLabel(model.products)}` +
          `</span>`,
        className: "model-choice",
        onClick: () => {
          user([model.code, model.name].filter(Boolean).join(" - "));
          askLsSpecification(model);
        }
      }),
      {pageSize: 30, onQuickSearch: returnToQuickSearch}
    );
    return;
  }

  const sortedProducts = [...products].sort((a, b) =>
    productTitle(a).localeCompare(productTitle(b), "vi", {numeric: true})
  );
  bot(
    `<strong>Bước 4:</strong> Chọn sản phẩm trong danh sách. ` +
    `<small>Nếu đã biết chính xác mã hàng, bạn có thể quay lại màn hình tìm nhanh.</small>`
  );
  pagedChoices(
    sortedProducts,
    product => ({
      html:
        `<strong>${esc(productTitle(product))}</strong>` +
        `<span class="choice-note">` +
        `${esc([product.spec, technicalLabel(product)].filter(Boolean).join(" · "))}` +
        `${product.spec || product.technical ? " · " : ""}${money.format(product.price)}/${esc(productUnit(product))}` +
        `</span>`,
      className: "model-choice",
      onClick: () => {
        state.product = product;
        user(productOptionLabel(product));
        askVariant();
      }
    }),
    {pageSize: 30, onQuickSearch: returnToQuickSearch}
  );
}

function askLsSpecification(model) {
  const products = model.products;
  if (products.length === 1) {
    state.product = products[0];
    state.variant = products[0].spec || "";
    askQuantity();
    return;
  }

  const prices = new Set(products.map(product => product.price));
  const samePrice = prices.size === 1;
  bot(
    `<strong>Chọn thông số:</strong> ${esc([model.code, model.name].filter(Boolean).join(" - "))}. ` +
    (samePrice
      ? `Các thông số bên dưới có cùng đơn giá <strong>${money.format(products[0].price)}/${esc(productUnit(products[0]))}</strong>.`
      : "Đơn giá thay đổi theo từng thông số và được ghi ngay trên mỗi lựa chọn.")
  );
  pagedChoices(
    products,
    product => ({
      html:
        `<strong>${esc(product.spec || "Mặc định")}</strong>` +
        (!samePrice
          ? `<span class="choice-note">${money.format(product.price)}/${esc(productUnit(product))}</span>`
          : ""),
      className: "spec-choice",
      onClick: () => {
        state.product = product;
        state.variant = product.spec || "";
        user(
          `${product.spec || productTitle(product)}` +
          `${samePrice ? "" : ` · ${money.format(product.price)}/${productUnit(product)}`}`
        );
        askQuantity();
      }
    }),
    {
      pageSize: 30,
      backLabel: "← Chọn mã hàng khác",
      onBack: () => {
        user("Chọn mã hàng khác");
        askProduct();
      },
      onQuickSearch: () => {
        user("Quay lại tìm nhanh");
        askBrandEntry();
      }
    }
  );
}

function askVariant() {
  const variants = variantOptions(state.product);
  if (variants.length <= 1) {
    state.variant = variants[0] || state.product.spec || "";
    askQuantity();
    return;
  }
  bot(`<strong>Chọn định mức:</strong> ${esc(productTitle(state.product))}.`);
  choices(variants.map(variant => ({
    label: variant,
    onClick: () => {
      user(variant);
      state.variant = variant;
      askQuantity();
    }
  })));
}

function askQuantity() {
  const product = state.product;
  const details = [state.variant, technicalLabel(product)].filter(Boolean).join(" · ");
  bot(
    `<strong>Số lượng:</strong> ${esc(productTitle(product))}` +
    `${details ? ` · ${esc(details)}` : ""} có đơn giá ` +
    `<strong>${money.format(product.price)}/${esc(productUnit(product))}</strong>. ` +
    `Chọn nhanh hoặc tự nhập số lượng.`
  );

  const panel = document.createElement("div");
  panel.className = "qty-panel";
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Chọn nhanh số lượng");
  [1, 2, 3, 5, 10, 20, 50, 100, 200, 500, 1000].forEach(quantity => {
    const option = document.createElement("option");
    option.value = quantity;
    option.textContent = `${quantity} ${productUnit(product)}`;
    select.appendChild(option);
  });

  const input = document.createElement("input");
  input.type = "number";
  input.inputMode = "numeric";
  input.min = "1";
  input.max = "100000";
  input.step = "1";
  input.placeholder = "Tự nhập số lượng";
  input.setAttribute("aria-label", "Tự nhập số lượng");

  const error = document.createElement("p");
  error.className = "qty-error";
  error.setAttribute("aria-live", "polite");

  const add = document.createElement("button");
  add.type = "button";
  add.className = "choice primary";
  add.textContent = "Thêm vào giỏ";

  function selectedQuantity(showError = false) {
    const custom = input.value.trim();
    if (!custom) {
      error.textContent = "";
      add.disabled = false;
      return Number(select.value);
    }
    const quantity = Number(custom);
    const valid = Number.isInteger(quantity) && quantity >= 1 && quantity <= 100000;
    error.textContent = !valid && showError
      ? "Số lượng phải là số nguyên từ 1 đến 100.000."
      : "";
    add.disabled = !valid;
    return valid ? quantity : 0;
  }

  select.addEventListener("change", () => {
    input.value = "";
    selectedQuantity(false);
  });
  input.addEventListener("input", () => selectedQuantity(true));
  input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !add.disabled) add.click();
  });
  add.onclick = () => {
    const quantity = selectedQuantity(true);
    if (!quantity) return;
    user(`${quantity} ${productUnit(product)}`);
    addToCart(product, state.variant, quantity);
  };

  panel.append(select, input, add, error);
  chat.appendChild(panel);
  scrollBottom();
  focusControl(select);
}

function addToCart(product, variant, quantity) {
  removeControls();
  const existing = state.cart.find(item =>
    item.product.id === product.id && item.variant === variant
  );
  if (existing) existing.quantity += quantity;
  else state.cart.push({product, variant, quantity});
  renderCart();
  bot(
    `Đã thêm <strong>${quantity} × ${esc(productTitle(product))}</strong>.<br>` +
    `Thành tiền: <strong>${money.format(product.price * quantity)}</strong>.`,
    "success"
  );
  askContinue();
}

function askContinue() {
  bot("Bạn muốn chọn thêm sản phẩm hay tiến hành gửi yêu cầu báo giá?");
  choices([
    {
      label: "Chọn thêm cùng nhãn",
      onClick: () => {
        user("Chọn thêm cùng nhãn");
        askBrandEntry();
      }
    },
    {
      label: "Chọn nhãn hàng khác",
      onClick: () => {
        user("Chọn nhãn hàng khác");
        askBrand();
      }
    },
    {
      label: "Tiến hành báo giá",
      className: "primary",
      onClick: () => {
        user("Tiến hành báo giá");
        askPhone();
      }
    }
  ]);
}

function chooseAnotherProduct() {
  if (window.QUOTE_PRESELECT) {
    window.location.href = "index.html";
    return;
  }
  start(true);
}

function normalizePhone(value) {
  const phone = String(value || "").trim().replace(/\s+/g, " ");
  if (!/^[+()\d.\s-]+$/.test(phone)) return "";
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15 ? phone : "";
}

function askPhone() {
  removeControls();
  bot(
    "<strong>Bước cuối:</strong> Vui lòng để lại số điện thoại để công ty liên hệ xác nhận và hỗ trợ mức giá tốt hơn."
  );

  const panel = document.createElement("div");
  panel.className = "phone-panel";

  const label = document.createElement("label");
  label.htmlFor = "quotePhone";
  label.textContent = "Số điện thoại";

  const input = document.createElement("input");
  input.id = "quotePhone";
  input.type = "tel";
  input.inputMode = "tel";
  input.autocomplete = "tel";
  input.placeholder = "Ví dụ: 0901 234 567";
  input.maxLength = 24;

  const help = document.createElement("p");
  help.className = "phone-help";
  help.textContent = "Số điện thoại chỉ được gửi cùng yêu cầu báo giá để nhân viên liên hệ lại.";

  const error = document.createElement("p");
  error.className = "phone-error";
  error.setAttribute("aria-live", "polite");

  const actions = document.createElement("div");
  actions.className = "phone-actions";
  const restart = document.createElement("button");
  restart.type = "button";
  restart.className = "choice";
  restart.textContent = "Chọn sản phẩm khác";
  restart.onclick = () => {
    user("Chọn sản phẩm khác");
    chooseAnotherProduct();
  };

  const confirm = document.createElement("button");
  confirm.type = "button";
  confirm.className = "choice primary";
  confirm.textContent = "Chốt báo giá";
  confirm.disabled = true;

  function updatePhoneState(showError = false) {
    const phone = normalizePhone(input.value);
    confirm.disabled = !phone;
    error.textContent = !phone && showError
      ? "Vui lòng nhập số điện thoại hợp lệ từ 9 đến 15 chữ số."
      : "";
    return phone;
  }

  input.addEventListener("input", () => updatePhoneState(false));
  input.addEventListener("blur", () => updatePhoneState(true));
  input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !confirm.disabled) confirm.click();
  });
  confirm.onclick = () => {
    const phone = updatePhoneState(true);
    if (!phone) return;
    state.phone = phone;
    user(`Số điện thoại: ${phone}`);
    finalize();
  };

  actions.append(restart, confirm);
  panel.append(label, input, help, error, actions);
  chat.appendChild(panel);
  scrollBottom();
  focusControl(input);
}

function renderCart() {
  cartBox.innerHTML = "";
  if (state.cart.length === 0) {
    cartBox.innerHTML = '<div class="empty">Chưa có sản phẩm nào.</div>';
  } else {
    state.cart.forEach((item, index) => {
      const product = item.product;
      const detail = [item.variant, technicalLabel(product)].filter(Boolean).join(" · ");
      const element = document.createElement("div");
      element.className = "cart-item";
      element.innerHTML = `
        <div class="cart-title">${esc(productTitle(product))}</div>
        <div class="cart-meta">
          <span>${esc(detail || product.category)}</span>
          <span>${esc(product.brand)} · Trang ${product.sourcePage}</span>
        </div>
        <div class="cart-meta">
          <span>${item.quantity} ${esc(productUnit(product))} × ${money.format(product.price)}</span>
          <span>${esc(product.sourceTable || product.family)}</span>
        </div>
        <div class="cart-total">
          <span>${money.format(item.quantity * product.price)}</span>
          <button class="remove" type="button" data-index="${index}">Xóa</button>
        </div>`;
      element.querySelector(".remove").onclick = () => {
        state.cart.splice(index, 1);
        renderCart();
        if (state.cart.length === 0) {
          removeControls();
          bot("Giỏ hàng hiện trống. Hãy chọn lại sản phẩm.");
          askBrand();
        }
      };
      cartBox.appendChild(element);
    });
  }

  const units = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  lineCount.textContent = state.cart.length;
  unitCount.textContent = units;
  grandTotal.textContent = money.format(total);
  mobileCount.textContent = units;
}

function buildQuotePayload(requestId, createdAt) {
  const items = state.cart.map(item => ({
    productId: item.product.id,
    brand: item.product.brand,
    code: item.product.code || "",
    category: item.product.category,
    name: item.product.name,
    variant: item.variant,
    sourceSpec: item.product.sourceSpec || item.product.spec,
    technical: technicalLabel(item.product),
    unit: productUnit(item.product),
    sourceDocument: item.product.sourceDocument,
    priceListEffectiveDate: item.product.effectiveDate,
    sourcePage: item.product.sourcePage,
    quantity: item.quantity,
    unitPrice: item.product.price
  }));
  const sources = [...new Map(
    items.map(item => [
      item.brand,
      {
        brand: item.brand,
        effectiveDate: item.priceListEffectiveDate,
        document: item.sourceDocument
      }
    ])
  ).values()];
  return {
    schemaVersion: 2,
    requestId,
    createdAt: createdAt.toISOString(),
    phone: state.phone,
    currency: "VND",
    sources,
    vatIncluded: false,
    items,
    total: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  };
}

function configuredEndpoint() {
  const url = String(APP_CONFIG.appsScriptUrl || "").trim();
  return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(url) ? url : "";
}

function phoneLink(value) {
  const phone = String(value || "").trim();
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "";
}

function zaloLink(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits ? `https://zalo.me/${digits}` : "";
}

function contactMarkup(contact) {
  const hotline = contact && contact.hotline ? String(contact.hotline) : "";
  const zalo = contact && contact.zalo ? String(contact.zalo) : "";
  const links = [];
  if (hotline) {
    links.push(
      `<span>Hotline: <a href="${esc(phoneLink(hotline))}">${esc(hotline)}</a></span>`
    );
  }
  if (zalo) {
    links.push(
      `<span>Zalo: <a href="${esc(zaloLink(zalo))}" target="_blank" rel="noopener">${esc(zalo)}</a></span>`
    );
  }
  return links.length ? `<div class="contact-box">${links.join("")}</div>` : "";
}

function createQuotePdfUrl(pdf) {
  if (!pdf || !pdf.base64) return "";
  const binary = atob(String(pdf.base64).replace(/\s+/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }
  const blob = new Blob([bytes], {type: "application/pdf"});
  return URL.createObjectURL(blob);
}

function openQuotePdf(pdf, shouldPrint = false) {
  const url = createQuotePdfUrl(pdf);
  if (!url) return false;
  const viewer = window.open(url, "_blank");
  if (!viewer) {
    URL.revokeObjectURL(url);
    return false;
  }
  viewer.opener = null;

  if (shouldPrint) {
    let printed = false;
    const printOnce = () => {
      if (printed || viewer.closed) return;
      printed = true;
      try {
        viewer.focus();
        viewer.print();
      } catch (error) {
        console.error(error);
      }
    };
    viewer.addEventListener("load", () => setTimeout(printOnce, 300), {once: true});
    setTimeout(printOnce, 1200);
  }

  setTimeout(() => URL.revokeObjectURL(url), 300000);
  return true;
}

function showPostSubmitActions(payload, allowRetry, pdf = null) {
  const items = [];
  if (allowRetry) {
    items.push({
      label: "Gửi lại yêu cầu",
      className: "primary",
      onClick: () => submitQuote(payload)
    });
  }
  if (pdf && pdf.base64) {
    items.push(
      {
        label: "Xem báo giá PDF",
        className: "primary",
        onClick: () => {
          if (!openQuotePdf(pdf)) {
            bot("Trình duyệt đang chặn cửa sổ xem PDF. Vui lòng cho phép mở cửa sổ bật lên.", "error");
          }
        }
      },
      {
        label: "In / lưu PDF",
        onClick: () => {
          if (!openQuotePdf(pdf, true)) {
            bot("Trình duyệt đang chặn cửa sổ in PDF. Vui lòng cho phép mở cửa sổ bật lên.", "error");
          }
        }
      }
    );
  }
  items.push(
    {
      label: "Chọn sản phẩm khác",
      onClick: () => {
        user("Chọn sản phẩm khác");
        chooseAnotherProduct();
      }
    }
  );
  choices(items);
}

async function submitQuote(payload) {
  const endpoint = configuredEndpoint();
  if (!endpoint) {
    bot(
      "Hệ thống tiếp nhận yêu cầu đang tạm thời chưa sẵn sàng. Vui lòng liên hệ trực tiếp với công ty.",
      "error"
    );
    showPostSubmitActions(payload, true);
    return;
  }

  removeControls();
  const statusRow = bot("Công ty đang tiếp nhận yêu cầu báo giá của bạn…");
  const statusBubble = statusRow.querySelector(".bubble");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(payload),
      redirect: "follow"
    });
    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error("Apps Script trả về dữ liệu không hợp lệ.");
    }
    if (!response.ok || !result.ok) {
      throw new Error(result.error || `Apps Script trả về HTTP ${response.status}.`);
    }

    const pdf = result.pdf && result.pdf.base64 ? result.pdf : null;
    const pdfMessage = pdf
      ? "<br>Bản PDF báo giá tham khảo đã sẵn sàng. Bạn có thể xem hoặc in/lưu bằng các nút bên dưới."
      : "";

    statusBubble.classList.add("success");
    statusBubble.innerHTML =
      `<strong>Công ty đã nhận yêu cầu báo giá của bạn.</strong><br>` +
      `Mã yêu cầu: <strong>${esc(result.requestId || payload.requestId)}</strong>.<br>` +
      `Nhân viên sẽ liên hệ qua số <strong>${esc(payload.phone)}</strong> để tư vấn mức giá tốt hơn.` +
      pdfMessage +
      contactMarkup(result.contact);
    showPostSubmitActions(payload, false, pdf);
  } catch (error) {
    statusBubble.classList.add("error");
    statusBubble.textContent =
      "Chưa gửi được yêu cầu báo giá. Vui lòng thử lại hoặc liên hệ trực tiếp với công ty.";
    console.error(error);
    showPostSubmitActions(payload, true);
  }
  scrollBottom();
}

function quoteSourceSummary(cartItems) {
  const brands = [...new Set(cartItems.map(item => item.product.brand))];
  return brands.map(brand => {
    const source = CATALOG_SOURCES[brand];
    return source
      ? `${source.label} hiệu lực từ ${source.effectiveDate}`
      : brand;
  }).join(" và ");
}

function finalize() {
  removeControls();
  if (state.cart.length === 0) {
    bot("Không thể chốt vì giỏ hàng đang trống.", "error");
    askBrand();
    return;
  }
  if (!state.phone) {
    askPhone();
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  const units = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const rows = state.cart.map((item, index) => {
    const product = item.product;
    const detail = [
      item.variant,
      product.spec && item.variant !== product.spec ? `dòng giá: ${product.spec}` : "",
      technicalLabel(product)
    ].filter(Boolean).join(" · ");
    return `<tr>
      <td>${index + 1}</td>
      <td>${esc(product.brand)}</td>
      <td>${esc(product.category)}</td>
      <td><strong>${esc(productTitle(product))}</strong><br><small>${esc(detail)}</small></td>
      <td class="num">${item.quantity} ${esc(productUnit(product))}</td>
      <td class="num">${money.format(product.price)}</td>
      <td class="num">${money.format(item.quantity * product.price)}</td>
    </tr>`;
  }).join("");

  const now = new Date();
  const quoteCode =
    `BG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-` +
    `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const payload = buildQuotePayload(quoteCode, now);
  const sourceSummary = quoteSourceSummary(state.cart);

  bot(`<strong>Báo giá tổng hợp</strong>
    <div class="quote">
      <div class="quote-meta">
        <span>Mã: <strong>${quoteCode}</strong></span>
        <span>SĐT: <strong>${esc(state.phone)}</strong></span>
        <span>${now.toLocaleString("vi-VN")}</span>
      </div>
      <div class="table-scroll"><table>
        <thead><tr>
          <th>STT</th><th>Nhãn</th><th>Nhóm</th><th>Sản phẩm</th>
          <th class="num">SL</th><th class="num">Đơn giá</th><th class="num">Thành tiền</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr>
          <td colspan="4">Tổng cộng</td><td class="num">${units}</td><td></td>
          <td class="num">${money.format(total)}</td>
        </tr></tfoot>
      </table></div>
    </div>
    <br><small>Giá trên chỉ là giá tham khảo theo bảng giá ${esc(sourceSummary)}.</small>`,
    "",
    "final"
  );

  submitQuote(payload);
}

if (catalogCount) {
  catalogCount.textContent =
    `${PRODUCTS.length.toLocaleString("vi-VN")} lựa chọn · ` +
    `${AVAILABLE_SOURCES.length} nhãn hàng`;
}
resetButton.onclick = chooseAnotherProduct;
if (window.QUOTE_PRESELECT) {
  startPreselectedQuote(window.QUOTE_PRESELECT);
} else {
  start(true);
}
