import React, { useEffect, useState } from 'react'
import styles from './_style/MuseumVideo.module.scss'
import { useInView } from 'react-intersection-observer'

import { FaClock } from "react-icons/fa";

export default function MuseumTicket() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (inView) setShow(true)
  }, [inView])
  return (
    <section className={styles.museumVideoSection}>
 

      <div ref={ref} className={styles.museumTicketCard + ' ' + (show ? styles.slideInUpDelayed : '')}>
        <div className={styles.museumTicketRight}>
          <img src="/img/login-bg/cover.jpeg" alt="ticket" />
          <div className={styles.museumTicketPrice + ' ' + styles.desktopOnly}>全票 $250</div>
        </div>
        <div className={styles.museumTicketLeft}>
          <div className={styles.museumTicketTag}>National Ceramic Museum Ticket</div>
          <h2 className={styles.museumTicketTitle}>國立故瓷博物館門票</h2>
          <p className={styles.museumTicketDesc}>購買門票，探索陶瓷之美</p>
          <div className={styles.museumTicketTime}>
            <FaClock className={styles.museumTicketIcon} />
          開館時間｜09:00 - 17:00（週一休館）
          </div>
          <div className={styles.museumTicketPrice}>全票 $250｜優待票 $150</div>
          <button className={styles.museumTicketBtn}>目前僅提供現場購票</button>
        </div>
   
      </div>
    </section>
  )
}
