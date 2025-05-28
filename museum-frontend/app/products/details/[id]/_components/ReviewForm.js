'use client'

import React, { useState, useEffect } from 'react'
import StarRating from './StarRating'
import '../_styles/ReviewForm.scss'
import { useToast } from '@/app/_components/ToastManager'
import { useAuth } from '@/app/_hooks/useAuth'

export default function ReviewForm({
  product_id,
  existingReview,
  onReviewSubmitted,
  onCancelEdit,
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()
  const { token } = useAuth() //使用 useAuth 拿 token

  useEffect(() => {
    setRating(existingReview?.rating || 0)
    setComment(existingReview?.comment || '')
  }, [existingReview])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      showToast('danger', '請給予評分！', 3000)
      return
    }
    if (!comment.trim()) {
      showToast('danger', '評論內容不能為空！', 3000)
      return
    }

    if (!token) {
      showToast('danger', '請先登入才能提交或更新評論。', 4000)
      return
    }

    setIsSubmitting(true)

    const method = existingReview ? 'PUT' : 'POST'
    const url = existingReview
      ? `http://localhost:3005/api/products/reviews/${existingReview.id}`
      : `http://localhost:3005/api/products/reviews`

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id,
          rating,
          comment,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        showToast(
          'error',
          errorData.error || '提交評論失敗，伺服器錯誤。',
          4000
        )
        console.error('提交評論錯誤:', errorData.error || response.statusText)
      } else {
        showToast(
          'success',
          existingReview ? '評論更新成功！' : '評論提交成功！感謝您的評價。',
          3000
        )
        if (!existingReview) {
          setRating(0)
          setComment('')
        }
        if (onCancelEdit) {
          onCancelEdit()
        }
        onReviewSubmitted()
      }
    } catch (error) {
      console.error('網路請求失敗:', error)
      showToast('error', `提交評論失敗：${error.message}`, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="review-form-wrapper">
      <div className="review-form-container">
        <h4>{existingReview ? '編輯您的評論' : '撰寫您的評論'}</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="rating" className="form-label">
              您的評分:
            </label>
            <StarRating
              value={rating}
              onChange={setRating}
              readOnly={isSubmitting}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="comment" className="form-label">
              評論內容:
            </label>
            <textarea
              id="comment"
              className="form-control"
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="請分享您的購買體驗..."
              disabled={isSubmitting}
            ></textarea>
          </div>
          <div className="d-flex justify-content-start gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? '提交中...'
                : existingReview
                  ? '更新評論'
                  : '提交評論'}
            </button>
            {existingReview && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                取消
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
