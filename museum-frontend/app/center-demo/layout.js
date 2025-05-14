'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/_components/ToastManager'
import '@/app/member/center/_style/memberCenter.scss'
import CoverEditor from './_components/CoverEditor'
import Sidebar from './_components/Sidebar'
import TabContent from './_components/TabContent'
import LotteryGame from './_components/LotteryGame'

export default function MemberLayout({ children }) {
    const router = useRouter()
    const { showToast } = useToast()

    const [member, setMember] = useState({
        avatar: '',
        name: '',
        email: '',
        gender: '',
        phone: '',
        address: '',
        birthday: '',
    })
    const [coverImage, setCoverImage] = useState('/profile/images/gg.gif')
    const [activeTab, setActiveTab] = useState('profile')
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        phone: '',
        address: '',
        birthday: ''
    })

    const handleCoverUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            showToast('error', '請上傳圖片檔案')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('error', '圖片大小不能超過 5MB')
            return
        }

        const previewUrl = URL.createObjectURL(file)
        setCoverImage(previewUrl)
    }

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            showToast('error', '圖片大小不能超過 5MB')
            return
        }

        if (!file.type.startsWith('image/')) {
            showToast('error', '請上傳圖片檔案')
            return
        }

        const fd = new FormData()
        fd.append('avatar', file)

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/profile/avatar`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            })

            const data = await res.json()
            if (data.success && data.data.avatarUrl) {
                const url = data.data.avatarUrl.startsWith('http')
                    ? data.data.avatarUrl
                    : `${process.env.NEXT_PUBLIC_API_URL}${data.data.avatarUrl}`

                const updated = { ...member, avatar: url }
                setMember(updated)
                localStorage.setItem('member', JSON.stringify(updated))
                window.dispatchEvent(new Event('memberUpdate'))
                showToast('success', '頭像更新成功')
            } else {
                showToast('error', data.message || '上傳失敗')
            }
        } catch (error) {
            console.error(error)
            showToast('error', '上傳失敗')
        }
    }

    const handleEdit = () => setIsEditing(true)

    const handleCancel = () => {
        setIsEditing(false)
        setFormData({
            name: member.name || '',
            gender: member.gender || '',
            phone: member.phone || '',
            address: member.address || '',
            birthday: member.birthday || ''
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/')
                return
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            if (data.success) {
                const updated = { ...member, ...data.data }
                setMember(updated)
                localStorage.setItem('member', JSON.stringify(updated))
                window.dispatchEvent(new Event('memberUpdate'))
                setIsEditing(false)
                showToast('success', '資料更新成功')
            } else {
                showToast('error', data.message || '更新失敗')
            }
        } catch (error) {
            showToast('error', '更新失敗，請稍後再試')
        }
    }

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/')
                    return
                }

                const savedMember = localStorage.getItem('member')
                if (savedMember) {
                    const parsed = JSON.parse(savedMember)
                    setMember(parsed)
                    setFormData({
                        name: parsed.name || '',
                        gender: parsed.gender || '',
                        phone: parsed.phone || '',
                        address: parsed.address || '',
                        birthday: parsed.birthday || ''
                    })
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()

                if (data.success) {
                    setMember(data.data)
                    setFormData({
                        name: data.data.name || '',
                        gender: data.data.gender || '',
                        phone: data.data.phone || '',
                        address: data.data.address || '',
                        birthday: data.data.birthday || ''
                    })
                    localStorage.setItem('member', JSON.stringify(data.data))
                } else {
                    router.push('/')
                }
            } catch (error) {
                console.error(error)
                router.push('/')
            } finally {
                setIsLoading(false)
            }
        }

        fetchMemberData()
    }, [router])

    if (isLoading) {
        return (
            <div className="loading-container text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3">載入中...</p>
            </div>
        )
    }

    return (
        <div className="member-center">
            <CoverEditor coverImage={coverImage} onCoverUpload={handleCoverUpload} />
            <div className="container">
                <Sidebar
                    member={member}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onAvatarUpload={handleAvatarUpload}
                />
                <div className="main-content">
                    <div className="card">
                        <div className="card-body">
                            <TabContent
                                activeTab={activeTab}
                                isEditing={isEditing}
                                member={member}
                                formData={formData}
                                onEdit={handleEdit}
                                onCancel={handleCancel}
                                onSubmit={handleSubmit}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="right-content">
                    <LotteryGame />
                </div>
            </div>
        </div>
    )
}
