'use client'

import { useEffect, useState } from 'react'
import AdminNavbar from './_components/AdminNavbar'
import AdminSidebar from './_components/AdminSidebar.js'
import { ToastProvider } from '../_components/ToastManager'

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
          <footer className="text-center py-3 text-muted small">
            &copy; 2025 NCM 後台管理系統
          </footer>
        </div>
      </div>
    </ToastProvider>
  )
}
