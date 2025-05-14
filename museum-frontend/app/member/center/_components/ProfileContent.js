// 'use client'

// import React from 'react'
// import { motion } from 'framer-motion'

// export default function ProfileContent({
//   isEditing,
//   member,
//   formData,
//   onEdit,
//   onCancel,
//   onSubmit,
//   onChange,
// }) {
//   return (
//     <motion.div
//       className="profile-content"
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h4 className="card-title mb-0">個人資料</h4>
//           <p className="text-muted">Personal Profile</p>
//         </div>
//         {!isEditing ? (
//           <button className="btn btn-primary" onClick={onEdit}>
//             <i className="fas fa-edit me-2"></i> 編輯資料
//           </button>
//         ) : (
//           <div>
//             <button className="btn btn-secondary me-2" onClick={onCancel}>
//               取消
//             </button>
//             <button className="btn btn-primary" onClick={onSubmit}>
//               儲存
//             </button>
//           </div>
//         )}
//       </div>

//       {!isEditing ? (
//         <div className="profile-info">
//           <InfoRow label="姓名" value={member.name} />
//           <InfoRow label="性別" value={genderToText(member.gender)} />
//           <InfoRow label="手機號碼" value={member.phone} />
//           <InfoRow label="生日" value={formatDate(member.birthday)} />
//           <InfoRow label="電子郵件" value={member.email} />
//           <InfoRow label="地址" value={member.address} />
//         </div>
//       ) : (
//         <form onSubmit={onSubmit}>
//           <InputField
//             label="姓名"
//             name="name"
//             value={formData.name}
//             onChange={onChange}
//           />
//           <SelectField
//             label="性別"
//             name="gender"
//             value={formData.gender}
//             onChange={onChange}
//             options={[
//               { label: '男', value: 'M' },
//               { label: '女', value: 'F' },
//               { label: '其他', value: 'O' },
//             ]}
//           />
//           <InputField
//             label="手機號碼"
//             name="phone"
//             value={formData.phone}
//             onChange={onChange}
//           />
//           <InputField
//             label="生日"
//             name="birthday"
//             type="date"
//             value={formData.birthday?.split('T')[0] || ''}
//             onChange={onChange}
//           />
//           <InputField
//             label="地址"
//             name="address"
//             value={formData.address}
//             onChange={onChange}
//           />
//         </form>
//       )}
//     </motion.div>
//   )
// }

// function InfoRow({ label, value }) {
//   return (
//     <div className="row mb-3">
//       <div className="col-md-3 fw-bold">{label}：</div>
//       <div className="col-md-9">{value || '未設定'}</div>
//     </div>
//   )
// }

// function InputField({ label, name, value, onChange, type = 'text' }) {
//   return (
//     <div className="mb-3">
//       <label className="form-label">{label}</label>
//       <input
//         className="form-control"
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//       />
//     </div>
//   )
// }

// function SelectField({ label, name, value, onChange, options }) {
//   return (
//     <div className="mb-3">
//       <label className="form-label">{label}</label>
//       <select
//         className="form-select"
//         name={name}
//         value={value}
//         onChange={onChange}
//       >
//         <option value="">請選擇</option>
//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// function genderToText(gender) {
//   if (gender === 'M') return '男'
//   if (gender === 'F') return '女'
//   if (gender === 'O') return '其他'
//   return '未設定'
// }

// function formatDate(dateStr) {
//   if (!dateStr) return '未設定'
//   return new Date(dateStr).toLocaleDateString('zh-TW')
// }
