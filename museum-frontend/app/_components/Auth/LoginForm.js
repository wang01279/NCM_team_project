// 'use client'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Form } from 'react-bootstrap'
// import FloatingField from '@/app/_components/FloatingField'
// import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa'
// import { useToast } from '@/app/_components/ToastManager'
// import GoogleLoginButton from './GoogleLoginButton'

// export default function LoginForm({
//   formData,
//   setFormData,
//   onSubmit,
//   onClose,
// }) {
//   const [loading, setLoading] = useState(false)
//   const { showToast } = useToast()
//   const router = useRouter()

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   // 傳統 email/password 登入
//   const handleLogin = async (e) => {
//     e.preventDefault()
//     if (!formData.email || !formData.password) {
//       showToast('error', '請填寫所有欄位')
//       return
//     }

//     setLoading(true)
//     try {
//       await onSubmit?.(formData)
//     } catch (err) {
//       console.error('登入錯誤:', err)
//       showToast('error', err.message || '系統錯誤')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Firebase Google Popup 登入成功後的 callback
//   const handleGoogleLoginSuccess = async (idToken) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/members/auth/firebase`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ idToken }),
//         }
//       )
//       const data = await res.json()
//       if (!res.ok || !data.success) {
//         throw new Error(data.message || 'Firebase 登入後端驗證失敗')
//       }

//       // 驗證成功：存 token + member，導頁
//       localStorage.setItem('token', data.accessToken)
//       localStorage.setItem('member', JSON.stringify(data.user))
//       showToast('success', 'Google 登入成功 🎉')
//       router.push('/member/center')
//     } catch (err) {
//       console.error('後端驗證錯誤：', err)
//       showToast('error', err.message)
//     }
//   }

//   return (
//     <Form onSubmit={handleLogin}>
//       <FloatingField
//         controlId="email"
//         name="email"
//         type="email"
//         label={
//           <>
//             <FaEnvelope className="icon" /> 電子郵件
//           </>
//         }
//         placeholder="請輸入電子郵件"
//         value={formData.email}
//         onChange={handleChange}
//       />
//       <FloatingField
//         controlId="password"
//         name="password"
//         type="password"
//         label={
//           <>
//             <FaLock className="icon" /> 密碼
//           </>
//         }
//         placeholder="請輸入密碼"
//         value={formData.password}
//         onChange={handleChange}
//       />

//       <div className="d-grid gap-2 mt-4">
//         <button className="btn btn-primary" type="submit" disabled={loading}>
//           {loading ? '登入中...' : '登入'}
//         </button>

//         <div className="text-center my-3">
//           <span className="text-muted">或</span>
//         </div>

//         <GoogleLoginButton
//           onLoginSuccess={handleGoogleLoginSuccess}
//           disabled={loading}
//         />
//       </div>
//     </Form>
//   )
// }



'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from 'react-bootstrap'
import FloatingField from '@/app/_components/FloatingField'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'
import GoogleLoginButton from './GoogleLoginButton'
import { useAuth } from '@/app/_hooks/useAuth'

export default function LoginForm({ formData, setFormData, onSubmit, onClose }) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 傳統 email/password 登入
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      showToast('error', '請填寫所有欄位')
      return
    }

    setLoading(true)
    try {
      // 呼叫父層的 onSubmit 處理 email/password 登入
      await onSubmit(formData)
      showToast('success', '登入成功')
      router.push('/member/center')
    } catch (err) {
      console.error('登入錯誤:', err)
      showToast('error', err.message || '系統錯誤')
    } finally {
      setLoading(false)
    }
  }

  // Firebase Google Popup 登入成功後的 callback
  const handleGoogleLoginSuccess = async (idToken) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/auth/firebase`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      )
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Firebase 登入後端驗證失敗')
      }

      // 使用 useAuth.login 統一管理 state & localStorage
      login(data.user, data.accessToken)
      showToast('success', 'Google 登入成功 🎉')
      router.push('/member/center')
    } catch (err) {
      console.error('後端驗證錯誤：', err)
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleLogin}>
      <FloatingField
        controlId="email"
        name="email"
        type="email"
        label={
          <>
            <FaEnvelope className="icon" /> 電子郵件
          </>
        }
        placeholder="請輸入電子郵件"
        value={formData.email}
        onChange={handleChange}
      />
      <FloatingField
        controlId="password"
        name="password"
        type="password"
        label={
          <>
            <FaLock className="icon" /> 密碼
          </>
        }
        placeholder="請輸入密碼"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="d-grid gap-2 mt-4">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? '登入中...' : '登入'}
        </button>

        <div className="text-center my-3">
          <span className="text-muted">或</span>
        </div>

        <GoogleLoginButton
          onLoginSuccess={handleGoogleLoginSuccess}
          disabled={loading}
        />
      </div>
    </Form>
  )
}
