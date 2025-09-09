import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { join } from 'path'

let serviceAccount

// 如果有環境變數就用環境變數，否則讀本機 JSON
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
} else {
  serviceAccount = JSON.parse(
    readFileSync(join(process.cwd(), 'src/config/serviceAccountKey.json'), 'utf-8')
  )
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

export default admin
