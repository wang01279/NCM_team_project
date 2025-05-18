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
  const {
    id,
    name_zh: name,
    main_img: imageUrl,
    price,
    discount_rate,
    stock,
  } = product

  const hasDiscount = discount_rate && discount_rate > 0 && discount_rate < 10
  const discountPrice = hasDiscount
    ? Math.round(price * (discount_rate / 10))
    : null

  const status = stock === 0 ? '庫存不足' : '庫存充足'
  const isOutOfStock = stock === 0
  const isCurrentlyFavorite = favoriteProducts?.includes(id)

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="product-card">
        <div className="product-img">
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              console.error('Image failed to load:', imageUrl)
              e.currentTarget.onerror = null
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
          {hasDiscount ? (
            <>
              <span className="product-price">NT${discountPrice}</span>
              <span className="product-old-price">NT${price}</span>
              <span className="product-discount">{discount_rate} 折</span>
            </>
          ) : (
            <span className="product-price">NT${price}</span>
          )}
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

        {isOutOfStock && <span className="stock-badge">缺貨中</span>}
        {hasDiscount && <span className="stock-badge sale">特價中</span>}
      </div>
    </div>
  )
}
