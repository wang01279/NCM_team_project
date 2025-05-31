'use client'

import Navbar from '../_components/navbar'
import Footer3 from '../_components/footer3'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaShoppingCart } from 'react-icons/fa'
import { MdOutlinePayment } from 'react-icons/md'
import { AiOutlineTruck } from 'react-icons/ai'

import CartItems from './_components/CartItems'
import OrderSummary from './_components/OrderSummary'
import YouMightLike from '../products/details/[id]/_components/YouMightLike'
import ConfirmDeleteModal from './_components/ConfirmDeleteModal'
import { useToast } from '@/app/_components/ToastManager'
import { useCart } from '@/app/_context/CartContext'
import useFavorites from '@/app/_hooks/useFavorites'

import './cart.scss'

export default function CartPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { cartItems, updateQuantity, removeItem } = useCart()

  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [productDiscount, setProductDiscount] = useState(0)
  const [courseDiscount, setCourseDiscount] = useState(0)
  const [selectedProductCoupon, setSelectedProductCoupon] = useState(null)
  const [selectedCourseCoupon, setSelectedCourseCoupon] = useState(null)
  const [availableProductCoupons, setAvailableProductCoupons] = useState([])
  const [availableCourseCoupons, setAvailableCourseCoupons] = useState([])

  const [relatedProducts, setRelatedProducts] = useState([])
  const { favoriteIds, toggleFavorite } = useFavorites('product')

  const productSubtotal = cartItems
    .filter((item) => item.type === 'product')
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const courseSubtotal = cartItems
    .filter((item) => item.type === 'course')
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const totalPrice = productSubtotal + courseSubtotal

  // 檢查是否登入
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) setShowModal(true)

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
            const minSpendOk =
              (c.category === '商品' && productSubtotal >= c.minSpend) ||
              (c.category === '課程' && courseSubtotal >= c.minSpend)
            return notUsed && notExpired && minSpendOk
          })

          setAvailableProductCoupons(
            filtered.filter((c) => c.category === '商品')
          )
          setAvailableCourseCoupons(
            filtered.filter((c) => c.category === '課程')
          )
        }
      })
  }, [totalPrice, productSubtotal, courseSubtotal])

  // 撈謝旻祐的推薦商品
  useEffect(() => {
    let isMounted = true

    fetch('http://localhost:3005/api/products?limit=8&sort=hot')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data.products)) {
          setRelatedProducts(data.products)
        } else {
          setRelatedProducts([])
        }
      })
      .catch(() => {
        if (isMounted) setRelatedProducts([])
      })

    return () => {
      isMounted = false
    }
  }, [])

  // 儲存折扣資訊到 localStorage
  useEffect(() => {
    const discountInfo = {
      productDiscount,
      courseDiscount,
      selectedProductCoupon,
      selectedCourseCoupon,
    }
    localStorage.setItem('cartDiscount', JSON.stringify(discountInfo))
  }, [
    productDiscount,
    courseDiscount,
    selectedProductCoupon,
    selectedCourseCoupon,
  ])

  const confirmDeleteItem = (id, type) => {
    setDeleteTarget({ id, type })
    setShowDeleteModal(true)
  }

  const handleDelete = (isConfirmed) => {
    if (isConfirmed && deleteTarget) {
      removeItem(deleteTarget.id, deleteTarget.type)
      showToast('success', '已刪除商品', 3000)
    }
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  const handleModalConfirm = () => {
    setShowModal(false)
    router.push('/')
  }

  return (
    <>
      {/* 登入提醒 Modal */}
      {showModal && (
        <>
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

      {/* 刪除確認 Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onConfirm={() => handleDelete(true)}
        onCancel={() => handleDelete(false)}
      />

      <Navbar />

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-12">
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

            <h3 className="mb-4 py-3 myCart">我的購物車</h3>

            <div className="row">
              {cartItems.length === 0 ? (
                <div className="col-12 text-center text-muted py-5">
                  <FaShoppingCart size={60} className="mb-3" />
                  <h4 className="fst-italic">您的購物車是空的</h4>
                  <p>請前往商品頁挑選商品或課程。</p>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => router.push('/products')}
                  >
                    前往選購商品
                  </button>
                </div>
              ) : (
                <>
                  <CartItems
                    onQuantityChange={(id, type, newQty) =>
                      updateQuantity(id, type, newQty)
                    }
                    onDelete={confirmDeleteItem}
                  />

                  <OrderSummary
                    items={cartItems}
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
                                (productSubtotal * Number(coupon.discount)) /
                                  100
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
                                (courseSubtotal * Number(coupon.discount)) / 100
                              )
                            : Number(coupon.discount)
                        setCourseDiscount(d)
                      } else {
                        setCourseDiscount(0)
                      }
                    }}
                  />
                </>
              )}
            </div>

            {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
              <YouMightLike
                products={relatedProducts}
                favoriteProductIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </div>
        </div>
      </div>

      <Footer3 />
    </>
  )
}
