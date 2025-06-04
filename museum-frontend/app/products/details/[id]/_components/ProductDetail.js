'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../_styles/ProductDetail.scss'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'
import { FaShoppingCart } from 'react-icons/fa'
import { FaChevronRight, FaChevronLeft, FaReply } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function ProductDetail({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}) {
  const [thumbnails, setThumbnails] = useState([])
  const [mainImageSrc, setMainImageSrc] = useState('')
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  // 初始化 thumbnails + 主圖
  useEffect(() => {
    const filtered = (product.images || [])
      .filter((img) => img && img.trim() !== '')
      .slice(0, 3)

    setThumbnails(filtered)

    if (filtered.length > 0) {
      setMainImageSrc(filtered[0])
      setCurrentThumbnailIndex(0)
    } else if (product?.main_img) {
      setMainImageSrc(product.main_img)
      setCurrentThumbnailIndex(0)
    }
  }, [product])

  const handlePrevClick = () => {
    if (currentThumbnailIndex > 0) {
      const newIndex = currentThumbnailIndex - 1
      setCurrentThumbnailIndex(newIndex)
      setMainImageSrc(thumbnails[newIndex])
    }
  }

  const handleNextClick = () => {
    if (currentThumbnailIndex < thumbnails.length - 1) {
      const newIndex = currentThumbnailIndex + 1
      setCurrentThumbnailIndex(newIndex)
      setMainImageSrc(thumbnails[newIndex])
    }
  }

  const handleThumbnailClick = (index) => {
    setCurrentThumbnailIndex(index)
    setMainImageSrc(thumbnails[index])
  }

  const handleQuantityIncrement = () => {
    if (product.stock > 0 && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const displayPrice = product?.price
    ? product.discount_rate
      ? Math.round(
          Number(product.price) * (product.discount_rate / 10)
        ).toLocaleString()
      : Number(product.price).toLocaleString()
    : '價格未提供'

  if (!product) return <div>Loading...</div>
  const isOutOfStock = product.stock === 0

  return (
    <section>
      <div className="container py-4">
        {/*返回按鈕 */}
        <div className="mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => router.push('/products#category-menu')}
          >
            <FaReply className="me-2" />
            返回
          </button>
        </div>
        <div className="product-page">
          {/*主圖 + 縮圖區 */}
          <div className="product-left">
            {mainImageSrc ? (
              <Image
                src={mainImageSrc}
                className="main-image"
                alt={product.name_zh}
                width={350}
                height={350}
              />
            ) : (
              <div className="placeholder-image">No Image Available</div>
            )}

            {thumbnails.length > 0 && (
              <div className="thumbnail-carousel-wrapper">
                <button
                  className="thumb-prev"
                  onClick={handlePrevClick}
                  disabled={currentThumbnailIndex === 0}
                >
                  <FaChevronLeft />
                </button>

                <div className="thumbnail-fixed-view">
                  {thumbnails.map((thumbnailUrl, index) => (
                    <Image
                      key={index}
                      src={thumbnailUrl}
                      alt={`副圖${index + 1}`}
                      width={60}
                      height={60}
                      className={
                        index === currentThumbnailIndex ? 'active' : ''
                      }
                      onClick={() => handleThumbnailClick(index)}
                    />
                  ))}
                </div>

                <button
                  className="thumb-next"
                  onClick={handleNextClick}
                  disabled={currentThumbnailIndex === thumbnails.length - 1}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>

          {/*商品資訊 */}
          <div className="product-right">
            <div className="product-header-row">
              <h2 className="product-title">{product.name_zh}</h2>
              <AddToFavoritesButton
                itemId={product.id}
                itemType="product"
                isFavorite={isFavorite}
                onToggleFavorite={(_, __, state) =>
                  onToggleFavorite(product.id, state)
                }
                className="favorite-button"
              />
            </div>

            <p className="product-subtitle">{product.name_en}</p>
            <div className="product-price">NT${displayPrice}</div>

            {/* 數量控制 + 購物車 */}
            <div className="quantity-cart d-none d-md-flex">
              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={handleQuantityDecrement}
                  disabled={isOutOfStock || quantity <= 1}
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  className="qty-input"
                  readOnly
                />
                <button
                  className="qty-btn"
                  onClick={handleQuantityIncrement}
                  disabled={isOutOfStock || quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <button
                className="add-to-cart btn btn-primary d-flex"
                onClick={() => onAddToCart(quantity)}
                disabled={isOutOfStock}
              >
                <FaShoppingCart className="me-1" />
                加入購物車
              </button>
            </div>

            <div className="stock-info">剩餘數量：{product.stock} 件</div>
            <hr />
            <div className="product-note">
              <h5 className="fw-bold">注意事項</h5>
              {/* 修改為使用 <p> 標籤顯示 */}
              {Array.isArray(product.notes) && product.notes.length > 0 ? (
                // 將每個 note 項目用 <p> 顯示
                product.notes.map((note, index) => (
                  <p key={index} className="note-paragraph">
                    {note}
                  </p>
                ))
              ) : (
                <p>目前無特別注意事項。</p>
              )}
            </div>
          </div>
        </div>

        {/*手機底部加入購物車 */}
        <div className="mobile-fixed-bar d-md-none">
          <div className="container d-flex justify-content-between align-items-center gap-2">
            <div className="quantity-control">
              <button
                className="qty-btn"
                onClick={handleQuantityDecrement}
                disabled={isOutOfStock || quantity <= 1}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                className="qty-input"
                readOnly
              />
              <button
                className="qty-btn"
                onClick={handleQuantityIncrement}
                disabled={isOutOfStock || quantity >= product.stock}
              >
                +
              </button>
            </div>
            <button
              onClick={() => onAddToCart(quantity)}
              className="add-to-cart btn btn-primary d-flex justify-content-center align-items-center flex-grow-1"
              disabled={isOutOfStock}
            >
              <FaShoppingCart className="me-1" />
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
