'use client'

import React from 'react'
import Button from 'react-bootstrap/Button'
import { FaGoogle } from 'react-icons/fa'

export default function GoogleLoginButton({ onLoginSuccess }) {
  const handleGoogleLogin = async () => {
    try {
      // 使用環境變數中的 API URL
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/members/auth/google`
    } catch (error) {
      console.error('Google 登入失敗:', error)
    }
  }

  return (
    <Button
      variant="outline-dark"
      className="w-100 d-flex align-items-center justify-content-center gap-2"
      onClick={handleGoogleLogin}
    >
      <FaGoogle />
      <span>使用 Google 帳號登入</span>
    </Button>
  )
}