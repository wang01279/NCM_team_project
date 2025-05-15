'use client'
import React from 'react'

const AddToCartButton = ({ productId, onAddToCart, disabled }) => {
  const handleClick = () => {
    if (!disabled && onAddToCart) {
      onAddToCart(productId)
    } else if (disabled) {
      // 可以選擇在這裡顯示庫存不足的提示
      console.log(`商品 ${productId} 庫存不足，無法加入購物車`)
    }
  }

  return (
    <button
      className={`btn-cart ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <i className="fa-solid fa-cart-shopping me-2"></i>加入購物車
    </button>
  )
}

export default AddToCartButton
