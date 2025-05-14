'use client'

import React from 'react'
import Button from 'react-bootstrap/Button'
import { FaGoogle } from 'react-icons/fa'

export default function GoogleLoginButton({ onLoginSuccess }) {
  const handleGoogleLogin = async () => {
    try {
      // 这里实现 Google 登录逻辑
      // 例如：打开 Google OAuth 弹窗或重定向到 Google 登录页面
      window.location.href = 'http://localhost:3005/api/members/auth/google'
    } catch (error) {
      console.error('Google 登录失败:', error)
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