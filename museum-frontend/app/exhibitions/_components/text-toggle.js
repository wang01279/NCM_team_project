'use client'

import React, { useState } from 'react'
import styles from '../_styles/ex-toggle.module.scss'

export default function TextToggle({ text, maxLine = 2 }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="d-flex flex-column align-items-end">
      <p
        className={expanded ? styles.full : styles.ellipsis}
        style={{ WebkitLineClamp: maxLine }}
      >
        {text}
      </p>
      {text.length > 50 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={styles.toggleBtn}
        >
          {expanded ? '[收起]' : '[查看全文]'}
        </button>
      )}
    </div>
  )
}
