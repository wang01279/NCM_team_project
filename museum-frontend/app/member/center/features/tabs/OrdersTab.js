'use client'

import React, { useEffect, useState } from 'react'
import { CiShoppingTag } from 'react-icons/ci'
import styles from './_style/memOrders.module.scss'

export default function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('處理中') // 狀態切換

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const member = JSON.parse(localStorage.getItem('member') || '{}')
        const res = await fetch(
          `http://localhost:3005/api/orders/${member.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const data = await res.json()
        if (data.success) setOrders(data.orders)
        else alert(data.message || '載入訂單失敗')
      } catch (err) {
        console.error('訂單獲取失敗:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // 假狀態分類邏輯：id 為奇數 => 處理中；偶數 => 已完成
  const filteredOrders = orders.filter((order) => {
    return filterStatus === '處理中' ? order.id % 2 === 1 : order.id % 2 === 0
  })

  return (
    <div className="container mt-4">
      <h5 className="fw-bold mb-4 d-flex align-items-center">
        <CiShoppingTag className="me-2" />
        我的訂單
      </h5>

      {/* 狀態切換按鈕 */}
      <div className="mb-4">
        <button
          className={`btn me-2 ${
            filterStatus === '處理中' ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => setFilterStatus('處理中')}
        >
          處理中
        </button>
        <button
          className={`btn ${
            filterStatus === '已完成' ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => setFilterStatus('已完成')}
        >
          已完成
        </button>
      </div>

      {/* 訂單清單 */}
      {loading ? (
        <p>載入中...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-muted">尚無{filterStatus}訂單紀錄</p>
      ) : (
        filteredOrders.map((order) => {
          const total = Number(order.total_price || 0)
          const discount = Number(order.discount || 0)
          const shipping = Number(order.shipping_fee || 0)
          const date = new Date(order.created_at).toLocaleDateString()

          return (
            <div
              key={order.id}
              className={`mb-4 p-4 rounded shadow-sm ${styles.orderCard}`}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">訂單編號：{order.order_number}</h6>
                <span className="badge bg-secondary">{filterStatus}</span>
              </div>

              <p className="text-muted mb-2">下單日期：{date}</p>

              <div className="mb-2">
                <strong>付款方式：</strong>
                {order.payment_method}
                <br />
                <strong>取件方式：</strong>
                {order.shipping_method}
              </div>

              <div className="mb-2">
                <strong>訂購項目：</strong>
                <ul className="list-unstyled mt-2 ps-3">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="d-flex flex-wrap justify-content-between align-items-center border-bottom py-2"
                    >
                      <span>
                        {item.item_type === 'product' ? '🛒 商品' : '🎓 課程'}：
                        {item.name}
                      </span>
                      <div className="ms-3 d-flex flex-column flex-md-row gap-2 text-end">
                        <span>金額：NT${item.price.toLocaleString()}</span>
                        <span>數量：{item.quantity}</span>
                        <span>
                          小計：NT$
                          {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
