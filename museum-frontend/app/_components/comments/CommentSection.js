'use client'

import useSWR from 'swr'
import axios from 'axios'
import React, { useState } from 'react'
import styles from './CommentSection.module.scss'
import { FaStar } from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'
import { useAuth } from '@/app/_hooks/useAuth'

const fetcher = (url, token) =>
  axios.get(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined).then((res) => res.data)

// type: 'course' | 'product', id: number
export default function CommentSection({ type, id }) {
  const { member, token } = useAuth() || {}
  const { showToast } = useToast()
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  const apiUrl = `http://localhost:3005/api/comments?type=${type}&id=${id}`
  const { data: comments = [], mutate, isLoading } = useSWR(
    id ? [apiUrl, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  console.log('CommentSection props:', { type, id, token });

  // 發表評論
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return showToast('warning', '請輸入評論內容', 3000)
    setSubmitting(true)
    try {
      await axios.post(
        'http://localhost:3005/api/comments',
        { comment_type: type, target_id: id, content, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setContent('')
      setRating(5)
      showToast('success', '評論發表成功', 3000)
      mutate()
    } catch (err) {
      showToast('warning', '評論發表失敗', 3000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.commentSection}>
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 className={styles.title}>評論區</h2>
        </div>
        <div className="col-12 col-md-10 col-lg-8">
          {/* 發表區 */}
          {member && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={star <= rating ? styles.filled : styles.empty}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="留下你的評論..."
                rows={3}
                disabled={submitting}
              />
              <div className="d-flex justify-content-end mt-2">
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={submitting}
                >
                  {submitting ? '送出中...' : '送出評論'}
                </button>
              </div>
            </form>
          )}
          {/* 評論列表 */}
          <div className={styles.commentList}>
            {isLoading ? (
              <div className="text-center py-4">載入中...</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-4 text-muted">尚無評論</div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentName}>{c.member_name || c.member_email || '匿名'}</span>
                    <span className={styles.commentStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= c.rating ? styles.filled : styles.empty}
                        />
                      ))}
                    </span>
                    <span className={styles.commentDate}>{c.created_at?.slice(0, 10)}</span>
                  </div>
                  <div className={styles.commentContent}>{c.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 