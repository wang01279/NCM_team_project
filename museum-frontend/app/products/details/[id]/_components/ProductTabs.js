'use client'

import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ReviewItem from './ReviewItem'
import StarRating from './StarRating'
import ReviewForm from './ReviewForm'
import '../_styles/ProductTabs.scss'
import { useAuth } from '@/app/_hooks/useAuth'
import { FaBookOpen, FaScroll, FaLightbulb, FaCommentAlt } from 'react-icons/fa'
import { GiPorcelainVase } from 'react-icons/gi'

export default function ProductTabs({
  product,
  reviews = [],
  onReviewSubmitted,
  story = '',
}) {
  const { member, isLoggedIn } = useAuth()
  const memberId = member?.id

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)

  const hasReviewed = Array.isArray(reviews)
    ? reviews.some((review) => review.member_id === memberId)
    : false

  const userReview = Array.isArray(reviews)
    ? reviews.find((review) => review.member_id === memberId)
    : null

  const handleEditMyReviewClick = (reviewToEdit) => {
    setEditingReview(reviewToEdit)
    setShowReviewForm(true)
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0

  const storyRef = useRef(null)
  const inView = useInView(storyRef, { once: false, amount: 0.5 })

  const lineVariants = {
    hidden: { opacity: 0, y: 40 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  }

  const paragraphLines =
    typeof story === 'string' && story.trim()
      ? story.split('\n')
      : ['暫無作品故事']

  return (
    <div className="container product-tab">
      <div className="row">
        {/* 左側導覽按鈕 */}
        <div className="col-12 col-md-2 mb-4 mb-md-0 tab-left sticky-nav">
          <div className="tab-nav">
            <a href="#story" className="tab-button">
              <FaBookOpen className="me-2" />
              商品故事
            </a>
            <a href="#desc" className="tab-button">
              <FaScroll className="me-2" />
              商品說明
            </a>
            <a href="#gallery" className="tab-button">
              <GiPorcelainVase className="me-2" />
              商品藝廊
            </a>
            <a href="#note" className="tab-button">
              <FaLightbulb className="me-2" />
              貼心提醒
            </a>
            <a href="#reviews" className="tab-button">
              <FaCommentAlt className="me-2" />
              商品評價 ({reviews.length})
            </a>
          </div>
        </div>

        {/* 右側內容區塊 */}
        <div className="col-12 col-md-10">
          {/* 商品故事 */}
          <section id="story" className="tab-section story-wrapper">
            <div className="story-frame-container">
              <div className="story-card" ref={storyRef}>
                <div className="story-inner">
                  <motion.div
                    className="story-border"
                    initial="hidden"
                    animate={inView ? 'show' : 'hidden'}
                    variants={{}}
                  >
                    <div className="story-box">
                      <img
                        src="/img/ncmLogo/default-avatar.png"
                        className="story-icon"
                      />
                      <h3 className="story-heading">
                        <span className="en fs-6">Story</span> <span>商品故事</span>
                      </h3>
                      <div className="divider"></div>
                      <div className="story-paragraph">
                        {paragraphLines.map((line, i) => (
                          <motion.p
                            key={i}
                            className="story-line"
                            custom={i}
                            variants={lineVariants}
                            initial="hidden"
                            animate={inView ? 'show' : 'hidden'}
                          >
                            {line}
                          </motion.p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
          {/* 商品說明 */}
          <section id="desc" className="tab-section">
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
          </section>
          {/* 商品藝廊 */}
          <section id="gallery" className="tab-section gallery-section">
            <h4 className="fw-bold gallery-title">商品藝廊</h4>
            {Array.isArray(product.images) && product.images.length > 0 ? (
              <div className="gallery-grid">
                {product.images.map((src, index) => (
                  <div className="image-wrapper" key={index}>
                    <img
                      src={src}
                      alt={`商品圖 ${index + 1}`}
                      className="gallery-image"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="desc-text">目前尚無商品藝廊圖片。</p>
            )}
          </section>

          {/* 貼心提醒*/}
          <section id="note" className="tab-section">
            <div className="tips-block">
              <h4 className="fw-bold">
                Tips <span className="text-muted">貼心提醒</span>
              </h4>
              <ul className="tips-list desc-text">
                <li>台灣本島運送於付款後 3–7 個工作天可收到此商品</li>
                <li>離島運送將無法納入免運優惠</li>
                <li>
                  若需將此商品配送至台灣以外地區，請透過下方聯繫資訊洽客服人員，我們將為您安排最佳的運送方式
                </li>
                <li>
                  作品顏色僅供參考，色樣會因電腦螢幕設定不同而有誤差，顏色以實際作品為主。
                </li>
              </ul>
            </div>
          </section>
          {/* 商品評價 */}
          <section id="reviews" className="tab-section">
            <h4 className="fw-bold">商品評價 ({reviews.length})</h4>
            <div className="average-rating-summary mb-4">
              平均評分: {averageRating}{' '}
              <StarRating value={Number(averageRating)} readOnly={true} />
            </div>
            {isLoggedIn ? (
              hasReviewed ? (
                <button
                  className="btn btn-secondary mb-4"
                  onClick={() => handleEditMyReviewClick(userReview)}
                >
                  編輯我的評論
                </button>
              ) : (
                <button
                  className="btn btn-primary mb-4"
                  onClick={() => {
                    setEditingReview(null)
                    setShowReviewForm(!showReviewForm)
                  }}
                >
                  {showReviewForm && !editingReview
                    ? '隱藏評論表單'
                    : '撰寫評論'}
                </button>
              )
            ) : (
              <p className="mt-3 text-center desc-text">請登入後撰寫評論。</p>
            )}
            {(showReviewForm || editingReview) && isLoggedIn && (
              <ReviewForm
                product_id={product.id}
                existingReview={editingReview}
                onReviewSubmitted={() => {
                  setShowReviewForm(false)
                  setEditingReview(null)
                  onReviewSubmitted()
                }}
                onCancelEdit={() => {
                  setShowReviewForm(false)
                  setEditingReview(null)
                }}
              />
            )}
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => {
                  return (
                    <ReviewItem
                      key={review.id}
                      reviewerName={review.reviewer_name}
                      reviewerAvatar={review.reviewer_avatar}
                      rating={review.rating}
                      comment={review.comment}
                      reviewDate={review.created_at}
                      currentMemberId={memberId}
                      reviewMemberId={review.member_id}
                      onEdit={() => handleEditMyReviewClick(review)}
                    />
                  )
                })}
              </div>
            ) : (
              <p className="desc-text mt-3">目前沒有任何評論。</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
