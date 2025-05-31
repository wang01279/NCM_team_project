'use client'

import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './sidebar.module.scss'
import { useRouter } from 'next/navigation'
import {
  FaUser,
  FaTicketAlt,
  FaHistory,
  FaBookmark,
  FaCrown,
  FaUserShield,
  FaHeadset,
  FaChevronDown,
} from 'react-icons/fa'

const Sidebar = forwardRef(({
  member,
  activeTab,
  setActiveTab,
  onAvatarUpload,
  onEditProfileModal,
  onShowPasswordModal,
  onShowDeleteModal,
  couponFilter,
  setCouponFilter,
  favoriteFilter,
  setFavoriteFilter,
}, ref) => {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeDropdownItem, setActiveDropdownItem] = useState('')

  useImperativeHandle(ref, () => ({
    setActiveDropdownItem,
  }))

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

  // 角色對應表
  const roleMap = {
    admin: {
      label: '管理員',
      icon: <FaUserShield style={{ color: '#EA580C', marginLeft: 6 }} />,
      // className: styles.admin,
      className: `${styles.tag} ${styles.admin} ${styles.bubble}`,
    },
    staff: {
      label: '客服人員',
      icon: <FaHeadset style={{ color: '#3a5a40', marginLeft: 6 }} />,
      // className: styles.staff,
      className: `${styles.tag} ${styles.staff} ${styles.bubble}`,
    },
    user: {
      label: '一般會員',
      icon: <FaCrown style={{ color: '#842929', marginLeft: 6  }} />,
      // className: styles.user,
      className: `${styles.tag} ${styles.user} ${styles.bubble}`,
    },
  }

  // 取得角色key
  let roleKey = 'user'
  if (member.role === 'admin') roleKey = 'admin'
  else if (member.role === 'staff') roleKey = 'staff'
  // 其他都視為 user
  const roleInfo = roleMap[roleKey]

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
        <p className={roleInfo.className}>
          {roleInfo.label} {roleInfo.icon}
        </p>
      </div>
      <hr className={styles.hrLine} />
      <nav className={styles.nav}>
        {tabs.map((tab, i) => (
          <React.Fragment key={tab.id}>
            <a
              className={`${styles.navLink} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => {
                setActiveTab(tab.id)
                router.push(`/member/center?tab=${tab.id}`)
              }}
              style={{ cursor: 'pointer' }}
            >
              <span className={`${styles.iconSize} mx-2 my-auto`}>
                {tab.icon}
              </span>
              <p className={`${styles.label} my-auto`}>{tab.label}</p>
              <p className={`${styles.subLabel} my-auto`}>{tab.subLabel}</p>
              {tab.id === 'profile' && (
                <FaChevronDown 
                  style={{ marginLeft: 8, fontSize: 12, display: 'none' }}
                  className={styles.dropdownArrow}
                />
              )}
            </a>
            {/* 個人檔案子選單 */}
            <AnimatePresence initial={false}>
              {tab.id === 'profile' && activeTab === 'profile' && (
                <motion.div
                  key="profile-menu"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={styles.inlineMenu}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    onClick={e => { e.stopPropagation(); setActiveDropdownItem('edit'); onEditProfileModal(); }}
                    className={`${styles.inlineItem} ${activeDropdownItem === 'edit' ? styles.activeDropdown : ''}`}
                  >編輯資料</div>
                  <div
                    onClick={e => { e.stopPropagation(); setActiveDropdownItem('password'); onShowPasswordModal(); }}
                    className={`${styles.inlineItem} ${activeDropdownItem === 'password' ? styles.activeDropdown : ''}`}
                  >修改密碼</div>
                  <div
                    onClick={e => { e.stopPropagation(); setActiveDropdownItem('delete'); onShowDeleteModal(); }}
                    className={`${styles.inlineItem} ${activeDropdownItem === 'delete' ? styles.activeDropdown : ''}`}
                  >刪除帳號</div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* 我的優惠券子選單 */}
            <AnimatePresence initial={false}>
              {tab.id === 'coupons' && activeTab === 'coupons' && (
                <motion.div
                  key="coupons-menu"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={styles.inlineMenu}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    onClick={e => { e.stopPropagation(); setCouponFilter('available'); }}
                    className={`${styles.inlineItem} ${couponFilter === 'available' ? styles.activeDropdown : ''}`}
                  >可使用</div>
                  <div
                    onClick={e => { e.stopPropagation(); setCouponFilter('expired'); }}
                    className={`${styles.inlineItem} ${couponFilter === 'expired' ? styles.activeDropdown : ''}`}
                  >已失效</div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* 我的收藏子選單 */}
            <AnimatePresence initial={false}>
              {tab.id === 'favorites' && activeTab === 'favorites' && (
                <motion.div
                  key="favorites-menu"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={styles.inlineMenu}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    onClick={e => { e.stopPropagation(); setFavoriteFilter('exhibition'); }}
                    className={`${styles.inlineItem} ${favoriteFilter === 'exhibition' ? styles.activeDropdown : ''}`}
                  >展覽收藏</div>
                  <div
                    onClick={e => { e.stopPropagation(); setFavoriteFilter('product'); }}
                    className={`${styles.inlineItem} ${favoriteFilter === 'product' ? styles.activeDropdown : ''}`}
                  >商品收藏</div>
                  <div
                    onClick={e => { e.stopPropagation(); setFavoriteFilter('course'); }}
                    className={`${styles.inlineItem} ${favoriteFilter === 'course' ? styles.activeDropdown : ''}`}
                  >課程收藏</div>
                </motion.div>
              )}
            </AnimatePresence>
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
})

export default Sidebar
