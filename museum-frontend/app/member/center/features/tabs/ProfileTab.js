
// // 'use client'

// // import React from 'react'
// // import { Modal, Button, Form } from 'react-bootstrap'
// // import { useState } from 'react'

// // export default function ProfileTab({
// //   member,
// //   formData,
// //   onEdit,
// //   onCancel,
// //   onSubmit,
// //   onChange,
// // }) {
// //   const [showModal, setShowModal] = React.useState(false)

// //   const handleClose = () => {
// //     setShowModal(false)
// //     onCancel()
// //   }

// //   const handleShow = () => {
// //     setShowModal(true)
// //     onEdit()
// //   }

// //   // const handleSubmit = async (e) => {
// //   //   e.preventDefault()
// //   //   try {
// //   //     await onSubmit(e)
// //   //     setShowModal(false)
// //   //   } catch (error) {
// //   //     console.error('更新失敗:', error)
// //   //   }
// //   // }

// //   const [isLoading, setIsLoading] = useState(false)

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     setIsLoading(true)
// //     try {
// //       await onSubmit(e)
// //       setShowModal(false)
// //     } catch (error) {
// //       console.error('更新失敗:', error)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   return (
// //     <>
// //       <div className="d-flex justify-content-between align-items-center mb-4">
// //         <h4 className="card-title mb-0">個人資料</h4>
// //         <Button variant="primary" onClick={handleShow}>
// //           <i className="bi bi-pencil me-2"></i>編輯資料
// //         </Button>
// //       </div>

// //       <div className="profile-info">
// //         <InfoRow label="姓名" value={member.name} />
// //         <InfoRow label="電子郵件" value={member.email} />
// //         <InfoRow
// //           label="性別"
// //           value={
// //             member.gender === 'M' ? '男' : member.gender === 'F' ? '女' : '其他'
// //           }
// //         />
// //         <InfoRow label="電話" value={member.phone} />
// //         <InfoRow label="地址" value={member.address} />
// //         <InfoRow
// //           label="生日"
// //           value={
// //             member.birthday
// //               ? new Date(member.birthday).toLocaleDateString('zh-TW')
// //               : '未設定'
// //           }
// //         />
// //       </div>

// //       <Modal show={showModal} onHide={handleClose}>
// //         <Modal.Header closeButton>
// //           <Modal.Title>編輯個人資料</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <Form onSubmit={handleSubmit}>
// //             <FormInput
// //               label="姓名"
// //               name="name"
// //               value={formData.name}
// //               onChange={onChange}
// //             />
// //             <FormSelect
// //               label="性別"
// //               name="gender"
// //               value={formData.gender}
// //               onChange={onChange}
// //             />
// //             <FormInput
// //               label="電話"
// //               name="phone"
// //               value={formData.phone}
// //               onChange={onChange}
// //             />
// //             <FormInput
// //               label="地址"
// //               name="address"
// //               value={formData.address}
// //               onChange={onChange}
// //             />
// //             <FormInput
// //               label="生日"
// //               name="birthday"
// //               type="date"
// //               value={formData.birthday?.split('T')[0] || ''}
// //               onChange={onChange}
// //             />
// //           </Form>
// //         </Modal.Body>
// //         {/* <Modal.Footer>
// //           <Button variant="secondary" onClick={handleClose}>
// //             取消
// //           </Button>
// //           <Button variant="primary" onClick={handleSubmit}>
// //             儲存
// //           </Button>
// //         </Modal.Footer> */}
// //         {/* 在 Modal.Footer 中更新按鈕 */}
// //         <Modal.Footer>
// //           <Button
// //             variant="secondary"
// //             onClick={handleClose}
// //             disabled={isLoading}
// //           >
// //             取消
// //           </Button>
// //           <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
// //             {isLoading ? '更新中...' : '儲存'}
// //           </Button>
// //         </Modal.Footer>


// //       </Modal>
// //     </>
// //   )
// // }

// // function InfoRow({ label, value }) {
// //   return (
// //     <div className="row mb-3">
// //       <div className="col-md-3">
// //         <strong>{label}：</strong>
// //       </div>
// //       <div className="col-md-9">{value || '未設定'}</div>
// //     </div>
// //   )
// // }

// // function FormInput({ label, name, value, onChange, type = 'text' }) {
// //   return (
// //     <Form.Group className="mb-3">
// //       <Form.Label>{label}</Form.Label>
// //       <Form.Control type={type} name={name} value={value} onChange={onChange} />
// //     </Form.Group>
// //   )
// // }

