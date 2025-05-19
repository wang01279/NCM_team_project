import {
  fetchProducts,
  fetchProductById,
  fetchLatestProducts,
  fetchAllCategories, // 引入新的函式
} from "../services/productService.js";

/**
 * 取得商品清單（支援分類、篩選、排序、分頁）
 * 前端：/api/products?page=1&category=2&sort=price_desc
 */
export async function getProducts(req, res) {
  try {
    const productsData = await fetchProducts(req.query);
    res.json(productsData); // 回傳 { products, total, page, totalPages }
  } catch (err) {
    console.error("取得商品清單失敗:", err);
    res.status(500).json({ error: "伺服器錯誤，無法取得商品清單" });
  }
}

/**
 * 取得最新商品（前 4 筆，給 HeroSlider 用）
 * 前端：/api/products/latest
 */
export async function getLatestProducts(req, res) {
  try {
    const products = await fetchLatestProducts(5);
    res.json(products);
  } catch (err) {
    console.error("取得最新商品失敗:", err);
    res.status(500).json({ error: "伺服器錯誤，無法取得最新商品" });
  }
}

/**
 * 取得單筆商品詳情
 * 前端：/api/products/:id
 */
export async function getProductById(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "商品 ID 不正確" });
  }

  try {
    const product = await fetchProductById(id);
    if (!product) {
      return res.status(404).json({ error: "找不到該商品" });
    }
    res.json(product);
  } catch (err) {
    console.error("取得商品失敗:", err);
    res.status(500).json({ error: "伺服器錯誤，無法取得商品" });
  }
}

/**
 * 取得所有分類（包含子分類和 id）
 * 前端：/api/categories
 */
export async function getCategories(req, res) {
  try {
    const categories = await fetchAllCategories();
    res.json(categories);
  } catch (err) {
    console.error("取得分類資料失敗:", err);
    res.status(500).json({ error: "伺服器錯誤，無法取得分類資料" });
  }
}