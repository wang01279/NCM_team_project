'use client'

import React, { useState, useEffect } from 'react'
import Marquee from './_components/Marquee'
import HeroSlider from './_components/HeroSlider'
import CategoryShowcase from './_components/CategoryShowcase'
import CategoryMenu from './_components/CategoryMenu'
import ProductFilter from './_components/ProductFilter'
import ProductCard from '../_components/ProductCard'
import './_styles/productPage.scss'

export default function ProductPage() {
  // 儲存目前第幾頁
  const [currentPage, setCurrentPage] = useState(1)

  // 儲存後端傳來的商品陣列
  const [products, setProducts] = useState([])

  // 總共有幾頁
  const [totalPages, setTotalPages] = useState(1)

  // 新增一個 state 來儲存目前選取的分類
  const [selectedCategory, setSelectedCategory] = useState('熱銷精選') // 預設選取 '熱銷精選'

  // 當 currentPage 或 selectedCategory 改變時，自動重新 fetch 該頁的資料
  useEffect(() => {
    let url = `http://localhost:3005/api/products?page=${currentPage}`
    if (selectedCategory && selectedCategory !== '熱銷精選') {
      url += `&category=${selectedCategory}` // 假設後端使用 'category' 參數篩選
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // 設定商品資料與總頁數
        setProducts(data.products || [])
        setTotalPages(data.totalPages || 1)
      })
      .catch(() => {
        // 錯誤處理：清空資料避免報錯
        setProducts([])
        setTotalPages(1)
      })
  }, [currentPage, selectedCategory])

  // 切換目前頁碼
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // 產生分頁按鈕（根據 totalPages 數量）
  const renderPaginationButtons = () => {
    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      )
    }
    return <div className="pagination">{buttons}</div>
  }

  // 新增一個函式來處理分類選取
  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1) // 重置到第一頁
  }

  return (
    <>
      {/* 頁面固定上方區塊（跑馬燈、輪播、分類選單等） */}
      <Marquee />
      <HeroSlider />
      <CategoryShowcase />
      {/* 修改 CategoryMenu，傳入 handleCategoryClick */}
      <CategoryMenu onCategoryClick={handleCategoryClick} />
      <ProductFilter />

      {/* 商品清單區塊 */}
      <div className="container py-2">
        <div className="row g-4">
          {/* 每一筆商品資料渲染一張商品卡 */}
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 顯示分頁按鈕（超過 1 頁才出現） */}
        {totalPages > 1 && renderPaginationButtons()}
      </div>
    </>
  )
}