// // function FormSelect({ label, name, value, onChange }) {
// //   return (
// //     <Form.Group className="mb-3">
// //       <Form.Label>{label}</Form.Label>
// //       <Form.Select name={name} value={value} onChange={onChange}>
// //         <option value="">請選擇</option>
// //         <option value="M">男</option>
// //         <option value="F">女</option>
// //         <option value="O">其他</option>
// //       </Form.Select>
// //     </Form.Group>
// //   )
// // }


// 'use client'

// import React, { useState } from 'react'
// import { Modal, Button, Form } from 'react-bootstrap'

// export default function ProfileTab({
//   member,
//   formData,
//   onEdit,
//   onCancel,
//   onSubmit,
//   onChange,
//   onAvatarUpload, // 新增頭像上傳處理函數
// }) {
//   const [showModal, setShowModal] = React.useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [avatarPreview, setAvatarPreview] = useState(member?.avatar || null)

//   const handleClose = () => {
//     setShowModal(false)
//     onCancel()
//     setAvatarPreview(member?.avatar || null) // 重置頭像預覽
//   }

//   const handleShow = () => {
//     setShowModal(true)
//     onEdit()
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     try {
//       await onSubmit(e)
//       setShowModal(false)
//     } catch (error) {
//       console.error('更新失敗:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     if (file.size > 5 * 1024 * 1024) {
//       alert('圖片大小不能超過 5MB')
//       return
//     }

//     if (!file.type.startsWith('image/')) {
//       alert('請上傳圖片檔案')
//       return
//     }

//     // 創建預覽
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       setAvatarPreview(reader.result)
//     }
//     reader.readAsDataURL(file)

//     // 上傳頭像
//     await onAvatarUpload(e)
//   }

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="card-title mb-0">個人資料</h4>
//         <Button variant="primary" onClick={handleShow}>
//           <i className="bi bi-pencil me-2"></i>編輯資料
//         </Button>
//       </div>

//       <div className="profile-info">
//         <div className="text-center mb-4">
//           <img
//             src={member?.avatar || '/default-avatar.png'}
//             alt="頭像"
//             className="rounded-circle"
//             style={{ width: '150px', height: '150px', objectFit: 'cover' }}
//           />
//         </div>
//         <InfoRow label="姓名" value={member?.name} />
//         <InfoRow label="電子郵件" value={member?.email} />
//         <InfoRow
//           label="性別"
//           value={
//             member?.gender === 'M' ? '男' : member?.gender === 'F' ? '女' : '其他'
//           }
//         />
//         <InfoRow label="電話" value={member?.phone} />
//         <InfoRow label="地址" value={member?.address} />
//         <InfoRow
//           label="生日"
//           value={
//             member?.birthday
//               ? new Date(member?.birthday).toLocaleDateString('zh-TW')
//               : '未設定'
//           }
//         />
//       </div>

//       <Modal show={showModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>編輯個人資料</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             {/* 頭像上傳區域 */}
//             <div className="text-center mb-4">
//               <img
//                 src={avatarPreview || '/default-avatar.png'}
//                 alt="頭像預覽"
//                 className="rounded-circle mb-2"
//                 style={{ width: '150px', height: '150px', objectFit: 'cover' }}
//               />
//               <div>
//                 <Form.Control
//                   type="file"
//                   accept="image/*"
//                   onChange={handleAvatarChange}
//                   className="d-none"
//                   id="avatar-upload"
//                 />
//                 <Button
//                   variant="outline-primary"
//                   onClick={() => document.getElementById('avatar-upload').click()}
//                 >
//                   更換頭像
//                 </Button>
//               </div>
//             </div>

//             <FormInput
//               label="姓名"
//               name="name"
//               value={formData.name}
//               onChange={onChange}
//             />
//             <FormSelect
//               label="性別"
//               name="gender"
//               value={formData.gender}
//               onChange={onChange}
//             />
//             <FormInput
//               label="電話"
//               name="phone"
//               value={formData.phone}
//               onChange={onChange}
//             />
//             <FormInput
//               label="地址"
//               name="address"
//               value={formData.address}
//               onChange={onChange}
//             />
//             <FormInput
//               label="生日"
//               name="birthday"
//               type="date"
//               value={formData.birthday?.split('T')[0] || ''}
//               onChange={onChange}
//             />
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
//             取消
//           </Button>
//           <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? '更新中...' : '儲存'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   )
// }

// function InfoRow({ label, value }) {
//   return (
//     <div className="row mb-3">
//       <div className="col-md-3">
//         <strong>{label}：</strong>
//       </div>
//       <div className="col-md-9">{value || '未設定'}</div>
//     </div>
//   )
// }

// function FormInput({ label, name, value, onChange, type = 'text' }) {
//   return (
//     <Form.Group className="mb-3">
//       <Form.Label>{label}</Form.Label>
//       <Form.Control type={type} name={name} value={value} onChange={onChange} />
//     </Form.Group>
//   )
// }

// function FormSelect({ label, name, value, onChange }) {
//   return (
//     <Form.Group className="mb-3">
//       <Form.Label>{label}</Form.Label>
//       <Form.Select name={name} value={value} onChange={onChange}>
//         <option value="">請選擇</option>
//         <option value="M">男</option>
//         <option value="F">女</option>
//         <option value="O">其他</option>
//       </Form.Select>
//     </Form.Group>
//   )
// }



'use client'

import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

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
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type} name={name} value={value} onChange={onChange} />
    </Form.Group>
  )
}

