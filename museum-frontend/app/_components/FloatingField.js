'use client'

import { Form } from 'react-bootstrap'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { forwardRef } from 'react'

const FloatingField = forwardRef(
  (
    {
      controlId,
      label,
      value,
      onChange,
      onBlur,
      placeholder = '',
      type = 'text',
      errorMsg,
      isValid,
      options = [],
      as = 'input',
      ...rest
    },
    ref
  ) => {
    const renderOptions = () => {
      if (as !== 'select') return null

      return options.map((option, index) => {
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label

        return (
          <option key={index} value={value}>
            {label}
          </option>
        )
      })
    }

    return (
      <div className={`floating-field ${isValid ? 'has-success' : ''}`}>
        <Form.Floating>
          <Form.Control
            ref={ref}
            id={controlId}
            name={controlId}
            type={as === 'input' ? type : undefined}
            as={as}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`form-control ${errorMsg ? 'is-error' : ''} ${isValid ? 'is-valid' : ''}`}
            {...rest}
          >
            {renderOptions()}
          </Form.Control>
          <Form.Label htmlFor={controlId}>{label}</Form.Label>
        </Form.Floating>

        {/* 錯誤訊息直接顯示在 input 下方，佔位推開下方內容 */}
        {errorMsg && (
          <div className="invalid-feedback d-block" style={{ marginTop: '0.4rem' }}>
            <FaExclamationCircle className="me-1" />
            {errorMsg}
          </div>
        )}
        {/* Icon in top-right corner（可選，若要移除可刪） */}
        {/* {errorMsg && (
          <span className={`error-icon ${errorMsg ? 'shake' : ''}`}>
            <FaExclamationCircle />
          </span>
        )} */}

        {!errorMsg && isValid && (
          <span className="success-icon bounce-check">
            <FaCheckCircle />
          </span>
        )}
      </div>
    )
  }
)

FloatingField.displayName = 'FloatingField'

export default FloatingField

