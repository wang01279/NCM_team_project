// routes/cart/index.js
import express from "express";
import db from "../../config/database.js";

const router = express.Router();

// 設定回傳路由
const callbackUrl = "http://localhost:3000/cart/checkout/callback";

// POST 接收 7-11 門市選擇後的資料
router.post("/711", function (req, res) {
  res.redirect(callbackUrl + "?" + new URLSearchParams(req.body).toString());
});



// ✅ 查詢可用優惠券
// GET /api/cart/coupons?memberId=105&amount=5000
router.get("/coupons", async (req, res) => {
  try {
    const { memberId, amount = 0 } = req.query;

    // if (!memberId) {
    //   return res.status(400).json({ success: false, message: "缺少會員 ID" });
    // }

    const [rows] = await db.execute(
      `
      SELECT 
        mc.uuid_code,
        c.name,
        c.type,
        c.minSpend
      FROM member_coupons mc
      JOIN coupons c ON mc.coupon_id = c.id
      WHERE mc.member_id = ?
        AND mc.is_used = 0
        AND (mc.expired_at IS NULL OR mc.expired_at > NOW())
        AND c.minSpend <= ?
      `,
      [memberId, amount]
    );

    res.json({ success: true, coupons: rows });
  } catch (err) {
    console.error("查詢優惠券錯誤：", err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;
