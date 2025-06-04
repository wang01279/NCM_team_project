'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import useFavorites from '@/app/_hooks/useFavorites'
import Navbar from '../_components/navbar'
import Marquee from './_components/Marquee'
import HeroSlider from './_components/HeroSlider'
import CategoryShowcase from './_components/CategoryShowcase'
import CategoryMenu from './_components/CategoryMenu'
import ProductFilter from './_components/ProductFilter'
import ProductCard from '../_components/ProductCard'
import Footer from '../_components/footer3'
import { useToast } from '@/app/_components/ToastManager'
import './_styles/productPage.scss'
import Loader from '@/app/_components/load'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import CouponLink from '../_components/CouponLink'
import { useCart } from '@/app/_context/CartContext'

export default function ProductPage() {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState({
    category: null,
    subcategory: null,
  })
  const [categoryMap, setCategoryMap] = useState({})
  const [subcategoryMap, setSubcategoryMap] = useState({})
  const [categoryNameMap, setCategoryNameMap] = useState({})
  const [subcategoryNameMap, setSubcategoryNameMap] = useState({})
  const searchParams = useSearchParams()
  const { toggleFavorite, isFavorite } = useFavorites('product')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    material: [],
    origin: [],
    function: [],
    minPrice: 0,
    maxPrice: 50000,
    search: '',
    sort: '',
  })
  const [activeFilters, setActiveFilters] = useState([])
  const [hasInitialized, setHasInitialized] = useState(false)

  const labelMap = {
    search: '關鍵字',
    sort: '排序',
    material: '材質',
    origin: '產地',
    function: '功能',
    price: '價格',
    price_asc: '價格低到高',
    price_desc: '價格高到低',
    newest: '最新上架',
  }

  const getDisplayLabel = (type, value) => {
    return `${labelMap[type] || type}：${labelMap[value] || value}`
  }

  const updateFilters = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    const active = []

    if (newFilters.material.length)
      active.push(
        ...newFilters.material.map((m) => ({
          type: 'material',
          label: getDisplayLabel('material', m),
          rawValue: m,
        }))
      )

    if (newFilters.origin.length)
      active.push(
        ...newFilters.origin.map((o) => ({
          type: 'origin',
          label: getDisplayLabel('origin', o),
          rawValue: o,
        }))
      )

    if (newFilters.function.length)
      active.push(
        ...newFilters.function.map((f) => ({
          type: 'function',
          label: getDisplayLabel('function', f),
          rawValue: f,
        }))
      )

    if (newFilters.search)
      active.push({
        type: 'search',
        label: getDisplayLabel('search', newFilters.search),
        rawValue: newFilters.search,
      })

    if (newFilters.sort)
      active.push({
        type: 'sort',
        label: getDisplayLabel('sort', newFilters.sort),
        rawValue: newFilters.sort,
      })

    if (newFilters.minPrice !== 0 || newFilters.maxPrice !== 50000)
      active.push({
        type: 'price',
        label: `價格：${newFilters.minPrice}~${newFilters.maxPrice}`,
      })

    setActiveFilters(active)
  }

  const removeFilterTag = (target) => {
    const updated = { ...filters }
    if (target.type === 'material')
      updated.material = updated.material.filter((m) => m !== target.rawValue)
    if (target.type === 'origin')
      updated.origin = updated.origin.filter((m) => m !== target.rawValue)
    if (target.type === 'function')
      updated.function = updated.function.filter((m) => m !== target.rawValue)
    if (target.type === 'search') updated.search = ''
    if (target.type === 'sort') updated.sort = ''
    if (target.type === 'price') {
      updated.minPrice = 0
      updated.maxPrice = 50000
    }
    updateFilters(updated)
  }

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  useEffect(() => {
    fetch('http://localhost:3005/api/products/categories')
      .then((res) => res.json())
      .then((data) => {
        const cMap = {},
          cNameMap = {},
          sMap = {},
          sNameMap = {}
        data.forEach((cat) => {
          cMap[cat.category_name] = cat.category_id
          cNameMap[cat.category_id] = cat.category_name
          cat.subcategories.forEach((sub) => {
            sMap[sub.name] = sub.id
            sNameMap[sub.id] = sub.name
          })
        })
        setCategoryMap(cMap)
        setSubcategoryMap(sMap)
        setCategoryNameMap(cNameMap)
        setSubcategoryNameMap(sNameMap)
      })
  }, [])

  const handleCategoryClick = ({ category, subcategory }) => {
    const categoryId = category ? categoryMap[category] : null
    const subcategoryId = subcategory ? subcategoryMap[subcategory] : null
    setSelectedCategory({ category: categoryId, subcategory: subcategoryId })
    setCurrentPage(1)

    setTimeout(() => {
      const menuBlock = document.getElementById('category-menu')
      if (menuBlock) {
        const yOffset = -80
        const y =
          menuBlock.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 100)
  }
  useEffect(() => {
    const categoryId = searchParams.get('category')
    const subcategoryId = searchParams.get('subcategory')
    const hash = window.location.hash

    if (categoryId || subcategoryId) {
      setSelectedCategory({
        category: categoryId || null,
        subcategory: subcategoryId || null,
      })

      setTimeout(() => {
        const targetId =
          hash === '#category-menu' ? 'category-menu' : 'product-list'
        const targetEl = document.getElementById(targetId)
        if (targetEl) {
          const yOffset = -80
          const y =
            targetEl.getBoundingClientRect().top + window.scrollY + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100)
    }
  }, [searchParams])

  useEffect(() => {
    if (!loading) {
      const shouldScroll = sessionStorage.getItem('scrollToCategoryMenu')
      if (shouldScroll) {
        sessionStorage.removeItem('scrollToCategoryMenu')
        const el = document.getElementById('category-menu')
        if (el) {
          const yOffset = -80
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }
    }
  }, [loading])

  useEffect(() => {
    const query = new URLSearchParams()
    query.set('page', currentPage)
    if (selectedCategory.category)
      query.set('category', selectedCategory.category)
    if (selectedCategory.subcategory)
      query.set('subcategory', selectedCategory.subcategory)
    if (filters.search) query.set('search', filters.search)
    if (filters.sort) query.set('sort', filters.sort)
    if (filters.material.length > 0)
      query.set('material', filters.material.join(','))
    if (filters.origin.length > 0) query.set('origin', filters.origin.join(','))
    if (filters.function.length > 0)
      query.set('functions', filters.function.join(','))
    if (filters.minPrice !== 0) query.set('price_min', filters.minPrice)
    if (filters.maxPrice !== 50000) query.set('price_max', filters.maxPrice)

    if (!hasInitialized) setLoading(true)
    fetch(`http://localhost:3005/api/products?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setTotalPages(data.totalPages || 1)
        setTotalCount(data.totalCount || 0)
      })
      .catch(() => {
        setProducts([])
        setTotalPages(1)
        setTotalCount(0)
      })
      .finally(() => {
        setHasInitialized(true)
        setLoading(false)
      })
  }, [currentPage, selectedCategory, filters])

  const goToPage = (pageNumber) => setCurrentPage(pageNumber)

  const renderPaginationButtons = () => {
    const buttons = []
    const numbersToShow = isMobile ? 3 : 5
    const half = Math.floor(numbersToShow / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + numbersToShow - 1)
    if (end - start + 1 < numbersToShow)
      start = Math.max(1, end - numbersToShow + 1)
    end = Math.min(totalPages, start + numbersToShow - 1)

    buttons.push(
      <button
        key="first"
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        首頁
      </button>,
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        <FaArrowLeft />
      </button>
    )
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={`page-${i}`}
          onClick={() => goToPage(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      )
    }
    buttons.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        <FaArrowRight />
      </button>,
      <button
        key="last"
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        末頁
      </button>
    )
    return <div className="pagination">{buttons}</div>
  }

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    addItem({
      id: Number(product.id),
      name: product.name_zh,
      image: product.main_img,
      price: Number(product.price),
      type: 'product',
      quantity: 1,
    })

    showToast('success', '已加入購物車', 3000)
  }

  return (
    <>
      <Navbar />
      <Marquee />
      {loading ? (
        <Loader />
      ) : (
        <>
          <HeroSlider />
          <CategoryShowcase onCategoryClick={handleCategoryClick} />
          <div id="category-menu">
            <CategoryMenu onCategoryClick={handleCategoryClick} />
          </div>
          <ProductFilter
            filters={filters}
            setFilters={updateFilters}
            totalCount={products.length}
            selectedCategory={selectedCategory}
          />
          <CouponLink />
          <div className="container py-2">
            {selectedCategory.category && (
              <span className="badge bg-secondary me-2 p-2">
                主分類：{categoryNameMap[selectedCategory.category] || '未識別'}
              </span>
            )}
            {selectedCategory.subcategory && (
              <span className="badge bg-secondary p-2">
                子分類：
                {subcategoryNameMap[selectedCategory.subcategory] || '未識別'}
              </span>
            )}
            {activeFilters.length > 0 && (
              <div className="my-2 d-flex flex-wrap gap-2 align-items-center">
                <span className="fw-bold me-2">已套用篩選：</span>
                {activeFilters.map((f, idx) => (
                  <span
                    key={idx}
                    className="badge bg-light border text-dark d-flex align-items-center p-2"
                  >
                    {f.label}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`移除篩選條件 ${f.label}`}
                      className="ms-1 text-danger"
                      onClick={() => removeFilterTag(f)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          removeFilterTag(f)
                      }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            )}
            <div className="product-count my-2">共 {totalCount} 項商品</div>
            <div id="product-list" className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            {totalPages > 1 && renderPaginationButtons()}
          </div>
          <div className="mt-5">
            <Footer />
          </div>
        </>
      )}
    </>
  )
}
