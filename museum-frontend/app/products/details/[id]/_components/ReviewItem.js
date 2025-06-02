'use client'

import React from 'react'
import StarRating from './StarRating'

import '../_styles/ReviewItem.scss'

export default function ReviewItem({
  reviewerName,
  reviewerAvatar,
  rating,
  comment,
  reviewDate,
  images = [],
}) {
  const formattedDate = new Date(reviewDate).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const displayReviewerName = reviewerName || '匿名使用者'

  const avatarSrc =
    !reviewerAvatar ||
    reviewerAvatar.trim() === '' ||
    reviewerAvatar === '/uploads/default-avatar.png'
      ? '/img/ncmLogo/default-avatar.png'
      : reviewerAvatar.startsWith('http')
        ? reviewerAvatar
        : `http://localhost:3005${reviewerAvatar}`

  return (
    <div className="review-item mt-3">
      {/* 左邊頭像名字，右邊日期 */}
      <div className="review-header">
        <div className="left">
          <img
            src={avatarSrc}
            alt="使用者頭像"
            width={36}
            height={36}
            className="review-avatar"
          />
          <span className="reviewer-name ps-2">{displayReviewerName}</span>
        </div>
        <span className="review-date">{formattedDate}</span>
      </div>

      <div className="review-rating">
        <StarRating value={rating} readOnly={true} icon={<>&#9733;</>} />
      </div>
      <p className="review-comment">{comment}</p>
    </div>
  )
}
