import { useEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPopover() {
  const [cartItems, setCartItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // 讀取 localStorage 中的購物車資料
  useEffect(() => {
    const saved = localStorage.getItem('cartItems')
    if (saved) setCartItems(JSON.parse(saved))
  }, [])

  return (
    <div
      className="position-relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ cursor: 'pointer' }}
    >
      <FaShoppingCart size={24} />
      {cartItems.length > 0 && (
        <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
          {cartItems.length}
        </span>
      )}

      {/* 購物車內容區塊 */}
      {isOpen && (
        <div
          className="bg-white text-dark p-3 rounded shadow"
          style={{
            position: 'absolute',
            top: '120%',
            right: 0,
            width: '320px',
            zIndex: 999,
          }}
        >
          <h6 className="mb-3 border-bottom pb-2 fw-bold">購物車</h6>

          {cartItems.length === 0 ? (
            <div className="text-muted text-center">尚無商品</div>
          ) : (
            <ul className="list-unstyled">
              {cartItems.slice(0, 3).map((item, index) => (
                <li
                  key={`${item.id}-${item.type}-${index}`}
                  className="d-flex align-items-center mb-3"
                >
                  {/* 商品圖片 */}
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      position: 'relative',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                    className="me-3"
                  >
                    <Image
                      src={item.image || '/images/default-course.jpg'}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* 商品資訊 */}
                  <div className="flex-grow-1">
                    <div className="fw-bold">{item.name}</div>
                    <div className="text-muted small">
                      NT${item.price.toLocaleString()} × {item.quantity}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="text-end mt-2">
            <Link href="/cart" className="btn btn-sm btn-primary w-100">
              前往購物車
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
