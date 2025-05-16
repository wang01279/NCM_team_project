'use client'
import Image from 'next/image'
import { useToast } from '@/app/_components/ToastManager'
import jwtDecode from 'jwt-decode'

export default function CouponCard({ coupon }) {
  const showToast = useToast()

  const handleClaim = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('請先登入才能領取優惠券')
        return
      }

      const decoded = jwtDecode(token)
      const memberId = decoded.id

      const res = await fetch('/api/member-coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ← 若你後端會驗證
        },
        body: JSON.stringify({
          memberId, // TODO: 替換為實際登入會員ID
          couponId: coupon.id,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        showToast('已領取1張優惠券')
      } else {
        alert(data.message || '領取失敗')
      }
    } catch (err) {
      alert('發生錯誤，請稍後再試')
    }
  }

  return (
    <div
      className="card d-flex flex-row position-relative"
      style={{ borderRadius: '6px', overflow: 'hidden', width: '300px' }}
    >
      <div
        style={{
          width: '75px',
          backgroundImage: `url("/images/coupon1.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '155px',
        }}
      />
      <div className="p-3" style={{ width: '244px' }}>
        <div className="text-end text-muted small">
          <Image
            src="/images/logo-outline.png"
            alt="Logo"
            width={18}
            height={18}
            style={{ objectFit: 'contain' }}
            className="p-0 pb-1 me-1"
          />
          {coupon.name}
        </div>
        <h3 className="text-danger fw-bold mt-0">
          {coupon.type === '現金'
            ? `NT$ ${coupon.discount}`
            : `${coupon.discount}% OFF`}
        </h3>
        <p className="mb-0 small text-dark">低消 NT$ {coupon.minSpend}</p>
        <p className="mb-0 small text-dark">
          期限：{coupon.endDate.slice(0, 10)}
        </p>
        <button
          className="btn btn-sm btn-primary position-absolute bottom-0 end-0 m-3"
          onClick={handleClaim}
        >
          領取
        </button>
      </div>
    </div>
  )
}
