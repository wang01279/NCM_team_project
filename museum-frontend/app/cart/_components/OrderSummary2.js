'use client'

import Accordion from 'react-bootstrap/Accordion'

export default function OrderSummary2({
  cartItems,
  discountInfo,
  shippingMethod,
}) {
  const productSubtotal = cartItems
    .filter((item) => item.type === 'product')
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const courseSubtotal = cartItems
    .filter((item) => item.type === 'course')
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalSubtotal = productSubtotal + courseSubtotal

  const productDiscount = discountInfo?.productDiscount || 0
  const courseDiscount = discountInfo?.courseDiscount || 0
  const totalDiscount = productDiscount + courseDiscount

  // ✅ 根據運送方式決定運費
  const shippingFee = shippingMethod === '超商' ? 45 : 50

  const finalTotal =
    productSubtotal +
    courseSubtotal -
    productDiscount -
    courseDiscount +
    shippingFee

  return (
    <div className="col-12 mb-4">
      <div
        className="card sticky-top p-3 order-bg"
        style={{ position: 'sticky', top: '66px', zIndex: 10 }}
      >
        <div className="card-body">
          <div
            className="fs-4 mb-4 pb-3"
            style={{ borderBottom: '2px solid #000' }}
          >
            訂單資訊
          </div>

          <div className="mt-4 mb-4">
            {productSubtotal > 0 && (
              <>
                <div className="d-flex justify-content-between">
                  <div>商品金額</div>
                  <div>${productSubtotal.toLocaleString()}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>商品折扣</div>
                  <div>- ${productDiscount.toLocaleString()}</div>
                </div>
              </>
            )}

            {courseSubtotal > 0 && (
              <>
                <div className="d-flex justify-content-between">
                  <div>課程金額</div>
                  <div>${courseSubtotal.toLocaleString()}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>課程折扣</div>
                  <div>- ${courseDiscount.toLocaleString()}</div>
                </div>
              </>
            )}

            <div className="d-flex justify-content-between">
              <div>運費（{shippingMethod || '宅配'}）</div>
              <div>${shippingFee.toLocaleString()}</div>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <div>合計</div>
              <div>${finalTotal.toLocaleString()}</div>
            </div>
          </div>

          <Accordion defaultActiveKey="0" className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header style={{ marginTop: '0px' }}>
                查看商品詳情
              </Accordion.Header>
              <Accordion.Body>
                {cartItems.map((item, index) => (
                  <div
                    className="d-flex justify-content-between"
                    key={`${item.id}-${index}`}
                  >
                    <div className="me-3">
                      {item.name} × {item.quantity}
                    </div>
                    <div>${(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}

                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <div>小計</div>
                  <div>
                    ${(productSubtotal + courseSubtotal).toLocaleString()}
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
