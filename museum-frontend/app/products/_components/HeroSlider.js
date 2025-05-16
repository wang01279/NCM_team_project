'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import '../_styles/heroSlider.scss'

export default function HeroSlider() {
  const slides = [
    {
      bg: '/image/b1-bg.png',
      img: '/image/b1-removebg-preview.png',
      title: '法華牡丹金彩盤',
      desc: '繁花似錦，金彩輝映宴席風華',
    },
    {
      bg: '/image/b2-bg.png',
      img: '/image/b2-removebg-preview.png',
      title: '青花龍紋天球瓶小',
      desc: '祥龍盤繞，典藏氣韻小巧不凡',
    },
    {
      bg: '/image/b3-bg.png',
      img: '/image/b3-removebg-preview.png',
      title: '精工琉璃 翠玉白菜-霧面',
      desc: '霧面溫潤質感，寓意清白傳承',
    },
    {
      bg: '/image/b4-bg.png',
      img: '/image/b4-removebg-preview.png',
      title: '仿故宮金地青花雲龍蓋杯',
      desc: '金地青花交融，杯蓋藏龍蘊藏雅趣',
    },
  ]

  const INTERVAL = 6000 // 自動輪播時間（毫秒）

  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const timeoutRef = useRef(null) // 使用 useRef 來儲存 timeout 的 ID
  const leftArrowRef = useRef(null)
  const rightArrowRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768)
    }
  }, [])

  useEffect(() => {
    startAutoSlide()
    return () => clearTimeout(timeoutRef.current) // 在組件卸載時清除 timeout
  }, [current])

  const startAutoSlide = () => {
    clearTimeout(timeoutRef.current) // 清除任何現有的 timeout
    timeoutRef.current = setTimeout(() => {
      handleNext()
    }, INTERVAL)
  }

  const showSlide = (index) => {
    if (isAnimating || index === current) return
    setIsAnimating(true)
    setPrev(current)

    setTimeout(() => {
      setCurrent(index)
      setIsAnimating(false)
      setPrev(null)
      startAutoSlide() // 在手動切換後重新啟動自動輪播
    }, 600) // 等 exit 動畫跑完再切換 active
  }

  const handleNext = () => {
    const next = (current + 1) % slides.length
    showSlide(next)
  }

  const handlePrev = () => {
    const prevIndex = (current - 1 + slides.length) % slides.length
    showSlide(prevIndex)
  }

  const handleMouseMove = (e, ref) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (ref.current) {
      ref.current.style.left = `${x}px`
      ref.current.style.top = `${y}px`
    }
  }

  return (
    <section className="hero-section py-4">
      <div className="slider-container container">
        <div className="slider-title">
          <h1 className="text-center fw-bold">新品上市</h1>
          <h4 className="text-center">New Arrivals</h4>
        </div>

        {isMobile && (
          <div className="mobile-arrows d-flex justify-content-center gap-4 my-3">
            <button
              className="btn-arrow"
              onClick={() => {
                handlePrev()
                startAutoSlide()
              }}
            >
              <FaArrowLeft />
            </button>
            <button
              className="btn-arrow"
              onClick={() => {
                handleNext()
                startAutoSlide()
              }}
            >
              <FaArrowRight />
            </button>
          </div>
        )}

        <div className="slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === current ? 'active' : ''}`}
            >
              <img src={slide.bg} className="bg-img" alt={`背景${index + 1}`} />
            </div>
          ))}

          <div className="click-zones">
            <div
              className="zone prev"
              onClick={() => {
                handlePrev()
                startAutoSlide()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePrev()
                  startAutoSlide()
                }
              }}
              role="button"
              onMouseMove={(e) => handleMouseMove(e, leftArrowRef)}
            >
              <div className="arrow" ref={leftArrowRef}>
                <i className="fa-solid fa-arrow-left"></i>
              </div>
            </div>
            <div
              className="zone next"
              onClick={() => {
                handleNext()
                startAutoSlide()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNext()
                  startAutoSlide()
                }
              }}
              role="button"
              onMouseMove={(e) => handleMouseMove(e, rightArrowRef)}
            >
              <div className="arrow" ref={rightArrowRef}>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-container">
        <div className="contents">
          {slides.map((slide, index) => {
            let className = 'content'
            if (index === current) className += ' active'
            if (index === prev) className += ' exit'

            return (
              <div key={index} className={className}>
                <img
                  src={slide.img}
                  className="main-product-img"
                  alt={slide.title}
                />
                <h4 className="fw-bold mt-3">{slide.title}</h4>
                <p>{slide.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
