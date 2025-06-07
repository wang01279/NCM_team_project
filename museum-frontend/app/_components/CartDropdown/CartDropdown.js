'use client'
import Link from 'next/link'
import './CartDropdown.scss'
import Image from 'next/image'

export default function CartDropdown({ cartItems }) {
  return (
    <div className="cart-dropdown">
      <div className="user-profile-header mb-2">
        <div className="user-profile-info">
          <div className="user-profile-name">購物車</div>
        </div>
      </div>
      {cartItems.length === 0 ? (
        <div
          className="text-muted text-center"
          style={{ minHeight: '150px', alignContent: 'center' }}
        >
          購物車是空的
        </div>
      ) : (
        <ul className="list-unstyled">
          {cartItems.map((item) => (
            <li
              key={`${item.id}-${item.type}`}
              className="d-flex align-items-center mb-2 border-bottom pb-2"
            >
              {/* 商品圖片 */}
              <Image
                src={item.image}
                alt={item.name}
                width={50}
                height={50}
                style={{
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginRight: '10px',
                }}
              />

              {/* 商品名稱與數量 */}
              <div className="flex-grow-1">
                <div className="fw-bold">{item.name}</div>
                <small className="text-muted">x {item.quantity}</small>
              </div>

              {/* 單價 */}
              <div className="text-end" style={{ minWidth: '60px' }}>
                <small className="text-muted">
                  ${item.price * item.quantity}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link href="/cart" className="no-hover-style p-0">
        <button
          type="button"
          className="btn btn-primary w-100 justify-content-center "
        >
          前往結帳
        </button>
      </Link>
    </div>
  )
}
