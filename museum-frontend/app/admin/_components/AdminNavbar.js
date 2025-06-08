'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from '../_styles/AdminNavbar.module.scss'
import { MdOutlineMuseum } from "react-icons/md";

export default function AdminNavbar({ name = '管理員', pageTitle = '首頁' }) {
  const pathname = usePathname()
  const routes = {
    '/admin/coupon_upload': '優惠券管理',
    '/admin/exhibition_upload': '展覽管理',
    // 其他路由...
  }

  const dynamicTitle = routes[pathname] || pageTitle

  return (
    <nav
      className="navbar navbar-expand-lg mx-3 px-3 shadow-none rounded position-relative"
      id="navbarBlur"
      navbar-scroll="true"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="container-fluid py-2 px-2 ms-3">
        <div className="row w-100 align-items-center text-nowrap gx-3">
          {/* 左邊：麵包屑 */}
          <div className="col-12 col-md-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-1 pb-0 pt-1 px-0">
                <li className="breadcrumb-item text-sm">
                  <a className="opacity-5 text-dark" href="#">
                    『國立故瓷博物館』後台系統
                  </a>
                </li>
                <li className="breadcrumb-item text-sm text-dark active" aria-current="page">
                  {dynamicTitle}
                </li>
              </ol>
            </nav>
          </div>

          {/* 中間：GIF */}
          <div className="col-12 col-md-4 text-center my-2 my-md-0">
            <Image
              src="/admin-logo-img/ncm3.gif"
              alt="小磁怪們"
              width={400}
              height={100}
              className={`img-fluid navbar-gif ${styles.hoverGrow}`}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          {/* 右邊：使用者歡迎詞 */}
          <div className="col-12 col-md-4 d-flex justify-content-end align-items-center text-end">
            {/* <button className='btn btn-info d-flex align-items-center'> <MdOutlineMuseum className='fs-5 me-2'/> 返回前台網站</button> */}
            <span className="d-flex align-items-center">
              <Image
                src="/admin-logo-img/avatar2.jpg"
                alt="User Avatar"
                width={32}
                height={32}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '8px',
                  marginLeft: '4px',
                }}
              />
              <h6>admin</h6>
            </span>
          </div>
        </div>
      </div>

      {/* 動畫樣式 */}
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
