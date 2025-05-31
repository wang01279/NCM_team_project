// 用途：優惠券遊戲卡片

'use client'
import styles from '../_styles/game.module.scss'

export default function Card({ card, isFlipped, onClick }) {
  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
      onClick={onClick}
    >
      <img
        src={isFlipped ? card.src : '/images/back.png'}
        alt="card"
        draggable={false}
      />
    </div> 
  )
}
