'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export default function Carousel({ exhibitions = [] }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then((module) => {
        // ✅ 確保掛在 window 上，避免重複載入
        if (!window.bootstrap) {
          window.bootstrap = module
        }

        const el = document.getElementById('carouselExampleIndicators')
        if (el && window.bootstrap?.Carousel) {
          const instance = window.bootstrap.Carousel.getOrCreateInstance(el)
          instance.pause()
          instance.to(0) // 可選：切回第一張
          instance.cycle()
        }
      })
    }, 100) // 延遲等待圖片載入完

    return () => clearTimeout(timer)
  }, [exhibitions])

  if (!exhibitions || exhibitions.length === 0) {
    return (
      <div className="text-center my-5 text-muted">展覽輪播載入中...</div>
    )
  }

  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide pt-0"
      data-bs-ride="carousel"
      style={{ maxWidth: '1320px', width: '100%' }}
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        {exhibitions.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-current={index === 0 ? 'true' : undefined}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner">
        {exhibitions.map((e, index) => (
          <div
            key={e.id}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
          >
            <div className="ratio ratio-16x9" style={{ maxHeight: '600px' }}>
              <Image
                src={`/images/${e.image}`}
                alt={e.title}
                width={900}
                height={600}
                className="d-block w-100"
                style={{ objectFit: 'cover' }}
                priority={index === 0} // 加快第一張載入速度
              />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">上一張</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">下一張</span>
      </button>
    </div>
  )
}
