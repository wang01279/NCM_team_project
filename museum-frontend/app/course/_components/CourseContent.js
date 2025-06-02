import React from 'react'
import { memo } from 'react'
import Image from 'next/image'
import styles from '../_styles/courseDetail.module.scss'

const CourseContent = memo(function CourseContent({ course }) {
  const {
    description_intro,
    description_content,
    description_highlights,
    description_notice,
    video_url,
    artist,
    artistExperiences,
    venue_name,
    venue_main_image,
    venue_image_1,
    venue_image_2,
  } = course
  return (
    <>
      {/* Course Introduction */}
      <section className={`${styles['content-section']} mt-0`} data-aos="fade-up">
        <h2 className={styles['section-title']}>課程介紹</h2>
        <div className={styles['course-section-card']}>
          {description_intro && (
            <div className={styles['course-section-block']}>
              <div className={styles['course-section-subtitle']}>課程簡介</div>
              <p className="lead" style={{ fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{description_intro}</p>
            </div>
          )}
          {description_content && (
            <div className={styles['course-section-block']}>
              <div className={styles['course-section-subtitle']}>課程內容</div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{description_content}</p>
            </div>
          )}
          {description_highlights && (
            <div className={styles['course-section-block']}>
              <div className={styles['course-section-subtitle']}>學習重點</div>
              <ul className={styles['feature-list']}>
                {description_highlights.split(/\r?\n/).filter(Boolean).map((item, idx) => (
                  <li key={idx} data-aos="fade-up" data-aos-delay={idx * 100}
                    style={{ 
                      listStyle: 'none',
                      marginLeft: 0,
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}>
                    <span style={{ 
                      color: 'var(--primary-color)', 
                      marginRight: '10px',
                      fontSize: '1.2em'
                    }}>•</span>
                    <span style={{ flex: 1 }}>{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {description_notice && (
            <div className={styles['course-section-block']}>
              <div className={styles['course-section-subtitle']}>注意事項</div>
              <div className={styles['course-section-notice']} style={{ whiteSpace: 'pre-wrap' }}>{description_notice}</div>
            </div>
          )}
        </div>
      </section>

      {/* Course Video */}
      {video_url && (
        <section className={styles['content-section']} data-aos="fade-up">
          <h2 className={styles['section-title']}>創作影片</h2>
          <div className="ratio ratio-16x9">
            <iframe
              src={video_url}
              title="Course video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      )}

      {/* Artist Information */}
      {artist && (
        <section className={styles['content-section']} data-aos="fade-up">
          <h2 className={styles['section-title']}>師資介紹</h2>
          <div className={styles['instructor-card']}>
            <img 
              src={artist.avatar || "/course-img/artist-img/default-avatar.jpg"} 
              alt={artist.name}
              className={styles['instructor-avatar']}
            />
            <div className={styles['instructor-info']}>
              <h3>{artist.name}</h3>
              <p className="text-muted">{artist.type}</p>
              <p>{artist.bio}</p>
              {artistExperiences && artistExperiences.length > 0 && (
                <ul className={styles['experience-list']}>
                  {artistExperiences.map((exp, index) => (
                    <li key={index}>{exp}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Venue Information */}
      {venue_name && (
        <section className={styles['content-section']} data-aos="fade-up">
          <h2 className={styles['section-title']}>教室環境</h2>
          <div className="row g-4">
            <div className="col-md-8">
              <img 
                src="../course-img/classroom/B101_2.jpg" 
                alt="教室全景" 
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-4">
              <div className="row g-3">
                <div className="col-12">
                  <img 
                    src="../course-img/classroom/B101.jpg" 
                    alt="工作區" 
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-12">
                  <img 
                    src="../course-img/classroom/B101_2.jpg" 
                    alt="窯場" 
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
})

export default CourseContent 