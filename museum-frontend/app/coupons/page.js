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
  const { member, token, isLoggedIn } = useAuth()
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

      <div className="container">
        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ marginTop: '120px' }}
        >
          <h3 className="mb-0 pb-0 fw-bold" style={{ letterSpacing: '2px' }}>
            優惠券領取專區
          </h3>
          <h6 className="mt-2 pt-0 m-0 fw-bold">Coupon Redemption Area</h6>

          <div className={`${styles.scrollPrompt} mt-5 mb-0 text-end`}>
            <button className="btn btn-warning" onClick={scrollToGame}>
              <h5 className="m-0 p-0">
                開始領券挑戰 <GiClick className="ms-1 p-0 my-0" />
              </h5>
            </button>
          </div>
        </div>

        {/* ✅ 傳入 token 和 memberId */}
        <CouTab token={token} memberId={memberId} />

        <div className={styles.gameSection}>
          <div ref={gameRef} className={`mt-4 ${styles.scrollAnchor}`} ></div>
          <h2>每日挑戰</h2>
          <GameBoard token={token} memberId={memberId} />
        </div>
      </div>

      <Footer />
    </>
  )
}
