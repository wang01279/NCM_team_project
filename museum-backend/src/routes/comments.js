import express from 'express'
import db from '../config/database.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// 取得評論
router.get('/', async (req, res) => {
  const { type, id } = req.query
  if (!type) return res.status(400).json([])
  try {
    let rows
    if (id) {
      [rows] = await db.query(
        `SELECT c.*, m.email as member_email, p.name as member_name
         FROM comment c
         LEFT JOIN members m ON c.member_id = m.id
         LEFT JOIN member_profiles p ON p.member_id = m.id
         WHERE c.comment_type = ? AND c.target_id = ?
         ORDER BY c.created_at DESC`,
        [type, id]
      )
    } else {
      [rows] = await db.query(
        `SELECT c.*, m.email as member_email, p.name as member_name
         FROM comment c
         LEFT JOIN members m ON c.member_id = m.id
         LEFT JOIN member_profiles p ON p.member_id = m.id
         WHERE c.comment_type = ?
         ORDER BY c.created_at DESC`,
        [type]
      )
    }
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: '取得評論失敗' })
  }
})

// 新增評論
router.post('/', async (req, res) => {
  const { comment_type, target_id, content, rating } = req.body
  const auth = req.headers.authorization || ''
  const match = auth.match(/^Bearer (.+)$/)
  if (!match) return res.status(401).json({ message: '未登入' })
  let member
  try {
    member = jwt.verify(match[1], process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ message: 'JWT 驗證失敗' })
  }
  if (!content || !comment_type || !target_id || !rating) return res.status(400).json({ message: '缺少欄位' })
  try {
    await db.query(
      'INSERT INTO comment (member_id, comment_type, target_id, content, rating, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [member.id, comment_type, target_id, content, rating]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: '新增評論失敗' })
  }
})

export default router 