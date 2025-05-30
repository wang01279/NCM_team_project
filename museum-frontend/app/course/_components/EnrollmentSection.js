import React from 'react'

export default function EnrollmentSection({
  course,
  // onEnroll,
  onAddToCart,
  isEnrolled,
}) {
  const { price, original_price, maxStudents, materials_included } = course
  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="enrollment-section" data-aos="fade-left">
      <div className="price-tag">
        {formatPrice(price)}
        {original_price && (
          <span className="original-price">{formatPrice(original_price)}</span>
        )}
      </div>
      <ul className="enrollment-features list-unstyled">
        <li>
          <i className="bi bi-people"></i>
          小班制教學（限{maxStudents}人）
        </li>
        <li>
          <i className="bi bi-tools"></i>
          {materials_included ? '含材料與工具' : '不含材料'}
        </li>
      </ul>
      <button
        className="btn btn-primary mb-3"
        onClick={onAddToCart}
        disabled={isEnrolled}
      >
        <i className="bi bi-cart-plus"></i> {isEnrolled ? '已加入購物車' : '立即報名'}
      </button>
      <button className="btn btn-enroll btn-outline">
        <i className="bi bi-chat-text"></i> 諮詢課程
      </button>
    </div>
  )
}
