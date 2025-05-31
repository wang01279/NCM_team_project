'use client'

import React, { useState } from 'react'
import { Collapse } from 'react-bootstrap'
import styles from '../_style/OrderCard.module.scss' // 假設樣式放這

export default function OrderCard({ order }) {
  const [open, setOpen] = useState(false)

  const total = Number(order.total_price || 0)
  const discount = Number(order.discount || 0)
  const date = new Date(order.created_at).toLocaleDateString()

  const getStatusText = (status) => {
    switch (status) {
      case '已付款':
        return '已付款'
      case '處理中':
        return '處理中'
      case '已取消':
        return '已取消'
      case '已完成':
        return '已完成'
      default:
        return status
    }
  }

  return (
    <div className={styles.orderCard}>
      <div className={styles.leftBar}></div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <div className={styles.label}>訂單編號：</div>
            <div className={styles.orderNumber}>{order.order_number}</div>
          </div>
          <span className={styles.status}>{getStatusText(order.status)}</span>
        </div>

        <div className={styles.meta}>
          <p>下單日期：{date}</p>
          <p>付款方式：{order.payment_method}</p>
          <p>取件方式：{order.shipping_method}</p>
        </div>

        <div className={styles.items}>
          {order.items.map((item, idx) => (
            <div key={idx} className={styles.item}>
              <span className={styles.itemType}>
                {item.item_type === 'product' ? '🛒 商品' : '🎓 課程'}：
              </span>
              <span className={styles.itemName}>
                {item.name} × {item.quantity}
              </span>
              <span className={styles.itemPrice}>
                NT$ {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.total}>
          小計：<span>NT$ {(total - discount).toLocaleString()}</span>
        </div>

        <div className={styles.toggle}>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setOpen(!open)}
          >
            {open ? '收起明細' : '查看明細'}
          </button>
        </div>

        <Collapse in={open}>
          <div className={styles.detail}>
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
            {order.shipping_address && (
              <p>
                <strong>配送地址：</strong>
                {order.shipping_address}
              </p>
            )}
          </div>
        </Collapse>
      </div>
    </div>
  )
}
