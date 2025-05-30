import express from 'express'
import db from '../../config/database.js'
import { successResponse, errorResponse } from '../../lib/utils.js'

const router = express.Router()

// 加入收藏
router.post('/', async (req, res) => {
  const { memberId, courseId } = req.body
  if (!memberId || !courseId) {
    return errorResponse(res, '缺少必要參數')
  }

  try {
    const sql = `INSERT IGNORE INTO course_favorites (member_id, course_id) VALUES (?, ?)`
    await db.query(sql, [memberId, courseId])
    successResponse(res, '收藏成功')
  } catch (err) {
    errorResponse(res, '加入收藏失敗', err)
  }
})

// 移除收藏
router.delete('/', async (req, res) => {
  const { memberId, courseId } = req.body
  if (!memberId || !courseId) {
    return errorResponse(res, '缺少必要參數')
  }

  try {
    const sql = `DELETE FROM course_favorites WHERE member_id = ? AND course_id = ?`
    await db.query(sql, [memberId, courseId])
    successResponse(res, '已取消收藏')
  } catch (err) {
    errorResponse(res, '移除收藏失敗', err)
  }
})

// 查詢會員所有課程收藏
router.get('/:memberId', async (req, res) => {
  const { memberId } = req.params
  try {
    const sql = `
      SELECT c.id, c.title, c.venue_id, v.name AS venue_name, c.description_intro, ci.image_path AS main_image, c.start_time
      FROM course_favorites f
      JOIN courses c ON f.course_id = c.id
      LEFT JOIN venues v ON c.venue_id = v.id
      LEFT JOIN course_images ci ON ci.course_id = c.id AND ci.is_main = 1
      WHERE f.member_id = ?
    `
    const [rows] = await db.query(sql, [memberId])
    console.log('查詢到的課程收藏 rows:', rows)
    successResponse(res, rows)
  } catch (err) {
    errorResponse(res, '查詢收藏失敗', err)
  }
})

export default router
