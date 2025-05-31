// ✅ CouTab.js
'use client'

import { useEffect, useState } from 'react'
import TabCoupons from './tab-content'
import styles from '../_styles/coupon.module.scss'
import axios from 'axios'
import { FaBookOpen, FaGift } from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'

export default function CouTab({ token, memberId }) {
  const [activeTab, setActiveTab] = useState('products')
  const [allCoupons, setAllCoupons] = useState([])
  const { showToast } = useToast()

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons`)
        setAllCoupons(res.data.data)
      } catch (err) {
        console.error('❌ 優惠券取得失敗：', err)
        showToast('danger', '優惠券取得失敗，請稍後再試')
      }
    }
    fetchCoupons()
  }, [])

  const productCoupons = allCoupons.filter((c) => c.category === '商品')
  const courseCoupons = allCoupons.filter((c) => c.category === '課程')

  return (
    <>
      <ul className={`mt-5 ${styles.tabs} ${styles.tabMenu}`}>
        <li>
          <div
            className={`fs-5 d-flex align-items-center ${styles.tabItem} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FaGift className="me-2 p-0" /> 商品適用
          </div>
        </li>
        <li>
          <div
            className={`fs-5 d-flex align-items-center ${styles.tabItem} ms-2 ${activeTab === 'courses' ? styles.active : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <FaBookOpen className="me-2" /> 課程適用
          </div>
        </li>
      </ul>

      <div className="mt-4">
        {activeTab === 'products' && (
          <TabCoupons category="商品" coupons={productCoupons} token={token} memberId={memberId} />
        )}
        {activeTab === 'courses' && (
          <TabCoupons category="課程" coupons={courseCoupons} token={token} memberId={memberId} />
        )}
      </div>
    </>
  )
}
