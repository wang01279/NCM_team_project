import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 初始化數據庫連接池
const db = process.env.DATABASE_URL
  ? await mysql.createPool(process.env.DATABASE_URL)
  : await mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      timezone: "+08:00",
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });

// 測試數據庫連接
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ 數據庫連接成功！");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ 數據庫連接失敗：", error.message);
    return false;
  }
};

// 建立資料表
const createTables = async () => {
  try {
    // 先建立會員表
    await db.query(`
      CREATE TABLE IF NOT EXISTS members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        google_id VARCHAR(255),
        role ENUM('member', 'admin') DEFAULT 'member',
        reset_token VARCHAR(255),
        reset_token_expiry DATETIME,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Members table created or already exists");

    // 再建立訊息表（依賴 members）
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        from_user_id INT NOT NULL,
        to_user_id INT NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_user_id) REFERENCES members(id),
        FOREIGN KEY (to_user_id) REFERENCES members(id)
      )
    `);

    console.log("✅ Messages table created or already exists");
  } catch (error) {
    console.error("❌ 建立資料表錯誤:", error);
    throw error;
  }
};

// 初始化
(async () => {
  await testConnection();
  await createTables();
})();

export default db;

