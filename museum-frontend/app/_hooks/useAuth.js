// museum-frontend/app/_hooks/useAuth.js
'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/app/_components/ToastManager'

export function useAuth() {
  const [member, setMember] = useState({
    avatar: null,
    name: '',
    email: '',
    gender: null,
    phone: null,
    address: null,
    birthday: null,
  })
  const [token, setToken] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const savedToken = localStorage.getItem('token')
        if (!savedToken) {
          setToken(null)
          setMember({
            avatar: null,
            name: '',
            email: '',
            gender: null,
            phone: null,
            address: null,
            birthday: null,
          })
          setIsLoggedIn(false)
          setIsLoading(false)
          return
        }

        const savedMember = localStorage.getItem('member')
        if (savedMember) {
          const parsedMember = JSON.parse(savedMember)
          setMember(parsedMember)
          setToken(savedToken)
          setIsLoggedIn(true)
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/me`, {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        })

        const data = await response.json()
        if (data.success) {
          setMember(data.data)
          setToken(savedToken)
          setIsLoggedIn(true)
          localStorage.setItem('member', JSON.stringify(data.data))
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('member')
          setToken(null)
          setMember({
            avatar: null,
            name: '',
            email: '',
            gender: null,
            phone: null,
            address: null,
            birthday: null,
          })
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('獲取會員資料時發生錯誤:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('member')
        setToken(null)
        setMember({
          avatar: null,
          name: '',
          email: '',
          gender: null,
          phone: null,
          address: null,
          birthday: null,
        })
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthData()

    const handleStorageChange = (e) => {
      if (e.key === 'member' || e.key === 'token') {
        loadAuthData()
      }
    }

    const handleMemberUpdate = () => {
      loadAuthData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('memberUpdate', handleMemberUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('memberUpdate', handleMemberUpdate)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('member')
    setToken(null)
    setMember({
      avatar: null,
      name: '',
      email: '',
      gender: null,
      phone: null,
      address: null,
      birthday: null,
    })
    setIsLoggedIn(false)
    showToast('info', '您已登出 👋')
  }

  const updateMember = (newMemberData) => {
    setMember(newMemberData)
    localStorage.setItem('member', JSON.stringify(newMemberData))
  }

  return {
    member,
    token,
    isLoggedIn,
    isLoading,
    logout,
    updateMember
  }
}


// 使用方法
// import { useAuth } from '@/app/_hooks/useAuth'

// export default function SomeComponent() {
//   const { member, token, isLoggedIn, isLoading } = useAuth()

//   if (isLoading) {
//     return <div>載入中...</div>
//   }

//   return (
//     <div>
//       {isLoggedIn ? (
//         <div>歡迎, {member.name}</div>
//       ) : (
//         <div>請先登入</div>
//       )}
//     </div>
//   )
// }