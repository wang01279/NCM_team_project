'use client'

import React, { useState, useEffect, useCallback } from 'react'
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

export default function ProductPage() {
  const { showToast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
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
  const [filters, setFilters] = useState({
    material: [],
    origin: [],
    function: [],
    minPrice: 0,
    maxPrice: 100000,
    search: '',
    sort: '',
  })

  const updateFilters = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  useEffect(() => {
    const categoryId = searchParams.get('category')
    const subcategoryId = searchParams.get('subcategory')

    if (categoryId || subcategoryId) {
      setSelectedCategory({
        category: categoryId || null,
        subcategory: subcategoryId || null,
      })

      const productList = document.getElementById('product-list')
      if (productList) {
        productList.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [searchParams])

  useEffect(() => {
    fetch('http://localhost:3005/api/products/categories')
      .then((res) => res.json())
      .then((data) => {
        const cMap = {}
        const cNameMap = {}
        const sMap = {}
        const sNameMap = {}

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
  }

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
      query.set('function', filters.function.join(','))
    if (filters.minPrice > 0) query.set('minPrice', filters.minPrice)
    if (filters.maxPrice < 100000) query.set('maxPrice', filters.maxPrice)

    fetch(`http://localhost:3005/api/products?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setTotalPages(data.totalPages || 1)
      })
      .catch(() => {
        setProducts([])
        setTotalPages(1)
      })
  }, [currentPage, selectedCategory, filters])

  const goToPage = (pageNumber) => setCurrentPage(pageNumber)

  const renderPaginationButtons = () => {
    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      )
    }
    return <div className="pagination">{buttons}</div>
  }

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const cartItem = {
      id: product.id,
      name: product.name_zh,
      image: product.main_img,
      price: product.price,
      quantity: 1,
    }

    const existing = JSON.parse(localStorage.getItem('cartItems')) || []
    const index = existing.findIndex((item) => item.id === cartItem.id)

    if (index > -1) {
      existing[index].quantity += 1
    } else {
      existing.push(cartItem)
    }

    localStorage.setItem('cartItems', JSON.stringify(existing))
    showToast('success', '已加入購物車', 3000)
  }

  return (
    <>
      <Navbar />
      <Marquee />
      <HeroSlider />
      <CategoryShowcase onCategoryClick={handleCategoryClick} />
      <CategoryMenu onCategoryClick={handleCategoryClick} />
      <ProductFilter filters={filters} setFilters={updateFilters} />
      <div className="container py-2">
        {selectedCategory.category && (
          <span className="badge bg-secondary me-2">
            主分類：{categoryNameMap[selectedCategory.category] || '未識別'}
          </span>
        )}
        {selectedCategory.subcategory && (
          <span className="badge bg-secondary">
            子分類：
            {subcategoryNameMap[selectedCategory.subcategory] || '未識別'}
          </span>
        )}

        <div className="product-count mb-3">共 {products.length} 項商品</div>
        <div id="product-list" className="row g-4">
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
      <Footer />
    </>
  )
}
