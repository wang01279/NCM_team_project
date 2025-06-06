'use client'

import DataFetcher from '@/app/_components/DataFetcher'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../_styles/ex-page.module.scss'

export default function ExhibitionList({ state = 'current', year}) {
  const query = new URLSearchParams({ state })
  if (year) query.append('year', year)
  const url = `http://localhost:3005/api/exhibitions?${query.toString()}`

  return (
    <DataFetcher url={url}>
      {(res) => {
        const exhibitions = res?.data?.exhibitions || []
        if (exhibitions.length === 0) {
          return <p className="text-center text-muted">查無展覽資料</p>
        }

        return (
          <main className="container my-5">
            {exhibitions.map((ex) => (
              <Link
                href={`/exhibitions/${ex.id}`}
                key={ex.id}
                className="text-decoration-none"
              >
                <div
                  className={`${styles.exhibitionCard} row align-items-center overflow-hidden`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`col-md-5 col-12 ${styles.imageContainer1}`}>
                    <div className={styles.imageOverlay}></div>
                    <Image
                      src={`/images/${ex.image}`}
                      alt={ex.title}
                          fill
                      // width={600}
                      // height={250}
                      className="exhibitionImg"
                    />
                  </div>
                  <div className={`col-md-7 ${styles.infoContainer}`}>
                    <h5 className="fw-bold">{ex.title}</h5>
                    <div className={styles.boxMargin}>
                      <p className="text-muted mb-1">
                        展覽期間：{ex.startDate.slice(0, 10)} ~{' '}
                        {ex.endDate.slice(0, 10)}
                      </p>
                      <p className="text-muted ">展廳區域：{ex.venue_id}</p>
                      <div className="d-flex justify-content-end mb-3">
                        <button className={`btn btn-light`}>
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
            ))}
          </main>
        )
      }}
    </DataFetcher>
  )
}
