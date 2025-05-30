import React from 'react'
import { memo } from 'react'
import Image from 'next/image'

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
      <section className="content-section mt-0" data-aos="fade-up">
        <h2 className="section-title">課程介紹</h2>
        <div className="course-section-card">
          {description_intro && (
            <div className="course-section-block">
              <div className="course-section-subtitle">課程簡介</div>
              <p className="lead" style={{ fontStyle: 'italic' }}>{description_intro}</p>
            </div>
          )}
          {description_content && (
            <div className="course-section-block">
              <div className="course-section-subtitle">課程內容</div>
              <p>{description_content}</p>
            </div>
          )}
          {description_highlights && (
            <div className="course-section-block">
              <div className="course-section-subtitle">學習重點</div>
              <ul className="feature-list">
                {description_highlights.split(/\r?\n|•/).filter(Boolean).map((item, idx) => (
                  <li key={idx} data-aos="fade-up" data-aos-delay={idx * 100}
                    style={{ listStyle: 'disc', marginLeft: 20 }}>
                    <i className="bi bi-check-circle-fill" style={{ color: 'var(--primary-color)', marginRight: 8 }}></i>
                    {item.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {description_notice && (
            <div className="course-section-block">
              <div className="course-section-subtitle">注意事項</div>
              <div className="course-section-notice">{description_notice}</div>
            </div>
          )}
        </div>
      </section>

      {/* Course Video */}
      {video_url && (
        <section className="content-section" data-aos="fade-up">
          <h2 className="section-title">創作影片</h2>
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
        <section className="content-section" data-aos="fade-up">
          <h2 className="section-title">師資介紹</h2>
          <div className="instructor-card">
            <img 
              src={artist.avatar || "/course-img/artist-img/default-avatar.jpg"} 
              alt={artist.name}
              className="instructor-avatar"
            />
            <div className="instructor-info">
              <h3>{artist.name}</h3>
              <p className="text-muted">{artist.type}</p>
              <p>{artist.bio}</p>
              {artistExperiences && artistExperiences.length > 0 && (
                <ul className="experience-list">
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
        <section className="content-section" data-aos="fade-up">
          <h2 className="section-title">教室環境</h2>
          <div className="row g-4">
            <div className="col-md-8">
              <img 
                src={venue_main_image || "/default-course.jpg"} 
                alt="教室全景" 
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-4">
              <div className="row g-4">
                <div className="col-12">
                  <img 
                    src={venue_image_1 || "/default-course.jpg"} 
                    alt="工作區" 
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-12">
                  <img 
                    src={venue_image_2 || "/default-course.jpg"} 
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