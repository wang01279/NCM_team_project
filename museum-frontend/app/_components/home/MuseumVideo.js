import React from 'react'
import styles from './_style/MuseumVideo.module.scss'

export default function MuseumVideo() {
  return (
    <section className={styles.museumVideoSection}>
      <div className={styles.museumVideoCard}>
        <div className={styles.museumVideoLeft}>
          <div className={styles.museumVideoTag}>線上展覽</div>
          <h2 className={styles.museumVideoTitle}>360°互動式展覽</h2>
          <p className={styles.museumVideoDesc}>來自國立故瓷博物館</p>
          <button className={styles.museumVideoBtn}>瞭解詳情</button>
        </div>
        <div className={styles.museumVideoRight}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!4v1748084465731!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRDRndnFsWFE.!2m2!1d34.69345038669045!2d135.5054797545238!3f291.4747666093877!4f1.140874278307166!5f0.7820865974627469"
            title="Google Maps 360"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.museumVideoIframe}
          ></iframe>
        </div>
      </div>

      {/* <div className={styles.museumTicketCard}>
        <div className={styles.museumTicketLeft}>
          <div className={styles.museumTicketTag}>票券</div>
          <h2 className={styles.museumTicketTitle}>故瓷博物館門票</h2>
          <p className={styles.museumTicketDesc}>購買門票，探索陶瓷之美</p>
          <button className={styles.museumTicketBtn}>購買門票</button>
        </div>
        <div className={styles.museumTicketRight}>
          <img src="/img/ncm/ticket.png" alt="ticket" />
        </div>
      </div> */}
    </section>
  )
}
