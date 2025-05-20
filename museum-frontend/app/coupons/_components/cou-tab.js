// cou-tab.js
'use client'
import { useEffect, useState } from 'react'
import TabProducts from './tab-products'
import TabCourses from './tab-courses'
import styles from '../_styles/coupon.module.scss'
import axios from 'axios'
import { FaBookOpen, FaGift } from 'react-icons/fa'

export default function CouTab() {
  const [activeTab, setActiveTab] = useState('products')
  const [allCoupons, setAllCoupons] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:3005/api/coupons') // 後端資料請求
      .then((res) => {
        console.log('✅ 回傳資料：', res.data)
        setAllCoupons(res.data.data)
      })
      .catch((err) => console.error(err))
  }, [])

  // 分類（依 category 欄位）
  const productCoupons = allCoupons.filter((c) => c.category === '商品')
  const courseCoupons = allCoupons.filter((c) => c.category === '課程')

  return (
    <>
      <ul className={`mt-5 ${styles.tabs} ${styles.tabMenu}`}>
        <li>
          <div
            type="button"
            className={`fs-5 d-flex align-items-center ${styles.tabItem} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FaGift className='me-2 p-0'/>
            商品適用
          </div>
        </li>
        <li>
          <div
            type="button"
            className={`fs-5 d-flex align-items-center  ${styles.tabItem} ms-2 ${activeTab === 'courses' ? styles.active : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <FaBookOpen className='me-2'/>
            課程適用
          </div>
        </li>
      </ul>
      <div className="tab-content">
        {activeTab === 'products' && <TabProducts coupons={productCoupons} />}
        {activeTab === 'courses' && <TabCourses coupons={courseCoupons} />}
      </div>
    </>
  )
}
