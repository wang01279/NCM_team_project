// app/_components/home/FullScreenIntro.js
'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import Loading from '@/app/_components/load'
// 預載模型，一進來就開始下載並快取
useGLTF.preload('/models/simu-museum/simu-museum.gltf')

function MuseumModel() {
  const { scene } = useGLTF('/models/simu-museum/simu-museum.gltf')
  const box = new THREE.Box3().setFromObject(scene)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const scale = 18 / Math.max(size.x, size.y, size.z)
  scene.scale.set(scale, scale, scale)
  scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
  return <primitive object={scene} />
}

function CameraFly({ duration = 8 }) {
  const { camera } = useThree()
  // 起始位置
  const start = new THREE.Vector3(5, 3, 5)
  // 終點位置
  const end = new THREE.Vector3(10, 1, 0)
  // 用來追蹤動畫是否完成
  const ref = useRef({ done: false })

  useFrame(({ clock }) => {
    if (ref.current.done) return
    // 計算動畫進度
    const t = Math.min(clock.getElapsedTime() / duration, 1)
    // 計算貝塞爾曲線上的點
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
    }
  })
  return null
}

export default function FullScreenIntro() {
  const controlsRef = useRef()
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
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 999999,
                pointerEvents: 'none'
              }}
            >
              <div style={{
                position: 'relative',
                zIndex: 999999,
                pointerEvents: 'auto'
              }}>
                <Loading />
              </div>
            </Html>

            
          }
        >
          <MuseumModel />
          <CameraFly duration={6} />
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
