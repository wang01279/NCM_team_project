'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../_styles/ProductDetail.scss'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'

export default function ProductDetail({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}) {
  const [mainImageSrc, setMainImageSrc] = useState('')
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (product?.main_img) {
      setMainImageSrc(product.main_img)
    }
  }, [product])

  const handlePrevClick = () => {
    if (currentThumbnailIndex > 0) {
      const newIndex = currentThumbnailIndex - 1
      setCurrentThumbnailIndex(newIndex)
      setMainImageSrc(product.images[newIndex])
    }
  }

  const handleNextClick = () => {
    if (product.images && currentThumbnailIndex < product.images.length - 1) {
      const newIndex = currentThumbnailIndex + 1
      setCurrentThumbnailIndex(newIndex)
      setMainImageSrc(product.images[newIndex])
    }
  }

  const handleThumbnailClick = (index) => {
    setCurrentThumbnailIndex(index)
    setMainImageSrc(product.images[index])
  }

  const handleQuantityIncrement = () => {
    setQuantity(quantity + 1)
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

  const thumbnails = product.images || []
  const isOutOfStock = product.stock === 0

  return (
    <section>
      <div className="container py-4">
        <div className="product-page">
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
                <button className="thumb-prev" onClick={handlePrevClick}>
                  <FaChevronLeft />
                </button>
                <div className="thumbnail-fixed-view">
                  {thumbnails.map((thumbnailUrl, index) => (
                    <Image
                      key={index}
                      src={thumbnailUrl}
                      alt=""
                      width={60}
                      height={60}
                      className={
                        index === currentThumbnailIndex ? 'active' : ''
                      }
                      onClick={() => handleThumbnailClick(index)}
                    />
                  ))}
                </div>
                <button className="thumb-next" onClick={handleNextClick}>
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>

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

            <div className="quantity-cart d-none d-md-flex">
              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={handleQuantityDecrement}
                  disabled={isOutOfStock}
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
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
              <button
                className="add-to-cart btn btn-primary d-flex"
                onClick={() => onAddToCart(quantity)}
              >
                加入購物車
              </button>
            </div>
            <div className="stock-info">剩餘數量：{product.stock} 件</div>
            <hr />
            <div className="product-description">{product.description}</div>
          </div>
        </div>

        <div className="mobile-fixed-bar d-md-none">
          <div className="container d-flex justify-content-between align-items-center gap-2">
            <div className="quantity-control">
              <button
                className="qty-btn"
                onClick={handleQuantityDecrement}
                disabled={isOutOfStock}
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
                disabled={isOutOfStock}
              >
                +
              </button>
            </div>
            <button
              onClick={() => onAddToCart(quantity)}
              className="add-to-cart btn btn-primary d-flex justify-content-center align-items-center flex-grow-1"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
