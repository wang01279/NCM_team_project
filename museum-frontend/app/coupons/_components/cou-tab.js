// cou-tab.js
'use client' 
import { useEffect, useState } from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import TabProducts from './tab-products'
import TabCourses from './tab-courses'
import styles from '../_styles/coupon.module.scss'
import axios from 'axios'

export default function CouTab() {
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
  const productCoupons = Array.isArray(allCoupons)
    ? allCoupons.filter((c) => c.category === '商品')
    : []

  const courseCoupons = Array.isArray(allCoupons)
    ? allCoupons.filter((c) => c.category === '課程')
    : []
 
  return (
    <Tabs
      defaultActiveKey="products"
      className="d-flex justify-content-center mt-5 mb-2"
      justify
    >
      <Tab eventKey="products" title="商品適用" tabClassName={styles.tabItem}>
        <TabProducts coupons={productCoupons} />
      </Tab>
      <Tab eventKey="courses" title="課程適用" tabClassName={styles.tabItem}>
        <TabCourses coupons={courseCoupons} />
      </Tab>
    </Tabs>
  )
}
