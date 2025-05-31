'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// 建立 Context
const CartContext = createContext()

// 建立 Provider 元件
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  // 初始化：從 localStorage 讀取購物車資料
  useEffect(() => {
    const saved = localStorage.getItem('cartItems')
    if (saved) setCartItems(JSON.parse(saved))
  }, [])

  // 每次 cartItems 改變就寫回 localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  // 新增商品（預設 quantity = 1）
  const addItem = (item) => {
    const qty = Number(item.quantity) || 1

    const saved = localStorage.getItem('cartItems')
    const prev = saved ? JSON.parse(saved) : []

    const exists = prev.find((i) => i.id === item.id && i.type === item.type)

    const updated = exists
      ? prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      : [...prev, { ...item, quantity: qty }]

    localStorage.setItem('cartItems', JSON.stringify(updated))
    setCartItems(updated) // 同步更新狀態
  }

  // 更新數量（防止小於 1）
  const updateQuantity = (id, type, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.type === type
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    )
  }

  // 快捷：增加數量
  const increaseQuantity = (id, type) => {
    const item = cartItems.find((i) => i.id === id && i.type === type)
    if (!item) return
    updateQuantity(id, type, item.quantity + 1)
  }
  // 快捷：減少數量（至少 1）
  const decreaseQuantity = (id, type) => {
    const item = cartItems.find((i) => i.id === id && i.type === type)
    if (!item) return
    updateQuantity(id, type, Math.max(1, item.quantity - 1))
  }

  // 刪除商品
  const removeItem = (id, type) => {
    const updated = cartItems.filter(
      (item) => item.id !== id || item.type !== type
    )
    localStorage.setItem('cartItems', JSON.stringify(updated))
    setCartItems(updated)
  }

  // 清空購物車
  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addItem,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// 快捷 hook
export const useCart = () => useContext(CartContext)
