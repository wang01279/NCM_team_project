'use client'

import React, { useState, useEffect } from 'react'
import styles from './cover.module.scss'

export default function LowContent() {
  // 打字機效果
  const fullText = '歡迎成為故瓷會員～'
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let i = 0
    let typingTimer

    function startTyping() {
      typingTimer = setInterval(() => {
        setDisplayText(fullText.slice(0, i + 1))
        i++
        if (i === fullText.length) {
          clearInterval(typingTimer)
          setTimeout(() => {
            setDisplayText('')
            i = 0
            startTyping()
          }, 1200)
        }
      }, 120)
    }

    startTyping()
    return () => clearInterval(typingTimer)
  }, [])

  return (
    <div className={styles.coverContainer}>
      <div
        className={styles.coverImage}
        // 漸層流動背景，樣式寫在 SCSS
      />
      <div className={styles.textOverlay}>
        <span className={styles.typewriter}>{displayText}</span>
      </div>
    </div>
  )
}
