'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaUserFriends,
  FaShoppingBasket,
  FaPalette,
  FaTags,
  FaGraduationCap,
  FaSignOutAlt,
  FaMapPin,
  FaBook,
} from 'react-icons/fa'
import Image from 'next/image'
import styles from '../_styles/AdminNavbar.module.scss'

export default function ResponsiveSidebar({ children }) {
  const [isOpen, setIsOpen] = useState(undefined)

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1200)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [isOpenSub, setIsOpenSub] = useState({})

  const sidebarItems = [
    {
      href: '/admin/coupon_upload',
      icon: <FaUserFriends />,
      label: '會員管理',
      children: [
        { href: '/admin/member', label: '會員列表' },
        { href: '/admin/frozen', label: '凍結帳號' },
      ],
    },
    {
      href: '/admin/exhibition_upload',
      icon: <FaShoppingBasket />,
      label: '商品管理',
      children: [
        { href: '/admin/member', label: '商品列表' },
        { href: '/admin/frozen', label: '新增商品' },
        { href: '/admin/frozen', label: '已刪除商品' },
      ],
    },
    {
      href: '/admin/member',
      icon: <FaGraduationCap />,
      label: '師資管理',
      children: [
        { href: '/admin/member', label: '師資列表' },
        { href: '/admin/frozen', label: '新增師資' },
        { href: '/admin/frozen', label: '停權師資' },
      ],
    },
    {
      href: '/admin/exhibition_upload',
      icon: <FaPalette />,
      label: '展覽管理',
      children: [
        { href: '/admin/exhibition_upload', label: '展覽列表' },
        { href: '/admin/exhibition_upload/create', label: '新增展覽' },
      ],
    },
    {
      href: '/admin/course',
      icon: <FaMapPin />,
      label: '場地管理',
      children: [
        { href: '/admin/member', label: '場地列表' },
        { href: '/admin/frozen', label: '新增場地' },
        { href: '/admin/frozen', label: '預約清單' },
      ],
    },
    {
      href: '/admin/coupon_upload',
      icon: <FaTags />,
      label: '優惠券管理',
      children: [{ href: '/admin/coupon_upload', label: '優惠券列表' }],
    },
    {
      href: '/admin/venue',
      icon: <FaBook />,
      label: '課程管理',
      children: [
        { href: '/admin/member', label: '課程列表' },
        { href: '/admin/frozen', label: '新增課程' },
      ],
    },
  ]

  if (typeof isOpen === 'undefined') return null

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`sidebar text-white p-3 d-flex flex-column justify-content-between align-items-center ${
          isOpen ? 'sidebar-open' : 'sidebar-collapsed'
        }`}
        style={{
          position: 'fixed',
          width: isOpen ? '250px' : '60px',
          height: '800px',
          top: 20,
          left: 20,
          zIndex: 333,
          transition: 'width 0.3s ease',
          borderRadius: '18px',
          backgroundColor: '#2D2D2D',
        }}
      >
        <div className="w-100">
          <div className="d-flex justify-content-center align-items-center mb-4 w-100">
            <Image
              src={
                isOpen
                  ? '/admin-logo-img/logo10.png'
                  : '/admin-logo-img/head-icon.png'
              }
              alt="Logo"
              width={isOpen ? 180 : 40}
              height={isOpen ? 180 : 40}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '8px',
                marginLeft: '4px',
                transition: 'all 0.3s ease',
              }}
            />
          </div>
          <hr />

          <nav className="nav d-flex flex-column w-100 mt-4">
            {sidebarItems.map((item, index) => (
              <div key={index}>
                {item.children ? (
                  <>
                    {/* Dropdown Toggle */}
                    <div
                      className={`nav-link ${styles.customNavlink} text-white d-flex ms-2 text-decoration-none`}
                      onClick={() =>
                        setIsOpenSub((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }))
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`${styles.iconWrapper} `}>
                        {item.icon}
                      </div>
                      {isOpen && <span className="ms-2">{item.label}</span>}
                    </div>

                    {/* Dropdown Children */}
                    {isOpenSub[index] && (
                      <div className="ms-1">
                        {item.children.map((sub, subIndex) => (
                          <Link
                            key={subIndex}
                            href={sub.href}
                            className={`nav-link ${styles.customNavlink} text-white d-flex align-items-center text-decoration-none`}
                          >
                            {isOpen && (
                              <span className="ms-4">{sub.label}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`nav-link ${styles.customNavlink} text-white d-flex align-items-center justify-content-start`}
                  >
                    <div className={`${styles.iconWrapper} me-1`}>
                      {item.icon}
                    </div>
                    {isOpen && <span className="ms-2">{item.label}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto w-100 text-center">
          <Link
            href="/logout"
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
          >
            <FaSignOutAlt /> {isOpen && <span className="ms-2">登出</span>}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isOpen ? 180 : 10,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {children}
      </main>
    </div>
  )
}
