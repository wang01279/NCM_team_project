import { memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from '../_styles/courseDetail.module.scss'

const RelatedCourses = memo(function RelatedCourses({ courses }) {
  const router = useRouter()

  const handleCourseClick = useCallback((courseId) => {
    router.push(`/course/${courseId}`)
  }, [router])

  if (!courses?.length) return null

  return (
    <section className={styles['related-courses']}>
      <div className="container">
        <h2 className={`${styles['section-title']} mb-5`}>您可能也會喜歡</h2>
        <div className="row g-4">
          {courses.map((course, index) => (
            <div 
              className="col-md-4" 
              key={course.id} 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
            >
              <div 
                className={styles['course-card']} 
                onClick={() => handleCourseClick(course.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCourseClick(course.id)
                  }
                }}
              >
                <div className={styles['course-image-wrapper']}>
                  <Image
                    src={course.main_image || "/course-img/banner/banner-nom.png"}
                    alt={course.title}
                    width={400}
                    height={300}
                    className={styles['course-image']}
                    style={{ objectFit: 'cover' }}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className={styles['course-card-body']}>
                  <h5>{course.title}</h5>
                  <p className="text-muted">{course.shortDescription}</p>
                  <div className={styles['course-card-price']}>
                    NT$ {course.price?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default RelatedCourses 