'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/app/_components/navbar'
import CategoryMenu from '@/app/products/_components/CategoryMenu'
import ProductDetail from './_components/ProductDetail'
import ProductTabs from './_components/ProductTabs'
import ProductServiceTagline from './_components/ProductServiceTagline'
import YouMightLike from './_components/YouMightLike'
import useFavorites from '@/app/_hooks/useFavorites'

export default function IdPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [categoryMap, setCategoryMap] = useState({})
  const [subcategoryMap, setSubcategoryMap] = useState({})
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites('product')

  // 撈分類資料
  useEffect(() => {
    fetch('http://localhost:3005/api/products/categories')
      .then((res) => res.json())
      .then((data) => {
        const cMap = {}
        const sMap = {}
        data.forEach((cat) => {
          cMap[cat.category_name] = cat.category_id
          cat.subcategories.forEach((sub) => {
            sMap[sub.name] = sub.id
          })
        })
        setCategoryMap(cMap)
        setSubcategoryMap(sMap)
      })
  }, [])

  // 點分類會跳轉回商品列表頁
  const handleCategoryClick = ({ category, subcategory }) => {
    const categoryId = category ? categoryMap[category] : null
    const subcategoryId = subcategory ? subcategoryMap[subcategory] : null

    const params = new URLSearchParams()
    if (categoryId) params.set('category', categoryId)
    if (subcategoryId) params.set('subcategory', subcategoryId)

    router.push(`/products?${params.toString()}`)
  }

  // 撈單筆商品 + 推薦商品
  useEffect(() => {
    if (!id) return

    fetch(`http://localhost:3005/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))

    fetch(`http://localhost:3005/api/products/recommend/${id}`)
      .then((res) => res.json())
      .then((data) => setRelatedProducts(data))
  }, [id])

  if (!product) return <div>Loading...</div>

  return (
    <>
      <Navbar />
      <div style={{ marginTop: '79px' }}>
        <CategoryMenu onCategoryClick={handleCategoryClick} />
      </div>
      <ProductDetail
        product={product}
        isFavorite={isFavorite(product.id)}
        onToggleFavorite={toggleFavorite}
      />
      <ProductTabs product={product} notes={product.notes || []} />
      <ProductServiceTagline />
      <YouMightLike
        products={relatedProducts}
        favoriteProductIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
    </>
  )
}
