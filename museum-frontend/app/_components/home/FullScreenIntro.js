// app/_components/home/FullScreenIntro.js
'use client'

import { useRef, Suspense, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import LoadMini from '@/app/_components/LoadMini'
import { setGltfCache, getGltfCache, getCameraFlyPlayed, setCameraFlyPlayed } from './gltfCache'

// 預載模型，一進來就開始下載並快取
useGLTF.preload('/models/simu-museum/simu-museum.gltf')

function MuseumModel() {
  const { scene: loadedScene } = useGLTF('/models/simu-museum/simu-museum.gltf')

  // 只在 loadedScene 變動時處理
  const scene = useMemo(() => {
    let base = getGltfCache()
    if (!base) {
      setGltfCache(loadedScene)
      base = loadedScene
    }
    // 每次都 clone 一份新物件
    const cloned = base.clone(true)
    // 做縮放與居中（只動 clone，不動 base）
    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const scale = 18 / Math.max(size.x, size.y, size.z)
    cloned.scale.set(scale, scale, scale)
    cloned.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    return cloned
  }, [loadedScene])

  if (!scene) return null
  return <primitive object={scene} />
}

function CameraFly({ duration = 8, onComplete }) {
  const { camera } = useThree()
  const start = new THREE.Vector3(5, 3, 5)
  const end = new THREE.Vector3(10, 1, 0)
  const ref = useRef({ done: false })

  useFrame(({ clock }) => {
    if (ref.current.done) return
    const t = Math.min(clock.getElapsedTime() / duration, 1)
    const p0 = start
    const p1 = new THREE.Vector3(-5, 4, 15)
    const p2 = new THREE.Vector3(5, 4, 8)
    const p3 = end
    const pos = p0
      .clone()
      .multiplyScalar((1 - t) ** 3)
      .add(p1.clone().multiplyScalar(3 * (1 - t) ** 2 * t))
      .add(p2.clone().multiplyScalar(3 * (1 - t) * t ** 2))
      .add(p3.clone().multiplyScalar(t ** 3))
    camera.position.copy(pos)
    camera.lookAt(0, 0, 0)
    if (t === 1 && !ref.current.done) {
      ref.current.done = true
      if (onComplete) onComplete()
    }
  })
  return null
}

export default function FullScreenIntro() {
  const controlsRef = useRef()
  const [showCameraFly, setShowCameraFly] = useState(!getCameraFlyPlayed())

  useEffect(() => {
    if (showCameraFly) {
      setCameraFlyPlayed()
    }
  }, [showCameraFly])

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        backgroundColor: '#FDFBF7',
      }}
    >
      <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <directionalLight position={[-5, 10, -5]} intensity={1} />
        <directionalLight position={[0, -10, 0]} intensity={0.5} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#DCC692" />
        </mesh>

        <Suspense
          fallback={
            <Html
              center
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: '#FDFBF7',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <LoadMini />
              {/* <span style={{
                marginLeft: 32,
                fontSize: 24,
                color: '#3a2c13',
                fontWeight: 700,
                letterSpacing: '0.1em'
              }}>
                正在為您準備精彩的博物館之旅...
              </span> */}
            </Html>
          }
        >
          <MuseumModel />
          {showCameraFly ? (
            <CameraFly duration={6} onComplete={() => setShowCameraFly(false)} />
          ) : null}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableRotate={true}
          enablePan={false}
          enableZoom={false}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
