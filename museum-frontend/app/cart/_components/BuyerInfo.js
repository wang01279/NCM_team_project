import React from 'react'

export default function BuyerInfo() {
  return (
    <div className="col-md-12">
      <h4 className="mb-4">購買人資訊*</h4>
      <div
        className="border card p-3 shadow-sm"
        style={{ border: '#000 1px solid' }}
      >
        <label htmlFor="name" className="form-label fw-bold">
          購買人姓名:
        </label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="請輸入真實姓名"
          required=""
        />
        <label htmlFor="phone" className="form-label fw-bold">
          連絡電話:
        </label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="輸入手機號碼"
          required=""
        />
        <label htmlFor="email" className="form-label fw-bold">
          連絡信箱:
        </label>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="輸入電子信箱"
          required=""
        />
      </div>
    </div>
  )
}
