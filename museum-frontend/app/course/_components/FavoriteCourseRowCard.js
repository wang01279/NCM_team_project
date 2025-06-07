import Image from 'next/image'
import { FaRegCalendarPlus } from 'react-icons/fa'
import Link from 'next/link'
import styles from '../_styles/courseDetail.module.scss'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'


export default function FavoriteCourseRowCard({ course, isFavorite, onToggleFavorite }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        border: '1px solid #eee',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        minHeight: 180,
        position: 'relative',
      }}
    >
      {/* 右上角收藏按鈕 */}
      <div
        className="product-actions ms-1 mb-0 p-0 d-flex align-items-center"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 2,
          gap: '15px'
        }}
        onClick={e => e.stopPropagation()}
      >
        <AddToFavoritesButton
          itemId={course.id}
          itemType="course"
          isFavorite={isFavorite(course.id)}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
      {/* 左圖＋右側介紹都可點擊 */}
      <Link
        href={`/course/${course.id}`}
        style={{
          display: 'flex',
          flex: 1,
          minWidth: 0,
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <div style={{ flex: '0 0 220px', position: 'relative' }}>
          <Image
            src={course.main_image || '/default-course.jpg'}
            alt={course.title}
            width={220}
            height={180}
            style={{ objectFit: 'cover', height: '100%' }}
          />
        </div>
        <div
          style={{
            flex: 1,
            padding: '1.2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 0,
          }}
        >
          <h5 style={{ fontWeight: 700, fontSize: 20, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {course.title}
          </h5>
          <div style={{ color: '#888', fontSize: 15, margin: '0.5rem 0 0.7rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            ｜授課地點：{course.venue_name}
          </div>
          <div style={{ fontSize: 15, color: '#444', marginBottom: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {course.description_intro}
          </div>
        </div>
      </Link>
      {/* 右側功能區塊 */}
      <div style={{ flex: '0 0 220px', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* 空白，或可放其他功能 */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
          <div style={{ fontWeight: 600, color: '#b85c00', fontSize: 18 }}>
            {course.price ? `${course.price} ntd` : ''}
          </div>
          <div style={{ color: '#555', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaRegCalendarPlus style={{ marginRight: 4 }} />
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