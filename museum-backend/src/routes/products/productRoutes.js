import express from "express";
import {
  getProducts,
  getProductById,
  getLatestProducts,
} from "../../controllers/productController.js";

const router = express.Router();

// 一定要放在前面！不然會被當成 /:id
router.get("/latest", getLatestProducts);
router.get("/:id", getProductById);
router.get("/", getProducts);

export default router;
