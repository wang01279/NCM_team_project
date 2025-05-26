// SeriesCalendar.js
import React, { useState, useRef } from 'react'
import styles from '@/app/_components/home/_style/SeriesCalendar.module.scss'
import classNames from 'classnames'

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 展覽資料（支援跨日）
const exhibitions = [
  { name: '亞洲探險記—十七世紀東西交流傳奇', start: '2025-03-28', end: '2025-05-28' },
  { name: '摶泥幻化—院藏陶瓷精華展', start: '2025-03-22', end: '2025-06-08' },
  { name: '士拿乎—清宮鼻煙壺的時尚風潮', start: '2025-05-18', end: '2025-10-25' },
  { name: '航向天方─十五世紀的伊斯蘭印象', start: '2025-03-11', end: '2025-07-16' },
  { name: '皇帝的鏡子—清宮鏡鑑文化與典藏', start: '2025-05-17', end: '2025-08-17' },
  { name: '鑑古—乾隆朝的宮廷收藏', start: '2025-04-19', end: '2025-07-06' },
  { name: '適於心—明代永樂皇帝的瓷器', start: '2025-06-19', end: '2025-10-19' },
  { name: '若水澄華—館藏玻璃文物特展', start: '2025-07-19', end: '2025-11-19' },
  { name: '大美不言—梵克雅寶典藏精粹特展', start: '2024-09-26', end: '2024-12-29' },
  { name: '「瓷緣萬里」暨「宮廷雅器的時代風華」特展', start: '2024-09-26', end: '2024-12-29' },
  { name: '貴似晨星—清宮傳世12至14世紀青瓷特展', start: '2025-08-19', end: '2025-12-19' },
  { name: '無界之涯——從海出發探索十六世紀東西文化交流', start: '2024-09-26', end: '2024-12-29' },
  { name: '紫砂風潮—傳世器及其他', start: '2024-09-26', end: '2024-12-29' },
  { name: '品牌的故事—乾隆皇帝的文物收藏與包裝藝術', start: '2024-09-26', end: '2024-12-29' },
  { name: '風格故事—琺瑯彩瓷特展', start: '2023-05-25', end: '2023-10-25' },
  { name: '茄楠—瓷器文化特展', start: '2024-09-26', end: '2024-12-29' },
  { name: '國寶聚焦', start: '2024-09-26', end: '2024-12-29' },
  { name: '小時代的日常—一個十七世紀的生活陶瓷', start: '2023-05-25', end: '2023-10-25' },
  { name: '看得見的紅樓夢', start: '2023-05-25', end: '2023-10-25' },
  { name: '愛硯成痴特展', start: '2023-05-25', end: '2023-10-25' },
  { name: '華麗魔法屋─洛可可珍藏', start: '2023-05-25', end: '2023-10-25' },
  { name: '貴冑榮華─清代宮廷的日常風景', start: '2023-05-25', end: '2023-10-25' },
  { name: '皇帝的移動花園－清代宮廷花卉畫', start: '2023-05-25', end: '2023-10-25' },
  { name: '院藏清代歷史文書珍品—端陽時節', start: '2022-05-17', end: '2022-08-17' },
  { name: '悅耳－傾聽畫裡的聲音', start: '2022-05-17', end: '2022-08-17' },
  { name: '國寶聚焦 2025-II', start: '2022-05-17', end: '2022-08-17' },
  { name: '織造精彩－清宮緙絲刺繡展', start: '2022-05-17', end: '2022-08-17' },
  { name: '賞賜有禮：清代文獻中的天子禮物', start: '2022-05-17', end: '2022-08-17' },
  { name: '身體展演：從歷史圖像看身體之謎', start: '2021-04-19', end: '2021-06-22' },
  { name: '歲時吉慶—院藏節令文物精粹', start: '2021-04-19', end: '2021-06-22' },
  { name: '祀與戎：古代兵器攻略', start: '2021-04-19', end: '2021-06-22' },
  { name: '經典之美—新媒體藝術展', start: '2021-04-19', end: '2021-06-22' },
]
// 閉館日（舉例）
const closedDates = ['2025-06-02', '2025-06-09', '2025-06-16', '2025-06-23', '2025-06-30']

function getDateStr(y, m, d) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function getExhibitionsForDate(dateStr) {
  return exhibitions
    .filter(e => dateStr >= e.start && dateStr <= e.end)
    .map(e => e.name)
}

export default function SeriesCalendar({ year: propYear = 2025, month: propMonth = 6 }) {
  const [hovered, setHovered] = useState(null)
  const [year, setYear] = useState(propYear)
  const [month, setMonth] = useState(propMonth)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const carouselTimer = useRef(null)
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDay = new Date(year, month - 1, 1).getDay()

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1)
      setMonth(12)
    } else {
      setMonth(month - 1)
    }
  }
  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1)
      setMonth(1)
    } else {
      setMonth(month + 1)
    }
  }

  const cells = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1
    const dateStr = getDateStr(year, month, d)
    const isClosed = closedDates.includes(dateStr)
    const exhibitionsToday = getExhibitionsForDate(dateStr)
    const weekday = weekdays[(firstDay + d - 1) % 7]
    const showTooltip = hovered === d && (isClosed || exhibitionsToday.length > 0)

    let tooltipText = ''
    if (isClosed) {
      tooltipText = '閉館日'
    } else if (exhibitionsToday.length > 0) {
      tooltipText = exhibitionsToday[carouselIdx % exhibitionsToday.length]
    }

    // hover 時啟動輪播
    const handleMouseEnter = () => {
      setHovered(d)
      if (exhibitionsToday.length > 1) {
        setCarouselIdx(0)
        if (carouselTimer.current) clearInterval(carouselTimer.current)
        carouselTimer.current = setInterval(() => {
          setCarouselIdx(idx => (idx + 1) % exhibitionsToday.length)
        }, 1500)
      }
    }
    // 移開時清除輪播
    const handleMouseLeave = () => {
      setHovered(null)
      setCarouselIdx(0)
      if (carouselTimer.current) {
        clearInterval(carouselTimer.current)
        carouselTimer.current = null
      }
    }

    return (
      <div
        key={d}
        className={classNames(styles.cell, {
          [styles.closed]: isClosed,
          [styles.highlight]: hovered === d,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={styles.date}>{d}</span>
        <span className={styles.weekday}>{`星期${weekday}`}</span>
        {showTooltip && (
          <div className={styles.tooltip}>{tooltipText}</div>
        )}
      </div>
    )
  })

  return (
    <div className={styles.calendarBar}>
      <div className={styles.calendarNav}>
        <button className={styles.arrowBtn} onClick={handlePrevMonth} aria-label="上一月">&#60;</button>
        <div className={styles.header} style={{margin:0}}>
          {year}.{month.toString().padStart(2, '0')}
        </div>
        <button className={styles.arrowBtn} onClick={handleNextMonth} aria-label="下一月">&#62;</button>
      </div>
      <div className={styles.barScroller}>
        {cells}
      </div>
      <div className={styles.legend}>
        <span>■ 休館日</span>
      </div>
    </div>
  )
}
