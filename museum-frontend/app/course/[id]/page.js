'use client'

import '@/app/_styles/components/productCard.scss'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
// import Image from 'next/image'
import { useToast } from '@/app/_components/ToastManager'
import Head from 'next/head'
import '@/app/_styles/globals.scss'
import styles from '@/app/course/_styles/courseDetail.module.scss'
import CourseInfo from '@/app/course/_components/CourseInfo'
import CourseContent from '@/app/course/_components/CourseContent'
import EnrollmentSection from '@/app/course/_components/EnrollmentSection'
import RelatedCourses from '@/app/course/_components/RelatedCourses'
import Navbar from '@/app/_components/navbar'
import Footer from '../../_components/footer3'
import Image from 'next/image'
import { useCart } from '@/app/_context/CartContext'
import CommentSection from '@/app/_components/comments/CommentSection'
import CourseNotice from '../_components/CourseNotice'
import Loader from '@/app/_components/load'
import useFavorites from '@/app/_hooks/useFavorites'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'

// API functions
const fetchCourse = async (id) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`
  )
  return response.data
}

const fetchArtist = async (artistId) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artists/${artistId}`
  )
  return response.data
}

const fetchArtistExperiences = async (artistId) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artists/${artistId}/experiences`
  )
  return response.data
}

const fetchRelatedCourses = async (courseId, categoryId) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/related?courseId=${courseId}&category=${categoryId}`
  )
  return response.data
}

export default function CourseDetailPage() {
  const { cartItems, addItem } = useCart()
  const params = useParams()
  const id = params.id
  const [course, setCourse] = useState(null)
  const [relatedCourses, setRelatedCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites('course')
  const [isMobile, setIsMobile] = useState(false)

  const toast = useToast()
  const { showToast } = useToast()

  const fetchCourseData = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const courseData = await fetchCourse(id)
      let artist = null
      let artistExperiences = []
      if (courseData.artist_id) {
        artist = await fetchArtist(courseData.artist_id)
        artistExperiences = await fetchArtistExperiences(courseData.artist_id)
      }
      // 計算課程總時數
      let totalHours = ''
      if (courseData.start_time && courseData.end_time) {
        const start = new Date(courseData.start_time)
        const end = new Date(courseData.end_time)
        const diffMs = end - start
        if (!isNaN(diffMs) && diffMs > 0) {
          const hours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100
          totalHours = `${hours} 小時`
        }
      }
      // 統一 course 物件
      const unifiedCourse = {
        ...courseData,
        duration: totalHours || '—',
        maxStudents: courseData.max_students || '20',
        artist,
        artistExperiences,
        studentCount: courseData.studentCount || 0,
      }
      setCourse(unifiedCourse)
      // 相關課程
      let relCourses = []
      if (courseData.categories && courseData.categories[0]?.id) {
        try {
          relCourses = await fetchRelatedCourses(
            id,
            courseData.categories[0].id
          )
        } catch { }
      }
      setRelatedCourses(relCourses)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('無法載入課程資訊')
      setLoading(false)
      if (toast && typeof toast.showToast === 'function') {
        toast.showToast('error', '無法載入課程資訊')
      }
    }
  }, [id, toast])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  useEffect(() => {
    const alreadyInCart = cartItems.some(
      (item) => item.id === course?.id && item.type === 'course'
    )
    setIsEnrolled(alreadyInCart)
  }, [cartItems, course])

  const handleFavorite = useCallback(async (courseId) => {
    return await toggleFavorite(courseId, !isFavorite(courseId))
  }, [toggleFavorite, isFavorite])

  // const handleEnroll = useCallback(() => {
  //   if (!course) return
  //   console.log('報名課程:', course.id)
  //   // TODO: Implement enrollment logic
  // }, [course])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 700px)').matches)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255,255,255,0.85)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary mt-3" onClick={fetchCourseData}>
          重試
        </button>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          找不到課程
        </div>
      </div>
    )
  }
  const handleAddToCart = (quantity = 1) => {
    if (!course) return

    addItem({
      id: course.id,
      name: course.title,
      image: course.images?.find((img) => img.is_main == 0)?.image_path,
      price: Number(course.price),
      quantity,
      type: 'course',
    })

    showToast('success', `已成功報名課程 ${quantity} 堂`, 3000)
  }

  return (
    <>
      <Navbar />
      <Head>
        <title>{course.title} | 國立故瓷博物館</title>
        <meta name="description" content={course.description || ''} />
      </Head>

      {console.log('images:', course.images)}
      {/* Gallery Section */}
      <section className="course-gallery container py-4">
        <div className="row g-3">
          {Array.isArray(course.images) && (
            isMobile
              ? course.images.filter(img => img.is_main == 1).slice(0, 1).map((img, idx) => (
                  <div className="col-12" key={img.image_path || idx}>
                    <div className="gallery-img-wrapper">
                      <Image
                        src={img.image_path || '/default-course.jpg'}
                        alt={`課程圖片主圖`}
                        width={100}
                        height={260}
                        className="img-fluid rounded"
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '260px',
                        }}
                      />
                    </div>
                  </div>
                ))
              : course.images.slice(0, 3).map((img, idx) => (
                  <div className="col-md-4" key={img.image_path || idx}>
                    <div className="gallery-img-wrapper">
                      <Image
                        src={img.image_path || '/default-course.jpg'}
                        alt={`課程圖片${idx + 1}`}
                        width={100}
                        height={260}
                        className="img-fluid rounded"
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '260px',
                        }}
                      />
                    </div>
                  </div>
                ))
          )}
        </div>
      </section>

      <div className="container px-3 px-md-4">
        <CourseInfo course={course} />
        <div className="row mt-5">
          <div className="col-lg-8">
            <CourseContent course={course} />
          </div>
          <div className="col-lg-4">
            <EnrollmentSection
              course={course}
              // onEnroll={handleEnroll}
              onAddToCart={handleAddToCart}
              isEnrolled={isEnrolled}
              isFavorite={isFavorite(course.id)}
              onFavorite={handleFavorite}
            />
          </div>
        </div>
      </div>

      {/* 推薦課程板塊 */}
      <RelatedCourses courses={relatedCourses} />

      {/* 課程購買注意事項區塊（可折疊） */}
      <CourseNotice />

      {/* 學員評價區塊 */}
      <CommentSection type="course" id={course.id} />
      <Footer />
    </>
  )
}

// 自定義組件實現
// function CourseDetail3D({ roomId }) {
//   return (
//     <section className="spline-container">
//       <iframe
//         src={`https://my.spline.design/untitled-${roomId || 'FPswV6rOeZZPKCr2BxFt1apj'}/`}
//         frameBorder='0'
//         width='100%'
//         height='100%'
//       ></iframe>
//     </section>
//   )
// }
