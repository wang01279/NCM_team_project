'use client'

import React from 'react'

export default function ProfileTab({
  isEditing,
  member,
  formData,
  onEdit,
  onCancel,
  onSubmit,
  onChange,
}) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="card-title mb-0">個人資料</h4>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={onEdit}>
            <i className="bi bi-pencil me-2"></i>編輯資料
          </button>
        ) : (
          <div>
            <button className="btn btn-secondary me-2" onClick={onCancel}>
              取消
            </button>
            <button className="btn btn-primary" onClick={onSubmit}>
              儲存
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="profile-info">
          <InfoRow label="姓名" value={member.name} />
          <InfoRow label="電子郵件" value={member.email} />
          <InfoRow
            label="性別"
            value={
              member.gender === 'M'
                ? '男'
                : member.gender === 'F'
                ? '女'
                : '其他'
            }
          />
          <InfoRow label="電話" value={member.phone} />
          <InfoRow label="地址" value={member.address} />
          <InfoRow
            label="生日"
            value={
              member.birthday
                ? new Date(member.birthday).toLocaleDateString('zh-TW')
                : '未設定'
            }
          />
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <FormInput label="姓名" name="name" value={formData.name} onChange={onChange} />
          <FormSelect label="性別" name="gender" value={formData.gender} onChange={onChange} />
          <FormInput label="電話" name="phone" value={formData.phone} onChange={onChange} />
          <FormInput label="地址" name="address" value={formData.address} onChange={onChange} />
          <FormInput
            label="生日"
            name="birthday"
            type="date"
            value={formData.birthday?.split('T')[0] || ''}
            onChange={onChange}
          />
        </form>
      )}
    </>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="row mb-3">
      <div className="col-md-3">
        <strong>{label}：</strong>
      </div>
      <div className="col-md-9">{value || '未設定'}</div>
    </div>
  )
}

function FormInput({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} className="form-control" />
    </div>
  )
}

function FormSelect({ label, name, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select name={name} value={value} onChange={onChange} className="form-select">
        <option value="">請選擇</option>
        <option value="M">男</option>
        <option value="F">女</option>
        <option value="O">其他</option>
      </select>
    </div>
  )
}
