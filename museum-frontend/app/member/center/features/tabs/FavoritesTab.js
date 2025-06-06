'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/_hooks/useAuth'
import { getFavoritesByType, removeFavoriteByType } from '@/app/api/favorites'
import FavoriteCard from './_components/FavoriteCard'
import Loader from '@/app/_components/load'
import styles from './_styles/favoritesTab.module.scss'
import { FaReply, FaTrashAlt } from 'react-icons/fa'
import { FaEye } from "react-icons/fa6";
import { useToast } from '@/app/_components/ToastManager'
import FavoriteCourseRowCard from '@/app/course/_components/FavoriteCourseRowCard'

export default function FavoritesTab({ type = 'menu', setType }) {
  const { member } = useAuth()
  const memberId = member?.id

  // const [type, setType] = useState('menu') // 'menu' 或 'product' / 'course' / 'exhibition'
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [counts, setCounts] = useState({ product: 0, course: 0, exhibition: 0 })
  const { showToast } = useToast()

  const fetchFavorites = async (targetType) => {
    if (!memberId || !targetType) return
    setIsLoading(true)
    try {
      const result = await getFavoritesByType(targetType, memberId)
      console.log('✅ 收藏資料：', result?.data?.data)
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
    for (const t of types) {
      try {
        const res = await getFavoritesByType(t, memberId)
        newCounts[t] = res?.data?.data?.length || 0
      } catch {
        newCounts[t] = 0
      }
    }
    setCounts(newCounts)
  }

  useEffect(() => {
    if (!member || !memberId) return
    if (type === 'menu') {
      fetchCounts()
    } else {
      fetchFavorites(type)
    }
  }, [type, memberId, member])

  const handleRemove = async (itemId) => {
    try {
      await removeFavoriteByType(type, memberId, itemId)
      setData((prev) => prev.filter((item) => item.id !== itemId))
      showToast('warning', '已移除收藏', 3000)
    } catch (err) {
      showToast('error', '移除失敗，請稍後再試', 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  const FavoriteBlock = ({ type: blockType, title, description }) => (
    <div
      className={`${styles.favoriteBlock} ${styles[`${blockType}Block`]} d-flex flex-column justify-content-between align-items-center w-100 h-100`}
    >
      <div>
        <h4>{title}</h4>
        <div>{counts[blockType]}</div>
        <p>您目前的收藏數量</p>
      </div>
      <div>
        <p>{description}</p>
        <button
          className="btn btn-outline-light"
          onClick={() => {
            setType(blockType)
            scrollToTop()
          }}
        >
          進行收藏管理
        </button>
      </div>
    </div>
  )

  if (type === 'menu') {
    return (
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12 d-flex p-0">
            <FavoriteBlock
              type="exhibition"
              title="您的展覽收藏"
              description="隨時找到展覽靈感與記錄，打造屬於你的藝術收藏人生！"
            />
          </div>
        </div>
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

  return (
    <div className={`container-fluid ${styles.favoritesTabContainer}`}>
      <button
        onClick={() => setType('menu')}
        className={`btn btn-outline-secondary ${styles.backButton}`}
      >
        <div className="d-flex align-items-center">
          <FaReply className="me-2" />
          返回
        </div>
      </button>

      {isLoading ? (
        <Loader />
      ) : data.length > 0 ? (
        type === 'product' ? (
          <div className="table-responsive">
            <table className={`table align-middle ${styles.favoriteTable}`}>
              <thead className="text-start">
                <tr>
                  <th>圖片</th>
                  <th>商品名稱</th>
                  <th>分類</th>
                  <th>子分類</th>
                  <th>價格</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.main_img}
                        alt={item.name_zh}
                        width={80}
                        height={80}
                        style={{ objectFit: 'contain' }}
                      />
                    </td>
                    <td>{item.name_zh}</td>
                    <td>{item.category_name}</td>
                    <td>{item.subcategory_name}</td>
                    <td>{`NT$${Math.round(item.price).toLocaleString()}`}</td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            window.open(
                              `/products/details/${item.id}`,
                              '_blank'
                            )
                          }
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemove(item.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : type === 'course' ? (
          <div>
            {data.map((item) => (
              <FavoriteCourseRowCard
                key={item.id}
                course={item}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <div className="row g-3">
            {data.map((item) => (
              <FavoriteCard
                key={item.id}
                item={item}
                type={type}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )
      ) : (
        <p className={styles.emptyText}>
          尚未收藏任何{' '}
          {type === 'product' ? '商品' : type === 'course' ? '課程' : '展覽'}。
        </p>
      )}
    </div>
  )
}
