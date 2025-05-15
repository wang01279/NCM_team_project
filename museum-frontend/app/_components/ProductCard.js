'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import '../_styles/components/productCard.scss'
import AddToCartButton from '@/app/_components/AddToCartButton'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'

const ProductCard = ({
  product,
  onAddToCart,
  onAddToFavorites,
  favoriteProducts,
}) => {
  const { id, name, imageUrl, price, oldPrice, discount, status } = product
  const isCurrentlyFavorite = favoriteProducts && favoriteProducts.includes(id)
  const isOutOfStock = status === '庫存不足'

  const imageHeight = 200 // 設定圖片的期望高度，與 SCSS 中 .product-img 的固定高度一致
  const imageWidth = 300 // 設定圖片的期望寬度，您可以根據您的圖片比例和佈局需求調整這個值

  return (
    <div className={`col-12 col-sm-6 col-md-4 col-lg-3`}>
      <div className="product-card">
        <div className="product-img">
          <Image
            src={imageUrl}
            alt={name}
            width={imageWidth} // 設定 <Image /> 的寬度
            height={imageHeight} // 設定 <Image /> 的高度
            objectFit="contain" // 保持圖片原始比例，縮放以完全包含在容器內，可能會留白
            onError={(e) => {
              console.error('Image failed to load:', imageUrl)
              e.currentTarget.onerror = null
              e.currentTarget.src = '/image/placeholder.png'
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

export default ProductCard
