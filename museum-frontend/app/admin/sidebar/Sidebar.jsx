'use client'

import React from 'react'
import { motion } from 'framer-motion'
import styles from './sidebar.module.scss'
import { useRouter } from 'next/navigation'

export default function Sidebar({ member, activeTab, setActiveTab }) {
  const router = useRouter()

  const tabs = [
    { id: 'users', label: '會員管理', subLabel: '會員列表', path: '/admin/user/users' },
    { id: 'products', label: '商品管理', subLabel: '商品列表', path: '/admin/products/product-list' },
    { id: 'instructors', label: '師資管理', subLabel: '新增師資', path: '/admin/instructor/instructor-up' },
    { id: 'exhibitions', label: '展覽管理', subLabel: '新增展覽', path: '/admin/exhibitions/exhibition-create' },
    { id: 'venues', label: '場地管理', subLabel: '新增場地', path: '/admin/venue/venue-create' },
    { id: 'courses', label: '課程管理', subLabel: '新增課程', path: '/admin/courses/course-create' },
    { id: 'coupons', label: '優惠券管理', subLabel: '新增優惠券', path: '/admin/coupons' },
  ]

  return (
    <motion.aside
      className={styles.sidebar}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <hr className={styles.hrLine} />
      <nav className={styles.nav}>
        {tabs.map((tab, i) => (
          <React.Fragment key={tab.id}>
            <a
              className={`${styles.navLink} ${activeTab === tab.id ? styles.active : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setActiveTab(tab.id)
                router.push(tab.path)
              }}
            >
              <span className={`${styles.iconSize} me-2 my-auto`}></span>
              <div>
                <p className={`${styles.label} my-auto`}>{tab.label}</p>
                <p className={`${styles.subLabel} my-auto`}>{tab.subLabel}</p>
              </div>
            </a>
            {i < tabs.length - 1 && <hr className={styles.hrLine} />}
          </React.Fragment>
        ))}
      </nav>
    </motion.aside>
  )
}
