'use client'
import React from 'react'

export default function ErrorModal({ show, onClose, message }) {
  if (!show) return null

  return (
    <div
      className="modal fade show"
      style={{
        display: 'block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1050,
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '500px', margin: 'auto' }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">欄位錯誤</h5>
          </div>
          <div className="modal-body">
            <p className="text-danger mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onClose}>
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
