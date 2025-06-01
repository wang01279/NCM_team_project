'use client'
import React, { useState } from 'react'
import CouponTable from './_components/CouponTable'
import DataFetcher from '@/app/_components/DataFetcher'
import CreateModal from './_components/CreateModal'
import { FaTicketAlt, FaPlus } from 'react-icons/fa'
import SortCoupon from './_components/SortCoupon'
import { useToast } from '@/app/_components/ToastManager'

export default function CouponAdminPage() {
  const baseUrl = 'http://localhost:3005/api/couponUploads'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)
  const perPage = 10

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleSuccess = () => {
    setPage(1) // 🔁 回到第 1 頁
    setRefreshKey((prev) => prev + 1) // 🔁 強制重新 fetch
    setIsModalOpen(false) // ✅ 關閉 modal
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1) // 重新篩選時從第 1 頁開始
    setRefreshKey((prev) => prev + 1)
  }
    const { showToast } = useToast()

  // 將篩選條件與分頁資訊轉成查詢字串
  const query = new URLSearchParams({
    ...filters,
    page,
    perPage,
  }).toString()

  const url = `${baseUrl}?${query}`

  return (
    <>
      <div className="container-fluid px-5">
        <div className="card-header border-bottom pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold mb-3 d-flex align-items-center">
              <FaTicketAlt className="me-2" /> 優惠券列表
            </h4>
          </div>
        </div>

        <DataFetcher url={url} key={refreshKey}>
          {(data) => (
            <>
              <div className="pt-3 d-flex justify-content-between align-items-center">
                <SortCoupon />
                {data.total !== undefined && (
                  <div className="text-start m-1 p-0">共 {data.total} 筆</div>
                )}
              </div>
              <div className="d-flex flex-row justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center mb-2"
                  onClick={handleOpenModal}
                >
                  <FaPlus className="me-2" /> 新增優惠券
                </button>
              </div>
              <CouponTable coupons={data.items || []} />
              {/* 分頁按鈕 */}
              <div className="d-flex justify-content-center my-3">
                {Array.from({ length: data.totalPages || 1 }).map((_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm mx-1 ${page === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </DataFetcher>
      </div>

      {isModalOpen && (
        <CreateModal onClose={handleCloseModal} onSuccess={handleSuccess} />
      )}
    </>
  )
}
