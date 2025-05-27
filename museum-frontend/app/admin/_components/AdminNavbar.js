// app/_components/AdminNavbar.js
'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function AdminNavbar({ name = '管理員', pageTitle = '首頁' }) {
  const pathname = usePathname()
  const routes = {
    '/admin/coupon_upload': '優惠券管理',
    '/admin/exhibition_upload': '展覽管理',
    // 你可以依照需要補更多 path 與標題對應
  }

  const dynamicTitle = routes[pathname] || pageTitle

  return (
    <nav className="navbar navbar-main navbar-expand-lg mx-5 px-3 shadow-none rounded" id="navbarBlur" navbar-scroll="true">
      <div className="container-fluid py-1 px-2">
        <div className="d-flex align-items-center justify-content-between w-100" style={{ minHeight: '60px' }}>
          {/* 麵包屑 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-1 pb-0 pt-1 px-0 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm">
                  <a className="opacity-5 text-dark" href="#">『國立故瓷博物館』後台系統</a>
                </li>
                <li className="breadcrumb-item text-sm text-dark active" aria-current="page">{dynamicTitle}</li>
              </ol>
            </nav>
          </div>

          {/* 中間 GIF */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <Image src="/admin-logo-img/ncm3.gif" alt="小磁怪們" width={300} height={50} className="navbar-gif" />
          </div>

          {/* 右側使用者歡迎詞 */}
          <div style={{ flex: 1, textAlign: 'right' }}>
            <span className="user-welcome d-inline-flex align-items-center">
              <Image src="/admin-logo-img/avatar2.jpg" alt="User Avatar" width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover', margin: '0 8px 0 4px' }} />
              {name}
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .navbar-gif {
          transition: transform 0.3s ease;
        }
        .navbar-gif:hover {
          transform: scale(1.1);
        }
      `}</style>
    </nav>
  )
}
