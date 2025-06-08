'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/_components/ToastManager'

export default function ExhibitionCreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    intro: '',
    startDate: '',
    endDate: '',
    venue_id: '',
    image: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()
  const { showToast } = useToast()

  const todayStr = new Date().toISOString().split('T')[0]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('請選擇圖片格式的檔案')
      return
    }

    setError('')
    setFormData((prev) => ({
      ...prev,
      image: file.name, // ✅ 只記檔名
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 日期防呆
    const todayStr = new Date().toISOString().split('T')[0]
    if (formData.startDate < todayStr) {
      showToast('warning', '起始日期不得早於今天')
      // setError('起始日期不得早於今天')
      return
    }

    if (formData.endDate < formData.startDate) {
      showToast('warning', '結束日期不得早於今天')
      // setError('結束日期不得早於起始日期')
      return
    }

    if (!formData.image) {
      showToast('warning', '請選擇展覽圖片')
      // setError('請選擇展覽圖片')
      return
    }

    // 判斷 state 狀態
    const now = new Date()
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)

    const state =
      now >= start && now <= end ? 'current' : now > end ? 'past' : 'future'

    // ✅ 使用 JSON 傳遞
    try {
      await axios.post('http://localhost:3005/api/exhibitionUploads', {
        ...formData,
        state,
      })
      showToast('success', '新增成功')
      // alert('✅ 展覽新增成功')
      router.push('/admin/exhibition_upload?state=future')
    } catch (err) {
      setError(err.response?.data?.message || '新增失敗')
    }
  }

  return (
    <div className="container" style={{overflow: "hidden"}}>
      <h2 className="mb-4 text-center">新增展覽</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form
        onSubmit={handleSubmit}
        className="row g-3 d-flex justify-content-center"
      >
        <div className="col-8 col-md-8">
          <label className="form-label">展覽名稱</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="col-8 col-md-8">
          <label className="form-label">選擇圖片</label>
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* 右邊：預覽 + 清除按鈕 */}
        {formData.image && (
          <div className="col-8 col-md-8">
            <div className="border p-2 position-relative">
              <img
                src={`/images/${formData.image}`}
                alt="預覽圖片"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '6px',
                }}
                onError={(e) => (e.target.style.display = 'none')}
              />
              <div className="text-muted small mt-2">{formData.image}</div>

              {/* 清除按鈕 */}
              <button
                type="button"
                className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    image: '',
                  }))
                }
              >
                移除圖片
              </button>
            </div>
          </div>
        )}


        <div className="col-8 col-md-8">
          <label className="form-label">展覽簡介</label>
          <textarea
            name="intro"
            className="form-control"
            rows="6"
            style={{ minHeight: '180px' }}
            value={formData.intro}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="col-8 col-md-8">
          <label className="form-label">展覽場地</label>
          <select
            name="venue_id"
            className="form-select"
            value={formData.venue_id}
            onChange={handleChange}
            required
          >
            <option value="">請選擇場地</option>
            <optgroup label="1樓">
              <option value="101">101</option>
              <option value="102">102</option>
              <option value="103">103</option>
              <option value="104">104</option>
              <option value="105">105</option>
              <option value="106">106</option>
              <option value="107">107</option>
            </optgroup>
            <optgroup label="2樓">
              <option value="201">201</option>
              <option value="202">202</option>
              <option value="203">203</option>
              <option value="204">204</option>
              <option value="205">205</option>
              <option value="206">206</option>
              <option value="207">207</option>
              <option value="208">208</option>
            </optgroup>
          </select>
        </div>

        <div className='col-12'>
          <div className='row g-3 d-flex justify-content-center'>
            <div className="col-md-4 col-4">
              <label className="form-label">開始日期</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
                min={todayStr}
              />
            </div>

            <div className="col-4 col-md-4">
              <label className="form-label">結束日期</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
              />
            </div>
          </div>
        </div>
        <div className="col-12 text-center mt-5">
          <button type="submit" className="btn btn-primary px-5">
            送出
          </button>
        </div>
      </form>
    </div>
  )
}
