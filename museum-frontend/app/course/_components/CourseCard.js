import Image from 'next/image'
import Link from 'next/link'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'
import styles from '../_styles/CourseList.module.css'
import { FaRegCalendarPlus } from 'react-icons/fa'

export default function CourseCard({
  course,
  isFavorite,
  onToggleFavorite,
  onCalendarClick
}) {
  return (
    <div className={styles.courseCard}>
      <Image
        src={course.main_image || '/default-course.jpg'}
        alt={course.title}
        width={400}
        height={260}
        className={styles.courseCardImg}
      />
      <div className={styles.courseCardBody}>
        <div className={styles.bookmarkBtn} style={{position: 'absolute', top: '1.2rem', right: '1.2rem', zIndex: 2}}>
          <AddToFavoritesButton
            itemId={course.id}
            itemType="course"
            isFavorite={isFavorite(course.id)}
            onToggleFavorite={onToggleFavorite}
            className="favorite-button"
          />
        </div>
        <div className={styles.courseCardBodyContent}>
          <Link href={`/course/${course.id}`} className={styles.courseCardLink}>
            <h5 className={styles.courseTitle}>{course.title}</h5>
          </Link>
          <div className={styles.courseMeta}>
            ｜授課地點：{course.venue_name}
          </div>
          <Link href={`/course/${course.id}`} className={styles.courseCardLink}>
            <p className={styles.courseDesc}>{course.description_intro}</p>
          </Link>
        </div>
        <div className={styles.courseCardBodyFooter}>
          <div className={styles.coursePrice}>{course.price} ntd</div>
          <div className={styles.divider}></div>
          <div
            className={styles.courseDateFooter}
            style={{ cursor: 'pointer' }}
            title="加入 Google 行事曆"
            onClick={e => {
              e.stopPropagation();
              onCalendarClick && onCalendarClick(course)
            }}
          >
            <FaRegCalendarPlus />
            {new Date(course.start_time).toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 