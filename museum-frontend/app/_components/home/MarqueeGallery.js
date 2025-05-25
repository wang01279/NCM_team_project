import React from 'react'
import styles from '@/app/_components/home/_style/MarqueeGallery.module.scss'

const logos = [
  '/img/logos/logo.svg',
  '/img/logos/logo2.png',
  '/img/logos/logo3.png',
  '/img/logos/logo4.jpg',
  '/img/logos/logo5.jpg',
  '/img/logos/logo6.jpg',
  '/img/logos/logo7.jpeg',
  '/img/logos/logo8.webp',
]

export default function MarqueeGallery() {
  return (
    <div className={styles.marqueeSection}>
      <h2 className={styles.title}>合作品牌</h2>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marquee}>
          {logos.concat(logos).map((src, idx) => (
            <div className={styles.logoBox} key={idx}>
              <img src={src} alt={`合作品牌${idx+1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 