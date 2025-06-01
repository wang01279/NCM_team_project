// app/_components/ClientCanvas.js
'use client'
import { usePathname } from 'next/navigation'
import FullScreenIntro from '@/app/_components/home/FullScreenIntro'

export default function ClientCanvas() {
  const path = usePathname()

  return (
    path === '/' && (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
      >
        <FullScreenIntro />
      </div>
    )
  )
}
