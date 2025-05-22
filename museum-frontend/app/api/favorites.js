import axios from 'axios'

/**
 * 收藏 / 取消收藏
 * @param {number} id - 收藏項目的 ID
 * @param {'product' | 'course' | 'exhibition'} type - 收藏類型
 * @param {boolean} isNowFavorite - 收藏狀態：true=要加入收藏，false=要移除收藏
 */
export async function toggleFavoriteAPI(id, type, isNowFavorite) {
  if (isNowFavorite) {
    await axios.post('/api/favorites', { itemId: id, itemType: type })
  } else {
    await axios.delete('/api/favorites', {
      data: { itemId: id, itemType: type },
    })
  }
}
