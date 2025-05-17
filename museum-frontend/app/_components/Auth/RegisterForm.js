// museum-frontend/app/_components/Auth/RegisterForm.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from 'react-bootstrap'
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa'
import FloatingField from '@/app/_components/FloatingField'
import { useToast } from '@/app/_components/ToastManager'
import { useAuth } from '@/app/_hooks/useAuth'

export default function RegisterForm({ formData, setFormData, onSubmit, onClose }) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!formData.name || formData.name.length < 2 || formData.name.length > 20) {
      showToast('error', '姓名需為 2-20 字元')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showToast('error', '請輸入有效的電子郵件格式')
      return false
    }
    if (formData.password.length < 8) {
      showToast('error', '密碼長度至少為 8 字元')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('error', '兩次輸入的密碼不一致')
      return false
    }
    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/members/register`
      console.log('註冊請求 URL:', apiUrl)

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      // 检查响应的 Content-Type
      const contentType = res.headers.get('content-type')
      console.log('回應 Content-Type:', contentType)
      console.log('回應狀態碼:', res.status)

      // 如果不是 JSON 格式，先读取内容看看是什么
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text()
        console.error('非 JSON 回應內容:', text)
        throw new Error('伺服器回應格式錯誤，請檢查 API 地址是否正確')
      }

      const data = await res.json()
      console.log('完整回應內容:', data)

      if (!res.ok || !data.success) {
        throw new Error(data.message || '註冊失敗')
      }

      // 檢查返回的數據結構
      if (!data.token) {
        console.error('返回數據缺少 token 字段:', data)
        throw new Error('註冊成功但未收到認證令牌')
      }

      if (!data.user) {
        console.error('返回數據缺少 user 字段:', data)
        throw new Error('註冊成功但未收到用戶信息')
      }

      // 使用注册返回的数据更新全局状态
      login(data.user, data.token)
      
      // 关闭模态框并显示成功消息
      showToast('success', '註冊成功 🎉')
      if (onClose) onClose()
      
      // 跳转到会员中心
      router.push('/member/center')
    } catch (err) {
      console.error('註冊錯誤:', err)
      showToast('error', err.message || '系統錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/members/auth/google`
  }

  return (
    <Form onSubmit={handleRegister}>
      <FloatingField
        controlId="name"
        name="name"
        label={<><FaUser className="icon" /> 姓名</>}
        placeholder="請輸入姓名"
        value={formData.name}
        onChange={handleChange}
      />
      <FloatingField
        controlId="email"
        name="email"
        type="email"
        label={<><FaEnvelope className="icon" /> 電子郵件</>}
        placeholder="請輸入電子郵件"
        value={formData.email}
        onChange={handleChange}
      />
      <FloatingField
        controlId="password"
        name="password"
        type="password"
        label={<><FaLock className="icon" /> 密碼</>}
        placeholder="請輸入密碼"
        value={formData.password}
        onChange={handleChange}
      />
      <FloatingField
        controlId="confirmPassword"
        name="confirmPassword"
        type="password"
        label={<><FaLock className="icon" /> 確認密碼</>}
        placeholder="請再次輸入密碼"
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      <div className="d-grid gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '註冊中...' : '註冊'}
        </button>

        <div className="text-center my-3">
          <span className="text-muted">或</span>
        </div>

        <button type="button" className="btn btn-outline-primary" onClick={handleGoogleRegister}>
          <FaGoogle className="icon" />
          使用 Google 註冊
        </button>
      </div>
    </Form>
  )
}