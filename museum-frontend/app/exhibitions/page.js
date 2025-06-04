'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExhibitionList from './_components/list'
import Tabs from './_components/tabs'
import Navbar from '../_components/navbar'
import Carousel from './_components/carousel'
import Menu from './_components/menu'
import Footer from '../_components/footer3'
import styles from '../exhibitions/_styles/ex-page.module.scss'

// ✅ 引入動畫
import { motion, AnimatePresence } from 'framer-motion'

export default function ExhibitionPage() {
  const searchParams = useSearchParams()
  const state = searchParams.get('state') || 'current'
  const year = searchParams.get('year') || ''

  const [selectedYear, setSelectedYear] = useState(year)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    setCurrentPage(1)
  }, [state, selectedYear])

  useEffect(() => {
    setSelectedYear(year)
  }, [year])

  return (
    <>
      <Navbar />
      <div className={styles.customMargin} style={{ paddingBottom: '20px' }}>
        <div className="d-flex justify-content-center align-items-center flex-column fw-bold">
          <h1 className="mb-0 pb-0 fw-bolder" style={{ letterSpacing: '5px' }}>
            展覽
          </h1>
          <h6 className="mt-2 pt-0 fw-bolder">Exhibition</h6>
        </div>
        <Tabs />
      </div>

      {/* ✅ 將變動內容用 AnimatePresence 包起來 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state + selectedYear}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {state === 'current' && (
            <section className="d-flex justify-content-center">
              <Carousel />
            </section>
          )}

          {state === 'past' && (
            <section className="mt-5 mb-1">
              <Menu selectedYear={year} />
            </section>
          )}

          <ExhibitionList
            state={state}
            year={state === 'past' ? selectedYear : ''}
            page={currentPage}
            pageSize={pageSize}
          />
        </motion.div>
      </AnimatePresence>

      <Footer />
    </>
  )
}
