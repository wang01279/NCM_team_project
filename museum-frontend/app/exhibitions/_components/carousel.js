// components/exhibition/Carousel.js
'use client'
import { useEffect } from 'react'
import Image from 'next/image'

export default function Carousel() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])

  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide pt-5"
      data-bs-ride="carousel"
    >
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="ratio ratio-16x9">
            <Image
              src="/images/04010505.jpg"
              className="d-block w-100"
              alt="亞洲探險記"
              width={1000}
              height={500}
            />
          </div>
        </div>
        <div className="carousel-item">
          <div className="ratio ratio-16x9">
            <Image
              src="/images/04000569.jpg"
              className="d-block w-100"
              alt="士拿呼"
              width={1000}
              height={500}
            />
          </div>
        </div>
        <div className="carousel-item">
          <div className="ratio ratio-16x9">
            <Image
              src="/images/04011127.png"
              className="d-block w-100"
              alt="清宮鼻煙壺"
              width={1000}
              height={500}
            />
          </div>
        </div>
      </div>

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
