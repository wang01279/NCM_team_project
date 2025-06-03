// ✅ 完整整合 GameBoard 小遊戲版本（支援登入判斷、提示、API互動）

'use client'
import { useEffect, useState } from 'react'
import styles from '../_styles/game.module.scss'
import Card from './Card'
import { useToast } from '@/app/_components/ToastManager'
import axios from 'axios'
import InfoModal from './InfoModal'
import { TbSparkles } from 'react-icons/tb'
import { RiPokerClubsFill } from 'react-icons/ri'

const cardImages = [
  { src: '/images/porcelain-1.png', matched: false },
  { src: '/images/porcelain-2.png', matched: false },
  { src: '/images/porcelain-3.png', matched: false },
  { src: '/images/porcelain-4.png', matched: false },
]

export default function GameBoard({ memberId, token, scrollToGame }) {
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [cards, setCards] = useState([])
  const [firstCard, setFirstCard] = useState(null)
  const [secondCard, setSecondCard] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [matchedCount, setMatchedCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [gameResult, setGameResult] = useState('')
  const [hasClaimedToday, setHasClaimedToday] = useState(false)
  // ✨ 新增：控制是否等待提示後再開始
  const [pendingStart, setPendingStart] = useState(false)

  const { showToast } = useToast()

  // 洗牌初始化卡牌
  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))
    setCards(shuffled)
    setMatchedCount(0)
    setFirstCard(null)
    setSecondCard(null)
    setTimeLeft(20)
    setGameEnded(false)
    setGameResult('')
  }

  // 點擊開始遊戲
  const handleStartGame = async () => {
    if (!memberId) {
      setShowWarningModal(true)
      setPendingStart(true) // 設定等待中，不立即啟動
      return
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/memberCoupons`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.data.claimedToday) {
        setHasClaimedToday(true)
        showToast('warning', '今日挑戰的獎勵已經領過囉！')
        return
      }
    } catch (err) {
      console.error('❌ 檢查紀錄失敗:', err)
      showToast('danger', '無法開始遊戲，請稍後再試')
      return
    }

    startGame()
    setTimeout(() => {
      scrollToGame?.()
    }, 100)
  }

  const startGame = () => {
    shuffleCards()
    setGameStarted(true)
    scrollToGame?.() // ✅ 加這行
  }

  // 倒數計時器
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (gameStarted && timeLeft === 0 && !gameEnded) {
      setGameEnded(true)
      setGameResult('fail')
      showToast('info', '未能完成挑戰，請再試一次')
    }
  }, [gameStarted, timeLeft, gameEnded])

  // 翻牌後配對邏輯
  useEffect(() => {
    if (firstCard && secondCard) {
      setDisabled(true)
      if (firstCard.src === secondCard.src) {
        setCards((prev) =>
          prev.map((card) =>
            card.src === firstCard.src ? { ...card, matched: true } : card
          )
        )
        setMatchedCount((prev) => prev + 1)
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [firstCard, secondCard])

  // 成功配對 4 對邏輯
  useEffect(() => {
    const handleSuccess = async () => {
      setGameEnded(true)
      setGameResult('success')

      if (!memberId) {
        showToast('info', '請登入後再挑戰')
        showToast('danger', '未登入，無法領取優惠券')

        return
      }

      if (hasClaimedToday) {
        showToast('warning', '今日挑戰的獎勵已經領過囉！')
        return
      }

      try {
        const payload = {
          couponId: 999, // ✅ 遊戲專屬優惠券 id
        }

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/couponsClaim/claim`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (res.data.status === 'success') {
          showToast('success', '挑戰成功！')
          showToast('success', '優惠券已發送，請至會員中心查看')
          setHasClaimedToday(true)
        } else {
          showToast('warning', res.data.message || '優惠券發送失敗')
        }
      } catch (err) {
        if (err.response?.status === 409) {
          showToast('warning', err.response.data.message || '今日已領取過')
        } else {
          showToast('danger', '發送優惠券時發生錯誤')
        }
      }
    }
    if (matchedCount === 4 && timeLeft > 0 && !gameEnded) {
      handleSuccess()
    }
  }, [matchedCount, timeLeft])

  const handleCardClick = (card) => {
    if (!gameStarted || disabled || card.matched || card === firstCard) return
    firstCard ? setSecondCard(card) : setFirstCard(card)
  }

  const resetTurn = () => {
    setFirstCard(null)
    setSecondCard(null)
    setDisabled(false)
  }
  const handleCancelGame = () => {
    setGameStarted(false)
    setGameEnded(false)
    setMatchedCount(0)
    setTimeLeft(30)
    setCards([])
    setTimeout(() => {
      scrollToGame?.()
    }, 100)
  }

  return (
    <div className={styles.gameBoard}>
      <div className={styles.rule}>
        {!gameStarted && !gameEnded && (
          <>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div className={`${styles.glowText} mt-5 fw-bold fs-1`}>
                DAILY CHALLENGE
              </div>
              <h5 className="mt-5">
                <RiPokerClubsFill className="mb-1 me-1" />
                <b>遊戲規則：</b>
              </h5>
              <h5 style={{ lineHeight: '1.5' }}>
                限時 <span style={{ color: 'red' }}>20 秒</span>{' '}
                內完成所有卡片配對，
                <br />
                即可獲得不限金額折<b> $30元 </b>優惠券乙張。
              </h5>
            </div>
            <button
              className={`btn btn-warning mt-3 fs-3 mt-4  ${styles.shakeButton}`}
              onClick={handleStartGame}
            >
              START
            </button>
          </>
        )}
        {gameStarted && (
          <div className={styles.timerWrapper}>
            <div className="d-flex justify-content-between align-items-center w-100 px-2">
              {/* 倒數區 */}
              <div className="d-flex align-items-center gap-2">
                <h4 className="m-0">倒數：</h4>
                <h1
                  key={timeLeft}
                  className={`${styles.countdown} ${timeLeft <= 5 ? styles.warning : ''
                    } me-2`}
                >
                  {timeLeft}
                </h1>
                <h4 className="my-0 me-5">s</h4>
              </div>

              {/* 計分區 */}
              <div className="d-flex align-items-center gap-2">
                <h4 className="m-0">配對數：</h4>
                <h2 className={`${styles.score}`}>{matchedCount} / 4</h2>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cardGrid}>
        {cards.map((card) => {
          const isFlipped =
            card === firstCard || card === secondCard || card.matched
          return (
            <Card
              key={card.id}
              card={card}
              isFlipped={isFlipped}
              onClick={() => handleCardClick(card)}
            />
          )
        })}
      </div>

      {gameEnded && (
        <div className={styles.overlay}>
          <div
            className={
              gameResult === 'success'
                ? styles.overlayContentSuccess
                : styles.overlayContentFail
            }
          >
            <h3>
              {gameResult === 'success' ? (
                <>
                  <TbSparkles /> 挑戰成功 <TbSparkles />
                </>
              ) : (
                '- 挑戰失敗 -'
              )}
            </h3>
            {gameResult === 'fail' && <p>再接再厲!</p>}
            <button className="btn btn-success mt-3" onClick={handleStartGame}>
              再玩一次
            </button>
            <button
              className="btn btn-cancel mt-3 ms-2"
              onClick={handleCancelGame}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 未登入提醒 Modal */}
      {showWarningModal && (
        <InfoModal
          title="活動規則"
          message="登入會員後，才能領取挑戰成功獎勵!"
          buttonText="我知道了"
          showByDefault={true}
          onConfirm={() => {
            setShowWarningModal(false)
            if (pendingStart) {
              setPendingStart(false)
              startGame()
            }
          }}
        />
      )}
    </div>
  )
}
