'use client'

import Navbar from '../../_components/navbar'
import Footer3 from '../../_components/footer3'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderSchema } from '@/app/_schemas/orderSchema'
import { useShip711StoreOpener } from './_hooks/use-ship-711-store'
import { apiUrl } from '@/app/_config/index.js'
import { useCart } from '@/app/_context/CartContext'

import { FaShoppingCart } from 'react-icons/fa'
import { MdOutlinePayment } from 'react-icons/md'
import { AiOutlineTruck } from 'react-icons/ai'

import Shipping from '../_components/Shipping'
import BuyerInfo from '../_components/BuyerInfo'
import Payment from '../_components/Payment'
import OrderSummary2 from '../_components/OrderSummary2'
import Loader from '../../_components/load'

import './checkout.scss'

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { cartItems, clearCart } = useCart()

  const { store711, openWindow } = useShip711StoreOpener(`${apiUrl}/cart/711`, {
    autoCloseMins: 3,
  })

  const [buyer, setBuyer] = useState({ name: '', phone: '', email: '' })
  const [shipping, setShipping] = useState({
    shippingMethod: '宅配',
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
  const shippingFee = shipping.shippingMethod === '超商' ? 45 : 50

  const [discountInfo, setDiscountInfo] = useState({
    productDiscount: 0,
    courseDiscount: 0,
    selectedProductCoupon: null,
    selectedCourseCoupon: null,
  })

  useEffect(() => {
    if (store711?.storename && store711?.storeaddress) {
      setShipping((prev) => ({
        ...prev,
        store: `${store711.storename} (${store711.storeaddress})`,
      }))
    }
  }, [store711])

  // ✅ 沒商品就導回購物車
  // useEffect(() => {
  //   if (cartItems.length === 0) {
  //     router.push('/cart')
  //   }
  // }, [cartItems, router])

  // ✅ 讀取優惠券資訊
  useEffect(() => {
    const saved = localStorage.getItem('cartDiscount')
    if (saved) {
      setDiscountInfo(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = OrderSchema.safeParse({
      ...buyer,
      ...shipping,
      ...payment,
      cartItems,
      shippingFee,
    })
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      alert('欄位錯誤：' + Object.values(errors)[0][0])
      return
    }

    const cleanedItems = cartItems.map((item) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }))

    const orderData = {
      ...result.data,
      cartItems: cleanedItems,
      productDiscount: discountInfo.productDiscount,
      courseDiscount: discountInfo.courseDiscount,
      usedProductCoupon: discountInfo.selectedProductCoupon?.uuid_code || null,
      usedCourseCoupon: discountInfo.selectedCourseCoupon?.uuid_code || null,
      shippingFee,
      discount:
        (discountInfo.productDiscount || 0) +
        (discountInfo.courseDiscount || 0),
    }

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
        clearCart()

        if (payment.paymentMethod === 'credit') {
          router.push('/cart/order-success')
        } else if (payment.paymentMethod === 'linepay') {
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
      console.error('fetch 錯誤:', err)
      alert('網路錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
              <div className="col-12">
                {/* 頂部流程指示條 */}
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

                <h3 className="mb-4 py-3 myOrder text-center text-md-start">
                  付款資訊
                </h3>
                {/* 表單 + Order Summary RWD 版面 */}
                <div className="row flex-column flex-md-row">
                  <h4 className="mb-4">購買人資訊*</h4>
                  {/* 左側：購買人、運送、付款 */}
                  <div className="col-md-8 col-12 mb-4">
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3 mb-4">
                        <BuyerInfo value={buyer} onChange={setBuyer} />
                        <Shipping
                          value={shipping}
                          onChange={setShipping}
                          store711={store711}
                          openWindow={openWindow}
                        />
                        <Payment value={payment} onChange={setPayment} />
                      </div>

                      <div className="col-12 d-flex flex-column flex-md-row justify-content-between mt-4 gap-3">
                        <a
                          href="/cart"
                          className="btn btn-dark w-100 w-md-auto px-5"
                        >
                          回到上一步
                        </a>
                        <button
                          id="orderBtn"
                          className="btn px-5 w-100 w-md-auto"
                          style={{ backgroundColor: '#7b2d12', color: 'white' }}
                          type="submit"
                        >
                          前往付款
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* 右側：訂單摘要 */}
                  <div className="col-md-4 col-12 order-2 d-flex flex-column">
                    <div className="order-summary2-sticky align-self-md-end w-100">
                      <OrderSummary2
                        cartItems={cartItems}
                        discountInfo={discountInfo}
                        shippingMethod={shipping.shippingMethod}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer3 />
    </>
  )
}
