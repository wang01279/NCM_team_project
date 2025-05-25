'use client'
import { useState } from 'react'
import { Offcanvas, Button } from 'react-bootstrap'
import { FaTicketAlt } from "react-icons/fa"
import styles from '../_styles/CouponLink.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CouponLink() {
  const [show, setShow] = useState(false)
  const router = useRouter()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const goToCoupons = () => router.push('/coupons')

  const couponList = [
    {
      name: '夏季 8 折券',
      value: 'NT$200',
      min: 'NT$2000',
      type: '現金',
      endDate: '2025-06-30',
      bgImage: '/images/coupon1.jpg',
    },
    {
      name: '夏季 85 折券',
      value: '15% OFF',
      min: 'NT$1800',
      type: '折扣',
      endDate: '2025-06-30',
      bgImage: '/images/coupon1.jpg',
    },
    {
      name: '夏季 9 折券',
      value: '10% OFF',
      min: 'NT$1000',
      type: '折扣',
      endDate: '2025-06-30',
      bgImage: '/images/coupon1.jpg',
    },
  ]

  return (
    <>
      <Button variant="primary" onClick={handleShow} className={styles.customCouponBtn}>
        <h6 className={`d-flex align-items-center p-0 m-0 ${styles.couponTextColor}`}>
          <FaTicketAlt className='me-2' />coupon
        </h6>
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><strong>推薦優惠券</strong></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='d-flex justify-content-center flex-column align-items-center'>

          {couponList.map((coupon, idx) => (
            <div
              key={idx}
              className={`${styles.couponCard} d-flex flex-row position-relative mt-4`}
              onClick={goToCoupons}
              style={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              <div
                className={styles.imageContainer}
                style={{
                  backgroundImage: `url("${coupon.bgImage}")`,
                }}
              >
                <div className={styles.overlay}>
                  <span className={styles.hintText}>前往領取</span>
                </div>
              </div>

              <div className={`p-3 ${styles.cardbody}`}>
                <div className="text-end text-muted small">
                  <Image
                    src="/images/logo-outline.png"
                    alt="Logo"
                    width={18}
                    height={18}
                    className="p-0 pb-1 me-1"
                    style={{ objectFit: 'contain' }}
                  />
                  {coupon.name}
                </div>
                <h3 className="fw-bold mt-0">{coupon.value}</h3>
                <p className="mb-0 small text-dark">低消 {coupon.min}</p>
                <p className="mb-0 small text-dark">領券期限：{coupon.endDate}</p>
              </div>
            </div>
          ))}

          <Button variant="warning" href="/coupons" className='text-center text-decoration-none mt-5'>
            <h6 className='m-0 p-1'>前往領取中心</h6>
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
