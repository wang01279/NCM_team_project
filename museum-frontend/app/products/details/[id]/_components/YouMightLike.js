import React from 'react'
import ProductCard from '@/app/_components/ProductCard'
import '../_styles/YouMightLike.scss'
import { useToast } from '@/app/_components/ToastManager'
import { useCart } from '@/app/_context/CartContext'

export default function YouMightLike({
  products,
  favoriteProductIds = [],
  onToggleFavorite,
}) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId)

    if (!product) return

    addItem({
      id: Number(product.id),
      name: product.name_zh,
      image: product.main_img,
      price: Number(product.price),
      type: 'product',
      quantity: 1,
    })

    showToast('success', '已加入購物車', 3000)
  }
  return (
    <div className="others-section">
      <div className="text-center fw-bold my-4">
        <h4>您可能會有興趣</h4>
        <p className="others-title">更多相關商品</p>
      </div>
      <div className="card-scroll">
        {products &&
          products
            .slice(0, 8)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favoriteProductIds.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
                onAddToCart={handleAddToCart}
              />
            ))}
        {products && products.length === 0 && <p>暫無相關商品推薦。</p>}
      </div>
    </div>
  )
}
