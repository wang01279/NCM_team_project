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
  getFilteredProductCount,
} from "../../controllers/productController.js";

import { authenticateToken } from "../../middleware/auth.js";
const router = express.Router();

//僅限本路由轉接：將 req.user → req.member，避免動到共用 middleware
const injectMemberFromUser = (req, res, next) => {
  if (req.user) {
    req.member = req.user;
  }
  next();
};

router.get("/count", getFilteredProductCount); // 篩選
router.get("/recommend/:id", getRecommendedProducts); // 推薦8筆
router.get("/latest", getLatestProducts); // 最新商品
router.get("/categories", getCategories); // 取得分類
router.get("/:id", getProductById); // 單一商品
router.get("/", getProducts); // 商店清單

//提交評論、更新評論時加上轉接 req.member
router.post("/reviews", authenticateToken, injectMemberFromUser, postReview);
router.put(
  "/reviews/:reviewId",
  authenticateToken,
  injectMemberFromUser,
  putReview
);

//查評論不需登入
router.get("/reviews/product/:productId", getReviewsByProductId);

export default router;
