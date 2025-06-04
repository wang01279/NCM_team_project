'use client'

import '@/app/_styles/components/productCard.scss'
import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '@/app/_components/ToastManager'
import Navbar from '@/app/_components/navbar'
import '@/app/_styles/globals.scss'
import styles from './_styles/CourseList.module.scss'
import { FaFilter, FaRegBookmark, FaBookmark, FaArrowLeft, FaRegCalendarPlus, FaSearch, FaUserCircle } from 'react-icons/fa'
import useFavorites from '@/app/_hooks/useFavorites'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'
import CourseCard from './_components/CourseCard'
import Footer from '../_components/footer3'
import FilterSidebar from './_components/FilterSidebar'
import CourseNotice from './_components/CourseNotice'
import Loader from '@/app/_components/load'


// Mock data
const mockCourses = [
  {
    id: 1,
    title: '3D列印陶瓷粗胚',
    venue_name: '主館B131',
    description_intro: '本館將由比利時引進一臺陶瓷3D列印機，由Unfold團隊帶領3位種子教師實地演練陶瓷3D列印技術，並分別完成一組以上實用器皿設計及列印。',
    price: 500,
    start_time: '2025-03-14',
    main_image: '/course1.jpg',
  },
  {
    id: 2,
    title: '陶瓷修復基礎',
    location: '主館B132',
    description: '學習陶瓷修復的基本理論與實作，適合初學者入門，課程包含材料介紹與修復流程演練。',
    price: 800,
    start_time: '2025-04-10',
    images: [{ image_path: '/course2.jpg', is_main: 0 }]
  },
  {
    id: 3,
    title: '上釉技法進階',
    location: '主館B133',
    description: '深入探討各種上釉技巧，並實際操作多種釉藥，提升作品質感與創意表現。',
    price: 1000,
    start_time: '2025-05-05',
    images: [{ image_path: '/course3.jpg', is_main: 0 }]
  },
  {
    id: 4,
    title: '陶藝拉坯入門',
    location: '主館B134',
    description: '從基礎拉坯技法到成品製作，適合初學者體驗陶藝的樂趣。',
    price: 1200,
    start_time: '2025-06-02',
    images: [{ image_path: '/course4.jpg', is_main: 0 }]
  },
  {
    id: 5,
    title: '釉藥調配實作',
    location: '主館B135',
    description: '學習各種釉藥的調配與應用，提升陶藝作品的色彩層次。',
    price: 1500,
    start_time: '2025-07-10',
    images: [{ image_path: '/course5.jpg', is_main: 0 }]
  },
  {
    id: 6,
    title: '現代陶藝創作',
    location: '主館B136',
    description: '結合現代設計理念與傳統陶藝技法，創作屬於自己的陶瓷作品。',
    price: 2000,
    start_time: '2025-08-01',
    images: [{ image_path: '/course6.jpg', is_main: 0 }]
  }
]

// API functions
const fetchCourses = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    return mockCourses
  }
}

const fetchArtists = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/artists`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching artists:', error)
    return []
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/courses/categories');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

function useAllCourseComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/comments?type=course`)
      .then(res => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false))
  }, [])
  return { comments, loading }
}

