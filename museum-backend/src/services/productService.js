import db from "../config/database.js";

/**
 * 取得所有分類（包含子分類和 id）
 */
export async function fetchAllCategories() {
  // 撈主分類
  const [categories] = await db.query(
    `SELECT id AS category_id, name AS category_name FROM product_categories`
  );

  // 撈子分類
  const [subcategories] = await db.query(
    `SELECT id, name, category_id FROM product_subcategories`
  );

  // 將子分類歸類到對應主分類底下
  const result = categories.map((cat) => {
    const subs = subcategories.filter(
      (sub) => sub.category_id === cat.category_id
    );
    return {
      ...cat,
      subcategories: subs,
    };
  });

  return result;
}

/**
 * 取得商品清單（含篩選、排序、分頁、搜尋）
 */
export async function fetchProducts({
  category,
  subcategory,
  material,
  origin,
  functions,
  sort,
  page = 1,
  search,
  price_min,
  price_max,
}) {
  const limit = 12;
  const offset = (page - 1) * limit;
  const params = [];

  // ✅ 修正重點：把字串轉陣列
  if (typeof material === "string") {
    material = material.split(",").filter(Boolean);
  }
  if (typeof origin === "string") {
    origin = origin.split(",").filter(Boolean);
  }
  if (typeof functions === "string") {
    functions = functions.split(",").filter(Boolean);
  }

  // ✅ 價格字串轉數字
  const parsedMinPrice = Number(price_min);
  const parsedMaxPrice = Number(price_max);

  // ✅ 查名稱對應的 ID 陣列
  if (material && Array.isArray(material) && material.length > 0) {
    const [rows] = await db.query(
      `SELECT id FROM product_materials WHERE name IN (${material
        .map(() => "?")
        .join(",")})`,
      material
    );
    material = rows.map((r) => r.id);
  }

  if (origin && Array.isArray(origin) && origin.length > 0) {
    const [rows] = await db.query(
      `SELECT id FROM product_origins WHERE name IN (${origin
        .map(() => "?")
        .join(",")})`,
      origin
    );
    origin = rows.map((r) => r.id);
  }

  if (functions && Array.isArray(functions) && functions.length > 0) {
    const [rows] = await db.query(
      `SELECT id FROM product_functions WHERE name IN (${functions
        .map(() => "?")
        .join(",")})`,
      functions
    );
    functions = rows.map((r) => r.id);
  }

  // ✅ 商品查詢條件組合
  let baseQuery = `FROM products WHERE deleted_at IS NULL`;

  if (search) {
    baseQuery += ` AND (name_zh LIKE ? OR name_en LIKE ?)`;
    const keyword = `%${search}%`;
    params.push(keyword, keyword);
  }

  if (category) {
    baseQuery += ` AND category_id = ?`;
    params.push(category);
  }

  if (subcategory) {
    baseQuery += ` AND subcategory_id = ?`;
    params.push(subcategory);
  }

  // ✅ 價格篩選 (考慮折扣)
  if (!isNaN(parsedMinPrice)) {
    baseQuery += ` AND price * (1 - discount_rate) >= ?`;
    params.push(parsedMinPrice);
  }
  if (!isNaN(parsedMaxPrice)) {
    baseQuery += ` AND price * (1 - discount_rate) <= ?`;
    params.push(parsedMaxPrice);
  }

  if (material && material.length > 0) {
    baseQuery += ` AND material_id IN (${material.map(() => "?").join(",")})`;
    params.push(...material);
  }

  if (origin && origin.length > 0) {
    baseQuery += ` AND origin_id IN (${origin.map(() => "?").join(",")})`;
    params.push(...origin);
  }

  if (functions && functions.length > 0) {
    baseQuery += ` AND function_id IN (${functions.map(() => "?").join(",")})`;
    params.push(...functions);
  }

  // ✅ 查總筆數
  const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
  const [countResult] = await db.query(countQuery, params);
  const total = countResult[0].total;

  // ✅ 排序 + 分頁
  let orderClause = "";
  if (sort === "price_asc") {
    orderClause = ` ORDER BY price ASC`;
  } else if (sort === "price_desc") {
    orderClause = ` ORDER BY price DESC`;
  } else {
    orderClause = ` ORDER BY id ASC`;
  }

  const dataQuery = `SELECT *, price * (1 - discount_rate) AS discounted_price ${baseQuery}${orderClause} LIMIT ? OFFSET ?`;
  const [rows] = await db.query(dataQuery, [...params, limit, offset]);

  return {
    products: rows.map((row) => ({
      ...row,
      final_price: Math.round(row.discounted_price),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/* 取得最新商品*/
export async function fetchLatestProducts(limit = 5) {
  const [rows] = await db.query(
    `SELECT id, main_img, name_zh, description FROM products WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
  return rows;
}

/* 根據商品 ID 取得單筆商品詳情*/
export async function fetchProductById(id) {
  const [rows] = await db.query(
    `SELECT
      p.*,
      m.name AS material_name,
      o.name AS origin_name,
      f.name AS function_name
     FROM products p
     LEFT JOIN product_materials m ON p.material_id = m.id
     LEFT JOIN product_origins o ON p.origin_id = o.id
     LEFT JOIN product_functions f ON p.function_id = f.id
     WHERE p.id = ? AND p.deleted_at IS NULL`,
    [id]
  );
  const product = rows[0] || null;
  if (!product) return null;

  // 撈出多張圖片
  const [images] = await db.query(
    `SELECT image_path FROM product_images WHERE product_id = ? ORDER BY sort_order ASC`,
    [id]
  );
  product.images = images.map((img) => img.image_path);

  //注意事項
  try {
    const [notes] = await db.query(
      `SELECT n.content FROM product_notes pn
     JOIN notes n ON pn.note_id = n.id
     WHERE pn.product_id = ?`,
      [id]
    );
    product.notes = notes.map((row) => row.content);
  } catch (e) {
    console.warn("撈 notes 發生錯誤", e.message);
    product.notes = [];
  }

  return product;
}

export async function fetchRecommendedProducts(productId, categoryId) {
  const [rows] = await db.query(
    `SELECT id, name_zh, price, discount_rate, stock, main_img
     FROM products
     WHERE category_id = ? AND id != ? AND deleted_at IS NULL
     ORDER BY stock DESC
     LIMIT 8`,
    [categoryId, productId]
  );
  return rows;
}

export async function fetchProductCategoryId(id) {
  const [rows] = await db.query(
    "SELECT category_id FROM products WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
  return rows[0]?.category_id || null;
}
