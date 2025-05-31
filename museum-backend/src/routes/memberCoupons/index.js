import express from 'express'
import db from '../../config/database.js'
import { authenticateToken } from '../../middleware/auth.js'

const router = express.Router()

// ✅ 查詢目前會員所有已領取的優惠券資料（完整資訊）
router.get('/', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.id

    const sql = `
      SELECT 
        mc.coupon_id,
        mc.uuid_code,
        mc.claimed_at,
        mc.expired_at,
        mc.is_used,
        c.name,
        c.type,
        c.discount,
        c.minSpend,
        c.category,
        c.source
      FROM member_coupons mc
      JOIN coupons c ON mc.coupon_id = c.id
      WHERE mc.member_id = ?
    `
    const [rows] = await db.query(sql, [memberId])

    res.json({ success: true, data: rows })
  } catch (err) {
    console.error('❌ 會員優惠券查詢錯誤:', err)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})



export default router
