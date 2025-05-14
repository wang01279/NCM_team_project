'use client'

import React from 'react'
import MemberCenterLayout from './layout'
import { ToastProvider } from '@/app/_components/ToastManager'
// import '@/app/_styles/globals.scss'
import '@/app/_styles/formCustom.scss'
import '@/app/center-demo/_style/memberCenter.scss'

import ProfileTab from './features/profile/ProfileTab'
import FavoritesTab from './features/favorites/FavoritesTab'
import OrdersTab from './features/orders/OrdersTab'
import CouponsTab from './features/coupons/CouponsTab'
import CoverEditor from './features/cover/CoverEditor'
import LotteryGame from './features/lottery/LotteryGame'


export default function MemberPage() {
  return (
    <ToastProvider>
      <CoverEditor />
      <ProfileTab />
      <FavoritesTab />
      <OrdersTab />
      <CouponsTab />
      <LotteryGame />
    </ToastProvider>
  )
}
