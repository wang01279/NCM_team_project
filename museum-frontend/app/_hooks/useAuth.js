// // 'use client'

// import { useState, useEffect } from 'react'
// import { auth } from '@/app/_config/firebase'
// import { signOut as firebaseSignOut } from 'firebase/auth'

// export const useAuth = () => {
// // export default function useAuthInner() {
//   const [member, setMember] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [token, setToken] = useState(null)

//   // 第 1 支 effect：初始化 loadLocalStorage
//   useEffect(() => {
//     const storedMember = localStorage.getItem('member')
//     const storedToken = localStorage.getItem('token')
//     if (storedMember && storedToken) {
//       const memberData = JSON.parse(storedMember)
//       setMember(memberData)
//       setToken(storedToken)
//       setIsLoggedIn(true)
//     }
//     setIsLoading(false)
//   }, [])

//   // 第 2 支 effect：token 有了就 fetch 一次最新 profile
//   useEffect(() => {
//     if (!token || !member?.id) return
//     const fetchLatestProfile = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/members/${member.id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         const data = await res.json()
//         if (data.success) {
//           setMember(data.data)
//           localStorage.setItem('member', JSON.stringify(data.data))
//         }
//       } catch (error) {
//         console.error('獲取最新會員資料失敗:', error)
//       }
//     }
//     fetchLatestProfile()
//   }, [token, member?.id])

//   // 監聽登入/登出事件
//   useEffect(() => {
//     const handleLogin = (event) => {
//       const { memberData, token: newToken } = event.detail
//       setMember(memberData)
//       setToken(newToken)
//       setIsLoggedIn(true)
//       localStorage.setItem('member', JSON.stringify(memberData))
//       localStorage.setItem('token', newToken)
//     }
//     const handleLogout = () => {
//       setMember(null)
//       setToken(null)
//       setIsLoggedIn(false)
//       localStorage.removeItem('member')
//       localStorage.removeItem('token')
//     }
//     window.addEventListener('memberLogin', handleLogin)
//     window.addEventListener('memberLogout', handleLogout)
//     return () => {
//       window.removeEventListener('memberLogin', handleLogin)
//       window.removeEventListener('memberLogout', handleLogout)
//     }
//   }, [])

//   // 主動呼叫登入
//   const login = (memberData, authToken) => {
//     window.dispatchEvent(
//       new CustomEvent('memberLogin', {
//         detail: { memberData, token: authToken },
//       })
//     )
//   }

//   const updateMember = (newMemberData) => {
//     setMember(newMemberData)
//     localStorage.setItem('member', JSON.stringify(newMemberData))
//   }

//   const logout = async () => {
//     try {
//       await firebaseSignOut(auth)
//       window.dispatchEvent(new Event('memberLogout'))
//     } catch (error) {
//       console.error('登出失敗:', error)
//       throw error
//     }
//   }

//   return {
//     member,
//     token,
//     isLoading,
//     isLoggedIn,
//     login,
//     updateMember,
//     logout,
//   }
// }

'use client'

// app/_hooks/useAuth.js
import { useState, useEffect } from 'react'
import { auth } from '@/app/_config/firebase'
import { signOut as firebaseSignOut } from 'firebase/auth'

export function useAuth() {
  const [member, setMember] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(null)

  // 初始化：從 localStorage 載入
  useEffect(() => {
    const storedMember = localStorage.getItem('member')
    const storedToken = localStorage.getItem('token')
    if (storedMember && storedToken) {
      const trimmed = storedMember.trim()
      // 如果是 HTML (以 '<' 開頭)，直接清除
      if (trimmed.startsWith('<')) {
        console.warn('localStorage.member 似乎為 HTML, 已清除')
        localStorage.removeItem('member')
        localStorage.removeItem('token')
      }
      // 如果看起來像 JSON (以 '{' 開頭) 才嘗試解析
      else if (trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed)
          setMember(parsed)
          setToken(storedToken)
          setIsLoggedIn(true)
        } catch (e) {
          console.warn('JSON 解析失敗, 已清除本地儲存:', e)
          localStorage.removeItem('member')
          localStorage.removeItem('token')
        }
      } else {
        console.warn('localStorage.member 不是 JSON, 已清除')
        localStorage.removeItem('member')
        localStorage.removeItem('token')
      }
    }
    setIsLoading(false)
  }, [])

  // token 有了就更新會員資料
  useEffect(() => {
    if (!token || !member?.id) return
    ;(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/members/${member.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const json = await res.json()
        if (json.success) {
          setMember(json.data)
          localStorage.setItem('member', JSON.stringify(json.data))
        }
      } catch (e) {
        console.error('更新會員資料失敗:', e)
      }
    })()
  }, [token, member?.id])

  // 直接登入
  const login = (memberData, authToken) => {
    setMember(memberData)
    setToken(authToken)
    setIsLoggedIn(true)
    localStorage.setItem('member', JSON.stringify(memberData))
    localStorage.setItem('token', authToken)
  }

  // 登出
  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      setMember(null)
      setToken(null)
      setIsLoggedIn(false)
      localStorage.removeItem('member')
      localStorage.removeItem('token')
    } catch (e) {
      console.error('登出失敗:', e)
      throw e
    }
  }

  return { member, token, isLoading, isLoggedIn, login, logout }
}
