'use client'
import React, { useEffect, useState, useRef } from 'react'
import '../_styles/categoryMenu.scss'

const categories = [
  { name: '全部商品', sub: ['熱銷精選'] },
  {
    name: '典藏精品',
    sub: ['陶瓷', '迷你陶器', '琉璃'],
  },
  {
    name: '餐廚用品',
    sub: ['馬克杯/保溫杯', '品茗茶具', '餐墊/杯墊', '餐具碗盤'],
  },
  {
    name: '圖書影音',
    sub: ['電子書', '期刊', 'DVD'],
  },
  {
    name: '文創商品',
    sub: ['生活用品', '辦公用品', '居家小品'],
  },
]

export default function CategoryMenu({ onCategoryClick }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const categoryMenuRef = useRef(null) // 用於監聽外部點擊

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCategoryClick = (index, categoryName) => {
    setActiveIndex(index)
    if (onCategoryClick) {
      onCategoryClick(categoryName)
    }
    if (isMobile) {
      // 手機版：點擊時切換子選單顯示
      setActiveIndex(activeIndex === index ? null : index)
    }
  }

  const handleSubCategoryClick = (subCategoryName) => {
    if (onCategoryClick) {
      onCategoryClick(subCategoryName)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isMobile &&
        activeIndex !== null &&
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(e.target)
      ) {
        // 手機版：點擊選單外部時關閉子選單
        setActiveIndex(null)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isMobile, activeIndex])

  return (
    <div className="container py-4" ref={categoryMenuRef}>
      <div className="category-menu">
        {categories.map((cat, idx) => (
          <div
            key={cat.name}
            className={`category-item ${activeIndex === idx ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleCategoryClick(idx, cat.name)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                handleCategoryClick(idx, cat.name)
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span>{cat.name}</span>
            {cat.sub && (
              <div className="subcategory">
                {cat.sub.map((item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSubCategoryClick(item)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation()
                        handleSubCategoryClick(item)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
