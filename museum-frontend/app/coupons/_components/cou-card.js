// 用途：送出已領取的優惠券資訊，以及優惠券卡片元件
'use client'
import Image from 'next/image'
import { useToast } from '@/app/_components/ToastManager'
import styles from '../_styles/coupon.module.scss'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function CouponCard({
  coupon,
  onClaimed,
  token,
  isLoggedIn,
  isClaimed: claimedFromParent, // ✅ 來自父層 props 的狀態
}) {
  const [isClaimed, setIsClaimed] = useState(claimedFromParent || false)
  const { showToast } = useToast()

  // ✅ 如果 claimedFromParent 改變，要同步狀態（尤其初次渲染後、領完券等）
  useEffect(() => {
    setIsClaimed(claimedFromParent)
  }, [claimedFromParent])

  const handleClaim = async () => {
    if (isClaimed) return
    if (!isLoggedIn || !token) {
      showToast('danger', '請先登入會員')
      return
    }

    try {
      const res = await axios.post(
        'http://localhost:3005/api/couponsClaim/claim',
        { couponId: coupon.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status === 'success') {
        setIsClaimed(true)
        showToast('success', '成功領取優惠券')
        if (onClaimed) onClaimed(coupon.id)
      } else {
        showToast('warning', res.data.message || '領取失敗')
      }
    } catch (err) {
      console.error('❌ 領取錯誤:', err)
      showToast('danger', '無法領取，請稍後再試')
    }
  }

  return (
    <div
      type="button"
      tabIndex={0}
      className={`${styles.couponCard} d-flex flex-row position-relative ${isClaimed ? styles.claimed : ''}`}
      onClick={handleClaim}
      aria-label="點擊可領取"
      style={{
        cursor: isClaimed ? 'not-allowed' : 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        width: '100%',
      }}
    >
      {isClaimed && <div className={styles.claimedLabel}>已領取</div>}

      {/* 圖片欄位 */}
      <div
        className={styles.imageContainer}
        style={{ backgroundImage: `url("/images/coupon1.jpg")` }}
      >
        <div className={styles.overlay}>
          <span className={styles.hintText}>點擊領取</span>
        </div>
      </div>

      {/* 卡片內容 */}
      <div className={`p-3 ${styles.cardbody}`}>
        <div className="text-end text-muted small">
          <Image
            src="/images/logo-outline.png"
            alt="Logo"
            width={18}
            height={18}
            className="p-0 pb-1 me-1"
            style={{ objectFit: 'contain' }}
          />
          {coupon.name}
        </div>
        <h3 className="fw-bold mt-0">
          {coupon.type === '現金'
            ? `NT$ ${coupon.discount}`
            : `${coupon.discount}% OFF`}
        </h3>
        <p className="mb-0 small text-dark">低消 NT$ {coupon.minSpend}</p>
        <p className="mb-0 small text-dark">
          領券期限：{coupon.endDate.slice(0, 10)}
        </p>
      </div>
    </div>
  )
}
