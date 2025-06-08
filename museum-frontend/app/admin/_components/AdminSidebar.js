'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  FaUserFriends, FaShoppingBasket, FaPalette, FaTags,
  FaGraduationCap, FaSignOutAlt, FaMapPin, FaBook
} from 'react-icons/fa'
import styles from '../_styles/AdminNavbar.module.scss'

export default function AdminSidebar({ children }) {
  const [openSubmenu, setOpenSubmenu] = useState({})
  const pathname = usePathname()

  const sidebarItems = [
    {
      href: '/admin/member_upload',
      icon: <FaUserFriends />,
      label: '會員管理',
      children: [
        { href: '/admin/member', label: '會員列表' },
        { href: '/admin/frozen', label: '凍結帳號' },
      ],
    },
    {
      href: '/admin/product_upload',
      icon: <FaShoppingBasket />,
      label: '商品管理',
      children: [
        { href: '/admin/product', label: '商品列表' },
        { href: '/admin/product/create', label: '新增商品' },
        { href: '/admin/product/frozen', label: '已刪除商品' },
      ],
    },
    {
      href: '/admin/teacher_upload',
      icon: <FaGraduationCap />,
      label: '師資管理',
      children: [
        { href: '/admin/teacher_upload', label: '師資列表' },
        { href: '/admin/teacher_upload', label: '新增師資' },
        { href: '/admin/teacher_upload', label: '停權師資' },
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
        { href: '/admin/course', label: '場地列表' },
        { href: '/admin/course', label: '新增場地' },
        { href: '/admin/course', label: '預約清單' },
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
        { href: '/admin/venue', label: '課程列表' },
        { href: '/admin/venue', label: '新增課程' },
      ],
    },
  ]

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar text-white p-3 d-flex flex-column align-items-center"
        style={{
          position: 'fixed',
          width: '250px',
          height: '95vh',
          top: 20,
          left: 20,
          zIndex: 333,
          transition: 'width 0.3s ease',
          borderRadius: '18px',
          backgroundColor: '#2D2D2D',
          overflowY: 'auto'
        }}
      >

        <div className=' flex-grow-1'>
          {/* Logo*/}
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
          </div>
          {/* 選單區塊 */}
          <nav className="nav d-flex flex-column justify-content-center w-100">
            {sidebarItems.map((item, index) => (
              <div key={index}>
                {/* Dropdown Toggle */}
                <div
                  className={`nav-link ${styles.customNavlink} text-white d-flex align-items-center justify-content-center text-decoration-none`}
                  onClick={() =>
                    setOpenSubmenu((prev) => ({
                      ...prev,
                      [item.label]: !prev[item.label],
                    }))
                  }
                  style={{ cursor: 'pointer', marginTop: "5px" }}
                  title={item.label}
                >
                  <div className={styles.iconWrapper}>{item.icon}</div>
                  <span>{item.label}</span>
                </div>

                {/* Dropdown Items */}
                {openSubmenu[item.label] && (
                  <div >
                    {item.children.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className={` ${styles.customNavlinkSub} nav-link text-white d-flex justify-content-center align-items-center text-decoration-none ${pathname === sub.href ? styles.active : ''}`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className='d-flex justify-content-center align-items-center flex-column '>

          <Link href="/">
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center text-decoration-none"
              style={{
                width: '180px',
              }}
              title="登出"
            >
              <FaSignOutAlt />
              <span className="ms-2">登出</span>
            </button>
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
