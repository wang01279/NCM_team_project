'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { CiShoppingTag } from 'react-icons/ci'
import { AnimatePresence, motion } from 'framer-motion'
import Pagination from './_components/Pagination'
import Loader from '@/app/_components/load'

import styles from './_style/memOrders.module.scss'

export default function OrdersTab({ filter = 'processing' }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const member = JSON.parse(localStorage.getItem('member') || '{}')

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${member.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const data = await res.json()
        if (data.success) {
          setOrders(data.orders)
        } else {
          alert(data.message || '載入訂單失敗')
        }
      } catch (err) {
        console.error('訂單獲取失敗:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredSortedOrders = [...orders]
    .filter((order) => {
      if (filter === 'processing')
        return order.status === '處理中' || order.status === 'processing'
      if (filter === 'completed')
        return order.status === '已完成' || order.status === 'completed'
      return true
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

  const totalPages = Math.ceil(filteredSortedOrders.length / itemsPerPage)
  const paginatedOrders = filteredSortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])
  useEffect(() => {
    setCurrentPage(1) // 篩選條件變更時，自動回到第一頁
  }, [filter])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold d-flex align-items-center">
                <CiShoppingTag className="me-2" />
                我的訂單
              </h5>
              <select
                className="form-select w-auto"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="desc">日期：從近到遠</option>
                <option value="asc">日期：從遠到近</option>
              </select>
            </div>

            {loading ? (
              <p>載入中...</p>
            ) : filteredSortedOrders.length === 0 ? (
              <p className="text-muted">
                尚無{filter === 'processing' ? '處理中' : '已完成'}訂單紀錄
              </p>
            ) : (
              paginatedOrders.map((order) => {
                const total = Number(order.total_price || 0)
                const discount = Number(order.discount || 0)
                const shipping = Number(order.shipping_fee || 0)
                const date = new Date(order.created_at).toLocaleString('zh-TW')

                return (
                  <div
                    key={order.id}
                    className={`mb-4 p-4 rounded shadow-sm border ${styles.orderCard}`}
                  >
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                      <div>
                        <div className="fw-bold">
                          訂單編號：{order.order_number}
                        </div>
                        <div className="text-muted">訂購日期：{date}</div>
                        <div className="text-muted">
                          付款方式：{order.payment_method_name}
                        </div>
                        {order.items.some(
                          (item) => item.item_type === 'product'
                        ) ? (
                          <div className="text-muted">
                            運送方式：{order.shipping_method}
                          </div>
                        ) : (
                          <div className="text-muted">
                            運送方式：此訂單為課程，無需運送
                          </div>
                        )}
                      </div>

                      <div
                        className="d-flex flex-column justify-content-between align-items-end"
                        style={{ minHeight: '100px' }}
                      >
                        <span className="badge bg-secondary">
                          {order.status}
                        </span>
                        <button
                          className="btn btn-primary btn-sm mt-2"
                          onClick={() =>
                            setExpandedOrderId(
                              expandedOrderId === order.id ? null : order.id
                            )
                          }
                        >
                          {expandedOrderId === order.id
                            ? '收合明細 ▲'
                            : '查看明細 ▼'}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedOrderId === order.id && (
                        <motion.div
                          className="mt-3"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="mb-3">
                            <div>購買人：{order.recipient_name}</div>
                            <div>電話：{order.recipient_phone}</div>
                            <div>信箱：{order.recipient_email}</div>

                            {order.shipping_method === '宅配' &&
                              (order.recipient_address ? (
                                <div>收件地址：{order.recipient_address}</div>
                              ) : null)}

                            {order.shipping_method === '超商' &&
                              (order.store_name ? (
                                <div>取貨門市：{order.store_name}</div>
                              ) : (
                                <div className="text-muted">
                                  （此筆訂單為課程，無超商門市）
                                </div>
                              ))}
                          </div>

                          <ul className="list-unstyled">
                            {order.items?.map((item, idx) => (
                              <li
                                key={idx}
                                className="d-flex border-bottom py-2 gap-3 align-items-center"
                              >
                                <div
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    position: 'relative',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    background: '#eee',
                                  }}
                                >
                                  <Image
                                    src={
                                      item.image_url ||
                                      '/images/default-course.jpg'
                                    }
                                    alt={item.name}
                                    width={60}
                                    height={60}
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <div>
                                    {item.item_type === 'product'
                                      ? '🛒 商品'
                                      : '🎓 課程'}
                                    ：{item.name}
                                  </div>
                                  <div className="text-muted small">
                                    金額：NT${item.price.toLocaleString()}
                                    ｜數量：
                                    {item.quantity}｜小計：NT$
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className="text-end mt-3">
                            <div>總金額：NT${total.toLocaleString()}</div>
                            <div>運費：NT${shipping.toLocaleString()}</div>
                            <div className="text-danger">
                              優惠折扣：-NT${discount.toLocaleString()}
                            </div>
                            <div className="fw-bold">
                              應付金額： NT$
                              {(total - discount + shipping).toLocaleString()}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })
            )}

            {/* 分頁按鈕 */}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                isMobile={isMobile}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}
