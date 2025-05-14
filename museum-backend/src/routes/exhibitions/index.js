import express from 'express'
import db from '../../config/mysql.js'
import { successResponse, errorResponse } from '../../lib/utils.js'

const router = express.Router()

// ✅ 取得所有展覽資料（可篩選 state + year）
router.get('/:state', async (req, res) => {
  try {
    const { state } = req.params
    const { year } = req.query

    let sql = 'SELECT * FROM exhibitions WHERE state = ?'
    const params = [state]

    if (year) {
      sql += ' AND YEAR(startDate) = ?'
      params.push(year)
    }

    const [rows] = await db.query(sql, params)

    successResponse(res, { exhibitions: rows })
  } catch (err) {
    errorResponse(res, err)
  }
})

export default router
