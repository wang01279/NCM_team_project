'use client'

import { useEffect, useState } from 'react'
import AdminNavbar from './_components/AdminNavbar'
import AdminSidebar from './_components/AdminSidebar.js'
import { ToastProvider } from '../_components/ToastManager'
import Image from 'next/image'

export default function AdminLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 1200)
    }

    handleResize() // 初始判斷一次
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ToastProvider>
      <div className="d-flex">
        {/* 左側 Sidebar（寬度夠才顯示） */}
        {showSidebar && <AdminSidebar />}

        {/* 主內容區塊 */}
        <div className="flex-grow-1">
          <AdminNavbar name="測試管理員" />
          <main className="px-4">{children}</main>
          <footer className="d-flex justify-content-center flex-column align-items-center  text-center py-3 text-muted small">
            <Image
              src="/admin-logo-img/logo-nav1.png"
              alt="展覽主視覺"
              width={390}
              height={100}
              className=" object-fit-cover"
              style={{ height: 'auto' }}  // 可用於保持比例
            />
            <div>
             <h6>Copyright &copy; 2025 <span style={{ color: '#7B2D12'}}>國立故瓷博物館</span>by 萬磁王與小磁怪們</h6> 
            </div>
            
          </footer>
        </div>
      </div>
    </ToastProvider>
  )
}
