'use client'

import React from 'react'

export default function OrderSummary2() {
  return (
    <div className="col-md-4 col-12 mb-4">
      <div className="card sticky-top p-3">
        <div className="card-body">
          <div
            className="fs-4 mb-4 pb-3"
            style={{ borderBottom: '2px solid #000' }}
          >
            訂單資訊
          </div>

          {/* 商品詳情 */}
          <div className="accordion mb-4" id="orderAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingProduct">
                <button
                  className="accordion-button p-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseProduct"
                  aria-expanded="true"
                  aria-controls="collapseProduct"
                >
                  商品詳情
                </button>
              </h2>
              <div
                id="collapseProduct"
                className="accordion-collapse collapse show"
                aria-labelledby="headingProduct"
                data-bs-parent="#orderAccordion"
              >
                <div
                  className="accordion-body"
                  style={{ borderBottom: '2px dashed #000' }}
                >
                  <div className="d-flex justify-content-between">
                    <div>青花瓷瓶天球瓶(小)*1</div>
                    <div>$1,200</div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>青花瓷瓶天球瓶(小)*1</div>
                    <div>$1,400</div>
                  </div>
                  <div className="d-flex justify-content-between text-muted">
                    <div>優惠折扣</div>
                    <div>-$100</div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <div>合計</div>
                    <div>$2,500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 課程詳情 */}
          <div className="accordion" id="orderAccordion2">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingCourse">
                <button
                  className="accordion-button collapsed p-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseCourse"
                  aria-expanded="false"
                  aria-controls="collapseCourse"
                >
                  課程詳情
                </button>
              </h2>
              <div
                id="collapseCourse"
                className="accordion-collapse"
                aria-labelledby="headingCourse"
                data-bs-parent="#orderAccordion2"
              >
                <div className="accordion-body">
                  <div className="d-flex justify-content-between">
                    <div>手作陶藝課*1(門)</div>
                    <div>$2,000</div>
                  </div>
                  <div className="d-flex justify-content-between text-muted">
                    <div>優惠折扣</div>
                    <div>-$200</div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <div>合計</div>
                    <div>$1,900</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 總結金額 */}
          <div className="mt-4">
            <div className="d-flex justify-content-between">
              <div>總金額</div>
              <div>$4,600</div>
            </div>
            <div className="d-flex justify-content-between">
              <div>運費</div>
              <div>$50</div>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <div>合計</div>
              <div>$4,450</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
