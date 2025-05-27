'use client'

import Sidebar from './sidebar/Sidebar.jsx'
import AdminNavbar from './_components/AdminNavbar'

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex">
      {/* 左側 Aside */}
      {/* <Sidebar /> */}

      {/* 主內容區塊 */}
      <div className="flex-grow-1">
        {/* Navbar */}
        <AdminNavbar name="測試管理員" />

        {/* Page 內容 */}
        <main className="p-4">{children}</main>

        {/* Footer */}
        <footer className="text-center py-3 text-muted small">
          &copy; 2025 NCM 後台管理系統
        </footer>
      </div>
    </div>
  )
}
