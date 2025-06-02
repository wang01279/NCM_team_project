'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  FaUserFriends, FaShoppingBasket, FaPalette, FaTags,
  FaGraduationCap, FaSignOutAlt, FaMapPin, FaBook
} from 'react-icons/fa'
import { MdOutlineMuseum } from 'react-icons/md'
import styles from '../_styles/AdminNavbar.module.scss'

export default function AdminSidebar({ children }) {
  const [openSubmenu, setOpenSubmenu] = useState({})
  const pathname = usePathname()

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
      label: '優惠管理',
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

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar text-white p-3 d-flex flex-column justify-content-center align-items-center"
        style={{
          position: 'fixed',
          width: '250px',
          height: '95%',
          top: 20,
          left: 20,
          zIndex: 333,
          transition: 'width 0.3s ease',
          borderRadius: '18px',
          backgroundColor: '#2D2D2D',
        }}
      >
        {/* Logo + 返回 */}
        <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-4">
          <Image
            src="/admin-logo-img/logo10.png"
            alt="Logo"
            width={180}
            height={180}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              transition: 'all 0.3s ease',
            }}
          />
          <Link href="/">
            <button
              className="btn btn-info d-flex align-items-center justify-content-center mt-2"
              style={{
                width: '180px',
                transition: 'width 0.3s ease',
              }}
              title="返回前台網站"
            >
              <MdOutlineMuseum className="fs-5 me-2" />
              <span>返回前台網站</span>
            </button>
          </Link>
        </div>

        <hr />

        {/* 選單區塊 */}
        <nav className="nav d-flex flex-column justify-content-center w-100 mt-4">
          {sidebarItems.map((item, index) => (
            <div key={index}>
              {/* Dropdown Toggle */}
              <div
                className={`nav-link ${styles.customNavlink} text-white d-flex align-items-center justify-content-center text-decoration-none`}
                onClick={() =>
                  setOpenSubmenu(prev => ({
                    ...prev,
                    [index]: !prev[index],
                  }))
                }
                style={{ cursor: 'pointer' }}
                title={item.label}
              >
                <div className={styles.iconWrapper}>{item.icon}</div>
                <span className="pt-2 ms-2">{item.label}</span>
              </div>

              {/* Dropdown Items */}
              {openSubmenu[index] && (
                <div className="d-flex flex-column justify-content-center align-items-start ps-3">
                  {item.children.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      href={sub.href}
                      className={`nav-link ${styles.customNavlink} text-white d-flex align-items-center text-decoration-none ${pathname === sub.href ? styles.active : ''}`}
                    >
                      <span className="ms-4">{sub.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 登出按鈕 */}
        <div className="mt-auto w-100 text-center">
          <Link
            href="/logout"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center text-decoration-none"
            title="登出"
          >
            <FaSignOutAlt />
            <span className="ms-2">登出</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main
        className="flex-grow-1 p-4"
        style={{
          marginLeft: 180,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {children}
      </main>
    </div>
  )
}
