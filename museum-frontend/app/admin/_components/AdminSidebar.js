'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState('')

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? '' : menu)
  }

  const navItems = [
    {
      label: '會員管理',
      key: 'member',
      items: [
        { label: '展覽列表', href: '/admin/member' },
        { label: '新增展覽', href: '/admin/member/create' },
      ],
    },
    {
      label: '商品管理',
      key: 'product',
      items: [
        { label: '商品列表', href: '/admin/product' },
        { label: '新增商品', href: '/admin/product/create' },
        { label: '已刪除商品', href: '/admin/product/create' },
      ],
    },
    {
      label: '展覽管理',
      key: 'exhibition',
      items: [
        { label: '展覽列表', href: '/admin/exhibition' },
        { label: '新增展覽', href: '/admin/exhibition/create' },
      ],
    },
    {
      label: '場地管理',
      key: 'venue',
      items: [
        { label: '展覽列表', href: '/admin/exhibition' },
        { label: '新增展覽', href: '/admin/exhibition/create' },
      ],
    },
    {
      label: '優惠券管理',
      key: 'coupon',
      items: [{ label: '優惠券列表', href: '/admin/coupon' }],
    },
    {
      label: '課程管理',
      key: 'course',
      items: [
        { label: '課程列表', href: '/admin/course' },
        { label: '新增課程', href: '/admin/course/create' },
      ],
    },
  ]

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r shadow-sm z-50">
      <div class="p-3 border-bottom text-center">
        <img
          src="/admin-logo-img/logo10.png"
          alt="logo"
          className="img-fluid"
          style={{ maxWidth: '120px', height: 'auto' }}
        />
      </div>

      <nav className="px-4 pt-4">
        {navItems.map((menu) => (
          <div key={menu.key} className="mb-3">
            <button
              className="flex items-center w-full text-left text-lg font-medium py-2 px-2 hover:bg-gray-100 rounded"
              onClick={() => toggleMenu(menu.key)}
            >
              <span className="mr-2">{menu.icon}</span>
              {menu.label}
            </button>
            {openMenu === menu.key && (
              <ul className="pl-6">
                {menu.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        ('block py-1 text-sm hover:text-blue-600',
                        pathname === item.href && 'font-bold text-blue-600')
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
