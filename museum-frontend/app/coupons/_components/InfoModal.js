'use client'

import { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { FaLightbulb } from 'react-icons/fa'
import '@/app/_styles/authModal.scss'

export default function InfoModal({
  title = '提醒',
  message,
  buttonText = '我知道了',
  showByDefault = true,
  onConfirm = () => {},
}) {
  const [show, setShow] = useState(showByDefault)

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (showByDefault) setShow(true)
  }, [showByDefault])

  const handleClose = () => {
    setShow(false)
    onConfirm() // ✅ 點擊時執行外部邏輯
  }

  if (!isClient) return null // ✅ SSR 不渲染 modal，避免 mismatch

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FaLightbulb />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="fs-5">{message}</Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" onClick={handleClose}>
          {buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
