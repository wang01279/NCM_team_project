'use client'
import React, { useState, useEffect } from 'react'
import { FaFilter, FaSearch } from 'react-icons/fa'
import '../_styles/productFilter.scss'

export default function ProductFilter({ filters, setFilters }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showSection, setShowSection] = useState({
    material: true,
    origin: true,
    function: true,
  })

  const openFilterPanel = () => setIsFilterOpen(true)
  const closeFilterPanel = () => setIsFilterOpen(false)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const toggleFilter = (type, value) => {
    const updated = filters[type].includes(value)
      ? filters[type].filter((v) => v !== value)
      : [...filters[type], value]
    handleFilterChange({ ...filters, [type]: updated })
  }

  const handleMinPriceChange = (e) => {
    handleFilterChange({ ...filters, minPrice: Number(e.target.value) })
  }

  const handleMaxPriceChange = (e) => {
    handleFilterChange({ ...filters, maxPrice: Number(e.target.value) })
  }

  const handleSearch = (e) => {
    handleFilterChange({ ...filters, search: e.target.value })
  }

  const handleSort = (e) => {
    handleFilterChange({ ...filters, sort: e.target.value })
  }

  const clearFilters = () => {
    handleFilterChange({
      material: [],
      origin: [],
      function: [],
      minPrice: 0,
      maxPrice: 100000,
      search: '',
      sort: '',
    })
  }

  const rangePercent = () => {
    const min = Math.min(filters.minPrice, filters.maxPrice)
    const max = Math.max(filters.minPrice, filters.maxPrice)
    const minPct = (min / 100000) * 100
    const maxPct = (max / 100000) * 100
    return { left: `${minPct}%`, width: `${maxPct - minPct}%` }
  }

  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isFilterOpen])

  return (
    <div className="container py-2">
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-3">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="搜尋商品..."
              value={filters.search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="col-12 col-md-3">
          <select
            className="form-select"
            value={filters.sort}
            onChange={handleSort}
          >
            <option value="">排序</option>
            <option value="price-asc">價格低到高</option>
            <option value="price-desc">價格高到低</option>
            <option value="newest">最新上架</option>
          </select>
        </div>
        <div className="col-12 col-md-3">
          <button
            className="btn-add btn btn-primary p-3"
            onClick={openFilterPanel}
          >
            <FaFilter className="me-2 " /> 篩選
          </button>
        </div>
      </div>

      <div className={`filter-panel ${isFilterOpen ? 'show' : ''}`}>
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          aria-label="Close"
          onClick={closeFilterPanel}
        ></button>
        <h5 className="mb-3">篩選條件</h5>

        <div className="mb-4">
          <label className="form-label">價格範圍</label>
          <div className="d-flex gap-2 align-items-center mb-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={handleMinPriceChange}
              className="form-control"
            />
            <span>~</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={handleMaxPriceChange}
              className="form-control"
            />
          </div>
          <div className="range-container">
            <div className="range-track"></div>
            <div className="range-selected" style={rangePercent()}></div>
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={filters.minPrice}
              onChange={handleMinPriceChange}
            />
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={filters.maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
          <div className="text-center mt-2">
            價格：NT${Math.min(filters.minPrice, filters.maxPrice)} ~ NT$
            {Math.max(filters.minPrice, filters.maxPrice)}
          </div>
        </div>

        {['material', 'origin', 'function'].map((type) => (
          <div className="mb-4" key={type}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label mb-0">
                {type === 'material'
                  ? '材質'
                  : type === 'origin'
                    ? '生產地'
                    : '功能'}
              </label>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() =>
                  setShowSection({ ...showSection, [type]: !showSection[type] })
                }
              >
                {showSection[type] ? '-' : '+'}
              </button>
            </div>
            {showSection[type] && (
              <div className="filter-button-group">
                {getOptions(type).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`btn btn-outline-primary filter-btn ${filters[type].includes(option.value) ? 'active' : ''}`}
                    onClick={() => toggleFilter(type, option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="d-flex gap-2">
          <button className="btn btn-secondary w-100" onClick={clearFilters}>
            清除篩選
          </button>
        </div>
      </div>

      <div
        className={`overlay ${isFilterOpen ? 'show' : ''}`}
        onClick={closeFilterPanel}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') closeFilterPanel()
        }}
      ></div>
    </div>
  )
}

function getOptions(type) {
  const all = {
    material: [
      { value: '瓷土', label: '瓷土' },
      { value: '骨瓷', label: '骨瓷' },
      { value: '陶瓷', label: '陶瓷' },
      { value: '水晶玻璃', label: '水晶玻璃' },
      { value: '不鏽鋼', label: '不鏽鋼' },
      { value: '青花瓷', label: '青花瓷' },
      { value: '矽膠', label: '矽膠' },
      { value: '天然竹', label: '天然竹' },
      { value: '電子書', label: '電子書' },
      { value: '紙本套', label: '紙本套' },
      { value: 'DVD', label: 'DVD' },
    ],
    origin: [
      { value: '台灣', label: '台灣' },
      { value: '中國', label: '中國' },
      { value: '日本', label: '日本' },
      { value: '韓國', label: '韓國' },
      { value: '歐洲', label: '歐洲' },
    ],
    function: [
      { value: '擺飾', label: '擺飾' },
      { value: '飲用器具', label: '飲用器具' },
      { value: '物品墊', label: '物品墊' },
      { value: '餐具', label: '餐具' },
      { value: '書籍', label: '書籍' },
      { value: '影音光碟', label: '影音光碟' },
      { value: '玩具', label: '玩具' },
      { value: '文具', label: '文具' },
      { value: '個人用品', label: '個人用品' },
    ],
  }
  return all[type] || []
}
