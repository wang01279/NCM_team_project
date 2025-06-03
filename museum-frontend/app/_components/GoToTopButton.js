'use client'
import { useEffect, useState } from 'react'
import styles from '../_styles/GoToTopButton.module.scss'

export default function GoToTopButton() {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 900)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    showButton && (
      <button className={`${styles.goToTop} ${showButton ? 'visible' : 'hidden'}`} onClick={scrollToTop} aria-label="Back to top">
        ⬆
      </button>
    )
  )
}
