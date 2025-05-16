'use client'

import '@/app/_styles/globals.scss'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IoLocationSharp } from 'react-icons/io5'
import { FaRegCalendarPlus, FaRegBookmark } from 'react-icons/fa6'
import Image from 'next/image'
import styles from '../_styles/ex-detail.module.scss'
import TextToggle from '../_components/text-toggle.js'

export default function ExhibitionDetailPage() {
  const { id } = useParams()
  const [exhibits, setExhibits] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)

    fetch(`http://localhost:3005/api/exhibitions/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success') {
          setExhibits(res.data)
        } else {
          setIsError(true)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('❌ fetch detail error:', err)
        setIsError(true)
        setIsLoading(false)
      })
  }, [id])

  if (isLoading) return <div className="text-center py-5">資料載入中...</div>
  if (isError || !exhibits)
    return <div className="text-center text-danger py-5">資料載入失敗</div>

  const toUTCString = (dateStr) => {
    const date = new Date(dateStr)
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const googleCalendarUrl =
    exhibits?.startDate && exhibits?.endDate
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(exhibits.title)}` +
        `&details=${encodeURIComponent(exhibits.intro?.slice(0, 100) || '')}` +
        `&location=${encodeURIComponent(exhibits.location || '國立故瓷博物館')}` +
        `&dates=${toUTCString(exhibits.startDate)}/${toUTCString(exhibits.endDate)}`
      : '#'

  return (
    <>
      <div className="d-flex justify-content-center mt-4">
        <Image
          src={`/images/${exhibits.image}`}
          alt={exhibits.title}
          width={1000}
          height={500}
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div
        className={`container d-flex justify-content-center flex-column py-4 ${styles.exhibitionInfo}`}
      >
        <h2 className="fw-bold text-center mb-3">{exhibits.title}</h2>

        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none text-dark text-center"
        >
          <FaRegCalendarPlus className="me-2" />
          {exhibits.startDate.slice(0, 10)} ~ {exhibits.endDate.slice(0, 10)}
        </a>

        <div className="d-flex justify-content-center align-items-center">
          <p className="text-center text-muted d-inline-block me-2 mb-0">
            <IoLocationSharp className="me-1 p-0" />
            {exhibits.venue_id}
          </p>
          <button type="button" className="btn btn-icon">
            <FaRegBookmark />
          </button>
        </div>

        <div className={`container py-4 ${styles.exhibitionDescription}`}>
          <h4 className="fw-bold mb-3">展覽概述</h4>
          <TextToggle text={exhibits.intro} maxLine={5} />
        </div>
      </div>

      <div className="container my-5 d-flex justify-content-center gap-3">
        <Link href="/" className="btn btn-outline-dark px-4">
          返回首頁
        </Link>
        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={() => history.back()}
        >
          返回上一頁
        </button>
      </div>
    </>
  )
}
