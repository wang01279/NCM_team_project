'use client'

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

  return (
    <div className="col-md-4 col-12">
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
                <label className="form-label">商品優惠券</label>
                <select
                  className="form-select mb-2"
                  onChange={(e) => {
                    const code = e.target.value
                    const coupon = productCoupons.find(
                      (c) => c.uuid_code === code
                    )
                    onProductCouponChange(coupon || null)
                  }}
                >
                  <option value="">請選擇商品優惠券</option>
                  {productCoupons.map((c) => (
                    <option
                      key={c.uuid_code}
                      value={c.uuid_code}
                      disabled={!c.isAvailable}
                    >
                      {c.type === '百分比'
                        ? `滿${c.minSpend} 享 ${c.discount}% 折`
                        : `滿${c.minSpend} 折 ${c.discount} 元`}
                      {!c.isAvailable && `（${c.reason}）`}
                    </option>
                  ))}
                </select>
              </>
            )}

            {courseTotal > 0 && (
              <>
                <label className="form-label">課程優惠券</label>
                <select
                  className="form-select"
                  onChange={(e) => {
                    const code = e.target.value
                    const coupon = courseCoupons.find(
                      (c) => c.uuid_code === code
                    )
                    onCourseCouponChange(coupon || null)
                  }}
                >
                  <option value="">請選擇課程優惠券</option>
                  {courseCoupons.map((c) => (
                    <option
                      key={c.uuid_code}
                      value={c.uuid_code}
                      disabled={!c.isAvailable}
                    >
                      {c.type === '百分比'
                        ? `滿${c.minSpend} 享 ${c.discount}% 折`
                        : `滿${c.minSpend} 折 ${c.discount} 元`}
                      {!c.isAvailable && `（${c.reason}）`}
                    </option>
                  ))}
                </select>
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
    </div>
  )
}
