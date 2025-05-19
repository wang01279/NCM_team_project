import db from "../config/database.js";

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

  // 共用條件組合
  let baseQuery = `FROM products WHERE deleted_at IS NULL`;
  const params = [];

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

  if (price_min) {
    baseQuery += ` AND price >= ?`;
    params.push(price_min);
  }

  if (price_max) {
    baseQuery += ` AND price <= ?`;
    params.push(price_max);
  }

  if (material && Array.isArray(material) && material.length > 0) {
    baseQuery += ` AND material_id IN (${material.map(() => "?").join(",")})`;
    params.push(...material);
  }

  if (origin && Array.isArray(origin) && origin.length > 0) {
    baseQuery += ` AND origin_id IN (${origin.map(() => "?").join(",")})`;
    params.push(...origin);
  }

  if (functions && Array.isArray(functions) && functions.length > 0) {
    baseQuery += ` AND function_id IN (${functions.map(() => "?").join(",")})`;
    params.push(...functions);
  }

  //查總筆數
  const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
  const [countResult] = await db.query(countQuery, params);
  const total = countResult[0].total;

  //查當頁資料
  let orderClause = "";
  if (sort === "price_asc") {
    orderClause = ` ORDER BY price ASC`;
  } else if (sort === "price_desc") {
    orderClause = ` ORDER BY price DESC`;
  } else {
    orderClause = ` ORDER BY id ASC`; // 預設用 ID 排序
  }

  const dataQuery = `SELECT * ${baseQuery}${orderClause} LIMIT ? OFFSET ?`;
  const [rows] = await db.query(dataQuery, [...params, limit, offset]);

  return {
    products: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/* 取得最新商品（預設 4 筆）*/
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
    `SELECT * FROM products WHERE id = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}
