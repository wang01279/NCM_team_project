// FavoriteTab.js
import { getCourseFavorites, getProductFavorites, getExhibitionFavorites } from '@/app/api/favorites'
import { useState, useEffect } from 'react'
import FavoriteCard from './FavoriteCard'

export default function FavoriteTab({ type }) {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      let result = []
      if (type === 'course') result = await getCourseFavorites(memberId)
      if (type === 'product') result = await getProductFavorites(memberId)
      if (type === 'exhibition') result = await getExhibitionFavorites(memberId)
      setData(result)
    }
    fetchData()
  }, [type])

  return (
    <div className="row">
      {data.map(item => (
        <FavoriteCard key={item.id} item={item} type={type} />
      ))}
    </div>
  )
}
