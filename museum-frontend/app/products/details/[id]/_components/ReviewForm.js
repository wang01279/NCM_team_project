// app/products/details/[id]/_components/ReviewForm.js

'use client'

import React, { useState, useEffect } from 'react'
import StarRating from './StarRating' // 確保這個路徑和組件名是正確的
import '../_styles/ReviewForm.scss' // 引入 SCSS 檔案
import { useToast } from '@/app/_components/ToastManager' // 假設你有這個 ToastManager

export default function ReviewForm({
  product_id,
  // member_id, // 這行可以刪除，因為 member_id 應該從後端 token 解析
  existingReview, // 如果有現有評論，表示是編輯模式
  onReviewSubmitted,
  onCancelEdit, // 編輯模式下取消按鈕的功能
}) {
  // 使用 existingReview 的值來初始化狀態
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast() // 使用 ToastManager

  // 當 existingReview 改變時，同步更新表單的狀態
  useEffect(() => {
    setRating(existingReview?.rating || 0)
    setComment(existingReview?.comment || '')
  }, [existingReview]) // 依賴 existingReview

  const handleSubmit = async (e) => {
    e.preventDefault()

    // --- 前端驗證 ---
    if (rating === 0) {
      showToast('error', '請給予評分！', 3000)
      return
    }
    if (!comment.trim()) {
      showToast('error', '評論內容不能為空！', 3000)
      return
    }

    // --- 獲取認證令牌 ---
    let token = null
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken') // <--- 確保這裡的 key 和你登入時儲存的 key 一致
    }

    if (!token) {
      showToast('error', '請先登入才能提交或更新評論。', 4000)
      // 可選：如果需要，可以導向登入頁面
      // import { useRouter } from 'next/navigation';
      // const router = useRouter();
      // router.push('/login');
      return
    }

    setIsSubmitting(true)

    const method = existingReview ? 'PUT' : 'POST'
    const url = existingReview
      ? `http://localhost:3005/api/products/reviews/${existingReview.id}` // 使用 existingReview.id
      : `http://localhost:3005/api/products/reviews`

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <--- 關鍵：取消註釋！並確保 key 正確
        },
        body: JSON.stringify({
          product_id: product_id, // 對於 POST 請求是必須的
          rating: rating,
          comment: comment,
          // member_id 不需要從前端發送，後端會從 token 中解析
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
        // const _result = await response.json() // 為了避免 ESLint 警告，可以使用 _result
        showToast(
          'success',
          existingReview ? '評論更新成功！' : '評論提交成功！感謝您的評價。',
          3000
        )
        // 提交成功後，如果是新增模式，清空表單
        if (!existingReview) {
          setRating(0)
          setComment('')
        }
        // 如果是編輯模式，且有取消按鈕的處理，執行取消
        if (onCancelEdit) {
          onCancelEdit()
        }
        onReviewSubmitted() // 通知父組件重新獲取評論
      }
    } catch (error) {
      console.error('網路請求失敗:', error)
      showToast('error', `提交評論失敗：${error.message}`, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // 添加一個容器來控制間距
    <div className="review-form-wrapper">
      <div className="review-form-container">
        <h4>{existingReview ? '編輯您的評論' : '撰寫您的評論'}</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="rating" className="form-label">
              您的評分:
            </label>
            {/* 傳遞 value 而不是 initialRating */}
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
            {' '}
            {/* 用 div 包裹按鈕以控制間距 */}
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
