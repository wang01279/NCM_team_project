import React, { useState } from 'react'
import styles from './_style/YourSection.module.scss'

const hotspots = [
  {
    id: 1,
    x: '30%',
    y: '40%', // 百分比定位
    title: '區塊一標題',
    desc: '這是區塊一的解說內容。',
    zoom: { left: '20%', top: '30%', width: '30%', height: '40%' },
  },
  {
    id: 2,
    x: '60%',
    y: '50%',
    title: '區塊二標題',
    desc: '這是區塊二的解說內容。',
    zoom: { left: '55%', top: '45%', width: '30%', height: '40%' },
  },
  {
    id: 3,
    x: '70%',
    y: '20%',
    title: '區塊三標題',
    desc: '這是區塊三的解說內容。',
    zoom: { left: '65%', top: '10%', width: '25%', height: '30%' },
  },
]

export default function InteractiveImageSection() {
  const [active, setActive] = useState(null)

  return (
    <div className={styles.interactiveSection}>
      <img src="https://cdn.cosmos.so/80cc52db-cd84-4da9-a4b8-7e46eba3eebd?format=jpeg" className={styles.bgImg} alt="導覽圖" />
      {hotspots.map((h) => (
        <button
          key={h.id}
          className={styles.hotspot}
          style={{ left: h.x, top: h.y }}
          onClick={() => setActive(h)}
        />
      ))}
      {active && (
        <div className={styles.overlay} onClick={() => setActive(null)}>
          <div
            className={styles.zoomArea}
            style={{
              left: active.zoom.left,
              top: active.zoom.top,
              width: active.zoom.width,
              height: active.zoom.height,
              backgroundImage: `url(/your-image.jpg)`,
              backgroundPosition: `${active.zoom.left} ${active.zoom.top}`,
              backgroundSize: 'cover',
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div className={styles.descBox} onClick={(e) => e.stopPropagation()}>
            <h3>{active.title}</h3>
            <p>{active.desc}</p>
            <button onClick={() => setActive(null)}>關閉</button>
          </div>
        </div>
      )}
    </div>


  )
}
