# 📘 DataFetcher 使用說明書（強韌增強版 for React + SWR）

## ✅ 功能概覽
`DataFetcher` 是一個通用型資料抓取元件，內建以下功能：

- 自動處理 loading 狀態（顯示 `<Loader />`）
- 自動處理錯誤狀態（顯示錯誤訊息與狀態碼）
- 支援 children 為 function（render props）
- 提供 `mutate()` 讓子元件可更新資料
- 支援自訂 fallback 畫面與 debug 模式

---

## 📦 安裝需求
- 需安裝 `swr`
```bash
npm install swr
```

- 需自備 `<Loader />` 載入動畫元件，預設載入中使用此元件

---

## 🗂 建議檔案位置
```
app/
├─ _components/
│  ├─ DataFetcher.js     ← 就放這裡
│  ├─ Loader.js          ← 你的共用 loading 元件
```

---

## 🔧 使用方式
```jsx
<DataFetcher url="/api/exhibitions">
  {(data, mutate) => (
    <ExhibitionList data={data} refresh={mutate} />
  )}
</DataFetcher>
```

### 🔁 若需傳遞 params：
```jsx
<DataFetcher url={`/api/coupons?category=${category}`}>
  {(res) => <CouponSection coupons={res.data} />}
</DataFetcher>
```

---

## 🔐 props 一覽
| Prop | 類型 | 必填 | 說明 |
|------|------|------|------|
| `url` | `string` | ✅ | API 端點網址 |
| `children` | `function` | ✅ | 回傳資料並渲染內容 `(data, mutate) => JSX` |
| `fallbackUI` | `JSX` | ❌ | 無資料時顯示畫面（預設為「查無資料」） |
| `showDebug` | `boolean` | ❌ | 開啟後 console.log 出資料，預設為 `false` |

---

## ✨ 加強功能說明

### ✅ Error 處理完整：
```js
❌ 資料載入失敗（404）
未知錯誤
```
> 顯示 HTTP 狀態碼 + 錯誤訊息（來自後端或 network）

### ✅ 支援 mutate：
```js
<DataFetcher url="/api/coupons">
  {(data, mutate) => (
    <button onClick={() => mutate()}>重新整理</button>
  )}
</DataFetcher>
```

### ✅ 防呆設計：
若 children 非 function，會直接 throw error。

---

## 🧩 元件程式碼（簡化版）
```jsx
'use client'
import useSWR from 'swr'
import axios from 'axios'
import Loader from './Loader'

const fetcher = (url) => axios.get(url).then((res) => res.data)

export default function DataFetcher({ url, children, fallbackUI, showDebug }) {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  if (isLoading) return <Loader />
  if (error) {
    const message = error?.data?.message || error?.message || '未知錯誤'
    const status = error?.status || error?.response?.status || 'No status'
    return (
      <div className="text-danger text-center py-4">
        ❌ 資料載入失敗（{status})<br />
        <small>{message}</small>
      </div>
    )
  }

  if (data === null || typeof data === 'undefined') {
    return fallbackUI || (
      <p className="text-muted text-center py-4">查無資料</p>
    )
  }

  if (typeof children !== 'function') {
    throw new Error('DataFetcher 需要一個 function 作為 children')
  }

  if (showDebug && typeof window !== 'undefined') {
    console.log(`📦 [DataFetcher] ${url}`, data)
  }

  return children(data, mutate)
}
```

---

## ✅ 適合使用情境
| 情境 | 適合用 DataFetcher？ |
|--------|---------------------|
| 展覽清單、課程列表、優惠券中心（GET） | ✅ 超適合 |
| 會員中心、設定頁面（需要 POST/PUT） | ❌ 不建議，自己處理 state 較彈性 |
| 需要 revalidate 刷新資料（例如刪除、更新後） | ✅ 非常方便 |
| 有 localStorage 記錄或表單編輯 | ❌ 建議自己管理狀態 |

---

如需搭配 `mutate()` 的更新範例、搭配 `toast` 顯示、loading overlay、或是錯誤 fallback 自定元件，也可以另外擴充 🙌