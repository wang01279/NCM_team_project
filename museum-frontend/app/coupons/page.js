'use client'

import React, { useState, useEffect } from 'react'
import CouTab from './_components/cou-tab.js'
// import DiceCouponGame from './game.js'
import CouponRulesModal from './_components/couponRulesModal.js'

export default function CouponPage() {
  return (
    <>
      <CouponRulesModal/>
      <div className="container">
        <div
          className="d-flex justify-content-center align-items-center flex-column fw-bold"
          style={{ marginTop: '80px' }}
        >
          <h2 className="mb-0 pb-0">優惠券專區</h2>
          <p className="mb-0 pb-0">-</p>
          <h5 className="mt-0 pt-0 m-0">Coupon Redemption Area</h5>
        </div>

        <CouTab />
        <div className="container">玩遊戲領優惠券</div>
        {/* <DiceCouponGame /> */}
        <></>
      </div>
    </>
  )
}
