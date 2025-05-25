'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import CategoryMenu from '@/app/products/_components/CategoryMenu'
import ProductDetail from './_components/ProductDetail'
import ProductTabs from './_components/ProductTabs'
import ProductServiceTagline from './_components/ProductServiceTagline'
import YouMightLike from './_components/YouMightLike'
import { useToast } from '@/app/_components/ToastManager'

export default function IdPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const { showToast } = useToast()
  useEffect(() => {
    if (!id) return

    // 撈單筆商品資料
    fetch(`http://localhost:3005/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
      })

    // 撈推薦商品（可用 category 為依據過濾）
    fetch(`http://localhost:3005/api/products/recommend/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRelatedProducts(data)
      })
  }, [id])

  const handleAddToCart = (quantity = 1) => {
    if (!product) return

    const cartItem = {
      id: product.id,
      name: product.name_zh,
      image: product.main_img,
      price: product.price,
      quantity,
    }

    const existing = JSON.parse(localStorage.getItem('cartItems')) || []
    const index = existing.findIndex((item) => item.id === cartItem.id)

    if (index > -1) {
      existing[index].quantity += quantity
    } else {
      existing.push(cartItem)
    }

    localStorage.setItem('cartItems', JSON.stringify(existing))
    showToast('success', `已加入購物車 ${quantity} 件`, 3000)
  }

  if (!product) return <div>Loading...</div>

  return (
    <>
      <div style={{ marginTop: '79px' }}>
        <CategoryMenu />
      </div>
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
      <ProductTabs product={product} />
      <ProductServiceTagline />
      <YouMightLike products={relatedProducts} />
    </>
  )
}
