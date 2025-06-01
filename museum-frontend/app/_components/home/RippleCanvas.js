import React, { useRef, useEffect } from 'react'

export default function RippleCanvas() {
  const canvasRef = useRef(null)
  const ripples = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ripples.current.forEach((ripple, i) => {
        ripple.radius += 2
        ripple.alpha *= 0.96
        if (ripple.alpha < 0.01) ripples.current.splice(i, 1)
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, 2 * Math.PI)
        ctx.strokeStyle = `rgba(253,251,247,${ripple.alpha})`
        ctx.lineWidth = 2
        ctx.stroke()
      })
      animationId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animationId)
  }, [])

  useEffect(() => {
    function handleMouseDown(e) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      ripples.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        alpha: 0.8,
      })
    }
    window.addEventListener('mousedown', handleMouseDown)
    return () => window.removeEventListener('mousedown', handleMouseDown)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        pointerEvents: 'none',
        background: 'transparent',
        width: '100vw',
        height: '100vh',
      }}
    />
  )
} 