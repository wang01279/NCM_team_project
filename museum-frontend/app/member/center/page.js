'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/_components/ToastManager'
import { useAuth } from '@/app/_hooks/useAuth'
// import { useAuth } from '../../_components/Auth/AuthProvider'

import styles from './styles/center.module.scss'
import LeftSidebar from './features/sidebar/LeftSidebar'
import LowContent from './features/cover/LowContent'
import RightContent from './features/lottery/RightContent'

// 分頁元件
import ProfileTab from './features/tabs/ProfileTab'
import OrdersTab from './features/tabs/OrdersTab'
import CouponsTab from './features/tabs/CouponsTab'
import FavoritesTab from './features/tabs/FavoritesTab'

import { useSearchParams } from 'next/navigation' // ✅ 加這行
import Loader from '@/app/_components/load'
import EditProfileModal from './features/tabs/_profile/EditProfileModal'
import PasswordChangeModal from './features/tabs/_profile/PasswordChangeModal'
import DeleteAccountModal from './features/tabs/_profile/DeleteAccountModal'

export default function MemberCenter() {
  const router = useRouter()
  const { showToast } = useToast()
  const {
    member,
    token,
    isLoggedIn,
    isLoading: authLoading,
    updateMember,
  } = useAuth()

  const searchParams = useSearchParams() // ✅ 加這行
  const [activeTab, setActiveTab] = useState('profile') // ✅ 加這行

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    address: '',
    birthday: '',
  })

  // 新增三個 modal 狀態
  const [showModal, setShowModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // 新增 couponFilter 狀態
  const [couponFilter, setCouponFilter] = useState('available') // 'available' or 'expired'
  // 新增 ordersFilter 狀態
  const [ordersFilter, setOrdersFilter] = useState('processing') // 'processing' or 'completed'
  // 新增 favoriteType 狀態
  const [favoriteType, setFavoriteType] = useState('menu') // 'menu' | 'exhibition' | 'product' | 'course'

  // 新增 passwordData 狀態
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const sidebarRef = useRef()

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    const validTabs = ['profile', 'coupons', 'orders', 'favorites']
    const safeTab = validTabs.includes(tabFromUrl) ? tabFromUrl : 'profile'

    if (safeTab !== activeTab) {
      setActiveTab(safeTab)
    }
  }, [searchParams, activeTab])

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/')
    }
  }, [authLoading, isLoggedIn, router])

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        gender: member.gender || '',
        phone: member.phone || '',
        address: member.address || '',
        birthday: member.birthday || '',
      })
    }
  }, [member])

  // useEffect(() => {
  //   const hash = window.location.hash.replace('#', '')
  //   if (hash && ['profile', 'orders', 'coupons', 'favorites'].includes(hash)) {
  //     setActiveTab(hash)
  //   }
  // }, [])

  // 編輯
  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: member.name || '',
      gender: member.gender || '',
      phone: member.phone || '',
      address: member.address || '',
      birthday: member.birthday || '',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 上傳頭像
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', '圖片大小不能超過 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      showToast('error', '請上傳圖片檔案')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      console.log('開始上傳頭像...')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/profile/avatar`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      console.log('收到回應:', res.status)
      const data = await res.json()
      console.log('回應數據:', data)

      if (data.success && data.data.avatarUrl) {
        const newAvatarUrl = data.data.avatarUrl.startsWith('http')
          ? data.data.avatarUrl
          : `${process.env.NEXT_PUBLIC_API_URL}${data.data.avatarUrl}`

        console.log('新的頭像 URL:', newAvatarUrl)

        const updatedMember = {
          ...member,
          avatar: newAvatarUrl,
        }
        updateMember(updatedMember)
        showToast('success', '頭像更新成功')
      } else {
        showToast('error', data.message || '上傳失敗')
      }
    } catch (error) {
      console.error('頭像上傳錯誤:', error)
      showToast('error', '上傳失敗，請稍後再試')
    }
  }

  const handleSubmit = async (formData) => {
    try {
      console.log('Token:', token)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/profile`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // 直接發送 FormData
        }
      )

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('收到回應:', data)

      if (!response.ok) {
        throw new Error(data.message || '更新失敗')
      }

      updateMember({
        ...member,
        ...data.data,
      })

      showToast('success', '資料更新成功')
    } catch (error) {
      console.error('更新失敗:', error)
      showToast('error', error.message || '更新失敗')
    }
  }

  // 密碼欄位 onChange
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 密碼送出
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    // ...你原本的密碼送出邏輯，可複製自 ProfileTab.js...
  }

  // modal 關閉時自動清除 activeDropdownItem
  const handleCloseEditModal = () => {
    setShowModal(false)
    if (sidebarRef.current) sidebarRef.current.setActiveDropdownItem('')
  }
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false)
    if (sidebarRef.current) sidebarRef.current.setActiveDropdownItem('')
  }
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    if (sidebarRef.current) sidebarRef.current.setActiveDropdownItem('')
  }

  // 渲染主內容
  const renderMainContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab
            member={member}
            isEditing={isEditing}
            formData={formData}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onAvatarUpload={handleAvatarUpload}
          />
        )
      case 'coupons':
        return <CouponsTab filter={couponFilter} />
      case 'orders':
        return <OrdersTab filter={ordersFilter} />
      case 'favorites':
        return <FavoritesTab type={favoriteType} setType={setFavoriteType} />
      default:
        return <div>找不到此頁面</div>
    }
  }

  if (authLoading) {
    return <Loader />
  }

  // 未登入
  if (!isLoggedIn) {
    return null
  }

  // 渲染頁面
  return (
    <>
      <div className={styles.lowContent}>
        <LowContent />
      </div>
      <div className={styles.leftSidebar}>
        <LeftSidebar
          ref={sidebarRef}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          member={member || {}}
          onEditProfileModal={() => setShowModal(true)}
          onShowPasswordModal={() => setShowPasswordModal(true)}
          onShowDeleteModal={() => setShowDeleteModal(true)}
          couponFilter={couponFilter}
          setCouponFilter={setCouponFilter}
          ordersFilter={ordersFilter}
          setOrdersFilter={setOrdersFilter}
          favoriteFilter={favoriteType}
          setFavoriteFilter={setFavoriteType}
        />
      </div>
      <main className={styles.mainContent}>{renderMainContent()}</main>
      <div className={styles.rightContent}>
        <RightContent />
      </div>
      {/* Modal 控制區 */}
      <EditProfileModal
        show={showModal}
        onHide={handleCloseEditModal}
        member={member}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <PasswordChangeModal
        show={showPasswordModal}
        onHide={handleClosePasswordModal}
        passwordData={passwordData}
        onChange={handlePasswordChange}
        onSubmit={handlePasswordSubmit}
      />
      <DeleteAccountModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
      />
    </>
  )
}
