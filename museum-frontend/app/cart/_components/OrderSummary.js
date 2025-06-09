'use client'

import Select from 'react-select'

export default function OrderSummary({
  items = [],
  productCoupons = [],
  courseCoupons = [],
  onProductCouponChange = () => {},
  onCourseCouponChange = () => {},
  productDiscount = 0,
  courseDiscount = 0,
}) {
  if (items.length === 0) return null

  const productTotal = items
    .filter((item) => item.type === 'product')
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const courseTotal = items
    .filter((item) => item.type === 'course')
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const finalTotal =
    productTotal - productDiscount + courseTotal - courseDiscount

  const toSelectOptions = (coupons) =>
    coupons.map((c) => ({
      value: c.uuid_code,
      label:
        (c.type === '百分比'
          ? `滿${c.minSpend} 享 ${c.discount}% 折扣`
          : `滿${c.minSpend} 折 ${c.discount} 元`) +
        (!c.isAvailable ? `（${c.reason}）` : ''),
      isDisabled: !c.isAvailable,
      original: c,
    }))

  return (
    <div
      className="card sticky-top p-3 order-bg"
      style={{ position: 'sticky', top: '66px', zIndex: 11 }}
    >
      <div className="card-body">
        <div className="card-title fs-4 mb-4">訂單資訊</div>

        {/* 優惠券選擇區塊 */}
        <div className="mb-3">
          {productTotal > 0 && (
            <>
              <label className="form-label mb-1">商品優惠券</label>
              <Select
                className="react-selectinput-container mb-2"
                classNamePrefix="react-select"
                options={toSelectOptions(productCoupons)}
                isClearable
                placeholder="請選擇商品優惠券"
                onChange={(selected) =>
                  onProductCouponChange(selected?.original || null)
                }
                menuPortalTarget={
                  typeof window !== 'undefined' ? document.body : null
                }
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </>
          )}

          {courseTotal > 0 && (
            <>
              <label className="form-label mb-1">課程優惠券</label>
              <Select
                className="react-selectinput-container"
                classNamePrefix="react-select"
                options={toSelectOptions(courseCoupons)}
                isClearable
                placeholder="請選擇課程優惠券"
                onChange={(selected) =>
                  onCourseCouponChange(selected?.original || null)
                }
                menuPortalTarget={
                  typeof window !== 'undefined' ? document.body : null
                }
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </>
          )}
        </div>

        {/* 小計與折扣 */}
        <div className="mb-3">
          {productTotal > 0 && (
            <>
              <div className="d-flex justify-content-between mb-2">
                <div>商品小計</div>
                <div>${productTotal.toLocaleString()}</div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <div>商品折扣</div>
                <div>-${productDiscount.toLocaleString()}</div>
              </div>
              <hr />
            </>
          )}

          {courseTotal > 0 && (
            <>
              <div className="d-flex justify-content-between mb-2">
                <div>課程小計</div>
                <div>${courseTotal.toLocaleString()}</div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <div>課程折扣</div>
                <div>-${courseDiscount.toLocaleString()}</div>
              </div>
              <hr />
            </>
          )}

          <div className="d-flex justify-content-between mb-2 fw-bold">
            <div>合計</div>
            <div>${finalTotal.toLocaleString()}</div>
          </div>
        </div>

        <a href="/cart/checkout" className="btn btn-checkout w-100">
          前往結帳
        </a>
      </div>
    </div>
  )
}
