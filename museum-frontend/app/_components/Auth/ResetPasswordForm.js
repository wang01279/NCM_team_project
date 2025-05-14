 'use client'
import { useState } from 'react'
import { Form } from 'react-bootstrap'
import FloatingField from '@/app/_components/FloatingField'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'

export default function ResetPasswordForm({
  formData,
  setFormData,
  setIsVerificationSent,
  setIsForgotPassword,
}) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReset = async (e) => {
    e.preventDefault()

    if (!formData.verificationCode) {
      showToast('error', '請輸入驗證碼')
      return
    }
    if (!formData.password) {
      showToast('error', '請輸入新密碼')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('error', '兩次輸入的密碼不一致')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3005/api/members/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          verificationCode: formData.verificationCode,
          newPassword: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || '重設密碼失敗')
      }

      showToast('success', '密碼重設成功，請使用新密碼登入')
      setIsVerificationSent(false)
      setIsForgotPassword(false)
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
      })
    } catch (err) {
      console.error('重設密碼錯誤:', err)
      showToast('error', err.message || '系統錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleReset}>
      <FloatingField
        controlId="verificationCode"
        name="verificationCode"
        label={<><FaEnvelope className="icon" /> 驗證碼</>}
        placeholder="請輸入驗證碼"
        value={formData.verificationCode}
        onChange={handleChange}
      />

      <FloatingField
        controlId="password"
        name="password"
        type="password"
        label={<><FaLock className="icon" /> 新密碼</>}
        placeholder="請輸入新密碼"
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
          {loading ? '重設中...' : '重設密碼'}
        </button>
      </div>
    </Form>
  )
}
