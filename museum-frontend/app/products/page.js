'use client'

import React, { useState } from 'react'
import Marquee from './_components/Marquee'
import HeroSlider from './_components/HeroSlider'
import CategoryShowcase from './_components/CategoryShowcase'
import CategoryMenu from './_components/CategoryMenu'
import ProductListHeader from './_components/ProductListHeader'
import ProductCard from '../_components/ProductCard'
import productList from '@/app/datatest/productList'
import './_styles/productPage.scss'

const itemsPerPage = 12

export default function ProductPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(productList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedProducts = productList.slice(startIndex, endIndex)

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
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
  return (
    <>
      <Marquee />
      <HeroSlider />
      <CategoryShowcase />
      <CategoryMenu />
      <ProductListHeader />
      <div className="container py-2">
        <div className="row g-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {totalPages > 1 && renderPaginationButtons()}
      </div>
    </>
  )
}
