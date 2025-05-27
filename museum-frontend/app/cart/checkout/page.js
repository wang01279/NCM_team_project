'use client'
import Navbar from '../../_components/navbar'
import Footer3 from '../../_components/footer3'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderSchema } from '@/app/_schemas/orderSchema'
import { useShip711StoreOpener } from './_hooks/use-ship-711-store'
import { apiUrl } from '@/app/_config/index.js'

//import icon
import { FaShoppingCart } from 'react-icons/fa'
import { MdOutlinePayment } from 'react-icons/md'
import { AiOutlineTruck } from 'react-icons/ai'

//import component
import Shipping from '../_components/Shipping'
import BuyerInfo from '../_components/BuyerInfo'
import Payment from '../_components/Payment'
import OrderSummary2 from '../_components/OrderSummary2'

// import style
import './checkout.scss'

export default function CartPage() {
  const router = useRouter()

  // useShip711StoreOpener的第一個傳入參數是"伺服器7-11運送商店用Callback路由網址"
  // 指的是node(express)的對應api路由。詳情請見說明文件:
  const { store711, openWindow } = useShip711StoreOpener(
    `${apiUrl}/cart/711`, // 也可以用express伺服器的api路由
    { autoCloseMins: 3 } // x分鐘沒完成選擇會自動關閉，預設5分鐘。
  )

  const [buyer, setBuyer] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [shipping, setShipping] = useState({
    shippingMethod: '宅配', // ✅ 預設值
    city: '',
    district: '',
    address: '',
    store: '',
  })
  const [payment, setPayment] = useState({
    paymentMethod: 'credit',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardHolder: '',
  })
  const [cartItems, setCartItems] = useState([])
  // console.log('shipping:', shipping)

  useEffect(() => {
    // 從 localStorage 拿購物車資料，假設 key 是 'cartItems'
    const storedCart = localStorage.getItem('cartItems')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    if (store711?.storename && store711?.storeaddress) {
      setShipping((prev) => ({
        ...prev,
        store: `${store711.storename} (${store711.storeaddress})`,
      }))
    }
  }, [store711])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = OrderSchema.safeParse({ ...buyer, ...shipping, ...payment })

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      alert('欄位錯誤：' + Object.values(errors)[0][0])
      return
    }

    // ✅ 清洗 cartItems → 轉換 price 與 quantity 為數字
    const cleanedItems = cartItems.map((item) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }))

    // ✅ 組成送出資料
    const orderData = {
      ...result.data,
      cartItems: cleanedItems,
    }
    console.log('orderData:', orderData)

    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:3005/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('伺服器錯誤：', errorText)
        alert(`伺服器錯誤 (${response.status})`)
        return
      }

      const res = await response.json()

      if (res.success) {
        // ✅ 信用卡付款：導向成功頁
        if (payment.paymentMethod === 'credit') {
          router.push('/cart/order-success')
          return
        }

        // ✅ 綠界付款：轉址到金流
        if (payment.paymentMethod === 'linepay') {
          const itemsStr = cleanedItems
            .map((item) => `${item.title || item.name}X${item.quantity}`)
            .join(',')

          const totalPrice = cleanedItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          )

          window.location.href = `http://localhost:3005/api/ecpay-test-only?amount=${totalPrice}&items=${encodeURIComponent(
            itemsStr
          )}`
        }
      } else {
        alert(`訂單建立失敗：${res.message}`)
      }
    } catch (err) {
      alert('網路錯誤，請稍後再試')
      console.error('fetch 錯誤:', err)
    }
  }

  return (
    <>
      <Navbar />

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* 購買流程 */}
            <div className="crumbs">
              <ul>
                <li>
                  <div>
                    <FaShoppingCart /> 購物車
                  </div>
                </li>
                <li>
                  <div className="active">
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

            <div className="row">
              {/* 訂單資訊Title */}
              <div>
                <h3 className="mb-4 py-3 myOrder">付款資訊</h3>
              </div>
              {/* 左側收件人資料 */}
              <h4 className="mb-4">購買人資訊*</h4>
              <div className="col-md-8 col-12">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-4">
                    {/* 購買人資訊 */}
                    <BuyerInfo value={buyer} onChange={setBuyer} />
                    <Shipping
                      value={shipping}
                      onChange={setShipping}
                      store711={store711} // ✅ 傳入門市資料
                      openWindow={openWindow} // ✅ 傳入開視窗函式
                    />
                    <Payment value={payment} onChange={setPayment} />
                  </div>

                  <div className="col-12 d-flex justify-content-between mt-4">
                    <a href="/cart" className="btn btn-dark px-5">
                      回到上一步
                    </a>
                    <button
                      id="orderBtn"
                      className="btn px-5"
                      style={{ backgroundColor: '#7b2d12', color: 'white' }}
                      type="submit"
                    >
                      前往付款
                    </button>
                  </div>
                </form>
              </div>

              {/* 右側訂單明細 */}
              <OrderSummary2 cartItems={cartItems} />
            </div>
          </div>
        </div>
      </div>

      <Footer3 />
    </>
  )
}
