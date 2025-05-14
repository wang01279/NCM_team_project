'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from 'react-bootstrap'
import FloatingField from '@/app/_components/FloatingField'
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'

export default function LoginForm({ formData, setFormData, onSubmit, onClose }) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      showToast('error', '請填寫所有欄位')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3005/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || '登入失敗')
      }

      localStorage.setItem('token', data.data.token)
      localStorage.setItem('member', JSON.stringify(data.data.user))
      window.dispatchEvent(new Event('memberUpdate'))
      showToast('success', '登入成功 🎉')

      router.push('/member/center')
      if (onSubmit) onSubmit(data)
      if (onClose) onClose()
    } catch (err) {
      console.error('登入錯誤:', err)
      showToast('error', err.message || '系統錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3005/api/members/auth/google'
  }

  return (
    <Form onSubmit={handleLogin}>
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

      <div className="d-grid gap-2 mt-4">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? '登入中...' : '登入'}
        </button>

        <div className="text-center my-3">
          <span className="text-muted">或</span>
        </div>

        <button type="button" className="btn btn-outline-primary" onClick={handleGoogleLogin}>
          <FaGoogle className="icon" />
          使用 Google 登入
        </button>
      </div>
    </Form>
  )
}
