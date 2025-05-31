import express from 'express'
import db from '../../config/database.js'
import { authenticateToken } from '../../middleware/auth.js'
import { successResponse, errorResponse } from '../../lib/utils.js'

const router = express.Router()

// ✅ 公開 API：取得全部優惠券（後台或測試用）
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM coupons')
    successResponse(res, rows)
  } catch (err) {
    errorResponse(res, '取得優惠券失敗', err)
  }
})

// ✅ 私人 API：取得尚未領取的優惠券（前台會員使用）
router.get('/available', authenticateToken, async (req, res) => {
  const memberId = req.user.id
  try {
    const [rows] = await db.query(
      `SELECT * FROM coupons 
       WHERE id NOT IN (
         SELECT coupon_id FROM member_coupons WHERE member_id = ?
       ) AND endDate > NOW()`,
      [memberId]
    )
    successResponse(res, rows)
  } catch (err) {
    errorResponse(res, '取得可領取的優惠券失敗', err)
  }
})

export default router
