'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import '../_styles/navbar.moudle.scss'
import AuthModal from '@/app/_components/Auth/AuthModal'
import { useAuth } from '@/app/_hooks/useAuth'

import CartDropdown from './CartDropdown/CartDropdown'
// import { useAuth } from '@/app/_components/Auth/AuthProvider'
import Link from 'next/link'

import {
  FaUserCircle,
  FaCommentDots,
  FaTicketAlt,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt,
  FaShoppingCart,
  FaUser,
  FaHistory,
  FaBookmark,
} from 'react-icons/fa'
import Image from 'next/image'

// toast
import { useToast } from './ToastManager'
import { io } from 'socket.io-client'
import ChatSidebar from './Chat/ChatSidebar'
import { jwtDecode } from 'jwt-decode'
import { useCart } from '@/app/_context/CartContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()

  // 添加判断当前路径是否匹配的函数
  const isActive = (path) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const {
    member,
    isLoggedIn,
    isLoading,
    login,
    logout,
    googleLogin,
    updateMember,
    avatarSrc,
    token,
  } = useAuth()

  /* ---------------------- State ---------------------- */
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const [isCartOpen, setIsCartOpen] = useState(false)
  // const cartItems = [] // 這裡可接
  // const [cartItems, setCartItems] = useState([])
  const { cartItems } = useCart()

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
    showToast('secondary', '您已登出！謝謝光臨！')
    router.push('/')
  }

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const handleSubmitLogin = async (formData) => {
    try {
      // 1. 呼叫後端登入 API（使用 NEXT_PUBLIC_API_URL）
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      )

      // 2. 解析回傳
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.message || `登入失敗：HTTP ${res.status}`)
      }

      const { user, token } = json.data

      // 3. 呼叫 login 更新全局狀態
      login(user, token)

      // 4. 解碼 token 獲取角色
      const decoded = jwtDecode(token)
      const role = decoded.role

      // 5. 根據角色導向不同頁面
      let redirectPath = '/member/center'
      if (role === 'admin') {
        redirectPath = '/admin/dashboard'
      }

      // 6. UI 處理：關 Modal、Toast、轉頁
      setIsLoginModalOpen(false)
      showToast('success', '登入成功 🎉')
      router.push(redirectPath)
    } catch (err) {
      console.error('登入錯誤：', err)
      showToast('danger', `登入失敗：${err.message || '未知錯誤'}`)
    }
  }

  const handleNavigateToMemberCenter = () => {
    router.push('/member/center')
  }

  const handleChatClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    setIsChatOpen(!isChatOpen)
  }
  // useEffect(() => {
  //   const saved = localStorage.getItem('cartItems')
  //   if (saved) setCartItems(JSON.parse(saved))
  // }, [])

  //管理區不需要選單列
  if (pathname.includes('/admin')) {
    return <></>
  }

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="nav-container">
          {/* Logo */}
          <Link href="/" className="logo-container logo" onClick={closeMenu}>
            <Image
              src="/img/logo-navbar/logo-navbar-light-1.svg"
              alt="國立故瓷博物館"
              className="large-logo"
              width={200}
              height={50}
            />
            <Image
              src="/img/ncmLogo/logo-ncm.png"
              alt="國立故瓷博物館"
              className="small-logo"
              width={40}
              height={40}
            />
          </Link>

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
          <div className="nav-menu desktop-menu">
            <Link href="/" className={isActive('/') ? 'active' : ''}>首頁</Link>
            <Link href="/exhibitions" className={isActive('/exhibitions') ? 'active' : ''} onClick={closeMenu}>
              展覽
            </Link>
            <Link href="/course" className={isActive('/course') ? 'active' : ''} onClick={closeMenu}>
              課程
            </Link>
            <Link
              href="/products"
              className={isActive('/products') ? 'active' : ''}
              onClick={closeMenu}
            >
              故瓷電商
            </Link>

            {/* Right cluster */}
            <div className="nav-right">
              {/* 客服 */}
              {isLoggedIn && (
              <a href="#" className="nav-icon"  onClick={handleChatClick}>
                <FaCommentDots className="icon" />
              </a>
              )}
              {/* 購物車 */}
              {/* <a href="/cart" className="nav-icon">
                <FaShoppingCart className="icon cart-icon" />
                <span className="cart-count">0</span>
              </a> */}
              {/* 購物車 */}
              {/* 登入後才顯示購物車 */}
              {isLoggedIn && (
                <div
                  className="nav-icon"
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                  style={{
                    position: 'relative',
                    width: 'fit-content',
                    height: 'fit-content',
                  }}
                >
                  <Link href="/cart">
                    <FaShoppingCart className="icon cart-icon" />
                  </Link>

                  {cartItems.length > 0 && (
                    <span className="cart-count">
                      {cartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </span>
                  )}

                  {isCartOpen && (
                    <div className="cart-dropdown-container">
                      <CartDropdown cartItems={cartItems} />
                    </div>
                  )}
                </div>
              )}

              {/* 個人檔案 */}
              {!isLoading &&
                (isLoggedIn ? (
                  <div className="user-greeting">
                    {/* 使用者頭像 */}
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      width={20}
                      height={20}
                      className="user-profile-avatar"
                      style={{ objectFit: 'cover', borderRadius: '50%' }}
                    />
                    <div className="user-dropdown">
                      <div className="user-profile-header">
                        <img
                          src={avatarSrc}
                          alt="avatar"
                          width={60}
                          height={60}
                          className="user-profile-avatar"
                          style={{ objectFit: 'cover', borderRadius: '50%' }}
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
                        href="/member/center?tab=profile"
                        className="user-dropdown-item"
                        onClick={handleNavigateToMemberCenter}
                      >
                        <FaUser className="icon" /> 個人檔案
                      </a>
                      {/* <a
                        href="#"
                        className="user-dropdown-item"
                        onClick={handleChatClick}
                      >
                        <span className="notification-dot">12</span>
                        <FaCommentDots className="icon" /> 我的訊息
                      </a> */}
                      <a
                        href="/member/center?tab=coupons"
                        className="user-dropdown-item"
                      >
                        <FaTicketAlt className="icon" /> 我的優惠券
                      </a>

                      <a
                        href="/member/center?tab=orders"
                        className="user-dropdown-item"
                      >
                        <FaHistory className="icon" /> 我的訂單
                      </a>
                      <a
                        href="/member/center?tab=favorites"
                        className="user-dropdown-item"
                      >
                        <FaBookmark className="icon" /> 我的收藏
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
                    {/* <FaUserCircle className="icon" /> 登入 */}
                    登入
                  </button>
                ))}
            </div>
          </div>
        </nav>

        {/* Mobile nav (side‑drawer) ----------------------------------------------------- */}
        <aside className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
          <nav className="nav-menu">
            <Link href="/exhibitions" className={isActive('/exhibitions') ? 'active' : ''} onClick={closeMenu}>
              展覽
            </Link>
            <Link href="/course" className={isActive('/course') ? 'active' : ''} onClick={closeMenu}>
              課程
            </Link>
            <Link href="/products" className={isActive('/products') ? 'active' : ''} onClick={closeMenu}>
              故瓷電商
            </Link>
          </nav>

          {/* 新增：購物車與聊天室 */}
          <div className="mobile-profile">
            {!isLoading &&
              (isLoggedIn ? (
                <>
                  <button
                    className="mobile-profile-header"
                    onClick={handleNavigateToMemberCenter}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleNavigateToMemberCenter() }}
                    style={{ background: 'none', border: 'none', width: '100%', padding: 0 }}
                  >
                    <img
                      src={member?.avatar || '/img/ncmLogo/logo-ncm.png'}
                      alt="avatar"
                      width={60}
                      height={60}
                      className="mobile-profile-avatar"
                      style={{ objectFit: 'cover', borderRadius: '50%' }}
                    />
                    <div className="mobile-profile-info">
                      <div className="mobile-profile-name">
                        {member?.name || '未設定姓名'}
                      </div>
                      <div className="mobile-profile-email">
                        {member?.email}
                      </div>
                    </div>
                  </button>
                  <div className="mobile-nav-actions">
                    {isLoggedIn && (
                      <Link href="/cart" className="mobile-nav-icon" onClick={closeMenu}>
                        <FaShoppingCart className="icon" />
                        {cartItems.length > 0 && (
                          <span className="cart-count">
                            {cartItems.reduce((total, item) => total + item.quantity, 0)}
                          </span>
                        )}
                        {/* <span className="mobile-nav-label style={{ color: '#7b2d12' }}>購物車</span> */}
                      </Link>
                    )}
                    <span className="mobile-nav-divider" />
                    {isLoggedIn && (
                      <button
                        className="mobile-nav-icon"
                        onClick={() => {
                          setIsChatOpen(true)
                          closeMenu()
                        }}
                      >
                        <FaCommentDots className="icon" style={{ color: '#7b2d12' }} />
                        {/* <span className="mobile-nav-label" style={{ color: '#7b2d12' }}>客服中心</span> */}
                      </button>
                    )}
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
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') closeMenu() }}
      />

      {/* Login Modal */}
      <AuthModal
        show={isLoginModalOpen}
        onHide={handleCloseLoginModal}
        onSubmit={handleSubmitLogin}
      />

      {/* 聊天室側邊欄 */}
      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        receiverId={
          member?.role === 'member'
            ? 93
            : member?.role === 'staff'
              ? 92
              : member?.role === 'admin'
                ? 92
                : undefined
        }
        isStaff={member?.role === 'staff' || member?.role === 'admin'}
      />
    </>
  )
}
