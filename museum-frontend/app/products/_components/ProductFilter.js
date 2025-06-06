'use client'
import React, { useState, useEffect } from 'react'
import {
  FaFilter,
  FaSearch,
  FaMinus,
  FaPlus,
  FaCaretUp,
  FaCaretDown,
} from 'react-icons/fa'
import Select from 'react-select'
import '../_styles/productFilter.scss'

export default function ProductFilter({
  filters,
  setFilters,
  selectedCategory,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState(filters)
  const [showSection, setShowSection] = useState({
    material: true,
    origin: true,
    function: true,
  })

  const openFilterPanel = () => {
    setPreviewCount(0)
    setIsFilterOpen(true)
  }
  const closeFilterPanel = () => setIsFilterOpen(false)

  const applyFilters = () => {
    setFilters(tempFilters)
    closeFilterPanel()
  }

  const handleTempChange = (key, value) => {
    setTempFilters({ ...tempFilters, [key]: value })
  }

  const toggleFilter = (type, value) => {
    const updated = tempFilters[type].includes(value)
      ? tempFilters[type].filter((v) => v !== value)
      : [...tempFilters[type], value]
    handleTempChange(type, updated)
  }

  const clearFilters = () => {
    const cleared = {
      material: [],
      origin: [],
      function: [],
      minPrice: 0,
      maxPrice: 50000,
      search: '',
      sort: '',
    }
    setTempFilters(cleared)
    setFilters(cleared)
  }

  const rangePercent = () => {
    const min = Math.min(tempFilters.minPrice, tempFilters.maxPrice)
    const max = Math.max(tempFilters.minPrice, tempFilters.maxPrice)
    const minPct = (min / 50000) * 100
    const maxPct = (max / 50000) * 100
    return { left: `${minPct}%`, width: `${maxPct - minPct}%` }
  }

  useEffect(() => {
    setTempFilters(filters)
  }, [isFilterOpen, filters])

  const [previewCount, setPreviewCount] = useState(0)

  useEffect(() => {
    if (!isFilterOpen) return

    const hasActiveFilters =
      tempFilters.material.length > 0 ||
      tempFilters.origin.length > 0 ||
      tempFilters.function.length > 0 ||
      tempFilters.search.trim() !== '' ||
      tempFilters.sort !== '' ||
      tempFilters.minPrice !== 0 ||
      tempFilters.maxPrice !== 50000

    if (!hasActiveFilters) {
      setPreviewCount(0) // 沒有篩選條件就顯示 0 筆
      return
    }

    const query = new URLSearchParams()
    if (selectedCategory?.category)
      query.set('category', selectedCategory.category)
    if (selectedCategory?.subcategory)
      query.set('subcategory', selectedCategory.subcategory)
    if (tempFilters.search) query.set('search', tempFilters.search)
    if (tempFilters.sort) query.set('sort', tempFilters.sort)
    if (tempFilters.material.length > 0)
      query.set('material', tempFilters.material.join(','))
    if (tempFilters.origin.length > 0)
      query.set('origin', tempFilters.origin.join(','))
    if (tempFilters.function.length > 0)
      query.set('functions', tempFilters.function.join(','))
    if (tempFilters.minPrice !== 0) query.set('price_min', tempFilters.minPrice)
    if (tempFilters.maxPrice !== 50000)
      query.set('price_max', tempFilters.maxPrice)

    fetch(`http://localhost:3005/api/products/count?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => setPreviewCount(data.total || 0))
      .catch(() => setPreviewCount(0))
  }, [tempFilters, isFilterOpen, selectedCategory])

  useEffect(() => {
    const closeBtn = document.querySelector('.filter-close-btn')
    const handleScroll = () => {
      if (!closeBtn) return
      const scrollTop =
        document.querySelector('.filter-content')?.scrollTop || 0
      if (scrollTop > 10) {
        closeBtn.classList.add('hide')
      } else {
        closeBtn.classList.remove('hide')
      }
    }
    if (isFilterOpen) {
      document.body.classList.add('no-scroll')
      const scrollContainer = document.querySelector('.filter-content')
      scrollContainer?.addEventListener('scroll', handleScroll)
    } else {
      document.body.classList.remove('no-scroll')
    }
    return () => {
      document.body.classList.remove('no-scroll')
      const scrollContainer = document.querySelector('.filter-content')
      scrollContainer?.removeEventListener('scroll', handleScroll)
    }
  }, [isFilterOpen])
  const sortOptions = [
    { value: 'newest', label: '最新上架' },
    { value: 'price_asc', label: '價格低到高' },
    { value: 'price_desc', label: '價格高到低' },
  ]

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
              value={tempFilters.search}
              onChange={(e) => handleTempChange('search', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setFilters({ ...tempFilters, search: e.target.value })
                }
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-3">
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={sortOptions}
            placeholder="請選擇排序方式"
            value={sortOptions.find((o) => o.value === tempFilters.sort)}
            onChange={(selected) => {
              const newValue = selected?.value || ''
              setTempFilters({ ...tempFilters, sort: newValue })
              setFilters({ ...tempFilters, sort: newValue })
            }}
            isClearable
            isSearchable={false}
          />
        </div>
        <div className="col-12 col-md-3">
          <button className="btn-add btn btn-primary" onClick={openFilterPanel}>
            <FaFilter /> 篩選
          </button>
        </div>
      </div>

      <div className={`filter-panel ${isFilterOpen ? 'show' : ''}`}>
        <button
          className="btn-close filter-close-btn"
          aria-label="Close"
          onClick={closeFilterPanel}
        ></button>

        <div className="filter-content">
          <h5 className="mb-3">篩選條件</h5>

          <div className="mb-4">
            <label className="form-label">價格範圍</label>
            <div className="d-flex gap-2 align-items-center mb-2 p-2">
              <input
                type="number"
                value={tempFilters.minPrice}
                onChange={(e) =>
                  handleTempChange('minPrice', Number(e.target.value))
                }
                className="form-control"
              />
              <span>~</span>
              <input
                type="number"
                value={tempFilters.maxPrice}
                onChange={(e) =>
                  handleTempChange('maxPrice', Number(e.target.value))
                }
                className="form-control"
              />
            </div>
            <div className="range-container m-2">
              <div className="range-track"></div>
              <div className="range-selected" style={rangePercent()}></div>
              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={tempFilters.minPrice}
                onChange={(e) =>
                  handleTempChange('minPrice', Number(e.target.value))
                }
              />
              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={tempFilters.maxPrice}
                onChange={(e) =>
                  handleTempChange('maxPrice', Number(e.target.value))
                }
              />
            </div>
            <div className="text-center mt-2">
              價格：NT${Math.min(tempFilters.minPrice, tempFilters.maxPrice)} ~
              NT$
              {Math.max(tempFilters.minPrice, tempFilters.maxPrice)}
            </div>
          </div>

          {['material', 'origin', 'function'].map((type) => (
            <div className="mb-4" key={type}>
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label mb-0">
                  {type === 'material'
                    ? '材質'
                    : type === 'origin'
                      ? '生產地'
                      : '功能'}
                </label>
                <button
                  className="btn  btn-dray"
                  onClick={() =>
                    setShowSection({
                      ...showSection,
                      [type]: !showSection[type],
                    })
                  }
                >
                  {showSection[type] ? (
                    <FaCaretDown className="fs-5" />
                  ) : (
                    <FaCaretUp className="fs-5" />
                  )}
                </button>
              </div>
              {showSection[type] && (
                <div className="filter-button-group">
                  {getOptions(type).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`btn btn-outline-primary filter-btn ${tempFilters[type].includes(option.value) ? 'active' : ''}`}
                      onClick={() => toggleFilter(type, option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="filter-footer d-flex gap-2">
          <button className="btn btn-secondary w-50" onClick={clearFilters}>
            清除篩選
          </button>
          <button className="btn btn-primary w-50" onClick={applyFilters}>
            套用篩選（共 {previewCount} 項結果）
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
      { value: '矽瓷', label: '矽瓷' },
      { value: '花瓷', label: '花瓷' },
      { value: '電子書', label: '電子書' },
      { value: '紙本書', label: '紙本書' },
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
      { value: '個人用具', label: '個人用具' },
    ],
  }
  return all[type] || []
}
