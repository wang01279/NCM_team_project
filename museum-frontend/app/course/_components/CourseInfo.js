import React from 'react'
import styles from '../_styles/courseDetail.module.scss'

const CourseInfo = ({ course }) => {
  const { category, title, studentCount, duration, maxStudents, id, venue_name } = course
  return (
    <div className={`${styles['course-info-card']} p-5`} data-aos="fade-up">
      <div className="row align-items-center">
        <div className="col-md-6">
          <span className={`${styles['course-category-badge']} mb-3`}>{category}</span>
          <h3 className="display-4 fw-bold mb-3">{title}</h3>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center justify-content-end mb-3 gap-3 px-5">
            {/* 收藏按鈕已移至報名區右上角 */}
          </div>
          <div className={styles['info-grid']}>
            <div className={styles['info-item']}>
              <i className="bi bi-calendar3"></i>
              <h5 className="pt-3">課程總時數</h5>
              <p className="mb-0">{duration}</p>
            </div>
            <div className={styles['info-item']}>
              <i className="bi bi-person-workspace"></i>
              <h5 className="pt-3">班級人數</h5>
              <p className="mb-0">限 {maxStudents} 人</p>
            </div>
            <div className={styles['info-item']} style={{ background: '#fde3e3' }}>
              <i className="bi bi-calendar3"></i>
              <h5 className="pt-3">課程教室</h5>
              <p className="mb-0">{venue_name || '未指定'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseInfo 