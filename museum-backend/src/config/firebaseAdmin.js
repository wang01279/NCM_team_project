// import admin from 'firebase-admin'
// import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   })
// }

// export default admin

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 解決 __dirname 在 ESM 中無法直接使用
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 讀取 JSON 檔案（改成這行最保險）
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf-8')
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin