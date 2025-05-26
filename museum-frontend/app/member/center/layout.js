'use client'

import React from 'react'
import styles from './styles/center.module.scss'
import Navbar from '@/app/_components/navbar'
import Footer from '@/app/_components/footer3'

export default function MemberCenterLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className={styles.container}>{children}</div>
      <Footer />
    </>
  )
}
