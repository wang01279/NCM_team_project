'use client'

import useSWR from 'swr'
import axios from 'axios'
import Loader from './load.js'

const fetcher = (url) =>
  axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response || err
    })

export default function DataFetcher({
  url,
  children,
  fallbackUI = <p className="text-muted text-center py-4">查無資料</p>,
  showDebug = false,
}) {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  // 顯示 loading 畫面
  if (isLoading) return <Loader />

  // 顯示錯誤畫面
  if (error) {
    const message = error?.data?.message || error?.message || '未知錯誤'
    const status = error?.status || error?.response?.status || 'No status'
    return (
      <div className="text-danger text-center py-4">
        ❌ 資料載入失敗（{status}）<br />
        <small>{message}</small>
      </div>
    )
  }

  // 顯示查無資料畫面（null 或 undefined）
  if (data === null || typeof data === 'undefined') {
    return fallbackUI
  }

  // 防呆：children 必須為 function
  if (typeof children !== 'function') {
    console.error(
      '❌ <DataFetcher> children 必須是 function，但收到：',
      children
    )
    throw new Error(
      'children 必須是 function，例如：<DataFetcher>{(data) => (...)}</DataFetcher>'
    )
  }

  // 開發用：顯示資料內容
  if (showDebug && typeof window !== 'undefined') {
    console.log(`📦 [DataFetcher] ${url}`, data)
  }

  // 回傳資料與 mutate 提供更新功能
  return children(data, mutate)
}
