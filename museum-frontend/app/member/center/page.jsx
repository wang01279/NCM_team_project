'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/_components/ToastManager'

import styles from './styles/center.module.scss'
import LeftSidebar from './features/sidebar/LeftSidebar'
import LowContent from './features/cover/LowContent'
import RightContent from './features/lottery/RightContent'

// 分頁元件
import ProfileTab from './features/tabs/ProfileTab'
import OrdersTab from './features/tabs/OrdersTab'
import CouponsTab from './features/tabs/CouponsTab'
import FavoritesTab from './features/tabs/FavoritesTab'

export default function MemberCenter() {
  const [activeTab, setActiveTab] = useState('profile') // 預設是個人資料頁

  // 根據 activeTab 渲染不同內容
  const renderMainContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab
        member={member}
        isEditing={isEditing}
        formData={formData}
        handleEdit={handleEdit}
        handleCancel={handleCancel}
        handleChange={handleChange}
        />
      case 'orders':
        return <OrdersTab />
      case 'coupons':
        return <CouponsTab />
      case 'favorites':
        return <FavoritesTab />
      default:
        return <div>找不到此頁面</div>
    }
  }



  const router = useRouter()
  const { showToast } = useToast()
  const [member, setMember] = useState({
    avatar: 'null',
    name: '',
    email: '',
    gender: 'null',
    phone: 'null',
    address: 'null',
    birthday: 'null',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    address: '',
    birthday: ''
  })

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        // 檢查 URL 參數中是否有用戶資料
        const searchParams = new URLSearchParams(window.location.search)
        const userData = searchParams.get('user')
        const token = searchParams.get('token')

        if (userData && token) {
          // 如果有 URL 參數，使用這些資料
          const parsedUserData = JSON.parse(decodeURIComponent(userData))
          setMember(parsedUserData)
          localStorage.setItem('token', token)
          localStorage.setItem('member', JSON.stringify(parsedUserData))
          setFormData({
            name: parsedUserData.name || '',
            gender: parsedUserData.gender || '',
            phone: parsedUserData.phone || '',
            address: parsedUserData.address || '',
            birthday: parsedUserData.birthday || ''
          })
          setIsLoading(false)
          return
        }

        // 如果沒有 URL 參數，從 localStorage 和 API 獲取資料
        const savedToken = localStorage.getItem('token')
        if (!savedToken) {
          router.push('/')
          return
        }

        // 先從 localStorage 讀取用戶資料
        const savedMember = localStorage.getItem('member')
        if (savedMember) {
          const parsedMember = JSON.parse(savedMember)
          setMember(parsedMember)
          setFormData({
            name: parsedMember.name || '',
            gender: parsedMember.gender || '',
            phone: parsedMember.phone || '',
            address: parsedMember.address || '',
            birthday: parsedMember.birthday || ''
          })
        }

        // 然後從 API 獲取最新資料
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/me`, {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        })

        const data = await response.json()
        if (data.success) {
          setMember(data.data)
          setFormData({
            name: data.data.name || '',
            gender: data.data.gender || '',
            phone: data.data.phone || '',
            address: data.data.address || '',
            birthday: data.data.birthday || ''
          })
          // 更新 localStorage 中的用戶資料
          localStorage.setItem('member', JSON.stringify(data.data))
        } else {
          console.error('獲取會員資料失敗:', data.message)
          localStorage.removeItem('token')
          localStorage.removeItem('member')
          router.push('/')
        }
      } catch (error) {
        console.error('獲取會員資料時發生錯誤:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('member')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemberData()
  }, [router])

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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 檢查檔案大小（限制 5MB）
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', '圖片大小不能超過 5MB')
      return
    }

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      showToast('error', '請上傳圖片檔案')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        showToast('error', '請先登入')
        return
      }

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

      console.log('上傳回應狀態:', res.status)
      const data = await res.json()
      console.log('上傳回應數據:', data)

      if (data.success && data.data.avatarUrl) {
        // 立即預覽
        const localUrl = URL.createObjectURL(file)
        setMember((prev) => ({ ...(prev || {}), avatar: localUrl }))
        
        // 立即更新大頭貼畫面
        const newAvatarUrl = data.data.avatarUrl.startsWith('http')
          ? data.data.avatarUrl
          : `${process.env.NEXT_PUBLIC_API_URL}${data.data.avatarUrl}`
        console.log('新的頭像URL:', newAvatarUrl)

        const updatedMember = {
          ...(member || {}),
          avatar: newAvatarUrl,
        }
        setMember(updatedMember)
        localStorage.setItem('member', JSON.stringify(updatedMember))
        // 觸發自定義事件
        window.dispatchEvent(new Event('memberUpdate'))
        showToast('success', '頭像更新成功')
      } else {
        console.error('上傳失敗:', data.message)
        showToast('error', data.message || '上傳失敗')
      }
    } catch (error) {
      console.error('頭像上傳錯誤:', error)
      showToast('error', '上傳失敗，請稍後再試')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()
      if (data.success) {
        const updatedMember = {
          ...member,
          ...data.data,
        }
        setMember(updatedMember)
        localStorage.setItem('member', JSON.stringify(updatedMember))
        // 觸發自定義事件
        window.dispatchEvent(new Event('memberUpdate'))
        setIsEditing(false)
        showToast('success', '資料更新成功')
      } else {
        showToast('error', data.message || '更新失敗')
      }
    } catch (error) {
      console.error('更新資料時發生錯誤:', error)
      showToast('error', '更新失敗，請稍後再試')
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    )
  }


  return (
    <>
      <div className={styles.lowContent}>
        <LowContent />
      </div>
      <div className={styles.leftSidebar}>
        <LeftSidebar 
        setActiveTab={setActiveTab} 
        activeTab={activeTab} 
        member={member}
        onAvatarUpload={handleAvatarUpload}
        />
      </div>
      <main className={styles.mainContent}>
        {renderMainContent()}
      </main>
      <div className={styles.rightContent}>
        <RightContent />
      </div>
    </>
  )
}
