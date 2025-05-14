'use client'

import React from 'react'
import styles from './styles/center.module.scss'

export default function MemberCenterLayout({ children }) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
} 