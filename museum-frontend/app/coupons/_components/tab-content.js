// ✅ TabCoupons + CouponSorter 穩定整合版

'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import CouponCard from './cou-card'
import CouponSorter from './cou-sorter'
import styles from '../_styles/coupon.module.scss'
import { useToast } from '@/app/_components/ToastManager'
import { LuMousePointer2 } from 'react-icons/lu'
import { FaTicketAlt } from 'react-icons/fa'
import Loader from '@/app/_components/load'

export default function TabCoupons({ category, coupons = [], token, memberId }) {
  const [sortedCoupons, setSortedCoupons] = useState([])
  const [claimedIds, setClaimedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()
  const isLoggedIn = !!token

  useEffect(() => {
    setSortedCoupons(coupons)
  }, [coupons])

  const fetchClaimedCoupons = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/memberCoupons`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data.success) {
        const ids = response.data.data.map((c) => c.coupon_id)
        setClaimedIds(ids)
      }
    } catch (error) {
      console.error('❌ 無法取得已領取清單:', error)
      showToast('danger', '無法取得已領取清單')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn && category) {
      fetchClaimedCoupons()
    } else {
      setLoading(false)
    }
  }, [token, category])

  const handleOneClickClaim = async () => {
    if (!isLoggedIn) return showToast('danger', '請先登入會員')

    const idsToClaim = sortedCoupons
      .filter((c) => !claimedIds.includes(c.id))
      .map((c) => c.id)

    if (idsToClaim.length === 0) {
      showToast('info', '沒有可領取的優惠券')
      return
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/couponsClaim/claim-multiple`,
        { couponIds: idsToClaim },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data.status === 'success') {
        showToast('success', '成功領取所有優惠券')
        setClaimedIds((prev) => [...new Set([...prev, ...idsToClaim])])
      } else {
        showToast('warning', res.data.message || '一鍵領取失敗')
      }
    } catch (err) {
      console.error('❌ 一鍵領取失敗:', err)
      showToast('danger', '一鍵領取失敗，請稍後再試')
    }
  }

  const handleSingleClaimed = (id) => {
    setClaimedIds((prev) => [...new Set([...prev, id])])
  }

  const handleSorted = useCallback((sorted) => {
    setSortedCoupons(sorted)
  }, [])

  const visibleCoupons = isLoggedIn
    ? sortedCoupons.filter((c) => c.source === 'normal' && !claimedIds.includes(c.id))
    : sortedCoupons.filter((c) => c.source === 'normal')

  return (
    <div className={`container my-4 ${styles.borderCustom} ${styles.fadeIn}`}>
      {/* ✅ Header */}
      <div className="row pt-3 px-3 mb-3 align-items-center">
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
            <h5 className="d-flex align-items-center mb-2 mb-sm-0">
              <FaTicketAlt className="me-2" />
              可領取張數：{visibleCoupons.length}
            </h5>
            {isLoggedIn && (
              <button
                className="btn btn-secondary ms-0 ms-sm-4"
                onClick={handleOneClickClaim}
              >
                <LuMousePointer2 className="me-2" />
                一鍵領取
              </button>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-md-end">
          <CouponSorter coupons={coupons} onSorted={handleSorted} />
        </div>
      </div>

      <hr />

      {/* ✅ 卡片區塊 */}
      {loading ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255,255,255,0.85)',
            zIndex: 19999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader />
        </div>
      ) : (
        <div
          className="row row-cols-1 row-cols-md-4 g-4 pb-4 justify-content-center"
          style={{ minHeight: '300px' }}
        >
          {visibleCoupons.length === 0 ? (
            <div className="text-center text-muted fs-5 mt-5">
              {isLoggedIn ? '🎉 你已領取所有優惠券囉！' : '🔒 請登入領取優惠券'}
            </div>
          ) : (
            visibleCoupons.map((c) => (
              <div
                key={c.id}
                className="col d-flex justify-content-center align-items-center"
              >
                <CouponCard
                  coupon={c}
                  memberId={isLoggedIn ? memberId : null}
                  token={isLoggedIn ? token : null}
                  onClaimed={handleSingleClaimed}
                  isLoggedIn={isLoggedIn}
                  isClaimed={isLoggedIn && claimedIds.includes(c.id)}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
