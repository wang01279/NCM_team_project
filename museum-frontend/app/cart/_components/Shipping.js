'use client'

import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'
import React, { useEffect, useState } from 'react'
import twzipcode from 'twzipcode-data'
import Image from 'next/image'

export default function Shipping({ value, onChange, store711, openWindow }) {
  /* ---------- 區域／縣市下拉 ---------- */
  const [cities, setCities] = useState([])
  const [zipcodes, setZipcodes] = useState([])
  const [districts, setDistricts] = useState([])

  useEffect(() => {
    const data = twzipcode()
    setCities(data.counties)
    setZipcodes(data.zipcodes)
  }, [])

  const handleCityChange = (e) => {
    const cityName = e.target.value
    setDistricts(zipcodes.filter((z) => z.county === cityName))
    onChange({ ...value, city: cityName, district: '' })
  }

  const handleDistrictChange = (e) =>
    onChange({ ...value, district: e.target.value })

  /* ---------- 宅配 / 超商 切換 ---------- */
  const methodMap = { home: '宅配', store: '超商' }
  const selectedMethod =
    Object.entries(methodMap).find(
      ([, v]) => v === value.shippingMethod
    )?.[0] || ''

  const selectShipping = (key) => {
    const method = methodMap[key]
    onChange({
      ...value,
      shippingMethod: method,
      ...(method === '宅配'
        ? { store: '' }
        : { city: '', district: '', address: '' }),
    })
  }

  /* ---------- 一般地址輸入 ---------- */
  const handleAddressChange = (e) =>
    onChange({ ...value, address: e.target.value })

  /* ---------- 當 store711 更新時，同步寫入 shipping.store ---------- */
  useEffect(() => {
    if (store711?.storename && store711?.storeaddress) {
      onChange({
        ...value,
        store: `${store711.storename} (${store711.storeaddress})`,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store711])

  return (
    <div className="col-md-12">
      <h4 className="mb-4">付款與取貨方式*</h4>

      <Accordion defaultActiveKey="home">
        {/* ---------- 宅配 ---------- */}
        <Accordion.Item eventKey="home" className="accordion-item-shipping">
          <Accordion.Header onClick={() => selectShipping('home')}>
            <div className="d-flex align-items-center w-100">
              <input
                className="form-check-input me-2 m-0"
                type="radio"
                name="shipping"
                id="homeRadio"
                checked={selectedMethod === 'home'}
                onChange={() => selectShipping('home')}
              />
              <label htmlFor="homeRadio" className="mb-0">
                宅配到府
              </label>
            </div>
          </Accordion.Header>

          <Accordion.Body>
            <div className="row mb-3">
              <div className="col">
                <label>縣市</label>
                <select
                  className="form-select"
                  value={value.city || ''}
                  onChange={handleCityChange}
                >
                  <option value="">請選擇縣市</option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <label>區域</label>
                <select
                  className="form-select"
                  value={value.district || ''}
                  onChange={handleDistrictChange}
                  disabled={!value.city}
                >
                  <option value="">請選擇區域</option>
                  {districts.map((d) => (
                    <option key={`${d.zipcode}-${d.city}`} value={d.city}>
                      {d.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label>地址</label>
              <input
                className="form-control"
                type="text"
                placeholder="輸入詳細地址"
                value={value.address || ''}
                onChange={handleAddressChange}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* ---------- 超商取貨 ---------- */}
        <Accordion.Item eventKey="store" className="accordion-item-shipping">
          <Accordion.Header onClick={() => selectShipping('store')}>
            <div className="d-flex align-items-center w-100">
              <input
                className="form-check-input me-2 m-0"
                type="radio"
                name="shipping"
                id="storeRadio"
                checked={selectedMethod === 'store'}
                onChange={() => selectShipping('store')}
              />
              <label htmlFor="storeRadio" className="mb-0">
                超商取貨
              </label>
            </div>
          </Accordion.Header>

          <Accordion.Body className="accordion-body-shipping">
            {/* 選店按鈕 */}
            <div className="mb-3">
              <label className="d-flex align-items-center mb-3">
                <Image
                  className="me-2"
                  src="/cart-img/7-eleven_logo.svg"
                  alt="購物車圖示"
                  width={24}
                  height={24}
                />
                7-11 門市
              </label>
              <button
                type="button"
                className="btn btn-outline-dark w-100 mb-2"
                onClick={openWindow}
              >
                {store711?.storename ? '更改門市' : '選擇門市'}
              </button>
            </div>

            {store711?.storename && store711?.storeaddress && (
              <div className="border rounded p-3 bg-light mt-2">
                <p className="mb-1">門市：{store711.storename}</p>
                <p className="mb-1">地址：{store711.storeaddress}</p>
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
