'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import heroSliderStyles from '../_styles/heroSlider.module.scss'
import Link from 'next/link'

export default function HeroSlider() {
  const [products, setProducts] = useState([])

  const bgImages = [
    '/image/b1-bg.png',
    '/image/b2-bg.png',
    '/image/b3-bg.png',
    '/image/b4-bg.png',
    '/image/b5-bg.png',
  ]

  const INTERVAL = 6000
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef(null)
  const leftArrowRef = useRef(null)
  const rightArrowRef = useRef(null)

  const [isMobile, setIsMobile] = useState(false)

  // 監聽螢幕尺寸切換手機版
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 撈資料
  useEffect(() => {
    fetch('http://localhost:3005/api/products/latest')
      .then((res) => {
        if (!res.ok) throw new Error('API 回傳錯誤')
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) setProducts(data)
        else setProducts([])
      })
      .catch(() => setProducts([]))
  }, [])

  // 啟動自動輪播
  useEffect(() => {
    if (products.length === 0) return
    startAutoSlide()
    return () => clearTimeout(timeoutRef.current)
  }, [current, products])

  const startAutoSlide = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(handleNext, INTERVAL)
  }

  const showSlide = (index) => {
    if (isAnimating || index === current) return
    setIsAnimating(true)
    setPrev(current)
    setTimeout(() => {
      setCurrent(index)
      setIsAnimating(false)
      setPrev(null)
      startAutoSlide()
    }, 600)
  }

  const handleNext = () => showSlide((current + 1) % products.length)
  const handlePrev = () =>
    showSlide((current - 1 + products.length) % products.length)

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
    <section className={heroSliderStyles['hero-section'] + ' py-5'}>
      <div className={heroSliderStyles['slider-container'] + ' container'}>
        {/* <div className={heroSliderStyles['slider-title']}>
          <h1 className="text-center fw-bold">新品上市</h1>
          <h4 className="text-center">New Arrivals</h4>
        </div> */}
        {/* {isMobile && (
          <div className={heroSliderStyles['mobile-arrows'] + ' d-flex justify-content-center gap-4 my-3'}>
            <button className={heroSliderStyles['btn-arrow'] + ' btn-primary'} onClick={handlePrev}>
              <FaArrowLeft />
            </button>
            <button className={heroSliderStyles['btn-arrow'] + ' btn-primary'} onClick={handleNext}>
              <FaArrowRight />
            </button>
          </div>
        )} */}

        <div className={heroSliderStyles['slider']}>
          {bgImages.map((bg, index) => (
            <div
              key={index}
              className={
                heroSliderStyles['slide'] +
                (index === current ? ' ' + heroSliderStyles['active'] : '')
              }
            >
              <img src={bg} className={heroSliderStyles['bg-img']} alt={`背景${index + 1}`} />
            </div>
          ))}

          <div className={heroSliderStyles['click-zones']}>
            <div
              className={heroSliderStyles['zone'] + ' ' + heroSliderStyles['prev']}
              onClick={handlePrev}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handlePrev()
              }}
              onMouseMove={(e) => handleMouseMove(e, leftArrowRef)}
              role="button"
              tabIndex="0"
            >
              <div className={heroSliderStyles['arrow']} ref={leftArrowRef}>
                <FaArrowLeft />
              </div>
            </div>

            <div
              className={heroSliderStyles['zone'] + ' ' + heroSliderStyles['next']}
              onClick={handleNext}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleNext()
              }}
              onMouseMove={(e) => handleMouseMove(e, rightArrowRef)}
              role="button"
              tabIndex="0"
            >
              <div className={heroSliderStyles['arrow']} ref={rightArrowRef}>
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={heroSliderStyles['product-container']}>
        <div className={heroSliderStyles['contents']}>
          {products.map((product, index) => {
            let className = heroSliderStyles['content']
            if (index === current) className += ' ' + heroSliderStyles['active']
            if (index === prev) className += ' ' + heroSliderStyles['exit']

            return (
              <Link key={product.id} href={`/products/details/${product.id}`}>
                <div className={className}>
                  <img
                    src={product.main_img}
                    className={heroSliderStyles['main-product-img']}
                    alt={product.name_zh}
                  />
                  <h4 className="fw-bold mt-2">{product.name_zh}</h4>
                  <p>{product.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
