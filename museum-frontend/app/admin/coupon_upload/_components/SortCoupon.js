'use client'
import React, { useState } from 'react'

export default function SortCoupon({ onFilterChange }) {
  const today = new Date().toISOString().split('T')[0]

  const [filters, setFilters] = useState({
    category: '全部',
    discountType: '',
    status: 'all',
    startDate:'',
    endDate: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    if (onFilterChange) onFilterChange(newFilters)
  }

  return (
    <form>
      <div className="d-flex flex-row">
        {/* 適用範圍 */}
        <div className="col-md-5 col-12">
          <label className="form-label h6">適用範圍</label>
          <div className="d-flex flex-wrap">
            {['全部', '商品', '課程'].map((item) => (
              <div className="form-check me-2" key={item}>
                <input
                  className="form-check-input p-1"
                  type="radio"
                  name="category"
                  value={item}
                  checked={filters.category === item}
                  onChange={handleChange}
                />
                <label className="form-check-label fs-6">{item}</label>
              </div>
            ))}
          </div>
        </div>

        {/* 折扣類型 */}
        <div className="col-md-5 col-12">
          <label className="form-label h6">折扣類型</label>
          <div className="d-flex flex-wrap">
            {[
              { label: '全部', value: '' },
              { label: '百分比', value: '百分比' },
              { label: '現金', value: '現金' },
            ].map(({ label, value }) => (
              <div className="form-check me-1" key={value || '全部'}>
                <input
                  className="form-check-input p-1"
                  type="radio"
                  name="discountType"
                  value={value}
                  checked={filters.discountType === value}
                  onChange={handleChange}
                />
                <label className="form-check-label fs-6">{label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* 狀態 */}
        <div className="col-md-4 col-12">
          <label className="form-label h6">優惠券狀態</label>
          <div className="d-flex flex-wrap">
            {['all', '啟用', '停用'].map((status) => (
              <div className="form-check me-2" key={status}>
                <input
                  className="form-check-input p-1"
                  type="radio"
                  name="status"
                  value={status}
                  checked={filters.status === status}
                  onChange={handleChange}
                />
                <label className="form-check-label fs-6">
                  {status === 'all' ? '全部' : status}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 有效日期範圍
        <div className="col-md-5 col-12">
          <label className="form-label h6">有效日期範圍</label>
          <div className="row align-items-center">
            <div className="col-5">
              <input
                type="date"
                className="form-control"
                name="startDate"
                onChange={handleChange}
                value={filters.startDate}
              />
            </div>
            <div className="col-1 text-center">至</div>
            <div className="col-6">
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                min={filters.startDate}
              />
            </div>
          </div>
        </div> */}
      </div>
    </form>
  )
}
