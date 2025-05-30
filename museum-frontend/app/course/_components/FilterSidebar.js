import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import styles from '../_styles/CourseList.module.css';

// 假設 fetchCategories, fetchYears, fetchMonths, fetchDays 會從 API 取得資料
// 這裡先用 mock data，實際可傳入 props 或在父層 fetch
const mockCategories = [
  { id: 1, name: '塑形' },
  { id: 2, name: '釉彩' },
  { id: 3, name: '修復' },
  { id: 4, name: '其他' },
];

export default function FilterSidebar({
  show,
  onClose,
  selectedType,
  onTypeChange,
  selectedCategories,
  onCategoriesChange,
  selectedDate,
  onDateChange,
  categories = mockCategories,
  years = [],
  months = [],
  days = [],
  selectWidth = { year: 80, month: 60, day: 60 },
}) {
  // 日期選單可根據 props 或 courses 動態產生
  return (
    <div className={`${styles.filterSidebarCustom} ${show ? styles.open : ''}`}>
      <button
        id="filterCloseBtn"
        className={`btn ${styles.filterCloseBtn}`}
        onClick={onClose}
      >
        <FaArrowLeft />
      </button>
      {/* 講師類別 */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>講師類別</div>
        <div style={{ borderBottom: '1px solid #e0e0e0', marginBottom: 12 }} />
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="courseType"
            id="domestic"
            checked={selectedType === 'domestic'}
            onChange={() => onTypeChange('domestic')}
          />
          <label className="form-check-label" htmlFor="domestic">
            國內課程
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="courseType"
            id="international"
            checked={selectedType === 'international'}
            onChange={() => onTypeChange('international')}
          />
          <label className="form-check-label" htmlFor="international">
            國際課程
          </label>
        </div>
      </div>
      {/* 課程分類 */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>課程分類</div>
        <div style={{ borderBottom: '1px solid #e0e0e0', marginBottom: 12 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`btn btn-sm ${selectedCategories.includes(cat.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={{ borderRadius: 20, marginBottom: 6 }}
              onClick={() => {
                if (selectedCategories.includes(cat.id)) {
                  onCategoriesChange(selectedCategories.filter((id) => id !== cat.id));
                } else {
                  onCategoriesChange([...selectedCategories, cat.id]);
                }
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      {/* 開課時間 */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>開課時間</div>
        <div style={{ borderBottom: '1px solid #e0e0e0', marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            className="form-select form-select-sm"
            style={{ width: selectWidth.year || 80 }}
            value={selectedDate.year || ''}
            onChange={e => onDateChange({ ...selectedDate, year: e.target.value })}
          >
            <option value="">年</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: selectWidth.month || 60 }}
            value={selectedDate.month || ''}
            onChange={e => onDateChange({ ...selectedDate, month: e.target.value })}
          >
            <option value="">月</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: selectWidth.day || 60 }}
            value={selectedDate.day || ''}
            onChange={e => onDateChange({ ...selectedDate, day: e.target.value })}
          >
            <option value="">日</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
} 