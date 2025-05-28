import express from 'express'
import db from '../../config/database.js'

const router = express.Router()

// 📌 取得所有優惠券
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      category,
      discountType,
      status,
    } = req.query

    const offset = (parseInt(page) - 1) * parseInt(perPage)
    const limit = parseInt(perPage)

    let sql = 'SELECT * FROM coupons WHERE 1'
    let countSql = 'SELECT COUNT(*) as total FROM coupons WHERE 1'
    const values = []
    const countValues = []

    // 條件：範圍
    if (category && category !== '全部') {
      sql += ' AND category = ?'
      countSql += ' AND category = ?'
      values.push(category)
      countValues.push(category)
    }

    // 條件：折扣類型
    if (discountType) {
      sql += ' AND type = ?'
      countSql += ' AND type = ?'
      values.push(discountType)
      countValues.push(discountType)
    }

    // 條件：狀態
    if (status && status !== 'all') {
      sql += ' AND status = ?'
      countSql += ' AND status = ?'
      values.push(status)
      countValues.push(status)
    }

    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?'
    values.push(limit, offset)

    // 查詢總筆數
    const [countRows] = await db.query(countSql, countValues)
    const total = countRows[0].total
    const totalPages = Math.ceil(total / perPage)

    // 查詢分頁資料
    const [rows] = await db.query(sql, values)

    res.json({
      items: rows,
      total,
      totalPages,
      currentPage: parseInt(page),
    })
  } catch (err) {
    res.status(500).json({ error: '查詢失敗', details: err.message })
  }
})


// 📌 新增優惠券
router.post('/', async (req, res) => {
  const { name, code, category, type, discount, minSpend, endDate, status, expired_at } = req.body
  if (!name || !code || !category || !type || !discount || !endDate) {
    return res.status(400).json({ error: '請填寫必要欄位' })
  }
  try {
    const sql = `
      INSERT INTO coupons (name, code, category, type, discount, minSpend, endDate, status, expired_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await db.query(sql, [
      name,
      code,
      category,
      type,
      discount,
      minSpend || 0,
      endDate,
      status || '啟用',
      expired_at || null,
    ])
    res.json({ success: true, id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: '新增失敗', details: err.message })
  }
})

export default router
