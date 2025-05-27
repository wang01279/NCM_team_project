'use client'
// import AuthModal from '@/app/_components/Auth/AuthModal'
import Navbar from '../_components/navbar'
import Footer3 from '../_components/footer3'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

//import icon
import { FaShoppingCart } from 'react-icons/fa'
import { MdOutlinePayment } from 'react-icons/md'
import { AiOutlineTruck } from 'react-icons/ai'

//import component
import CartItems from './_components/CartItems'
import OrderSummary from './_components/OrderSummary'
import SuggestedProducts from './_components/SuggestedProducts'
import ConfirmDeleteModal from './_components/ConfirmDeleteModal'
import { useToast } from '@/app/_components/ToastManager'

//import style
import './cart.scss'

export default function CartPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // 控制是否顯示刪除 Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  //  儲存欲刪除商品的 id
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const { showToast } = useToast()
  const [items, setItems] = useState([])

  const [productDiscount, setProductDiscount] = useState(0)
  const [courseDiscount, setCourseDiscount] = useState(0)
  const [selectedProductCoupon, setSelectedProductCoupon] = useState(null)
  const [selectedCourseCoupon, setSelectedCourseCoupon] = useState(null)
  const [availableProductCoupons, setAvailableProductCoupons] = useState([])
  const [availableCourseCoupons, setAvailableCourseCoupons] = useState([])

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  // 更新數量
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

  // 點擊刪除按鈕時  啟用Modal
  const confirmDeleteItem = (id) => {
    setDeleteTargetId(id)
    setShowDeleteModal(true)
  }
  // 在Modal點刪除，真正刪除
  const handleDelete = (isConfirmed) => {
    if (isConfirmed && deleteTargetId !== null) {
      // 確認刪除
      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId))
      showToast('success', '已刪除商品', 3000) //  吐司訊息
    }
    // 無論是否刪除，都關掉 Modal 並清空 targetId
    setShowDeleteModal(false)
    setDeleteTargetId(null)
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

  // 檢查是否登入，如果沒有 token，則顯示登入提示 Modal
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setShowModal(true)
    }
    setIsLoading(false) // 不論有沒有 token 都停止 loading
  }, [])

  // 取得會員優惠券
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch('http://localhost:3005/api/memberCoupons', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          const now = new Date()
          const filtered = data.data.filter((c) => {
            const notUsed = !c.is_used
            const notExpired = !c.expired_at || new Date(c.expired_at) > now
            const minSpendOk = totalPrice >= c.minSpend
            return notUsed && notExpired && minSpendOk
          })
          // console.log('✅ 所有可用優惠券:', filtered)

          // ✅ 依 category 分類
          setAvailableProductCoupons(
            filtered.filter((c) => c.category === '商品')
          )

          setAvailableCourseCoupons(
            filtered.filter((c) => c.category === '課程')
          )
          console.log(
            '✅ 商品優惠券:',
            filtered.filter((c) => c.category === '商品')
          )
        }
      })
  }, [totalPrice])

  if (isLoading) return null

  const handleModalConfirm = () => {
    setShowModal(false)
    router.push('/')
  }

  return (
    <>
      {/* 登入提示 Modal */}
      {showModal && (
        <>
          {/* 背景遮罩 */}
          <div className="modal-backdrop fade show"></div>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">尚未登入</h5>
                </div>
                <div className="modal-body">
                  <p>請先登入才能使用購物車。</p>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={handleModalConfirm}
                    className="btn btn-primary"
                  >
                    確認
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* 刪除商品確認 Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onConfirm={() => handleDelete(true)}
        onCancel={() => handleDelete(false)}
      />

      <Navbar />

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
            </div>

            <div className="row">
              {/* 商品列表 */}

              <CartItems
                items={items}
                updateQuantity={updateQuantity}
                deleteItem={confirmDeleteItem}
              />

              {/* 訂單摘要 */}
              <OrderSummary
                items={items}
                productCoupons={availableProductCoupons}
                courseCoupons={availableCourseCoupons}
                productDiscount={productDiscount}
                courseDiscount={courseDiscount}
                onProductCouponChange={(coupon) => {
                  setSelectedProductCoupon(coupon)
                  if (coupon) {
                    const d =
                      coupon.type === '百分比'
                        ? Math.floor(
                            (totalPrice * Number(coupon.discount)) / 100
                          )
                        : Number(coupon.discount)
                    setProductDiscount(d)
                  } else {
                    setProductDiscount(0)
                  }
                }}
                onCourseCouponChange={(coupon) => {
                  setSelectedCourseCoupon(coupon)
                  if (coupon) {
                    const d =
                      coupon.type === '百分比'
                        ? Math.floor(
                            (totalPrice * Number(coupon.discount)) / 100
                          )
                        : Number(coupon.discount)
                    setCourseDiscount(d)
                  } else {
                    setCourseDiscount(0)
                  }
                }}
              />
            </div>

            {/* 其他建議商品 */}
            <SuggestedProducts />
          </div>
        </div>
      </div>

      <Footer3 />
    </>
  )
}
