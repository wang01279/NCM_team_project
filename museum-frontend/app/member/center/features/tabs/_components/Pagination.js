'use client'

import React from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import './../../../../../products/_styles/productPage.scss'

export default function Pagination({
  currentPage,
  totalPages,
  isMobile = false,
  onPageChange,
}) {
  const numbersToShow = isMobile ? 3 : 5
  const half = Math.floor(numbersToShow / 2)
  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, start + numbersToShow - 1)

  if (end - start + 1 < numbersToShow)
    start = Math.max(1, end - numbersToShow + 1)
  end = Math.min(totalPages, start + numbersToShow - 1)

  const buttons = []

  buttons.push(
    <button
      key="first"
      onClick={() => onPageChange(1)}
      disabled={currentPage === 1}
      className="pagination-button"
    >
      首頁
    </button>,
    <button
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="pagination-button"
    >
      <FaArrowLeft />
    </button>
  )

  for (let i = start; i <= end; i++) {
    buttons.push(
      <button
        key={`page-${i}`}
        onClick={() => onPageChange(i)}
        className={`pagination-button ${currentPage === i ? 'active' : ''}`}
      >
        {i}
      </button>
    )
  }

  buttons.push(
    <button
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="pagination-button"
    >
      <FaArrowRight />
    </button>,
    <button
      key="last"
      onClick={() => onPageChange(totalPages)}
      disabled={currentPage === totalPages}
      className="pagination-button"
    >
      末頁
    </button>
  )

  return <div className="pagination">{buttons}</div>
}
