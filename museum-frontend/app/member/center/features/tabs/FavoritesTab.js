'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/_hooks/useAuth'
import { getFavoritesByType, removeFavoriteByType } from '@/app/api/favorites'
import FavoriteCard from './_components/FavoriteCard'
import styles from './_styles/favoritesTab.module.scss'

export default function FavoritesTab() {
  const { member } = useAuth()
  const memberId = member?.id

  const [view, setView] = useState('menu')
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [counts, setCounts] = useState({ product: 0, course: 0, exhibition: 0 })

  const fetchFavorites = async (type) => {
    if (!memberId || !type) return
    setIsLoading(true)
    try {
      const result = await getFavoritesByType(type, memberId)
      console.log('✅ 收藏資料：', result)
      setData(result?.data?.data || [])
    } catch (err) {
      console.error('❌ 取得收藏失敗', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCounts = async () => {
    const types = ['product', 'course', 'exhibition']
    const newCounts = {}
    for (const type of types) {
      try {
        const res = await getFavoritesByType(type, memberId)
        newCounts[type] = res?.data?.data?.length || 0
      } catch {
        newCounts[type] = 0
      }
    }
    setCounts(newCounts)
  }

  useEffect(() => {
    if (view === 'menu') {
      fetchCounts()
    } else {
      fetchFavorites(view)
    }
  }, [view, memberId])

  const handleRemove = async (itemId) => {
    await removeFavoriteByType(view, memberId, itemId)
    setData((prev) => prev.filter((item) => item.id !== itemId))
  }
  const scrollToTop = () => {
    window.scrollTo({
      top: 200,
      behavior: 'smooth',
    })
  }

  // 區塊樣式
  const FavoriteBlock = ({
    type,
    title,
    description,
    hasBackgroundImage = false, // 新增一個 prop 來判斷是否有背景圖片
  }) => (
    <div
      className={`${styles.favoriteBlock} ${styles[`${type}Block`]} d-flex flex-column justify-content-between align-items-center w-100 h-100 ${hasBackgroundImage ? styles.blockWithBgImage : ''}`}
    >
      <div>
        <h4>{title}</h4>
        <div>{counts[type]}</div>
        <p>您目前的收藏數量</p>
      </div>

      <div>
        <p>{description}</p>
        <button
          className="btn btn-outline-light"
          onClick={() => {
            setView(type)
            scrollToTop()
          }}
        >
          進行收藏管理
        </button>
      </div>
    </div>
  )

  //三個區塊卡片
  if (view === 'menu') {
    return (
      <div className="container-fluid p-0">
        {/* 商品 */}
        <div className="row g-0">
          <div className="col-12 d-flex p-0">
            <FavoriteBlock
              type="exhibition"
              title="您的展覽收藏"
              description="隨時找到展覽靈感與記錄，打造屬於你的藝術收藏人生！"
              hasBackgroundImage={true} // 設定為 true
            />
          </div>
        </div>

        {/* 展覽，收藏*/}
        <div className="row g-0">
          <div className="col-12 col-md-6 d-flex p-0">
            <FavoriteBlock
              type="product"
              title="您的商品收藏"
              description="隨時瀏覽喜愛的商品清單，輕鬆管理您的收藏項目！"
            />
          </div>
          <div className="col-12 col-md-6 d-flex p-0">
            <FavoriteBlock
              type="course"
              title="您的課程收藏"
              description="追蹤學習進度，查閱已收藏的熱門課程，持續成長不間斷！"
            />
          </div>
        </div>
      </div>
    )
  }

  //顯示收藏內容
  return (
    <div className={`container-fluid ${styles.favoritesTabContainer}`}>
      <button
        onClick={() => setView('menu')}
        className={`btn btn-outline-secondary ${styles.backButton}`}
      >
        ← 返回
      </button>

      {isLoading ? (
        <p className={styles.loadingText}>載入中...</p>
      ) : data.length > 0 ? (
        <div className="row">
          {data.map((item) => (
            <FavoriteCard
              key={item.id}
              item={item}
              type={view}
              onRemove={handleRemove}
            />
          ))}
        </div>
      ) : (
        <p className={`${styles.emptyText}`}>
          尚未收藏任何{' '}
          {view === 'product' ? '商品' : view === 'course' ? '課程' : '展覽'}。
        </p>
      )}
    </div>
  )
}
