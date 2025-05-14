// routes/exhibitions/detail.js
import express from 'express'
import db from '../../config/mysql.js'
import {
  successResponse,
  errorResponse,
  validatedParamId,
} from '../../lib/utils.js'

const router = express.Router()

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    validatedParamId(id)

    const [rows] = await db.query('SELECT * FROM exhibitions WHERE id = ?', [
      id,
    ])

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: '找不到展覽資料' })
    }

    successResponse(res, rows[0])
  } catch (err) {
    errorResponse(res, err)
  }
})

export default router
