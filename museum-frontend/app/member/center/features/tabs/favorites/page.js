// page.js
import FavoriteTab from './FavoritesTab'
import { useState } from 'react'

export default function FavoritesPage() {
  const [type, setType] = useState('product') // 可切換為 'course' 或 'exhibition'

  return (
    <>
      <div className="tabs">
        <button onClick={() => setType('product')}>商品</button>
        <button onClick={() => setType('course')}>課程</button>
        <button onClick={() => setType('exhibition')}>展覽</button>
      </div>
      <FavoriteTab type={type} />
    </>
  )
}
