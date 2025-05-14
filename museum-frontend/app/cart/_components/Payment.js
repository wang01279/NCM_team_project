'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState('credit')

  const selectPayment = (method) => {
    setSelectedMethod(method)
  }

  return (
    <div className="col-md-12">
      <h4 className="mb-4">付款方式*</h4>
      <div className="accordion shadow-sm" id="paymentAccordion">
        {/* 信用卡 */}
        <div className="accordion-item accordion-payment" id="accordion-credit">
          <h2 className="accordion-header">
            <button
              className="accordion-button accordion-btn-payment"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseCredit"
              onClick={() => selectPayment('credit')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <input
                  className="form-check-input me-2 m-0"
                  type="radio"
                  name="payment"
                  id="creditRadio"
                  checked={selectedMethod === 'credit'}
                  onChange={() => selectPayment('credit')}
                />
                <label htmlFor="creditRadio" className="mb-0">
                  信用卡付款
                </label>
                <div className="ms-auto d-flex gap-2">
                  <Image
                    alt="VISA"
                    src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/visa.sxIq5Dot.svg"
                    width={40}
                    height={25}
                  />
                  <Image
                    alt="MASTERCARD"
                    src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/mastercard.1c4_lyMp.svg"
                    width={40}
                    height={25}
                  />
                  <Image
                    alt="JCB"
                    src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/jcb.BgZHqF0u.svg"
                    width={40}
                    height={25}
                  />
                </div>
              </div>
            </button>
          </h2>
          <div
            id="collapseCredit"
            className="accordion-collapse collapse show"
            data-bs-parent="#paymentAccordion"
          >
            <div className="accordion-body accordion-body-payment">
              <input className="form-control mb-2" placeholder="卡片號碼" />
              <div className="row">
                <div className="col">
                  <input
                    className="form-control mb-2"
                    placeholder="有效期限 (MM / YY)"
                  />
                </div>
                <div className="col">
                  <input className="form-control mb-2" placeholder="安全碼" />
                </div>
              </div>
              <input className="form-control mb-2" placeholder="持卡人姓名" />
            </div>
          </div>
        </div>

        {/* LinePay */}
        <div
          className="accordion-item accordion-payment"
          id="accordion-linepay"
        >
          <h2 className="accordion-header">
            <button
              className="accordion-button accordion-btn-payment collapsed payment-header"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapselinepay"
              onClick={() => selectPayment('linepay')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <input
                  className="form-check-input me-2 m-0"
                  type="radio"
                  name="payment"
                  id="linepayRadio"
                  checked={selectedMethod === 'linepay'}
                  onChange={() => selectPayment('linepay')}
                />
                <label htmlFor="linepayRadio" className="mb-0">
                  LINE Pay付款
                </label>
                <div className="ms-auto d-flex gap-2">
                  <Image
                    src="/images/LINE-Pay.png"
                    alt="LINE Pay"
                    width={80}
                    height={25}
                  />
                </div>
              </div>
            </button>
          </h2>
          <div
            id="collapselinepay"
            className="accordion-collapse collapse"
            data-bs-parent="#paymentAccordion"
          >
            <div className="accordion-body accordion-body-payment">
              您將被導向 LinePay 完成付款。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
