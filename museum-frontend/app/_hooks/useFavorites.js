'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useToast } from '@/app/_components/ToastManager'
import {
  getFavoritesByType,
  addFavoriteByType,
  removeFavoriteByType,
} from '@/app/api/favorites'

//可用於 product, exhibition, course
export default function useFavorites(type) {
  const { member } = useAuth()
  const memberId = member?.id
  const { showToast } = useToast()

  const [favoriteIds, setFavoriteIds] = useState([]) // 收藏 ID 清單
  const [isLoading, setIsLoading] = useState(false)

  // console.log('目前收藏的 ID：', favoriteIds)

  // 載入會員收藏清單
  useEffect(() => {
    if (!memberId || !type) return
    setIsLoading(true)
    getFavoritesByType(type, memberId)
      .then((res) => {
        const list = res?.data?.data || []
        //後端已回傳完整資料，直接抓 item.id 即可
        setFavoriteIds(list.map((item) => item.id))
      })
      .finally(() => setIsLoading(false))
  }, [memberId, type])

  const toggleFavorite = async (itemId, nextState) => {
    if (!memberId) {
      showToast('danger', '請先登入會員')
      return false
    }
    try {
      if (nextState) {
        await addFavoriteByType(type, memberId, itemId)
        setFavoriteIds((prev) => [...prev, itemId])
        showToast('success', '成功加入收藏')
      } else {
        await removeFavoriteByType(type, memberId, itemId)
        setFavoriteIds((prev) => prev.filter((id) => id !== itemId))
        showToast('warning', '已移除收藏')
      }
      return true
    } catch (err) {
      console.error('收藏失敗：', err)
      showToast('danger', '收藏操作失敗')
      return false
    }
  }

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite: (id) => favoriteIds.includes(id), // 判斷某 ID 是否被收藏
    isLoading,
  }
}
