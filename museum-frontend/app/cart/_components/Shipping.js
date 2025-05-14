'use client'

import React, { useEffect, useState } from 'react'
import twzipcode from 'twzipcode-data'

export default function SelectCity() {
  const [selectedMethod, setSelectedMethod] = useState('home')

  const selectShipping = (method) => {
    setSelectedMethod(method)
  }
  // 地址資料
  const [cities, setCities] = useState([])
  const [zipcodes, setZipcodes] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [address, setAddress] = useState('')
  const [store, setStore] = useState('') // 超商門市名稱

  useEffect(() => {
    const data = twzipcode()
    setCities(data.counties)
    setZipcodes(data.zipcodes)
  }, [])

  const handleCityChange = (e) => {
    const cityName = e.target.value
    setSelectedCity(cityName)
    setSelectedDistrict('')
    const filteredDistricts = zipcodes.filter((z) => z.county === cityName)
    setDistricts(filteredDistricts)
  }

  return (
    <div className="col-md-12">
      <h4 className="mb-4">付款與取貨方式*</h4>
      <div className="accordion shadow-sm" id="shippingAccordion">
        {/* 宅配 */}
        <div className="accordion-item accordion-shipping">
          <h2 className="accordion-header">
            <button
              className="accordion-button accordion-btn-shipping"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseHome"
              onClick={() => selectShipping('home')}
            >
              <div className="d-flex align-items-center">
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
            </button>
          </h2>
          <div
            id="collapseHome"
            className="accordion-collapse collapse show"
            data-bs-parent="#shippingAccordion"
          >
            <div className="accordion-body accordion-body-shipping">
              <div className="row mb-3">
                <div className="col">
                  <label>縣市</label>
                  <select
                    className="form-select"
                    onChange={handleCityChange}
                    value={selectedCity}
                  >
                    <option value="">請選擇縣市</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <label>區域</label>
                  <select
                    className="form-select"
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    value={selectedDistrict}
                    disabled={!selectedCity}
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
                  type="text"
                  className="form-control"
                  placeholder="輸入詳細地址"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 超商取貨付款 */}
        <div className="accordion-item accordion-shipping">
          <h2 className="accordion-header">
            <button
              className="accordion-button accordion-btn-shipping collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseStore"
              onClick={() => selectShipping('store')}
            >
              <div className="d-flex align-items-center">
                <input
                  className="form-check-input me-2 m-0"
                  type="radio"
                  id="storeRadio"
                  name="shipping"
                  checked={selectedMethod === 'store'}
                  onChange={() => selectShipping('store')}
                />
                <label htmlFor="storeRadio" className="mb-0">
                  超商取貨
                </label>
              </div>
            </button>
          </h2>
          <div
            id="collapseStore"
            className="accordion-collapse collapse"
            data-bs-parent="#shippingAccordion"
          >
            <div className="accordion-body accordion-body-shipping">
              <label>門市名稱或編號</label>
              <input
                type="text"
                className="form-control"
                placeholder="請輸入您要取貨的門市（例如：7-11 光明店）"
                value={store}
                onChange={(e) => setStore(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
