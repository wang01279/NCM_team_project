'use client'

import ExhibitionTabs from '@/app/exhibitions/_components/tabs.js'
import Carousel from './_components/carousel'
import ExhibitionList from '@/app/exhibitions/_components/list.js'
import styles from '../exhibitions/_styles/ex-page.module.scss'

export default function ExhibitionPage() {
  return (
    <div>
      <main className="container">
        <div className={styles.customMargin}>
          <h2 className="d-flex justify-content-center align-items-center fw-bold mb-4">
            展覽 | Exhibition
          </h2>
          <ExhibitionTabs />
        </div>
        <Carousel />
        <ExhibitionList state="current" />
      </main>
    </div>
  )
}
