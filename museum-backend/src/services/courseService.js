import pool from '../config/database.js';

export async function fetchCourseById(id) {
  // 查詢課程主資料
  const [courses] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
  if (!courses.length) return null;
  const course = courses[0];

  // 查詢課程圖片
  const [images] = await pool.query('SELECT * FROM course_images WHERE course_id = ?', [id]);
  course.images = images;

  // 查詢課程分類
  const [categories] = await pool.query(
    `SELECT cc.* FROM course_category_map ccm
     JOIN course_categories cc ON ccm.category_id = cc.id
     WHERE ccm.course_id = ?`, [id]);
  course.categories = categories;
  course.category = categories[0]?.name || '';

  // 查詢藝術家
  const [artistRows] = await pool.query('SELECT * FROM artists WHERE id = ?', [course.artist_id]);
  course.artist = artistRows[0] || null;

  // 查詢報名人數（studentCount）
  const [studentRows] = await pool.query(
    `SELECT SUM(oi.quantity) as count
     FROM order_item oi
     JOIN member_orders mo ON oi.order_id = mo.id
     WHERE oi.item_type = 'course' AND oi.item_id = ?`,
    [id]
  );
  course.studentCount = studentRows[0]?.count || 0;

  return course;
}

export async function fetchRelatedCourses(courseId, categoryId) {
  // 查詢同分類的其他課程，並 join 主圖
  const [rows] = await pool.query(
    `SELECT c.*, ci.image_path AS main_image
     FROM courses c
     JOIN course_category_map ccm ON c.id = ccm.course_id
     LEFT JOIN course_images ci ON ci.course_id = c.id AND ci.is_main = 1
     WHERE ccm.category_id = ? AND c.id != ? AND c.status = 'approved' LIMIT 3`,
    [categoryId, courseId]
  );
  return rows;
}

export async function fetchCourses() {
  // 先查主資料
  const [rows] = await pool.query(`
    SELECT 
      c.id,
      c.title,
      c.venue_id,
      v.name AS venue_name,
      c.description_intro,
      c.price,
      c.start_time,
      c.end_time,
      ci.image_path AS main_image,
      c.artist_id,
      a.type AS artist_type
    FROM courses c
    LEFT JOIN venues v ON c.venue_id = v.id
    LEFT JOIN course_images ci ON ci.course_id = c.id AND ci.is_main = 1
    LEFT JOIN artists a ON c.artist_id = a.id
    WHERE c.status = 'approved'
  `);

  // 查所有課程的分類
  const [catMapRows] = await pool.query(`
    SELECT ccm.course_id, cc.id, cc.name
    FROM course_category_map ccm
    JOIN course_categories cc ON ccm.category_id = cc.id
  `);

  // 建立 course_id -> categories 陣列的 map
  const catMap = {};
  for (const row of catMapRows) {
    if (!catMap[row.course_id]) catMap[row.course_id] = [];
    catMap[row.course_id].push({ id: row.id, name: row.name });
  }

  // 把 categories 塞進每個課程
  for (const course of rows) {
    course.categories = catMap[course.id] || [];
  }

  return rows;
}