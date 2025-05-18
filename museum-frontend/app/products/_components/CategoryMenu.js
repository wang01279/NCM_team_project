'use client'
import React, { useEffect, useState } from 'react'
import '../_styles/categoryMenu.scss'

const categories = [
  { name: '熱銷精選' },
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

export default function CategoryMenu() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleClick = (index) => {
    if (isMobile) {
      setActiveIndex(activeIndex === index ? null : index)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isMobile &&
        activeIndex !== null &&
        !e.target.closest('.category-menu')
      ) {
        setActiveIndex(null)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isMobile, activeIndex])

  return (
    <div className="container py-4">
      <div className="category-menu">
        {categories.map((cat, idx) => (
          <div
            key={cat.name}
            className={`category-item ${activeIndex === idx ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleClick(idx)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                handleClick(idx)
              }
            }}
            role="button" // 表明這是一個可點擊的元素
            tabIndex={0} // 使其可以透過 Tab 鍵聚焦
          >
            <span>{cat.name}</span>
            {cat.sub && (
              <div className="subcategory">
                {cat.sub.map((item) => (
                  <a key={item} href="#">
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
