import Image from 'next/image'
import Link from 'next/link'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'
import styles from '../_styles/CourseList.module.scss'
import { FaRegCalendarPlus } from 'react-icons/fa'
import '@/app/_styles/components/productCard.scss'


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
        <div
          className="product-actions ms-1 mb-0 p-0 d-flex align-items-center"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 2,
            gap: '15px'
          }}
        >
          <AddToFavoritesButton
            itemId={course.id}
            itemType="course"
            isFavorite={isFavorite(course.id)}
            onToggleFavorite={(itemId, _itemType, nextState) => onToggleFavorite(itemId, nextState)}
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
          <div className={styles.coursePrice}>$ {course.price}</div>
          <div className={styles.divider}></div>
          <div className={styles.courseDateFooter}>
            <p className={`col-6 ${styles.courseDateadd}`}>加入行事曆</p>
            <p className={`col-6 ${styles.courseDate}`}
              style={{ cursor: 'pointer' }}
              title="加入 Google 行事曆"
              onClick={e => {
                e.stopPropagation();
                onCalendarClick && onCalendarClick(course)
              }}
            >
              <FaRegCalendarPlus /> {/* 加入行事曆 */}
              {new Date(course.start_time).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div >
  )
} 