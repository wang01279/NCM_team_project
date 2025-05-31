import React from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'

export default function BuyerInfo({ value, onChange }) {
  const handleChange = (e) => {
    const { name, value: newValue } = e.target
    onChange({
      ...value,
      [name]: newValue,
    })
  }

  return (
    <div className="col-md-12">
      <div className="buyer-card">
        <FloatingLabel
          controlId="name"
          label={
            <>
              <MdDriveFileRenameOutline className="me-1" />
              姓名
            </>
          }
          className="mb-2"
        >
          <Form.Control
            type="text"
            name="name"
            placeholder="請輸入真實姓名"
            value={value.name || ''}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="phone"
          label={
            <>
              <FaPhoneAlt className="me-1" />
              電話
            </>
          }
          className="mb-2"
        >
          <Form.Control
            type="text"
            name="phone"
            placeholder="輸入手機號碼"
            value={value.phone || ''}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="email"
          label={
            <>
              <FaEnvelope className="me-1" />
              信箱
            </>
          }
          className="mb-2"
        >
          <Form.Control
            type="email"
            name="email"
            placeholder="輸入電子信箱"
            value={value.email || ''}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
      </div>
    </div>
  )
}
