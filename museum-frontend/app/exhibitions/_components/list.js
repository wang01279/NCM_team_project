'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
// import '@/app/_styles/globals.scss'
import styles from '../_styles/ex-page.module.scss'
import Link from 'next/link'

export default function ExhibitionList({ state, year }) {
  const [exhibitions, setExhibitions] = useState([])

  useEffect(() => {
    console.log('state:', state)
    console.log('year:', year)
    if (!state) return

    const url = `http://localhost:3005/api/exhibitions/${state}${year ? `?year=${year}` : ''}`
    console.log('實際 fetch URL:', url)

    fetch(url)
      .then((res) => res.json())
      .then((res) => setExhibitions(res.data.exhibitions))
      .catch((err) => console.error('fetch 錯誤:', err))
  }, [state, year])

  return (
    <main className="container my-5">
      {exhibitions.length === 0 ? (
        <p className="text-center text-muted">資料載入中...</p>
      ) : (
        exhibitions.map((ex) => (
          <Link
            href={`/exhibitions/details/${ex.id}`}
            key={ex.id}
            className="text-decoration-none"
          >
            <div
              className={`${styles.exhibitionCard} row align-items-center overflow-hidden mb-4`}
              style={{ cursor: 'pointer' }}
            >
              <div className={`col-md-5 ${styles.imageContainer}`}>
                <Image
                  src={`/images/${ex.image}`}
                  alt={ex.title}
                  width={600}
                  height={400}
                  className="img-fluid"
                />
              </div>
              <div className={`col-md-7 ${styles.infoContainer}`}>
                <h5 className="fw-bold">{ex.title}</h5>
                <div className="mt-5">
                  <p className="text-muted mb-1">
                    展覽期間：{ex.startDate} ~ {ex.endDate}
                  </p>
                  <p className="text-muted mb-2">展廳區域：{ex.venue_id}</p>
                  <div className="d-flex justify-content-end">
                    <button className={`btn ${styles.customBtn}`}>
                      <span>查看更多</span>
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </main>
  )
}
