'use client'

import React, { useState } from 'react'
import ReviewItem from './ReviewItem'
import StarRating from './StarRating'
import ReviewForm from './ReviewForm' // 引入 ReviewForm
import '../_styles/ProductTabs.scss'

import { useAuth } from '@/app/_hooks/useAuth' // 確保路徑正確

export default function ProductTabs({
  product,
  notes = [],
  reviews = [],
  onReviewSubmitted,
}) {
  const [activeTab, setActiveTab] = useState('desc')
  const [showReviewForm, setShowReviewForm] = useState(false) // 控制評論表單顯示/隱藏的狀態

  // *** 新增：編輯模式的狀態 ***
  const [editingReview, setEditingReview] = useState(null) // 儲存正在編輯的評論物件 {id, rating, comment}

  const { member, isLoggedIn } = useAuth() // 獲取會員資訊
  const memberId = member?.id // 登入會員的 ID

  // 檢查當前登入用戶是否已評論過此商品
  const hasReviewed = reviews.some((review) => review.member_id === memberId)
  // 找出當前登入用戶的評論（如果存在）
  const userReview = reviews.find((review) => review.member_id === memberId)

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    // 當切換到其他 Tab 時，如果 ReviewForm 是開啟的，就隱藏它並清除編輯狀態
    if (showReviewForm) {
      setShowReviewForm(false)
      setEditingReview(null)
    }
  }

  // 處理點擊「撰寫評論」按鈕
  const handleWriteReviewClick = () => {
    setEditingReview(null) // 清除編輯狀態
    setShowReviewForm(!showReviewForm)
  }

  // 處理點擊「編輯我的評論」按鈕
  const handleEditMyReviewClick = (reviewToEdit) => {
    setEditingReview(reviewToEdit) // 設定要編輯的評論資料
    setShowReviewForm(true) // 顯示表單
    setActiveTab('reviews') // 確保在評論頁籤
  }

  // 計算平均評分
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0

  return (
    <div className="container product-tab">
      <div className="row">
        {/* 左側選單 + 中線 */}
        <div className="col-12 col-md-2 mb-4 mb-md-0 tab-left">
          <div className="tab-nav">
            <button
              className={`tab-button ${activeTab === 'desc' ? 'active' : ''}`}
              data-tab="desc"
              onClick={() => handleTabClick('desc')}
            >
              商品說明
            </button>
            <button
              className={`tab-button ${activeTab === 'note' ? 'active' : ''}`}
              data-tab="note"
              onClick={() => handleTabClick('note')}
            >
              注意事項
            </button>
            <button
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              data-tab="reviews"
              onClick={() => handleTabClick('reviews')}
            >
              商品評價 ({reviews.length})
            </button>
          </div>
        </div>

        {/* 右側內容 */}
        <div className="col-12 col-md-10">
          {/* 商品說明內容區塊 */}
          <div
            className={`tab-content desc ${activeTab === 'desc' ? 'active' : ''}`}
          >
            <h4 className="fw-bold">商品說明</h4>
            <p className="mb-2">{product?.name_zh}</p>
            <p className="desc-text">文物描述：{product?.details}</p>

            <div className="row border-top border-1 text-center fw-bold py-2">
              <div className="col-4">材質</div>
              <div className="col-4">出產地</div>
              <div className="col-4">用途(功能)</div>
            </div>
            <div className="row text-center py-2">
              <div className="col-4">{product?.material_name}</div>
              <div className="col-4">{product?.origin_name}</div>
              <div className="col-4">{product?.function_name}</div>
            </div>
          </div>

          {/* 注意事項內容區塊 */}
          <div
            className={`tab-content note ${activeTab === 'note' ? 'active' : ''}`}
          >
            <h4 className="fw-bold">注意事項</h4>
            {notes.length > 0 ? (
              <ul className="desc-text">
                {notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            ) : (
              <p className="desc-text">目前無特別注意事項。</p>
            )}
          </div>

          {/* 商品評價內容區塊 */}
          <div
            className={`tab-content reviews ${activeTab === 'reviews' ? 'active' : ''}`}
          >
            <h4 className="fw-bold">商品評價 ({reviews.length})</h4>
            <div className="average-rating-summary mb-4">
              平均評分: {averageRating}{' '}
              <StarRating value={Number(averageRating)} readOnly={true} />{' '}
            </div>

            {/* *** 根據登入狀態和是否已評論來顯示按鈕或提示 *** */}
            {isLoggedIn ? ( // 如果已登入
              hasReviewed ? ( // 並且已評論過
                <button
                  className="btn btn-secondary mb-4" // 顯示編輯按鈕
                  onClick={() => handleEditMyReviewClick(userReview)} // 傳遞自己的評論數據
                >
                  編輯我的評論
                </button>
              ) : (
                // 已登入但未評論過
                <button
                  className="btn btn-primary mb-4"
                  onClick={handleWriteReviewClick}
                >
                  {showReviewForm && !editingReview
                    ? '隱藏評論表單'
                    : '撰寫評論'}
                </button>
              )
            ) : (
              // 未登入
              <p className="mt-3 text-center desc-text">請登入後撰寫評論。</p>
            )}

            {/* 顯示評論表單 (僅在登入且點擊按鈕後顯示) */}
            {showReviewForm && isLoggedIn && (
              <ReviewForm
                product_id={product.id}
                member_id={memberId}
                // 如果有 editingReview，則傳遞其 id、rating、comment
                review_id={editingReview?.id}
                initialRating={editingReview?.rating}
                initialComment={editingReview?.comment}
                onReviewSubmitted={() => {
                  setShowReviewForm(false) // 提交後隱藏表單
                  setEditingReview(null) // 清除編輯狀態
                  onReviewSubmitted() // 觸發 page.js 重新載入評論
                }}
              />
            )}

            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <ReviewItem
                    key={review.id}
                    reviewerName={review.reviewer_name || '匿名使用者'}
                    rating={review.rating}
                    comment={review.comment}
                    reviewDate={review.created_at}
                    // 傳遞 memberId 和當前 review 的 member_id，以便 ReviewItem 判斷是否為自己的評論
                    currentMemberId={memberId}
                    reviewMemberId={review.member_id}
                    // 提供編輯回調，讓 ReviewItem 觸發編輯表單
                    onEdit={() => handleEditMyReviewClick(review)}
                  />
                ))}
              </div>
            ) : (
              <p className="desc-text mt-3">目前沒有任何評論。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