function FormSelect({ label, name, value, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Select name={name} value={value} onChange={onChange}>
        <option value="">請選擇</option>
        <option value="M">男</option>
        <option value="F">女</option>
        <option value="O">其他</option>
      </Form.Select>
    </Form.Group>
  )
}

export default function ProfileTab({
  member,
  formData,
  onEdit,
  onCancel,
  onSubmit,
  onChange,
}) {
  const [showModal, setShowModal] = React.useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null) // 新增：存儲頭像文件
  const [avatarPreview, setAvatarPreview] = useState(member?.avatar || null)

  const handleClose = () => {
    setShowModal(false)
    onCancel()
    setAvatarFile(null) // 重置頭像文件
    setAvatarPreview(member?.avatar || null) // 重置預覽
  }

  const handleShow = () => {
    setShowModal(true)
    onEdit()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('圖片大小不能超過 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('請上傳圖片檔案')
      return
    }

    // 創建預覽
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // 保存文件
    setAvatarFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // 創建 FormData 對象
      const formDataToSend = new FormData()
      
      // 添加其他資料
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key])
      })

      // 如果有新的頭像文件，添加到 FormData
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile)
      }

      // 發送請求
      await onSubmit(formDataToSend)
      setShowModal(false)
    } catch (error) {
      console.error('更新失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="card-title mb-0">個人資料</h4>
        <Button variant="primary" onClick={handleShow}>
          <i className="bi bi-pencil me-2"></i>編輯資料
        </Button>
      </div>

      <div className="profile-info">
        <div className="text-center mb-4">
          <img
            src={member?.avatar || '/default-avatar.png'}
            alt="頭像"
            className="rounded-circle"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        </div>
        <InfoRow label="姓名" value={member?.name} />
        <InfoRow label="電子郵件" value={member?.email} />
        <InfoRow
          label="性別"
          value={
            member?.gender === 'M' ? '男' : member?.gender === 'F' ? '女' : '其他'
          }
        />
        <InfoRow label="電話" value={member?.phone} />
        <InfoRow label="地址" value={member?.address} />
        <InfoRow
          label="生日"
          value={
            member?.birthday
              ? new Date(member?.birthday).toLocaleDateString('zh-TW')
              : '未設定'
          }
        />
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>編輯個人資料</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* 頭像上傳區域 */}
            <div className="text-center mb-4">
              <img
                src={avatarPreview || member?.avatar || '/default-avatar.png'}
                alt="頭像預覽"
                className="rounded-circle mb-2"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <div>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="d-none"
                  id="avatar-upload"
                />
                <Button
                  variant="outline-primary"
                  onClick={() => document.getElementById('avatar-upload').click()}
                >
                  更換頭像
                </Button>
              </div>
            </div>

            <FormInput
              label="姓名"
              name="name"
              value={formData.name}
              onChange={onChange}
            />
            <FormSelect
              label="性別"
              name="gender"
              value={formData.gender}
              onChange={onChange}
            />
            <FormInput
              label="電話"
              name="phone"
              value={formData.phone}
              onChange={onChange}
            />
            <FormInput
              label="地址"
              name="address"
              value={formData.address}
              onChange={onChange}
            />
            <FormInput
              label="生日"
              name="birthday"
              type="date"
              value={formData.birthday?.split('T')[0] || ''}
              onChange={onChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '更新中...' : '儲存'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}