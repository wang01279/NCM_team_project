import {
  fetchProducts,
  fetchProductById,
  fetchLatestProducts,
  fetchAllCategories,
  fetchRecommendedProducts,
  fetchProductCategoryId,
  addReview,
  updateReview,
  fetchReviewsByProductId,
  countFilteredProducts,
} from "../services/productService.js";

/**
 * 取得商品清單（支援分類、篩選、排序、分頁）
 * 前端：/api/products?page=1&category=2&sort=price_desc
 */
export async function getProducts(req, res) {
  // console.log('收到 query：', req.query);
  try {
    const productsData = await fetchProducts(req.query);
    res.json(productsData);
  } catch (err) {
    console.error("取得商品清單失敗:", err);
    res.status(500).json({ error: "伺服器錯誤，無法取得商品清單" });
  }
}

/**
 * 取得最新商品（前 5 筆，給 HeroSlider 用）
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

/**
 * 取得所有分類（包含子分類和 id）
 * 前端：/api/recommend/:id
 */
export async function getRecommendedProducts(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "商品 ID 不正確" });

  try {
    const categoryId = await fetchProductCategoryId(id);
    if (!categoryId) {
      return res.status(404).json({ error: "找不到此商品或分類" });
    }

    // 撈同分類、排除自己、依庫存排序的推薦商品
    const products = await fetchRecommendedProducts(id, categoryId);
    res.json(products);
  } catch (err) {
    console.error("取得推薦商品失敗:", err);
    res.status(500).json({ error: "伺服器錯誤" });
  }
}
//及時篩選套用
export async function getFilteredProductCount(req, res) {
  try {
    const total = await countFilteredProducts(req.query);
    res.json({ total });
  } catch (err) {
    console.error("即時計算商品數量錯誤:", err);
    res.status(500).json({ error: "無法取得商品數量" });
  }
}
/**
 * 新增評論
 * 前端：POST /api/products/reviews
 */
export async function postReview(req, res) {
  const { product_id, rating, comment } = req.body;
  const member_id_from_auth = req.user?.id || null; // 從認證中間件獲取會員ID

  // 後端資料驗證 (結合你現有的驗證)
  // 確保 product_id, rating, comment 存在
  if (!product_id || !rating || comment === undefined || comment === null) {
    return res
      .status(400)
      .json({ error: "缺少必要的評論資訊 (商品ID, 評分, 評論內容)" });
  }

  // 確保 member_id_from_auth 存在且是有效數字
  if (!member_id_from_auth || isNaN(Number(member_id_from_auth))) {
    return res.status(401).json({ error: "請先登入會員才能提交評論。" });
  }

  // 驗證評分是否在 1 到 5 之間
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "評分必須介於 1 到 5 之間" });
  }

  // 評論內容不能只有空白字元 (如果存在的話)
  if (typeof comment === "string" && comment.trim() === "") {
    return res.status(400).json({ error: "評論內容不能為空。" });
  }

  try {
    const newReview = await addReview({
      product_id: product_id,
      member_id: member_id_from_auth,
      rating: rating,
      comment: comment,
    });
    res.status(201).json({ message: "評論新增成功", review: newReview });
  } catch (error) {
    console.error("新增評論錯誤:", error);
    if (error.message.includes("已評論過")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "伺服器錯誤，無法新增評論" });
  }
}
/**
 * 更新評論
 * 前端：PUT /api/products/reviews/:reviewId
 */
export async function putReview(req, res) {
  const { reviewId } = req.params; // 從 URL 參數獲取評論 ID
  const { rating, comment } = req.body;
  // 重要：member_id 應該從認證中間件中獲取
  const member_id_from_auth = req.user?.id || null;

  // 驗證輸入資料
  if (!rating || comment === undefined || comment === null) {
    return res
      .status(400)
      .json({ error: "缺少必要的更新資訊 (評分, 評論內容)" });
  }

  if (!member_id_from_auth || isNaN(Number(member_id_from_auth))) {
    return res.status(401).json({ error: "請先登入會員才能編輯評論。" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "評分必須介於 1 到 5 之間" });
  }

  if (typeof comment === "string" && comment.trim() === "") {
    return res.status(400).json({ error: "評論內容不能為空。" });
  }

  try {
    await updateReview(reviewId, { rating, comment }, member_id_from_auth); // 傳遞 member_id_from_auth 進行安全檢查
    res.json({ message: "評論更新成功" });
  } catch (error) {
    console.error("更新評論錯誤:", error);
    if (
      error.message.includes("無權編輯") ||
      error.message.includes("不存在")
    ) {
      return res.status(403).json({ error: error.message }); // 403 Forbidden
    }
    res.status(500).json({ error: "伺服器錯誤，無法更新評論" });
  }
}
/**
 * 根據 product_id 取得商品評論
 * 前端：GET /api/reviews/product/:id
 */
export async function getReviewsByProductId(req, res) {
  const productId = Number(req.params.productId);

  if (isNaN(productId)) {
    return res.status(400).json({ error: "商品 ID 不正確" });
  }

  try {
    const reviews = await fetchReviewsByProductId(productId);
    res.json(reviews);
  } catch (err) {
    console.error("取得商品評論失敗:", err);
    res.status(500).json({ error: "伺服器錯誤，無法取得評論" });
  }
}
