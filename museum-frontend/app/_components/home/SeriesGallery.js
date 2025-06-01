import React, { useRef, useEffect, useState } from 'react'
import { items } from './data'
import styles from '@/app/_components/home/_style/SeriesGallery.module.scss'

const ROWS = 3 // 幾行

function splitRows(items, rows) {
  const result = Array.from({ length: rows }, () => [])
  items.forEach((item, i) => {
    result[i % rows].push(item)
  })
  return result
}

export default function SeriesMarqueeMasonry() {
  const scrollerRefs = useRef([])
  const [playing, setPlaying] = useState(true)
  let timer = useRef(null)
  const rows = splitRows(items.concat(items), ROWS)

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        scrollerRefs.current.forEach((ref, idx) => {
          if (ref) {
            // 不同行不同速度
            ref.scrollLeft += 1 + idx
            if (
              ref.scrollLeft + ref.clientWidth >=
              ref.scrollWidth - 2
            ) {
              ref.scrollTo({ left: 0 })
            }
          }
        })
      }, 50)
    } else {
      clearInterval(timer.current)
    }
    return () => clearInterval(timer.current)
  }, [playing])

  return (
    <section className={styles.seriesGallery}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>系列作品</h2>
        <button className={styles.toggle} onClick={() => setPlaying((p) => !p)}>
          {playing ? '❚❚ 暫停' : '► 播放'}
        </button>
        <div
          className={styles.marqueeRows}
          onMouseEnter={() => setPlaying(false)}
          onMouseLeave={() => setPlaying(true)}
        >
          {rows.map((row, rowIdx) => (
            <div
              className={styles.marqueeRow}
              key={rowIdx}
              ref={el => (scrollerRefs.current[rowIdx] = el)}
            >
              {row.map((item, i) => (
                <div className={styles.card} key={i}>
                  <img src={item.src} alt={item.title} />
                  <div className={styles.overlay}>
                    <span>{item.media}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
