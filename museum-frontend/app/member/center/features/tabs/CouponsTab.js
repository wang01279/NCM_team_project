'use client'

import { useAuth } from '@/app/_hooks/useAuth'
import { useState, useEffect } from 'react'
import CouponTable from './_components/CouponTable'
import './_style/memCoupons.module.scss'

export default function CouponsTab({ filter = 'available' }) {
  const { token, isLoggedIn } = useAuth()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(false)

  const getCoupons = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/memberCoupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success || data.status === 'success') {
        setCoupons(data.data)
      }
    } catch (error) {
      console.error('獲取優惠券失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      getCoupons()
    }
  }, [isLoggedIn, reload])

  const filteredCoupons = coupons.filter((c) => {
    const now = new Date()
    if (filter === 'available') {
      return !c.is_used && new Date(c.expired_at || c.endDate) > now
    }
    if (filter === 'expired') {
      return c.is_used || new Date(c.expired_at || c.endDate) <= now
    }
    return true
  })

  if (!isLoggedIn) return <div>請先登入</div>
  if (loading) return <div>載入中...</div>

  return (
    <div className="container p-5">
      <CouponTable
        coupons={filteredCoupons}
        isExpiredMode={filter === 'expired'}
        onActionSuccess={() => setReload((r) => !r)}
      />
    </div>
  )
}
