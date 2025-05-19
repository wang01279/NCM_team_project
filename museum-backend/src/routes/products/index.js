import express from "express";
import {
  getProducts,
  getProductById,
  getLatestProducts,
  getCategories, // 引入 getCategories
} from "../../controllers/productController.js";

const router = express.Router();

router.get("/latest", getLatestProducts); // 最新商品
router.get("/categories", getCategories); // 取得分類
router.get("/:id", getProductById); //id
router.get("/", getProducts); //商店

export default router;