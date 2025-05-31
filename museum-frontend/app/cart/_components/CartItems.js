import { useCart } from '@/app/_context/CartContext'
import CartItem from './CartItem'

export default function CartItems({ onDelete }) {
  const { cartItems, updateQuantity } = useCart()

  const productItems = cartItems.filter((item) => item.type === 'product')
  const courseItems = cartItems.filter((item) => item.type === 'course')

  return (
    <div className="col-md-8 col-12">
      <div className="card p-3 mb-5 shadow-sm">
        <div className="card-body">
          {/* 只有有商品時顯示商品區塊 */}
          {productItems.length > 0 && (
            <>
              <div className="pb-2 fs-4">商品列表</div>
              <div className="container mb-4">
                {productItems.map((item, index) => (
                  <CartItem
                    key={`product-${item.id}-${index}`}
                    {...item}
                    subtotal={item.price * item.quantity}
                    onQuantityChange={updateQuantity}
                    onDelete={() => onDelete(item.id, item.type)}
                  />
                ))}
              </div>
            </>
          )}

          {/* 只有有課程時顯示課程區塊 */}
          {courseItems.length > 0 && (
            <>
              <div className="pb-2 fs-4">課程列表</div>
              <div className="container">
                {courseItems.map((item, index) => (
                  <CartItem
                    key={`course-${item.id}-${index}`}
                    {...item}
                    subtotal={item.price * item.quantity}
                    onQuantityChange={updateQuantity}
                    onDelete={() => onDelete(item.id, item.type)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
