'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import '../_styles/components/productCard.scss'
import AddToCartButton from '@/app/_components/AddToCartButton'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'

// 金額格式化：移除小數點並加上千分位
const formatPrice = (price) => {
  if (price === null || price === undefined) return 'NT$0'
  return `NT$${Math.round(price).toLocaleString('zh-TW')}`
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
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
    : price
  const status = stock === 0 ? '庫存不足' : '庫存充足'
  const isOutOfStock = stock === 0
  const displayDiscount = hasDiscount
    ? `${Math.round(discount_rate * 10)} 折`
    : ''

  return (
    <div className="product-card-wrap">
      <div className="product-card">
        {/* 商品圖片 */}
        <div className="product-img">
          <Link href={`/products/details/${id}`}>
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="product-img-hover"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                console.error('Image failed to load:', imageUrl)
                e.currentTarget.onerror = null
              }}
            />
          </Link>

          {/* 原本的查看更多按鈕拿掉或註解 */}
          {/* <div className="img-overlay">
    <Link
      href={`/products/details/${id}`}
      className="more-btn btn-secondary"
    >
      查看更多
    </Link>
  </div> */}
        </div>

        {/* 商品資訊 */}
        <div className="product-info">
          <div className="product-name">{name}</div>

          <div className="product-price-wrap">
            {hasDiscount ? (
              <>
                <span className="product-price">
                  {formatPrice(discountPrice)}
                </span>
                <span className="product-old-price">{formatPrice(price)}</span>
                <span className="product-discount">{displayDiscount}</span>
              </>
            ) : (
              <span className="product-price">{formatPrice(price)}</span>
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
              itemId={id}
              itemType="product"
              isFavorite={isFavorite}
              onToggleFavorite={(itemId, itemType, nextState) => {
                onToggleFavorite?.(itemId, nextState)
              }}
            />
          </div>
        </div>

        {/* 標籤 */}
        {isOutOfStock && <span className="stock-badge">缺貨中</span>}
        {hasDiscount && <span className="stock-badge sale">特價中</span>}
      </div>
    </div>
  )
}
