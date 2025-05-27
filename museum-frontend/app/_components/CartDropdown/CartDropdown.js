import React, { useEffect, useRef } from 'react'
import './CartDropdown.scss'


export default function CartDropdown({ isOpen, onClose, cartItems = [] }) {
  const ref = useRef(null)

  // 點擊外部自動關閉
  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="cart-dropdown" ref={ref} style={{right: 0, left: 'auto', minWidth: 280}}>
      <div className="user-profile-header" style={{borderBottom: 'none', marginBottom: 0, paddingBottom: 0}}>
        <div className="user-profile-info">
          <div className="user-profile-name">購物車</div>
        </div>
      </div>
      <div style={{padding: '1rem 0'}}>
        {cartItems.length === 0 ? (
          <div style={{color: '#888', textAlign: 'center'}}>購物車是空的</div>
        ) : (
          <ul style={{margin: 0, padding: 0, listStyle: 'none'}}>
            {cartItems.map(item => (
              <li key={item.id} style={{padding: '0.5rem 0', borderBottom: '1px solid #eee'}}>
                {item.name} x {item.qty}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="btn btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>前往結帳</button>
    </div>
  )
}