import express from 'express'
import db from '../../config/database.js'
import { successResponse, errorResponse } from '../../lib/utils.js'
import { randomUUID } from 'crypto'
// import { authenticateToken } from '../../middleware/auth.js' // 可未來開啟 JWT 驗證

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { memberId, couponId, couponIds } = req.body

    if (!memberId) {
      return errorResponse(res, '缺少會員 ID')
    }

    // ✅ 單張領取
    if (couponId) {
      // 檢查是否已領取過
      const [exists] = await db.query(
        'SELECT 1 FROM member_coupons WHERE member_id = ? AND coupon_id = ?',
        [memberId, couponId]
      )
      if (exists.length > 0) {
        return errorResponse(res, '您已領取過此優惠券')
      }

      const sql = 'INSERT INTO member_coupons (id, member_id, coupon_id) VALUES (?, ?, ?)'
      await db.query(sql, [randomUUID(), memberId, couponId])
      return successResponse(res, '單張優惠券領取成功')
    }

    // ✅ 多張領取
    if (Array.isArray(couponIds)) {
      if (couponIds.length === 0) {
        return errorResponse(res, 'couponIds 陣列為空')
      }

      // 檢查已有的
      const [existing] = await db.query(
        'SELECT coupon_id FROM member_coupons WHERE member_id = ? AND coupon_id IN (?)',
        [memberId, couponIds]
      )
      const alreadyClaimed = new Set(existing.map(row => row.coupon_id))

      // 篩選還沒領取過的
      const newCoupons = couponIds.filter(id => !alreadyClaimed.has(id))

      if (newCoupons.length === 0) {
        return errorResponse(res, '所有優惠券都已領取過')
      }

      const sql = 'INSERT INTO member_coupons (id, member_id, coupon_id) VALUES ?'
      const values = newCoupons.map(id => [randomUUID(), memberId, id])
      await db.query(sql, [values])

      return successResponse(res, `成功領取 ${newCoupons.length} 張優惠券`)
    }

    return errorResponse(res, '請提供 couponId 或 couponIds')
  } catch (err) {
    return errorResponse(res, '優惠券領取失敗', err)
  }
})

export default router