export default function CourseListPage() {
  const [courses, setCourses] = useState(mockCourses)
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const [favoriteCourses, setFavoriteCourses] = useState([])
  const artistScrollRef = useRef(null)
  const [isArtistHovered, setIsArtistHovered] = useState(false)
  const sidebarRef = useRef(null);
  const containerRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites('course');

  // 篩選相關 state
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState({ year: '', month: '', day: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // 1. 取得課程分類 API
  const [categories, setCategories] = useState([]);

  // 動態產生年/月/日（排序、去重）
  const allDates = courses.map(c => c.start_time && new Date(c.start_time)).filter(Boolean);
  const years = Array.from(new Set(allDates.map(d => d.getFullYear()))).sort((a, b) => a - b);
  const months = Array.from(new Set(allDates.map(d => d.getMonth() + 1))).sort((a, b) => a - b);
  const days = Array.from(new Set(allDates.map(d => d.getDate()))).sort((a, b) => a - b);

  // 篩選邏輯
  const filteredCourses = courses.filter(course => {
    // 搜尋關鍵字
    const query = searchQuery.toLowerCase();
    const searchMatch = !query ||
      (course.title?.toLowerCase().includes(query)) ||
      (course.artist?.name?.toLowerCase().includes(query)) ||
      (course.description_intro?.toLowerCase().includes(query)) ||
      (course.description_content?.toLowerCase().includes(query));

    // 講師類別
    let passType = true;
    if (selectedType === 'domestic') {
      passType = course.artist_type === '國內藝術家';
    } else if (selectedType === 'international') {
      passType = course.artist_type === '國際藝術家';
    }
    // 課程分類
    let passCategory = true;
    if (selectedCategories.length > 0 && course.categories) {
      passCategory = course.categories.some(cat => selectedCategories.includes(cat.id));
    }
    // 開課時間
    let passDate = true;
    const d = course.start_time && new Date(course.start_time);
    if (selectedDate.year && d && d.getFullYear().toString() !== selectedDate.year) passDate = false;
    if (selectedDate.month && d && (d.getMonth() + 1).toString() !== selectedDate.month) passDate = false;
    if (selectedDate.day && d && d.getDate().toString() !== selectedDate.day) passDate = false;

    return searchMatch && passType && passCategory && passDate;
  });

  // Banner iframe 自動切換
  const iframeSrcs = [
    "https://www.google.com/maps/embed?pb=!4v1748448380829!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDR1TGVzdFFF!2m2!1d42.3619464287208!2d-82.98163396246964!3f236.51786120776936!4f-17.127596384718473!5f0.4000000000000002",
    "https://www.google.com/maps/embed?pb=!4v1748448030114!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRDR1T2ViRnc.!2m2!1d42.36223831572991!2d-82.9818134886949!3f44.49322021208187!4f-8.171940421015563!5f0.4000000000000002"
  ];
  const [bannerSrc, setBannerSrc] = useState(iframeSrcs[0]);
  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current = (current + 1) % iframeSrcs.length;
      setBannerSrc(iframeSrcs[current]);
      if (current === iframeSrcs.length - 1) {
        clearInterval(timer);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 側邊篩選欄根據 class-container 位置浮動
  useEffect(() => {
    function updateSidebarVisibility() {
      const sidebar = sidebarRef.current;
      const container = containerRef.current;
      if (!sidebar || !container) return;
      const rect = container.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const windowHeight = window.innerHeight;
      if (rect.bottom > 0 && rect.top < windowHeight) {
        let top = Math.max(rect.top, 0) + Math.min(rect.height, windowHeight, rect.bottom) / 2 - sidebarHeight / 2;
        sidebar.style.position = 'fixed';
        sidebar.style.left = '0';
        sidebar.style.top = `${top}px`;
        sidebar.style.transform = 'none';
        sidebar.classList.remove('hide');
      } else {
        sidebar.classList.add('hide');
      }
    }
    window.addEventListener('scroll', updateSidebarVisibility);
    window.addEventListener('resize', updateSidebarVisibility);
    updateSidebarVisibility();
    return () => {
      window.removeEventListener('scroll', updateSidebarVisibility);
      window.removeEventListener('resize', updateSidebarVisibility);
    };
  }, []);

  const toast = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch courses first
      const coursesData = await fetchCourses()
      setCourses(coursesData)

      // Fetch artists from API
      try {
        const artistsData = await fetchArtists()
        setArtists(artistsData)
      } catch (err) {
        console.warn('Could not fetch artists:', err)
        setArtists([])
      }

      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('無法載入課程資訊')
      setLoading(false)
      if (toast && typeof toast.showToast === 'function') {
        toast.showToast('error', '無法載入課程資訊')
      }
    }
  }, [toast])

  useEffect(() => {
    fetchData()
    // 取得課程分類
    fetchCategories().then(setCategories)
  }, [fetchData])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleFavorite = (courseId) => {
    setFavoriteCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    )
  }

  // 分頁相關
  const COURSES_PER_PAGE = 6;
  const paginatedCourses = courses.slice((currentPage - 1) * COURSES_PER_PAGE, currentPage * COURSES_PER_PAGE);
  const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);

  function getGoogleCalendarUrl(course) {
    const title = encodeURIComponent(course.title);
    const details = encodeURIComponent(course.description_intro || '');
    const location = encodeURIComponent(course.venue_name || '');
    // 轉成 YYYYMMDDTHHmmss 格式
    function formatDateTime(dt) {
      if (!dt) return '';
      const d = new Date(dt);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${yyyy}${mm}${dd}T${hh}${min}${ss}`;
    }
    const start = formatDateTime(course.start_time);
    const end = formatDateTime(course.end_time);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  }

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 400);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { comments: allCourseComments, loading: commentsLoading } = useAllCourseComments();

  const colorClasses = ['candyPink', 'candyBlue', 'candyYellow', 'candyGreen'];

  const [noticeOpen, setNoticeOpen] = useState(false);

  // 6rows only
  const maxReviewRows = 6;


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
        <button className="btn btn-primary mt-3" onClick={fetchData}>
          重試
        </button>
      </div>
    )
  }

  return (
    <>
      <Navbar />

      {/* Banner Section */}
      <section className={styles.bannerFullWidth}>
        <iframe
          id="banner-iframe"
          src={bannerSrc}
          width="100%"
          height="700"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section className="container mb-5 position-relative">
        <div className="row">
          <div className="col-12 col-lg-10 mx-auto">
            <section ref={containerRef} className={styles.classContainer}>
              {/* Filter Sidebar (電腦版) */}
              <div ref={sidebarRef} className={styles.filterSidebarFixed}>
                <button
                  id="filterToggleBtn"
                  className={`btn btn-primary ${styles.filterIconBtn} ${showFilter ? '' : styles.showBtn}`}
                  type="button"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <FaFilter />
                </button>
                <FilterSidebar
                  show={showFilter}
                  onClose={() => setShowFilter(false)}
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                  selectedCategories={selectedCategories}
                  onCategoriesChange={setSelectedCategories}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  categories={categories}
                  years={years}
                  months={months}
                  days={days}
                  selectWidth={{ year: 60, month: 45, day: 45 }}
                />
              </div>


              {/* Course List Section */}
              <h3 className={styles.sectionTitle}>課程列表</h3>
              <div className="col-12">
                {/* 手機 Drawer 篩選 */}
                {typeof window !== 'undefined' && window.innerWidth <= 400 && showFilter && (
                  <>
                    <div className={styles.mobileFilterOverlay} onClick={() => setShowFilter(false)} />
                    <div className={styles.mobileFilterDrawer}>
                      <FilterSidebar
                        show={showFilter}
                        onClose={() => setShowFilter(false)}
                        selectedType={selectedType}
                        onTypeChange={setSelectedType}
                        selectedCategories={selectedCategories}
                        onCategoriesChange={setSelectedCategories}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        categories={categories}
                        years={years}
                        months={months}
                        days={days}
                        selectWidth={{ year: 60, month: 45, day: 45 }}
                      />
                    </div>
                  </>
                )}
                {/* Search Box */}
                <div className={styles.searchContainer}>
                  <button
                    className={styles.mobileFilterBtn}
                    type="button"
                    onClick={() => setShowFilter(true)}
                    aria-label="篩選"
                  >
                    <FaFilter />
                  </button>
                  <FaSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="搜尋課程、講師或課程內容..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.coursesGrid}>
                {(isMobile ? filteredCourses : filteredCourses.slice((currentPage - 1) * COURSES_PER_PAGE, currentPage * COURSES_PER_PAGE)).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    onCalendarClick={(c) => {
                      setSelectedCourse(c)
                      setModalOpen(true)
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {!isMobile && (
                <div className={styles.pagination}>
                  {Array.from({ length: Math.ceil(filteredCourses.length / COURSES_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                    <span
                      key={page}
                      className={`${styles.paginationDot} ${currentPage === page ? styles.active : ''}`}
                      onClick={() => setCurrentPage(page)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* 學員評價區塊 */}
            <section className={`px-3 ${styles.commentBubbleSection} ${styles.classContainer}`}>
              <h3 className={styles.sectionTitle}>學員評價</h3>
              <div className={styles.commentBubbleList}>
                {commentsLoading ? (
                  <div className="text-center py-4">載入中...</div>
                ) : allCourseComments.length === 0 ? (
                  <div className="text-center py-4 text-muted">尚無評論</div>
                ) : (
                  // 6row only
                  allCourseComments.slice(0, maxReviewRows).map((c) => {
                    const alignClass = ['left', 'center', 'right'][Math.floor(Math.random() * 3)]
                    const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)]
                    return (
                      <div key={c.id} className={`${styles.commentBubble} ${styles[alignClass]} ${styles[colorClass]}`}>
                        <div className={styles.commentBubbleHeader}>
                          {c.member_avatar ? (
                            <Image src={c.member_avatar} alt={c.member_name || '匿名'} width={40} height={40} className={styles.commentAvatar} />
                          ) : (
                            <FaUserCircle className={styles.commentAvatarDefault} />
                          )}
                          <span className={styles.commentBubbleName}>{c.member_name || c.member_email || '匿名'}</span>
                        </div>
                        <div className={styles.commentBubbleContent}>{c.content}</div>
                      </div>
                    )
                  })
                )}
              </div>
            </section>

            {/* 駐村藝術家區塊 */}
            <section className={styles.classContainer}>
              <h3 className={styles.sectionTitle}>駐村藝術家</h3>
              <section className={styles.artistWaveMinimalSection}>
                <div className={styles.artistWaveIntroBox}>
                  <TypingEffectText text="輸入中..." className={styles.artistWaveTyping} />
                  <div className={styles.artistWaveIntroDesc}>
                    與我們優秀的駐村藝術家一同譜寫生活的篇章
                  </div>
                </div>
                {artists.map((artist, idx) => (
                  <div className={styles.artistWaveBar} key={artist.id || idx}>
                    <ArtistTypewriterName name={artist.name} />
                    <img
                      src={artist.avatar || '/default-avatar.jpg'}
                      alt={artist.name}
                      className={styles.artistWaveAvatar}
                      draggable={false}
                    />
                  </div>
                ))}
              </section>
            </section>

            {/* 課程購買注意事項區塊（可折疊） */}
            <CourseNotice />

            {/* Venue Map Section */}
            {/* <section>
              <h3 className={styles.sectionTitle}>場地配置圖</h3>
              <Image
                src="/venue-map.jpg"
                alt="場地配置圖"
                width={1200}
                height={800}
                className={styles.venueImg}
              />
            </section> */}
          </div>
        </div>
      </section>

      {/* Modal 彈窗 */}
      {modalOpen && selectedCourse && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>加入行事曆</h4>
            <p>你要將「{selectedCourse.title}」加入 Google 行事曆嗎？</p>
            {/*
            <a
              href={getGoogleCalendarUrl(selectedCourse)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              加入 Google 行事曆
            </a>
            */}
            <button
              className="btn btn-primary"
              onClick={() => window.open(getGoogleCalendarUrl(selectedCourse), 'gcal', 'width=600,height=600')}
            >
              加入 Google 行事曆
            </button>
            <button onClick={() => setModalOpen(false)} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>取消</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

function ArtistTypewriterName({ name }) {
  const chars = name.split('');
  const [visible, setVisible] = useState(Array(chars.length).fill(false));
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    let timeouts = [];
    // 產生每個字的隨機 delay（底部字先出現）
    const delays = Array.from({ length: chars.length }, (_, i) => 80 + Math.random() * 220 + i * 30);
    for (let i = chars.length - 1; i >= 0; i--) {
      // i=chars.length-1 是最下方字
      timeouts.push(
        setTimeout(() => {
          setVisible(v => {
            const nv = [...v];
            nv[i] = true;
            return nv;
          });
        }, delays[chars.length - 1 - i])
      );
    }
    const totalDelay = Math.max(...delays) + 1200;
    timeouts.push(
      setTimeout(() => {
        setVisible(Array(chars.length).fill(false));
        setCycle(c => c + 1);
      }, totalDelay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [name, cycle]);
  return (
    <div className={styles.artistWaveName}>
      {chars.map((char, i) => (
        <span
          key={i}
          className={styles.artistWaveChar}
          style={{
            opacity: visible[i] ? 1 : 0,
            transition: 'opacity 0.18s',
            color: '#111',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

function TypingEffectText({ text, className }) {
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    if (visibleCount < text.length) {
      const timeout = setTimeout(() => setVisibleCount(visibleCount + 1), 120);
      return () => clearTimeout(timeout);
    } else {
      // 打完後停 1.2 秒再重來
      const timeout = setTimeout(() => setVisibleCount(0), 1200);
      return () => clearTimeout(timeout);
    }
  }, [visibleCount, text]);
  return (
    <span className={className}>
      {text.slice(0, visibleCount)}
      <span className={styles.artistWaveTypingCursor}>|</span>
    </span>
  );
} 