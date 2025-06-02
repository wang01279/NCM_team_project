'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import styles from '@/app/course/_styles/courseDetail.module.scss'

export default function CourseLayout({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    })
  }, [])

  return (
    <div className={`${styles['course-layout']} course-layout`}>
      {children}
    </div>
  )
} 