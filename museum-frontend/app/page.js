'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/app/_components/navbar'
import FullScreenIntro from '@/app/_components/home/FullScreenIntro'
import MarqueeGallery from '@/app/_components/home/MarqueeGallery'
import MuseumVideo from '@/app/_components/home/MuseumVideo'
import MuseumTicket from '@/app/_components/home/MuseumTicket'
import SeriesCalendar from '@/app/_components/home/SeriesCalendar'
import SeriesGallery from '@/app/_components/home/SeriesGallery'
import YourSection from '@/app/_components/home/YourSection'
// import Footer from '@/app/_components/footer'
import CardGallery from '@/app/_components/home/CardGallery'
// import '@/app/_styles/globals.scss'
import styles from '@/app/_styles/home.module.scss'

import Footer from '@/app/_components/footer3'
import RippleCanvas from '@/app/_components/home/RippleCanvas'
import Loader from '@/app/_components/load'


import CouponLink from '@/app/_components/CouponLink.js'

// import waveButton from '@/app/_styles/components/waveButton.scss'

// const ceramicColors = [
//   '#F8F1E3', // 0% 淺 - 陶胎米白
//   '#CBAE93', // 25% 深 - 焙燒橘
//   '#EADFD4', // 50% 淺 - 陶粉霧白（釉回彈）
//   '#8A4B30', // 75% 深 - 紅陶棕
//   '#4B2A1E', // 100% 最深 - 古陶深棕（窯變釉）
// ]

const ceramicColors = [
  '#F8F1E3', // 0% 陶胎米白（初胚）
  '#EADFD2', // 25% 奶茶陶粉（乾燥陶土）
  '#EFE8DD', // 50% 淡霧米灰（霧釉）
  '#E3D2C4', // 75% 焙燒淺棕（柴燒溫潤色）
  '#D6C5B6', // 100% 柔霧陶粉灰（古意柔色）
]

const colorStops = [0, 0.3, 0.6, 0.8, 1]

function interpolateColor(color1, color2, t) {
  const c1 = color1.match(/\w\w/g).map((x) => parseInt(x, 16))
  const c2 = color2.match(/\w\w/g).map((x) => parseInt(x, 16))
  const c = c1.map((v, i) => Math.round(v + (c2[i] - v) * t))
  return `#${c.map((x) => x.toString(16).padStart(2, '0')).join('')}`
}

function getColorIdx(percent) {
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (percent >= colorStops[i] && percent <= colorStops[i + 1]) {
      const localT =
        (percent - colorStops[i]) / (colorStops[i + 1] - colorStops[i])
      return { idx: i, localT }
    }
  }
  return { idx: 0, localT: 0 }
}

export default function AppPage() {
  const [activeSection, setActiveSection] = useState('home')
  const [scrollY, setScrollY] = useState(0)
  const [bgColor, setBgColor] = useState(ceramicColors[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模擬首頁 loading 狀態
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY)
      const scroll = window.scrollY
      const docH = document.body.scrollHeight - window.innerHeight
      const percent = docH === 0 ? 0 : scroll / docH
      const { idx, localT } = getColorIdx(percent)
      const topColor = interpolateColor(
        ceramicColors[idx],
        ceramicColors[idx + 1],
        localT
      )
      const bottomIdx = Math.min(idx + 1, ceramicColors.length - 2)
      const bottomT = Math.min(localT + 0.2, 1)
      const bottomColor = interpolateColor(
        ceramicColors[bottomIdx],
        ceramicColors[bottomIdx + 1],
        bottomT
      )
      setBgColor(
        `linear-gradient(to bottom, ${topColor} 0%, ${bottomColor} 100%)`
      )
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {/* 紋理層 */}
      {/* <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.18,
          background: "url('/img/crackle-texture.png') center/cover repeat",
        }}
      /> */}
      {/* RippleCanvas 水波層 */}
      <RippleCanvas />
      {/* 內容層 */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar sticky={true} />

        {/* 導航按鈕 */}
        {/* <div className={styles.pageNav}> */}
          {/* <button
            className={activeSection === 'home' ? styles.active : ''}
            onClick={() => scrollToSection('home')}
          > */}
            {/* 首頁 */}
          {/* </button>
          <button
            className={activeSection === 'video' ? styles.active : ''}
            onClick={() => scrollToSection('video')}
          > */}
            {/* 影片導覽 */}
          {/* </button>
          <button
            className={activeSection === 'exhibitions' ? styles.active : ''}
            onClick={() => scrollToSection('exhibitions')}
          > */}
            {/* 展覽資訊 */}
          {/* </button>
          <button
            className={activeSection === 'brands' ? styles.active : ''}
            onClick={() => scrollToSection('brands')}
          > */}
            {/* 合作品牌 */}
          {/* </button>
        </div> */}
        
        <CouponLink />

        {/* 第一個區塊就是3D動畫 */}
        <section id="home" className={styles.homeSection}>
          <div className={styles['welcome-tile']}>
            <h2>國立故瓷博物館</h2>
            <p>歡迎來到 3D 虛擬陶瓷博物館</p>
            <button
              className={styles.enterBtn}
              onClick={() => {
                const videoSection = document.getElementById('video')
                if (videoSection) {
                  const y = videoSection.getBoundingClientRect().top + window.scrollY - 60 // 60px offset
                  window.scrollTo({ top: y, behavior: 'smooth' })
                }
              }}
            >
              <span>進入博物館</span>
            </button>
          </div>

          <div className={styles.fullScreenIntroWrap}>
            <FullScreenIntro scrollY={scrollY} />
          </div>
          <div className={styles.seriesCalendarWrap}>
            <SeriesCalendar />
          </div>
        </section>

        <div className="ceramic-transition transition1" />

        <section id="video" className={styles.museumVideoSection}>
          <MuseumTicket />
          <MuseumVideo />
        </section>

        <div className="ceramic-transition transition2" />

        <section id="exhibitions" className={styles.gallerySection}>
          <SeriesGallery />
        </section>

        <div className="ceramic-transition transition3" />

        <section id="brands" className={styles.brandSection}>
          {/* 卡片瀑布流區塊 */}
          <CardGallery />
          <MarqueeGallery />
        </section>

        <Footer className={styles.homeFooter} />
      </div>
    </>
  )
}
