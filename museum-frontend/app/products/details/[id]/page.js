'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import CategoryMenu from '@/app/products/_components/CategoryMenu'
import ProductDetail from './_components/ProductDetail'
import ProductTabs from './_components/ProductTabs'
import ProductServiceTagline from './_components/ProductServiceTagline'
import YouMightLike from './_components/YouMightLike'

import initialProductList from '@/app/datatest/productList'

// 假資料
const fakeProducts = [
  {
    id: 1,
    title: '青花纏枝天球瓶',
    subtitle:
      'Underglaze-blue porcelain globular vase with lotus-and-dragon décor (Large)',
    price: 4500,
    imageUrl: '/image/c20.jpg',
    thumbnails: ['/image/c20.jpg', '/image/c49.jpg', '/image/c50.jpg'],
    stock: 5,
    description:
      '本作品 明 永樂龍紋天球瓶縮小尺寸製作，經過還原窯燒1300℃，呈現出王者之尊氣勢。',
    category: '陶瓷',
  },
  {
    id: 2,
    title: '福壽蓮花盤',
    subtitle:
      'Underglaze-blue porcelain globular vase with lotus-and-dragon décor (Large)',
    price: 7800,
    imageUrl: '/image/k1.jpg',
    thumbnails: ['/image/k1.jpg', '/image/c52.jpg', '/image/c27.jpg'],
    stock: 10,
    description:
      '本作品 明 永樂龍紋天球瓶縮小尺寸製作，經過還原窯燒1300℃，呈現出王者之尊氣勢。',
    category: '瓷器',
  },
]

export default function IdPage() {
  const { id } = useParams()
  const productId = parseInt(id, 10)
  const product = fakeProducts.find((p) => p.id === productId)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (product) {
      const filteredProducts = initialProductList.filter(
        (p) => p.category === product.category && p.id !== String(productId)
      )
      const shuffledProducts = [...filteredProducts]
        .sort(() => 0.5 - Math.random())
        .slice(0, 8)
      setRelatedProducts(shuffledProducts)
    }
  }, [product, productId])

  if (!product) {
    return <div>找不到商品</div>
  }

  return (
    <>
      <div style={{ marginTop: '79px' }}>
        <CategoryMenu />
      </div>
      <ProductDetail product={product} />
      <ProductTabs product={product} />
      <ProductServiceTagline />
      <YouMightLike products={relatedProducts} />
    </>
  )
}
