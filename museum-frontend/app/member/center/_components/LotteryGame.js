'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function LotteryGame() {
  const [isOpened, setIsOpened] = useState(false)

  const handleOpen = () => {
    setIsOpened(true)
  }

  return (
    <motion.div
      className="right-content"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="right-content-title mt-4 mb-2">
        <h3>故瓷門票抽獎</h3>
        <p>每日抽獎一次！</p>
      </div>
      <hr />
      <div className="lottery-container mt-4">
        <div className="envelope-container">
          <div className={`envelope ${isOpened ? 'open' : ''}`} id="envelope">
            <div className="envelope-flap"></div>
            <div className="envelope-body">
              <div className={`ticket ${isOpened ? 'show' : ''}`} id="ticket">
                <div className="ticket-content">
                  <h4>故瓷博物館門票</h4>
                  <p>恭喜您抽中門票！</p>
                  <p>請至櫃台兌換</p>
                </div>
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary mt-4"
            id="openEnvelope"
            onClick={handleOpen}
            disabled={isOpened}
          >
            <i className="fas fa-envelope-open"></i>
            <span>打開信封</span>
          </button>
        </div>
        <div className="lottery-info">
          <div className="prize-history">
            <h5>抽獎紀錄</h5>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                2024/03/15
                <span className="badge bg-success rounded-pill">中獎</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                2024/03/14
                <span className="badge bg-danger rounded-pill">未中獎</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
