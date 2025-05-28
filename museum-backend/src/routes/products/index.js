import express from "express";
import {
  getProducts,
  getProductById,
  getLatestProducts,
  getCategories,
  getRecommendedProducts,
  postReview,
  putReview,
  getReviewsByProductId,
} from "../../controllers/productController.js";

import { authenticateToken } from "../../middleware/auth.js";
const router = express.Router();

router.get("/recommend/:id", getRecommendedProducts); //推薦8筆
router.get("/latest", getLatestProducts); // 最新商品
router.get("/categories", getCategories); // 取得分類
router.get("/:id", getProductById); //id
router.get("/", getProducts); //商店

// 提交評論的 POST 路由 - 需要認證
router.post("/reviews", authenticateToken, postReview);
// 更新評論的 PUT 路由 - 需要認證，且路徑包含 reviewId
router.put("/reviews/:reviewId", authenticateToken, putReview);
// 取得特定商品評論的 GET 路由
router.get("/reviews/product/:productId", getReviewsByProductId);

export default router;
