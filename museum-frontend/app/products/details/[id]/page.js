'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/app/_components/navbar'
import CategoryMenu from '@/app/products/_components/CategoryMenu'
import ProductDetail from './_components/ProductDetail'
import ProductStorySection from './_components/ProductStorySection'
import ProductTabs from './_components/ProductTabs'
import ProductServiceTagline from './_components/ProductServiceTagline'
import YouMightLike from './_components/YouMightLike'
import Footer from '@/app/_components/footer3'
import useFavorites from '@/app/_hooks/useFavorites'
import { useToast } from '@/app/_components/ToastManager'
import Loader from '@/app/_components/load'
import { useCart } from '@/app/_context/CartContext'
// import Btn from '@/app/datatest/btn'
// import StarRating from '@/app/products/details/[id]/_components/star-rating'

export default function IdPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [categoryMap, setCategoryMap] = useState({})
  const [subcategoryMap, setSubcategoryMap] = useState({})
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites('product')
  const { showToast } = useToast()
  const { addItem } = useCart()

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

    if (!categoryId && !subcategoryId) {
      // 若為「全部商品」，設置 scroll flag
      sessionStorage.setItem('scrollToCategoryMenu', '1')
      router.push('/products#category-menu')
      return
    }

    const params = new URLSearchParams()
    if (categoryId) params.set('category', categoryId)
    if (subcategoryId) params.set('subcategory', subcategoryId)

    router.push(`/products?${params.toString()}#category-menu`)
  }

  //重新獲取評論的函數
  const fetchReviews = async () => {
    if (!id || isNaN(Number(id))) {
      console.warn('商品 ID 無效，略過 fetchReviews:', id)
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/products/reviews/product/${id}`
      )
      // console.log('目前頁面商品 ID:', id)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(
          `無法獲取評論資料：${error.error || response.statusText}`
        )
      }
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('獲取評論錯誤:', error.message)
    }
  }

  // 撈單筆商品 + 推薦商品 + 評論
  useEffect(() => {
    if (!id) return

    fetch(`http://localhost:3005/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error('Error fetching product:', error))

    fetch(`http://localhost:3005/api/products/recommend/${id}`)
      .then((res) => res.json())
      .then((data) => setRelatedProducts(data))
      .catch((error) =>
        console.error('Error fetching related products:', error)
      )

    fetchReviews()
  }, [id]) // 當 id 改變時重新執行，確保評論也更新

  const handleAddToCart = (quantity = 1) => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name_zh,
      image: product.main_img,
      price: Number(product.price),
      quantity,
      type: 'product',
    })

    showToast('success', `已加入購物車 ${quantity} 件`, 3000)
  }

  if (!product) return <Loader />

  return (
    <>
      <Navbar />
      <div style={{ marginTop: '79px' }}>
        <CategoryMenu onCategoryClick={handleCategoryClick} />
      </div>
      <ProductDetail
        product={product}
        onAddToCart={handleAddToCart}
        isFavorite={isFavorite(product.id)}
        onToggleFavorite={toggleFavorite}
      />
      {/* <section id="story" className="tab-section">
        <ProductStorySection story={product?.story} />
      </section> */}

      {/* 將 reviews 資料和 fetchReviews 函式傳遞給 ProductTabs */}
      <ProductTabs
        product={product}
        notes={product.notes || []}
        reviews={reviews} // 傳遞評論資料
        onReviewSubmitted={fetchReviews} // 傳遞重新獲取評論的函式
        story={product.product_story}
      />
      {/* <ProductServiceTagline /> */}
      {/* <div className="container">
        <Btn />
      </div>
      <div className="container"></div> */}
      <YouMightLike
        products={relatedProducts}
        favoriteProductIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
      <Footer />
    </>
  )
}
