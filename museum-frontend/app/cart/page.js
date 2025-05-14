'use client'

import { useState, useEffect } from 'react'

//import icon
import { FaShoppingCart } from 'react-icons/fa'
import { MdOutlinePayment } from 'react-icons/md'
import { AiOutlineTruck } from 'react-icons/ai'

//import component
import CartItems from './_components/CartItems'
import OrderSummary from './_components/OrderSummary'
import SuggestedProducts from './_components/SuggestedProducts'
import Accordion from 'react-bootstrap/Accordion'

//import style
import 'bootstrap/dist/css/bootstrap.min.css'
import './cart.scss'

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      imageSrc: '/images/b8.jpg',
      title: '青花龍紋天球瓶(小)',
      price: 1399,
      quantity: 1,
      type: 'product',
    },
    {
      id: 2,
      imageSrc: '/images/b8.jpg',
      title: '青花龍紋天球瓶(小)',
      price: 1399,
      quantity: 1,
      type: 'product',
    },
    {
      id: 3,
      imageSrc: '/images/image3.webp',
      title: '手作陶藝課程',
      price: 1599,
      quantity: 1,
      type: 'course',
    },
  ])

  //test用 復原刪除的商品
  const restoreCart = () => {
    const defaultItems = [
      {
        id: 1,
        imageSrc: '/images/b8.jpg',
        title: '青花龍紋天球瓶(小)',
        price: 1399,
        quantity: 1,
        type: 'product',
      },
      {
        id: 2,
        imageSrc: '/images/b8.jpg',
        title: '青花龍紋天球瓶(小)',
        price: 1399,
        quantity: 1,
        type: 'product',
      },
      {
        id: 3,
        imageSrc: '/images/image3.webp',
        title: '手作陶藝課程',
        price: 1599,
        quantity: 1,
        type: 'course',
      },
    ]
    localStorage.setItem('cartItems', JSON.stringify(defaultItems))
    window.location.reload() // 重新整理頁面載入資料
  }

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item
      )
    )
  }

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  //造訪時從localstorage拿資料
  useEffect(() => {
    const saved = localStorage.getItem('cartItems')
    //有值執行下一行，空值執行第二段
    if (saved) setItems(JSON.parse(saved))
  }, [])

  //localStorage.setItem('key', 'value')
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items))
  }, [items])

  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* 購買流程 */}
            <div className="crumbs">
              <ul>
                <li>
                  <div className="active">
                    <FaShoppingCart /> 購物車
                  </div>
                </li>
                <li>
                  <div>
                    <MdOutlinePayment /> 付款資訊
                  </div>
                </li>
                <li>
                  <div>
                    <AiOutlineTruck /> 完成訂單
                  </div>
                </li>
              </ul>
            </div>

            {/* 購物車Title */}
            <div>
              <h3 className="mb-4 py-3 myCart">我的購物車</h3>
              {/*測試用，還原localstorage */}
              <button onClick={restoreCart} className="btn btn-secondary">
                一鍵還原購物車TEST用
              </button>
            </div>

            <div className="row">
              {/* 商品列表 */}

              <CartItems
                items={items}
                updateQuantity={updateQuantity}
                deleteItem={deleteItem}
              />

              {/* 訂單摘要 */}
              <OrderSummary items={items} />
            </div>

            {/* 其他建議商品 */}
            <SuggestedProducts />
          </div>
        </div>
      </div>
    </>
  )
}
