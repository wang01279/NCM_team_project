'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import '../_styles/components/productCard.scss'
import AddToCartButton from '@/app/_components/AddToCartButton'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'

export default function ProductCard({
  product,
  onAddToCart,
  onAddToFavorites,
  favoriteProducts,
}) {
  const { id, name, imageUrl, price, oldPrice, discount, status } = product
  const isCurrentlyFavorite = favoriteProducts && favoriteProducts.includes(id)
  const isOutOfStock = status === '庫存不足'

  // const imageHeight = 200
  // const imageWidth = 300

  return (
    <div className={`col-12 col-sm-6 col-md-4 col-lg-3`}>
      <div className="product-card">
        <div className="product-img">
          <Image
            src={imageUrl}
            alt={name}
            fill // 自動填滿
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              console.error('Image failed to load:', imageUrl)
              e.currentTarget.onerror = null // 關鍵：移除 onerror 監聽器
              // e.currentTarget.src = null; // 選項 1：將 src 設定為 null，圖片將不顯示
              // e.currentTarget.style.display = 'none'; // 選項 2：直接隱藏圖片元素
              // 選項 3：設定一個預設的替代圖片 (確保該圖片存在且路徑正確)
              // e.currentTarget.src = '/image/no-image.png';
            }}
          />
          <div className="img-overlay">
            <Link href={`/products/details/${id}`} className="more-btn">
              顯示更多
            </Link>
          </div>
        </div>
        <div className="product-name">{name}</div>
        <div className="product-price-wrap">
          <span className="product-price">NT${price}</span>
          {oldPrice && <span className="product-old-price">NT${oldPrice}</span>}
          {discount && <span className="product-discount">{discount}</span>}
        </div>
        <div className="product-status">
          <i className="fa-solid fa-box me-2"></i>
          {status}
        </div>
        <div className="product-actions">
          <AddToCartButton
            productId={id}
            onAddToCart={onAddToCart}
            disabled={isOutOfStock}
          />
          <AddToFavoritesButton
            productId={id}
            onAddToFavorites={onAddToFavorites}
            isFavorite={isCurrentlyFavorite}
          />
        </div>
        {status === '庫存不足' && <span className="stock-badge">缺貨中</span>}
        {discount && <span className="stock-badge sale">特價中</span>}
      </div>
    </div>
  )
}