'use client'

import AdminNavbar from './_components/AdminNavbar'
import AdminSidebar from './_components/AdminSidebar.js'
import { ToastProvider } from '../_components/ToastManager'


export default function AdminLayout({ children }) {
  return (
    <ToastProvider>
      <div className="d-flex">
        {/* 左側 Aside */}
        <AdminSidebar />

        {/* 主內容區塊 */}
        <div className="flex-grow-1">
          {/* Navbar */}
          <AdminNavbar name="測試管理員" />

          {/* Page 內容 */}
          <main className="px-4">{children}</main>

          {/* Footer */}
          <footer className="text-center py-3 text-muted small">
            &copy; 2025 NCM 後台管理系統
          </footer>
        </div>
      </div>
    </ToastProvider>
  )
}
