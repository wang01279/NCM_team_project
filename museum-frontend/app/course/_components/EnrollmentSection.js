import React from 'react'
import styles from '../_styles/courseDetail.module.scss'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'
import CouponLink from '@/app/_components/CouponLink'
import '@/app/_styles/components/productCard.scss'

export default function EnrollmentSection({ course, onAddToCart, isEnrolled, isFavorite, onFavorite }) {
  const { price, original_price, maxStudents, materials_included } = course
  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const showUrgentTag = (() => {
    if (!course.start_time) return false;
    const start = new Date(course.start_time);
    const now = new Date();
    const diffDays = (start - now) / (1000 * 60 * 60 * 24);
    return diffDays <= 15 && diffDays >= 0;
  })();

  return (
    <div className={styles['enrollment-section']} data-aos="fade-left">
      <div className={styles['price-tag']}>
        {formatPrice(price)}
        {original_price && (
          <span className={styles['original-price']}>{formatPrice(original_price)}</span>
        )}
      </div>
      <div
        className="product-actions ms-1 mb-0 p-0 d-flex align-items-center"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 2,
          gap: '15px'
        }}
      >
        <AddToFavoritesButton
          itemId={course.id}
          itemType="course"
          isFavorite={isFavorite}
          onToggleFavorite={onFavorite}
        />
      </div>
      <div className={styles['enrollment-features']}>
        <p style={{ color: '#7B2D12' }}>
          已有 {course.studentCount} 位報名
          {showUrgentTag && (
            <span style={{
              background: '#7c7c7c',
              color: '#fff',
              borderRadius: '1em',
              padding: '0.1rem 0.5em',
              fontSize: '0.9rem',
              marginLeft: '0.8em',
              verticalAlign: 'middle',
              display: 'inline-block',
              letterSpacing: '0.04em',
            }}>
              即將開課，欲購從速
            </span>
          )}
        </p>
        <p>小班制教學（限{maxStudents}人）</p>
        <p>{materials_included ? '含材料與工具' : '不含材料'}</p>
      </div>

      <button
        className={`${styles['btn-primary']} btn btn-primary mb-3`}
        onClick={() => onAddToCart(1)}
        disabled={isEnrolled}
      >
        <i className="bi bi-cart-plus"></i> {isEnrolled ? '已加入購物車' : '立即報名'}
      </button>
      <button className={`${styles['btn-enroll']} btn btn-outline`}>
        <i className="bi bi-chat-text"></i> 諮詢課程
      </button>
      <CouponLink />
    </div>
  )
}
