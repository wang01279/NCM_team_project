// routes/exhibitionUploads.js
import express from 'express'
import db from '../../config/database.js'
import path from 'path'

const router = express.Router()

// 改成JSON接收檔名public抓取
// // ✅ 設定圖片儲存資料夾與檔名格式
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads') // 儲存在 public/uploads 資料夾（要自己建）
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname)
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext
//     cb(null, uniqueName)
//   },
// })

// // ✅ 上傳中介層：只收單一檔案，欄位名稱為 image
// const upload = multer({ storage })

router.get('/', async (req, res) => {
  try {
    const state = req.query.state // 'current', 'past', 'future'
    const now = new Date()

    const [rows] = await db.query('SELECT * FROM exhibitions')

    const formatDate = (d) => d.toISOString().split('T')[0]

    const filtered = rows
      .map((row) => {
        const start = new Date(row.startDate)
        const end = new Date(row.endDate)

        const status =
          now >= start && now <= end
            ? '展覽中'
            : now > end
            ? '已結束'
            : '未開始'

        return {
          ...row,
          startDate: formatDate(start),
          endDate: formatDate(end),
          status,
          introShort: row.intro?.slice(0, 30),
        }
      })
      .filter((row) => {
        if (!state) return true
        if (state === 'current') return row.status === '展覽中'
        if (state === 'past') return row.status === '已結束'
        if (state === 'future') return row.status === '未開始'
        return true
      })

    res.json(filtered)
  } catch (error) {
    console.error('❌ 錯誤:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

// ✅ 展覽新增 POST：支援圖片 + 資料表欄位
router.post('/', async (req, res) => {
  try {
    const { title, intro, startDate, endDate, venue_id, state, image } = req.body

    if (!title || !intro || !startDate || !endDate || !venue_id || !state || !image) {
      return res.status(400).json({ message: '請填寫所有欄位' })
    }

    const sql = `
      INSERT INTO exhibitions (title, intro, startDate, endDate, image, venue_id, state)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await db.query(sql, [
      title,
      intro,
      startDate,
      endDate,
      image, // ✅ 檔名字串，不是上傳檔案
      venue_id,
      state,
    ])

    res.json({ message: '新增成功', id: result.insertId })
  } catch (error) {
    console.error('❌ 新增展覽錯誤：', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})


export default router