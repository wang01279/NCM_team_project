// 課程分類靜態資料
export async function GET(req) {
  // 可改為資料庫查詢
  const categories = [
    { id: 1, name: '塑形' },
    { id: 2, name: '釉彩' },
    { id: 3, name: '修復' },
    { id: 4, name: '其他' },
  ];
  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
} 