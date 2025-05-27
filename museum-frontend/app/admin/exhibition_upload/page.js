'use client'

import { useState } from 'react'
import React from 'react'
import DataFetcher from '@/app/_components/DataFetcher'
import ExTable from './_components/exTable'

export default function ExhibitionAdminPage() {
  const [state, setState] = useState('') // 可為 '', 'current', 'past', 'future'
  const url = `http://localhost:3005/api/exhibitionUploads${state ? `?state=${state}` : ''}`

  return (
    <div className="container-fluid py-4 px-5">
      <div className="card">
        <div className="card-header border-bottom pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="font-weight-bold fs-4 mb-0">
              <i className="fa-solid fa-tags"></i> 展覽列表
            </h6>
            <div className="d-flex gap-2">
              <a href="/admin/exhibition_upload/create" className="btn btn-primary">
                新增展覽
              </a>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-3">
            <label>展覽狀態篩選：</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="form-select w-auto">
              <option value="">全部</option>
              <option value="current">展覽中</option>
              <option value="past">已結束</option>
              <option value="future">未開始</option>
            </select>
          </div>
          <DataFetcher
            url={url} // ✅ 這裡要用你定義的 url（含 state）
            showDebug
          >
            {(data) => <ExTable exhibitions={data} />}
          </DataFetcher>
        </div>
      </div>
    </div>
  )
}
