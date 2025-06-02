'use client'
import React from 'react'
import Link from 'next/link'
import { FaEdit, FaEye } from 'react-icons/fa'
import styles from './style.module.scss'

export default function CouponTable({
  coupons = [],
  order = 0,
  queryString = '',
}) {
  if (coupons.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">⚠ 找不到符合條件的優惠券，請重新篩選。</p>
      </div>
    )
  }

  const getSortIcon = (orderValue, upIconOrder, downIconOrder) => {
    if (order === upIconOrder) return 'fa-sort-up'
    if (order === downIconOrder) return 'fa-sort-down'
    return 'fa-sort'
  }

  const formatDiscount = (discount, type) => {
    if (type === '現金') return `$${discount}`
    if (type === '百分比') return `${discount}P`
    return discount // fallback
  }


  return (
    <div className="table-responsive p-0">
      <table
        className={`table ${styles.couponTable} table-hover table-bordered align-items-center justify-content-center`}
      >
        <thead className="text-center">
          <tr>
            <th className="fs-6">名稱</th>
            <th className="fs-6">折扣碼</th>
            <th className="fs-6">適用範圍</th>
            <th className="fs-6">折扣</th>
            <th className="fs-6">低消金額</th>
            <th>領券截止日期 </th>
            <th className="">優惠券過期日期 </th>
            <th className="  text-s">狀態</th>
            <th className="  text-s">操作</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {coupons.map((coupon) => {
            const formatDate = (dateStr) =>
              dateStr ? new Date(dateStr).toISOString().split('T')[0] : ''

            return (
              <tr key={coupon.id}>
                <td>{coupon.name}</td>
                <td>{coupon.code}</td>
                <td>{coupon.category}</td>
                <td>{formatDiscount(coupon.discount, coupon.type)}</td>
                <td>{coupon.minSpend.toLocaleString('en-US')}</td>
                <td>{formatDate(coupon.endDate)}</td>
                <td>{formatDate(coupon.expired_at)}</td>
                <td>
                  {coupon.status === '啟用' ? (
                    <strong className="text-dark">啟用</strong>
                  ) : (
                    <strong className="text-white btn btn-sm bg-danger">
                      停用
                    </strong>
                  )}
                </td>
                <td>
                  {/* <Link
                    className="btn-light me-1"
                    href={`/coupons/${coupon.id}`}
                  >
                    <FaEye />
                  </Link> */}
                  <Link
                    // className=""
                    href={`/coupons/edit/${coupon.id}`}
                  >
                    <FaEdit />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
