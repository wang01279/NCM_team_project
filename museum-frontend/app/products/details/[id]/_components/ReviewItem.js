'use client'

import React from 'react'
import Image from 'next/image'
import StarRating from './StarRating'

import '../_styles/ReviewItem.scss'

export default function ReviewItem({
  reviewerName,
  rating,
  comment,
  reviewDate,
  images = [], // 預設為空陣列，以防沒有圖片
}) {
  // 格式化日期顯示
  const formattedDate = new Date(reviewDate).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // 匿名化使用者名稱，例如：顯示姓氏和部分名字，或只顯示第一個字和星號
  const displayReviewerName = reviewerName
    ? reviewerName.charAt(0) + '**' // 例如：王**
    : '匿名使用者'

  return (
    <div className="review-item">
      {' '}
      <div className="review-header">
        {' '}
        <span className="reviewer-name">{displayReviewerName}</span>{' '}
        <span className="review-date">{formattedDate}</span>{' '}
      </div>
      <div className="review-rating">
        {' '}
        <StarRating value={rating} readOnly={true} icon={<>&#9733;</>} />
      </div>
      <p className="review-comment">{comment}</p>{' '}
      {images.length > 0 && (
        <div className="review-images">
          {' '}
          {images.map((imgSrc, index) => (
            <Image
              key={index}
              src={imgSrc}
              alt={`評價圖片 ${index + 1}`}
              width={100}
              height={100}
              className="review-image"
            />
          ))}
        </div>
      )}
    </div>
  )
}
