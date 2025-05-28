'use client'

import React, { useEffect, useState } from 'react'
import { Collapse } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { CiShoppingTag } from 'react-icons/ci'
// import { HiOutlineChevronDown } from 'react-icons/hi'
import './_style/memOrders.module.scss'

export default function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [openOrderId, setOpenOrderId] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const member = JSON.parse(localStorage.getItem('member') || '{}')
        const memberId = member.id

        const res = await fetch(
          `http://localhost:3005/api/orders/${memberId}`,
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

  return (
    <div className="container mt-4">
      <h5 className="mb-3 fw-bold">
        <CiShoppingTag /> 我的訂單
      </h5>

      <table className="table order-table table-rounded text-center">
        <thead>
          <tr>
            <th>訂單編號</th>
            <th>訂單金額</th>
            <th>付款方式</th>
            <th>訂單日期</th>
            <th>訂單明細</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">載入中...</td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-muted">
                尚無訂單紀錄
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const total = Number(order.total_price || 0)
              const date = new Date(order.created_at).toLocaleDateString()

              return (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>{order.order_number}</td>
                    <td>${total.toLocaleString()}</td>
                    <td>{order.payment_method}</td>
                    <td>{date}</td>
                    <td>
                      <button
                        className="btn btn-link text-decoration-none"
                        onClick={() =>
                          setOpenOrderId(
                            openOrderId === order.id ? null : order.id
                          )
                        }
                      >
                        {openOrderId === order.id ? '收起' : '查看明細'}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="p-0 border-0">
                      <Collapse in={openOrderId === order.id}>
                        <div className="p-4 bg-light-subtle border-top">
                          <div className="row">
                            <div className="h2 text-start mb-4">訂單資訊</div>
                            <div className="col-md-6 text-start">
                              <p>
                                <strong>訂單編號：</strong>
                                {order.order_number}
                              </p>
                              <p>
                                <strong>訂單日期：</strong>
                                {date}
                              </p>
                              <p>
                                <strong>收件人姓名：</strong>
                                {order.recipient_name}
                              </p>
                              <p>
                                <strong>聯絡電話：</strong>
                                {order.recipient_phone}
                              </p>
                              <p>
                                <strong>聯絡信箱：</strong>
                                {order.recipient_email}
                              </p>
                              <p>
                                <strong>取件方式：</strong>
                                {order.shipping_method}
                              </p>

                              <p>
                                <strong>付款方式：</strong>
                                {order.payment_method}
                              </p>
                            </div>
                            <div className="col-md-6 text-start">
                              <h6>商品明細</h6>
                              <ul className="list-unstyled">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>
                                    {item.item_type === 'product'
                                      ? '🛒 商品'
                                      : '🎓 課程'}
                                    ：{item.name}（{item.price} x{' '}
                                    {item.quantity}） = $
                                    {item.price * item.quantity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="text-end mt-3">
                            <p>小計：${total.toLocaleString()}</p>
                            <p className="text-danger">
                              折扣：-${order.discount || 0}
                            </p>
                            <h5>
                              合計：$
                              {(total - (order.discount || 0)).toLocaleString()}
                            </h5>
                          </div>
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
