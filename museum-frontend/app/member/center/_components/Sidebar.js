'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function Sidebar({ member, activeTab, setActiveTab, onAvatarUpload }) {
  const tabs = [
    { id: 'profile', icon: 'fas fa-user', label: '個人檔案' },
    { id: 'coupons', icon: 'fas fa-ticket-alt', label: '我的優惠券' },
    { id: 'orders', icon: 'fas fa-history', label: '我的訂單' },
    { id: 'favorites', icon: 'fas fa-heart', label: '我的收藏' },
  ]

  

  return (
    <motion.aside
      className="left-sidebar"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="user-info text-center mb-4">
        <div className="avatar-container position-relative">
          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onAvatarUpload}
          />
          <label htmlFor="avatarUpload" style={{ cursor: 'pointer' }}>
            <img
              src={member?.avatar || '/profile/images/pic.jpg'}
              alt="用戶頭像"
              className="rounded-circle mb-3"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <img
              src="/profile/images/cap.png"
              alt="裝飾"
              className="decoration-icon"
            />
          </label>
        </div>
        <h4>{member?.name || '未命名'}</h4>
        <p>
          一般會員 <i className="fas fa-crown"></i>
        </p>
      </div>
      <hr className="hr-line" />
      <nav className="nav flex-lg-column flex-row">
        {tabs.map((tab, i) => (
          <React.Fragment key={tab.id}>
            <a
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`${tab.icon} me-2`}></i>
              <p>{tab.label}</p>
            </a>
            {i < tabs.length - 1 && <hr className="hr-line" />}
          </React.Fragment>
        ))}
      </nav>
      <button className="btn btn-danger mt-4 w-100">
        <i className="fas fa-sign-out-alt me-2"></i>
        登出
      </button>
    </motion.aside>
  )
}
