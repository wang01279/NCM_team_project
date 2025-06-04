'use client'

import CouTab from './_components/cou-tab.js'
import InfoModal from './_components/InfoModal.js'
import Navbar from '../_components/navbar.js'
import Footer from '../_components/footer3.js'
import GameBoard from './_components/GameBoard.js'
import { useRef } from 'react'
import styles from './_styles/main.module.scss'
import { GiClick } from 'react-icons/gi'
import { useAuth } from '@/app/_hooks/useAuth'

export default function CouponPage() {
  const { member, token } = useAuth()
  const memberId = member?.id
  const gameRef = useRef(null)

  const scrollToGame = () => {
    gameRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Navbar />
      <InfoModal
        title="領取提示："
        message="點擊優惠券即領取。"
        buttonText="知道了"
        showByDefault={true}
      />

      <div className={styles.titleCover} style={{ marginTop: '80px' }}>
        <h3 className="mb-0 pb-0 fw-bold text-center" style={{ letterSpacing: '2px' }}>
          優惠券領取專區
        </h3>
        <h6 className="mt-2 pt-0 m-0 fw-bold text-center">Coupon Redemption Area</h6>

      </div>

      <div className="container">
        <div className={`${styles.scrollPrompt}`}>
          <button className={`btn btn-outline-primary ${styles.button}`} onClick={scrollToGame}>
            <h5 className="m-0 p-0">
              開始領券挑戰 <GiClick className="ms-1 p-0 my-0" />
            </h5>
          </button>
        </div>

        {/* ✅ 傳入 token 和 memberId */}
        <CouTab token={token} memberId={memberId} />
      </div>

      {/* // ✅ 改成這樣（ref 直接設在遊戲區塊根容器上） */}
      <section
        ref={gameRef}
        className={`d-flex flex-column align-items-center justify-content-center ${styles.gameSection}`}
      >
        <GameBoard token={token} memberId={memberId} scrollToGame={scrollToGame} />
      </section>

      <Footer />
    </>
  )
}
