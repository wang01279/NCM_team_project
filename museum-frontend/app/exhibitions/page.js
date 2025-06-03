'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExhibitionList from './_components/list'
import Tabs from './_components/tabs'
import Navbar from '../_components/navbar'
import Carousel from './_components/carousel'
import Menu from './_components/menu'
import styles from '../exhibitions/_styles/ex-page.module.scss'
// import CouponLink from '@/app/_components/CouponLink.js'
import Footer from '../_components/footer3'

export default function ExhibitionPage() {
  const searchParams = useSearchParams()
  const state = searchParams.get('state') || 'current'
  const year = searchParams.get('year') || ''
    // 對過去展覽篩選年份
  const [selectedYear, setSelectedYear] = useState(year)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6  // 每頁 6 筆

  // 切換 tab 或篩選年份時，重置回第 1 頁
  useEffect(() => {
    setCurrentPage(1)
  }, [state, selectedYear])



  useEffect(() => {
    setSelectedYear(year)
  }, [year])

  return (
    <>
      <Navbar />

      <main className="container">
        <div className={styles.customMargin}>
          <div className="d-flex justify-content-center align-items-center flex-column fw-bold">
            <h3 className="mb-0 pb-0 fw-bold" style={{ letterSpacing: '5px' }}>
              展覽
            </h3>
            <h6 className="mt-2 pt-0 m-0 fw-bold">Exhibition</h6>
          </div>
          {/* <CouponLink /> */}
          <Tabs />
        </div>
        <div>
          {/* 當期展覽專屬：輪播區塊 */}
          {state === 'current' && (
            <section className="my-4 d-flex justify-content-center">
              <Carousel />
            </section>
          )}

          {/* 過去展覽專屬：年份篩選 */}
          {state === 'past' && (
            <section className="my-3">
              <Menu selectedYear={year} />
            </section>
          )}

          <ExhibitionList
            state={state}
            year={state === 'past' ? selectedYear : ''}
            page={currentPage}
            pageSize={pageSize}
          />
        </div>
        {/* <div className="d-flex justify-content-center my-4">
          <button
            className="btn btn-outline-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            上一頁
          </button>
          <span className="mx-2 align-self-center">第 {currentPage} 頁</span>
          <button
            className="btn btn-outline-secondary ms-2"
            // 若你已知總頁數 totalPages，也可加入 disabled 限制
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            下一頁
          </button>
        </div> */}

      </main>
      <Footer />
    </>
  )
}
