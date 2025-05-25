'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/app/_components/navbar'
import FullScreenIntro from '@/app/_components/home/FullScreenIntro'
import MarqueeGallery from '@/app/_components/home/MarqueeGallery'
import MuseumVideo from '@/app/_components/home/MuseumVideo'
import SeriesCalendar from '@/app/_components/home/SeriesCalendar'
import SeriesGallery from '@/app/_components/home/SeriesGallery'
import Footer from '@/app/_components/footer'
import CardGallery from '@/app/_components/home/CardGallery'
import '@/app/_styles/globals.scss'
import '@/app/_styles/home.scss'

export default function AppPage() {
  const [activeSection, setActiveSection] = useState('home')

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  return (
    // <main className="min-h-screen">
    <>
      <Navbar sticky={true} />
      
      {/* 導航按鈕 */}
      <div className="page-nav">
        <button 
          className={activeSection === 'home' ? 'active' : ''} 
          onClick={() => scrollToSection('home')}
        >
          {/* 首頁 */}
        </button>
        <button 
          className={activeSection === 'video' ? 'active' : ''} 
          onClick={() => scrollToSection('video')}
        >
          {/* 影片導覽 */}
        </button>
        <button 
          className={activeSection === 'exhibitions' ? 'active' : ''} 
          onClick={() => scrollToSection('exhibitions')}
        >
          {/* 展覽資訊 */}
        </button>
        <button 
          className={activeSection === 'brands' ? 'active' : ''} 
          onClick={() => scrollToSection('brands')}
        >
          {/* 合作品牌 */}
        </button>
      </div>

      {/* 第一個區塊就是3D動畫 */}
      <section
        id="home"
        style={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          // background: '#FDFBF7',
        }}
      >
        <div className="hero-card">
          <h2 className="hero-card__title">國立陶瓷博物館</h2>
          <p className="hero-card__desc">歡迎來到 3D 虛擬博物館</p>
        </div>
        <FullScreenIntro />
        <div className="series-calendar">
          <SeriesCalendar/>
        </div>
      </section>

     

      <section id="video" className="museum-video-section">
        <MuseumVideo />
      </section>

      <section id="exhibitions" className="gallery-section">
        <SeriesGallery />
      </section>

      <section id="brands" className="brand-section">
       {/* 卡片瀑布流區塊 */}
       <CardGallery />
        <MarqueeGallery />
      </section>

      {/* <Footer /> */}
    </>
    // </main>
  )
}
