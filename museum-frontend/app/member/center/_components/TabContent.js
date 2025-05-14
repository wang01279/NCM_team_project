// components/MemberCenter/TabContent.jsx
'use client'

import React from 'react'
import ProfileTab from './tabs/ProfileTab'
import OrdersTab from './tabs/OrdersTab'
import FavoritesTab from './tabs/FavoritesTab'
import CouponsTab from './tabs/CouponsTab'

export default function TabContent(props) {
  const { activeTab } = props

  switch (activeTab) {
    case 'profile':
      return <ProfileTab {...props} />
    case 'orders':
      return <OrdersTab />
    case 'favorites':
      return <FavoritesTab /> 
    case 'coupons':
      return <CouponsTab />
    default:
      return <div>找不到頁面內容</div>
  }
}
