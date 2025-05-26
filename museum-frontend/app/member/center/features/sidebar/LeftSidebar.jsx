'use client'

import React from 'react'
import { motion } from 'framer-motion'
import styles from './sidebar.module.scss'
import { useRouter } from 'next/navigation'

import {
  FaUser,
  FaTicketAlt,
  FaHistory,
  FaBookmark,
  FaCrown,
} from 'react-icons/fa'

export default function Sidebar({
  member,
  activeTab,
  setActiveTab,
  onAvatarUpload,
}) {
  const router = useRouter() // ✅ 加這行
  const tabs = [
    { id: 'profile', icon: <FaUser />, label: '個人檔案', subLabel: '簡歷' },
    {
      id: 'coupons',
      icon: <FaTicketAlt />,
      label: '我的優惠券',
      subLabel: '優惠券',
    },
    { id: 'orders', icon: <FaHistory />, label: '我的訂單', subLabel: '訂單' },
    {
      id: 'favorites',
      icon: <FaBookmark />,
      label: '我的收藏',
      subLabel: '收藏',
    },
  ]

  return (
    <motion.aside
      className={styles.sidebar}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.userInfo}>
        <div className={styles.avatarContainer}>
          {/* <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onAvatarUpload}
          /> */}
          <label htmlFor="avatarUpload" style={{ cursor: 'pointer' }}>
            <img
              src={member.avatar || '/profile/images/pic.jpg'}
              alt="用戶頭像"
              className={styles.roundedCircle}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <img
              src="/img/member/cap.png"
              alt="裝飾"
              className={styles.decorationIcon}
            />
          </label>
        </div>
        <h4>{member.name || '小磁怪'}</h4>
        {/* <span>{member.email || '小磁怪@gmail.com'}</span> */}
        {/* <p>
          {member.role === '管理員' ? '客服人員' : '一般會員'} <FaCrown />
        </p> */}
        <p>
          {member.role === 'admin' || member.role === '管理員'
            ? '客服人員'
            : '一般會員'}{' '}
          <FaCrown />
        </p>
      </div>
      <hr className={styles.hrLine} />
      <nav className={styles.nav}>
        {tabs.map((tab, i) => (
          <React.Fragment key={tab.id}>
            <a
              className={`${styles.navLink} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => {
                setActiveTab(tab.id) // ✅ 加這行
                router.push(`/member/center?tab=${tab.id}`) // ✅ 更新網址
              }}
              style={{ cursor: 'pointer' }}
            >
              {/* <i className={`${tab.icon} me-2`}></i> */}
              <span className={`${styles.iconSize} mx-2 my-auto`}>
                {tab.icon}
              </span>

              <p className={`${styles.label} my-auto`}>{tab.label}</p>
              <p className={`${styles.subLabel} my-auto`}>{tab.subLabel}</p>
            </a>
            {i < tabs.length - 1 && <hr className={styles.hrLine} />}
          </React.Fragment>
        ))}
      </nav>

      {/* <button className={styles.logoutButton}>
        <i className={styles.logoutIcon}></i>
        我的訊息
      </button> */}
    </motion.aside>
  )
}
