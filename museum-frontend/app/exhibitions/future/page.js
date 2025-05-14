'use client'

import ExhibitionTabs from '@/app/exhibitions/_components/tabs'
import ExhibitionList from '@/app/exhibitions/_components/list'

export default function ExhibitionPage() {
  //{ params } const state = params.state // ✅ 接收路由的 state
  return (
    <div>
      <main className="container">
        <div>
          <h2 className="d-flex justify-content-center align-items-center fw-bold mb-4">
            展覽 | Exhibition
          </h2>
          <ExhibitionTabs />
        </div>
        <ExhibitionList state="future" />
      </main>
    </div>
  )
}
