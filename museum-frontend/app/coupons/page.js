'use client'

import React, { useState, useEffect } from 'react'
import CouTab from './_components/cou-tab.js'
// import DiceCouponGame from './game.js'

export default function CouponPage() {
  return (
    <>
      <div className="container">
        <div className="pt-5 mt-5 text-center d-flex justify-content-center">
          <h4 className="fw-bold">
            優惠券專區 | Coupon Redemption Area <br />
          </h4>
        </div>
        <CouTab />
        <div className="container">玩遊戲領優惠券</div>
        {/* <DiceCouponGame /> */}
        <></>
      </div>
    </>
  )
}
