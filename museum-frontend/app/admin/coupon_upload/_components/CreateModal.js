'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useToast } from '@/app/_components/ToastManager'

export default function CreateModal({ onClose, onSuccess }) {
  const getToday = () => new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    name: '',
    code: '',
    category: '商品',
    type: '百分比',
    discount: 0,
    minSpend: 0,
    endDate: '',
    expired_at: '',
    status: '啟用',
  })
  const {showToast} = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 自動產生名稱與折扣碼
  useEffect(() => {
    const discount = parseFloat(form.discount) || 0
    const { category, type } = form

    if (!discount || !category || !type) return

    const prefix = category === '商品' ? '購物金' : '購課金'
    const displayAmount = type === '百分比' ? `${discount}%` : `${discount}`
    const codePrefix = category === '商品' ? 'SHOP' : 'COURSE'
    const codeSuffix = type === '百分比' ? 'P' : ''

    const fullName = `${prefix} ${displayAmount}`
    const fullCode = `${codePrefix}${discount}${codeSuffix}`

    setForm((prev) => ({
      ...prev,
      name: fullName,
      code: fullCode,
    }))
  }, [form.discount, form.category, form.type])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // 🧠 驗證：領取截止日不能大於使用期限
    if (form.endDate > form.expired_at) {
      showToast('danger', '❌ 領取截止日不能晚於優惠券到期日')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await axios.post(
        'http://localhost:3005/api/couponUploads',
        form
      )
      if (res.data.success) {
        // alert('新增成功')
        showToast('success', '新增成功')
        onClose()
        if (onSuccess) onSuccess() // 通知父層更新
      } else {
        showToast('danger', '新增失敗')
      }
    } catch (err) {
      console.error(err)
      showToast('warning', '無法新增')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="createCouponModalTitle"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="createCouponModalTitle">
                新增優惠券
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">優惠券名稱</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  readOnly
                />
                <div className="form-text text-end">系統自動生成</div>
              </div>

              <div className="mb-3">
                <label className="form-label">折扣碼</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.code}
                  readOnly
                />
                <div className="form-text text-end">系統自動生成</div>
              </div>

              <div className="mb-3">
                <label className="form-label">適用範圍</label>
                <div>
                  <label className="me-3">
                    <input
                      type="radio"
                      name="category"
                      value="商品"
                      checked={form.category === '商品'}
                      onChange={handleChange}
                    />{' '}
                    商品
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="課程"
                      checked={form.category === '課程'}
                      onChange={handleChange}
                    />{' '}
                    課程
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">折扣類型</label>
                <div>
                  <label className="me-3">
                    <input
                      type="radio"
                      name="type"
                      value="現金"
                      checked={form.type === '現金'}
                      onChange={handleChange}
                    />{' '}
                    現金折扣
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="百分比"
                      checked={form.type === '百分比'}
                      onChange={handleChange}
                    />{' '}
                    百分比折扣
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">面額</label>
                <div className="input-group">
                  {form.type === '現金' && (
                    <span className="input-group-text">$</span>
                  )}
                  <input
                    type="number"
                    name="discount"
                    className="form-control"
                    value={form.discount}
                    onChange={handleChange}
                  />
                  {form.type === '百分比' && (
                    <span className="input-group-text">%</span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">最低消費金額</label>
                <input
                  type="number"
                  name="minSpend"
                  className="form-control"
                  value={form.minSpend}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">領取截止日</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={form.endDate}
                  onChange={handleChange}
                  min={getToday()}
                  max={form.expired_at} // ✅ 限制最大不能超過使用期限
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">優惠券到期日</label>
                <input
                  type="date"
                  name="expired_at"
                  className="form-control"
                  value={form.expired_at}
                  onChange={handleChange}
                  min={getToday() || form.endDate} // ✅ 最早不能早於領券日
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? '新增中...' : '確認'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
