'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import '../_styles/navbar.scss'
import AuthModal from '@/app/_components/Auth/AuthModal'
import { useAuth } from '@/app/_hooks/useAuth'
import {
  FaUserCircle,
  FaCommentDots,
  FaTicketAlt,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt,
  FaShoppingCart,
  FaUser,
} from 'react-icons/fa'

// toast
import { useToast } from './ToastManager'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()
  const { member, isLoggedIn, isLoading, logout } = useAuth()
  
  /* ---------------------- State ---------------------- */
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  /* -------------------- Effects ---------------------- */
  // 1. 監聽捲動：縮小／還原 Header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 2. Body overflow：開側欄時鎖住背景
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  /* -------------------- Handlers --------------------- */
  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  const handleLogin = () => {
    setIsLoginModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const handleSubmitLogin = (formData) => {
    setIsLoginModalOpen(false)
    showToast('success', '登入成功 🎉')
    router.push('/member/center')
  }

  const handleNavigateToMemberCenter = () => {
    router.push('/member/center')
  }

  //管理區不需要選單列
  if (pathname.includes('/admin')) {
    return <></>
  }

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="nav-container">
          {/* Logo */}
          <a href="/" className="logo-container logo" onClick={closeMenu}>
            <img
              src="/img/logo-navbar/logo-navbar-light-1.svg"
              alt="國立故瓷博物館"
              className="large-logo"
            />
            <img
              src="/img/ncmLogo/logo-ncm.png"
              alt="國立故瓷博物館"
              className="small-logo"
            />
          </a>

          {/* Hamburger */}
          <button
            className={`hamburger-menu ${menuOpen ? 'active' : ''}`}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>

          {/* Desktop nav ----------------------------------------------------------------*/}
          <div className="nav-menu d-none d-md-flex">
            <a href="#">展覽 Exhibition</a>
            <a href="#">課程 Courses</a>
            <a href="#">故瓷電商 Shop</a>

            {/* Right cluster */}
            <div className="nav-right">
              {!isLoading &&
                (isLoggedIn ? (
                  <div className="user-greeting">
                    {/* 使用者頭像 */}
                    {/* <FaUserCircle /> */}
                    <img src={member?.avatar || '/img/ncmLogo/logo-ncm.png'} alt="avatar" className="user-profile-avatar" />
                    <div className="user-dropdown">
                      <div className="user-profile-header">
                        <img
                          src={member?.avatar || '/img/ncmLogo/logo-ncm.png'}
                          alt="avatar"
                          className="user-profile-avatar"
                        />
                        <div className="user-profile-info">
                          <div className="user-profile-name">
                            {member?.name || '未設定姓名'}
                          </div>
                          <div className="user-profile-email">
                            {member?.email}
                          </div>
                        </div>
                      </div>

                      <a
                        href="#"
                        className="user-dropdown-item"
                        onClick={handleNavigateToMemberCenter}
                      >
                        <FaUser className="icon" /> 個人檔案
                      </a>
                      <a href="#" className="user-dropdown-item">
                        <span className="notification-dot">12</span>
                        <FaCommentDots className="icon" /> 我的訊息
                      </a>
                      <a href="#" className="user-dropdown-item">
                        <FaTicketAlt className="icon" /> 我的優惠券
                      </a>
                      <a href="#" className="user-dropdown-item">
                        <FaShoppingBag className="icon" /> 我的訂單
                      </a>
                      <a href="#" className="user-dropdown-item">
                        <FaHeart className="icon" /> 我的收藏
                      </a>

                      <div className="user-dropdown-divider" />
                      <a
                        href="#"
                        className="user-dropdown-item"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="icon" /> 登出
                      </a>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={handleLogin}>
                    <FaUserCircle className="icon" /> 登入
                  </button>
                ))}

              <a href="#" className="nav-icon">
                <FaShoppingCart className="icon" />
                <span className="cart-count">0</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Mobile nav (side‑drawer) ----------------------------------------------------- */}
        <aside className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
          <nav className="nav-menu" onClick={closeMenu}>
            <a href="#">展覽 Exhibition</a>
            <a href="#">課程 Courses</a>
            <a href="#">故瓷電商 Shop</a>
          </nav>

          {/* Profile & logout */}
          <div className="mobile-profile">
            {!isLoading &&
              (isLoggedIn ? (
                <>
                  <div className="mobile-profile-header">
                    <img
                      src={member?.avatar || '/img/ncmLogo/logo-ncm.png'}
                      alt="avatar"
                      className="mobile-profile-avatar"
                    />
                    <div className="mobile-profile-info">
                      <div className="mobile-profile-name">
                        {member?.name || '未設定姓名'}
                      </div>
                      <div className="mobile-profile-email">{member?.email}</div>
                    </div>
                  </div>
                  <button
                    className="mobile-profile-item"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> 登出
                  </button>
                </>
              ) : (
                <button className="mobile-profile-item" onClick={handleLogin}>
                  <FaUserCircle /> 登入
                </button>
              ))}
          </div>
        </aside>
      </header>

      {/* Overlay */}
      <div
        className={`mobile-overlay ${menuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      {/* Login Modal */}
      <AuthModal
        show={isLoginModalOpen}
        onHide={handleCloseLoginModal}
        onSubmit={handleSubmitLogin}
      />
    </>
  )
}