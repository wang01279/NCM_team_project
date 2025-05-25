// routes/cart/index.js
import express from "express";
const router = express.Router();

// 設定回傳路由
const callbackUrl = "http://localhost:3000/cart/checkout/callback";

// POST 接收 7-11 門市選擇後的資料
router.post("/711", function (req, res) {
  res.redirect(callbackUrl + "?" + new URLSearchParams(req.body).toString());
});
export default router;

