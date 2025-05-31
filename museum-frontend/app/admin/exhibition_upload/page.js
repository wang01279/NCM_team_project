'use client'

import { useState } from 'react'
import React from 'react'
import DataFetcher from '@/app/_components/DataFetcher'
import ExTable from './_components/exTable'
import { FaThList, FaPlus } from 'react-icons/fa'

export default function ExhibitionAdminPage() {
  const [state, setState] = useState('') // 可為 '', 'current', 'past', 'future'
  const [page, setPage] = useState(1)
  const url = `http://localhost:3005/api/exhibitionUploads?${state ? `state=${state}&` : ''}page=${page}`

  return (
    <div className="container-fluid px-5">
      <div className="card-header border-bottom pb-0">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-3 d-flex align-items-center">
            <FaThList className="me-2 fs-5" />
            展覽列表
          </h4>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center gap-3 mb-3">
          <label>狀態篩選：</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="form-select w-auto"
          >
            <option value="">全部</option>
            <option value="current">展覽中</option>
            <option value="past">已結束</option>
            <option value="future">未開始</option>
          </select>
        </div>
        <div className="pt-3 d-flex justify-content-start align-items-center">
          <a
            href="/admin/exhibition_upload/create"
            className="btn btn-primary mb-3 text-decoration-none"
          >
            <FaPlus className="me-2" />
            上架展覽
          </a>
        </div>
      </div>
      <DataFetcher url={url} showDebug key={page + state}>
        {(data) => (
          <>
            {data.total !== undefined && (
              <div className="text-start mb-2">共 {data.total} 筆</div>
            )}
            <ExTable exhibitions={data.items || data} />

            {/* ✅ 分頁按鈕 */}
            {data.totalPages && (
              <div className="d-flex justify-content-center my-3">
                {Array.from({ length: data.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm mx-1 ${page === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </DataFetcher>
    </div>
  )
}
