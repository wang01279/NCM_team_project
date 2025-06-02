import React from 'react'
import styles from '../_styles/courseDetail.module.scss'

const CourseHero = ({ bannerImage, category, title }) => {
  return (
    <section 
      className={styles['course-hero']} 
      style={{ 
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container">
        <div className={styles['hero-content']} data-aos="fade-up">
          <span className={styles['hero-badge']}>{category}</span>
          <h1 className={styles['course-title']}>{title}</h1>
        </div>
      </div>
    </section>
  )
}

export default CourseHero 