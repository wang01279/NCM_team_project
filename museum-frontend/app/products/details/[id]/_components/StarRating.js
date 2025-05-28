// app/products/details/[id]/_components/StarRating.js (新檔名)

'use client'

import React, { useState, useEffect } from 'react'
import '../_styles/StarRating.scss' // <--- 更改為普通的 SCSS 檔案路徑，移除 .module

export default function StarRating({
  value = 0,
  max = 5,
  onChange = () => {},
  fillColor = 'gold',
  emptyColor = 'gray',
  icon = <>&#9733;</>, // 預設為星星 ★
  readOnly = false,
}) {
  const [rating, setRating] = useState(value)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    setRating(value)
  }, [value])

  return (
    <div className="star-container">
      {' '}
      {/* <--- 注意這裡：直接使用類名，不再是 styles.starContainer */}
      {Array(max)
        .fill(1)
        .map((_, i) => {
          const score = i + 1

          return (
            <button
              key={i}
              type="button" // <--- 關鍵修改：添加 type="button"
              className="star-btn" // <--- 注意這裡：直接使用類名
              onClick={() => {
                if (!readOnly) {
                  setRating(score)
                  onChange(score)
                }
              }}
              onMouseEnter={() => !readOnly && setHoverRating(score)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
              style={{
                cursor: readOnly ? 'default' : 'pointer',
                pointerEvents: readOnly ? 'none' : 'auto', // 完全停用互動
              }}
            >
              <span
                className={
                  score <= (hoverRating || rating) ? 'star-on' : 'star-off' // <--- 注意這裡：直接使用類名
                }
                style={{
                  '--fill-color': fillColor,
                  '--empty-color': emptyColor,
                }}
              >
                {icon}
              </span>
            </button>
          )
        })}
    </div>
  )
}
