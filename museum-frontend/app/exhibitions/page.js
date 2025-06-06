'use client'

import RedirectDefaultState from './_components/RedirectDefaultState'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExhibitionList from './_components/list'
import Tabs from './_components/tabs'
import Navbar from '../_components/navbar'
import Carousel from './_components/carousel'
import Menu from './_components/menu'
import Footer from '../_components/footer3'
import styles from '../exhibitions/_styles/ex-page.module.scss'
import Loader from '../_components/load'


// ✅ 引入動畫
import { motion, AnimatePresence } from 'framer-motion'

export default function ExhibitionPage() {
  const searchParams = useSearchParams()

  // ✅ ❶：把 state 和 year 分別設為 state 狀態，避免初次讀不到值
  const [state, setState] = useState(null)
  const [year, setYear] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [carouselData, setCarouselData] = useState([])


  // ✅ ❷：searchParams 變動時，重新抓取 state 與 year 值
  useEffect(() => {
    const newState = searchParams.get('state') || 'current'
    const newYear = searchParams.get('year') || ''
    setState(newState)
    setYear(newYear)
    setSelectedYear(newYear)
  }, [searchParams])

  // ✅ ❸：state 或 year 改變時啟動 loading 動畫
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [state, selectedYear])

  useEffect(() => {
    if (state === 'current') {
      fetch('http://localhost:3005/api/exhibitions?state=current')
        .then((res) => res.json())
        .then((res) => {
          if (res?.data?.exhibitions) {
            setCarouselData(res.data.exhibitions)
          }
        })
        .catch((err) => console.error('Carousel 資料錯誤：', err))
    } else {
      setCarouselData([]) // 切換到其他 tab 時清空資料
    }
  }, [state])


  // ✅ ❹：等待 state 初始完成再 render
  if (!state) return null

  return (
    <>
      <RedirectDefaultState />
      <Navbar />

      <div className={styles.customMargin} style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        <Tabs key={state} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state + selectedYear}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <div className="text-center my-5">
              <Loader />
            </div>
          ) : (
            <>
              {state === 'current' && (
                <section className="d-flex justify-content-center">
                  <Carousel exhibitions={carouselData} />
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

              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <Footer />
    </>
  )
}
