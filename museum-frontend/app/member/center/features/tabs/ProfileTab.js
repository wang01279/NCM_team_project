// museum-frontend/app/member/center/features/tabs/ProfileTab.js
'use client'

import React, { useState } from 'react'

import '@/app/_styles/vendors/_bootstrap-override.scss'
import '@/app/_styles/globals.scss'
import { Button } from 'react-bootstrap'
import { useToast } from '@/app/_components/ToastManager'
import InfoRow from './_profile/InfoRow'
import EditProfileModal from './_profile/EditProfileModal'
import PasswordChangeModal from './_profile/PasswordChangeModal'
import DeleteAccountModal from './_profile/DeleteAccountModal'

import styles from './_style/profile.module.scss'

import { FaKey, FaEdit, FaTrash } from 'react-icons/fa'

export default function ProfileTab({ member, formData, onEdit, onCancel, onSubmit, onChange }) {
  const [showModal, setShowModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(member?.avatar || null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [deletePassword, setDeletePassword] = useState('')
  const { showToast } = useToast()

  const handleClose = () => {
    setShowModal(false)
    onCancel()
    setAvatarFile(null)
    setAvatarPreview(member?.avatar || null)
  }

  const handleShow = () => {
    setAvatarPreview(member?.avatar || null)
    setShowModal(true)
    onEdit()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('圖片大小不能超過 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('請上傳圖片檔案')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)

    setAvatarFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formDataToSend = new FormData()

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key])
      })

      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile)
      }

      await onSubmit(formDataToSend)
      setShowModal(false)
    } catch (error) {
      console.error('更新失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (passwordData.newPassword.length < 8) {
      showToast('error', '新密碼長度至少需要8個字符')
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', '兩次輸入的新密碼不一致')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || '修改密碼失敗')
      }

      showToast('success', '密碼修改成功')
      setShowPasswordModal(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('修改密碼錯誤:', error)
      showToast('error', error.message || '修改密碼失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/members/account`
      console.log('API URL:', apiUrl)
      console.log('Token:', localStorage.getItem('token'))
      console.log('請求數據:', { password: deletePassword })

      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      })

      console.log('收到回應:', {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
      })

      let data
      try {
        data = await res.json()
        console.log('回應數據:', data)
      } catch (jsonError) {
        console.error('解析JSON失敗:', jsonError)
        throw new Error('伺服器回應格式錯誤')
      }

      if (!res.ok) {
        throw new Error(data.message || '刪除帳號失敗')
      }

      showToast('success', '帳號已成功刪除')
      // 清除本地存儲
      localStorage.removeItem('token')
      localStorage.removeItem('member')
      // 重定向到首頁
      window.location.href = '/'
    } catch (error) {
      console.error('刪除帳號錯誤:', error)
      console.error('錯誤詳情:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
      showToast('error', error.message || '刪除帳號失敗')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={styles['profile-card']}>
        <div className={styles['profile-main-row']}>
          <div className={styles['profile-avatar-col']}>
            <img
              src={member?.avatar || '/default-avatar.png'}
              alt="頭像"
              className={styles['profile-avatar']}
            />
            <div className={styles['profile-name']}>{member?.name}</div>
            <div className={styles['profile-role']}>
              {member?.role === 'admin' ? '管理員' : '一般會員'}
            </div>
          </div>
          <div className={styles['profile-info-col']}>
            <div className={styles['profile-info']}>
              <div className={styles['profile-row']}>
                <span className={styles['profile-label']}>電子郵件</span>
                <span className={styles['profile-value']}>{member?.email}</span>
              </div>
              <div className={styles['profile-row']}>
                <span className={styles['profile-label']}>性別</span>
                <span className={styles['profile-value']}>
                  {member?.gender === 'M' ? '男' : member?.gender === 'F' ? '女' : '其他'}
                </span>
              </div>
              <div className={styles['profile-row']}>
                <span className={styles['profile-label']}>電話</span>
                <span className={styles['profile-value']}>{member?.phone}</span>
              </div>
              <div className={styles['profile-row']}>
                <span className={styles['profile-label']}>地址</span>
                <span className={styles['profile-value']}>{member?.address}</span>
              </div>
              <div className={styles['profile-row']}>
                <span className={styles['profile-label']}>生日</span>
                <span className={styles['profile-value']}>
                  {member?.birthday
                    ? new Date(member?.birthday).toLocaleDateString('zh-TW')
                    : '未設定'}
                </span>
              </div>
            </div>
            <div className={styles['profile-btns-row']}>
              <Button
                variant="outline-primary"
                onClick={() => setShowPasswordModal(true)}
              >
                <FaKey className="icon my-auto" />修改密碼
              </Button>
              <Button variant="primary" onClick={handleShow}>
                <FaEdit className="icon my-auto" />編輯資料
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                <FaTrash className="icon my-auto" />刪除帳號
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        show={showModal}
        onHide={handleClose}
        member={member}
        formData={formData}
        onChange={onChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        avatarPreview={avatarPreview}
        onAvatarChange={handleAvatarChange}
      />

      <PasswordChangeModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        passwordData={passwordData}
        onChange={handlePasswordChange}
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
      />

      <DeleteAccountModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        deletePassword={deletePassword}
        onChange={(e) => setDeletePassword(e.target.value)}
        onSubmit={handleDeleteAccount}
        isLoading={isLoading}
      />
    </>
  )
}