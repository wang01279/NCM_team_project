'use client'

import { useSearchParams } from 'next/navigation'
import ExhibitionTabs from '../_components/tabs.js'
import Menu from '../_components/menu.js'
import ExhibitionList from '../_components/list.js'

export default function PastPage() {
  const searchParams = useSearchParams()
  const year = searchParams.get('year') // 會是 2023、2024...
  // { params } const state = params.state // 會是 past、current、future

  return (
    <main className="container">
      <div>
        <h2 className="d-flex justify-content-center align-items-center fw-bold mb-4">
          展覽 | Exhibition
        </h2>
        <ExhibitionTabs />
      </div>
      <Menu />
      <ExhibitionList state="past" year={year} />
    </main>
  )
}
