'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { FaImage, FaPalette } from 'react-icons/fa'

export default function CoverEditor({
  coverImage = '/profile/images/gg.gif',
  onCoverUpload,
  onColorSelect,
}) {
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleColorPick = (color) => {
    onColorSelect?.(color)
    setShowColorPicker(false)
  }

  return (
    <motion.div className="low-content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="cover-edit-btn">
        <div className="edit-options">
          <label htmlFor="coverUpload" className="btn btn-light btn-sm" title="上傳圖片">
            <FaImage />
          </label>
          <input
            type="file"
            id="coverUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onCoverUpload}
          />
          <button
            className="btn btn-light btn-sm color-picker-btn"
            title="選擇顏色"
            onClick={() => setShowColorPicker((prev) => !prev)}
          >
            <FaPalette />
          </button>
          <div className={`color-picker ${showColorPicker ? 'show' : ''}`}>
            {['#f8f1e3', '#e3d5ca', '#d4a373', '#a5a58d', '#6b705c'].map((color, i) => (
              <div
                key={i}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => handleColorPick(color)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <img src={coverImage} alt="封面" className="cover-image" />
    </motion.div>
  )
}
