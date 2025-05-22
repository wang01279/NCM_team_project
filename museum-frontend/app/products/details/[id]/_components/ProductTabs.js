'use client'

import React, { useState } from 'react'
import '../_styles/ProductTabs.scss'

export default function ProductTabs({ product, notes = [] }) {
  const [activeTab, setActiveTab] = useState('desc')

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="container product-tab">
      <div className="row">
        {/* 左側選單 + 中線 */}
        <div className="col-12 col-md-2 mb-4 mb-md-0 tab-left">
          <div className="tab-nav">
            <button
              className={`tab-button ${activeTab === 'desc' ? 'active' : ''}`}
              data-tab="desc"
              onClick={() => handleTabClick('desc')}
            >
              商品說明
            </button>
            <button
              className={`tab-button ${activeTab === 'note' ? 'active' : ''}`}
              data-tab="note"
              onClick={() => handleTabClick('note')}
            >
              注意事項
            </button>
          </div>
        </div>

        {/* 右側內容 */}
        <div className="col-12 col-md-10">
          {/* 商品說明 */}
          <div
            className={`tab-content desc ${activeTab === 'desc' ? 'active' : ''}`}
          >
            <h4 className="fw-bold">商品說明</h4>
            <p className="mb-2">{product?.name_zh}</p>
            <p className="desc-text">文物描述：{product?.details}</p>

            <div className="row border-top border-1 text-center fw-bold py-2">
              <div className="col-4">材質</div>
              <div className="col-4">出產地</div>
              <div className="col-4">用途(功能)</div>
            </div>
            <div className="row text-center py-2">
              <div className="col-4">{product?.material_name}</div>
              <div className="col-4">{product?.origin_name}</div>
              <div className="col-4">{product?.function_name}</div>
            </div>
          </div>

          {/* 注意事項 */}
          <div
            className={`tab-content note ${activeTab === 'note' ? 'active' : ''}`}
          >
            <h4 className="fw-bold">注意事項</h4>
            {notes.length > 0 ? (
              <ul className="desc-text">
                {notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            ) : (
              <p className="desc-text">目前無特別注意事項。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
