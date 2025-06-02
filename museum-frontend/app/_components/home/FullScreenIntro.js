// app/_components/home/FullScreenIntro.js
'use client'

import { useRef, Suspense, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import LoadMini from '@/app/_components/LoadMini'
import {
  setGltfCache,
  getGltfCache,
  getCameraFlyPlayed,
  setCameraFlyPlayed,
} from './gltfCache'
import { usePathname } from 'next/navigation'

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

function GradientSky({ position }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          color1: { value: new THREE.Color('#FDFBF7') },
          color2: { value: new THREE.Color('#EDE6D0') },
          color3: { value: new THREE.Color('#D6C7A1') },
        },
        vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec3 vPosition;
      void main() {
        float h = abs(vPosition.y) / 200.0;
        vec3 grad = mix(color1, color2, smoothstep(0.0, 0.5, h));
        grad = mix(grad, color3, smoothstep(0.5, 1.0, h));
        gl_FragColor = vec4(grad, 1.0);
      }
    `,
      }),
    []
  )
  return (
    <mesh position={position} scale={[400, 400, 400]}>
      <sphereGeometry args={[1, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

export default function FullScreenIntro({ scrollY = 0 }) {
  const controlsRef = useRef()
  const [controlsReady, setControlsReady] = useState(false)
  const [showCameraFly, setShowCameraFly] = useState(!getCameraFlyPlayed())
  const pathname = usePathname()
  const [showHint, setShowHint] = useState(false)

  // 雲朵進場動畫與飄動
  const [cloudIn, setCloudIn] = useState(false)
  const [cloudOffsets, setCloudOffsets] = useState([0, 0, 0, 0])
  const [showClouds, setShowClouds] = useState(true)
  useEffect(() => {
    setTimeout(() => setCloudIn(true), 100)
  }, [])
  useEffect(() => {
    let frame
    const start = Date.now()
    function animate() {
      const t = (Date.now() - start) / 1000
      setCloudOffsets([
        Math.sin(t * 0.12) * 20,
        Math.cos(t * 0.09) * 15,
        Math.sin(t * 0.15 + 1) * 18,
        Math.cos(t * 0.11 + 2) * 22,
      ])
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [])
  // RWD: 小螢幕不顯示雲朵
  useEffect(() => {
    function handleResize() {
      setShowClouds(window.innerWidth >= 900)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 當 OrbitControls mount 完成時，設為 ready
  useEffect(() => {
    if (controlsRef.current) {
      setControlsReady(true)
    }
  }, [controlsRef.current])

  // controlsReady 且回到首頁時，強制設置相機正面
  useEffect(() => {
    if (pathname === '/' && controlsReady && controlsRef.current) {
      controlsRef.current.object.position.set(10, 1, 0)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }, [pathname, controlsReady])

  useEffect(() => {
    if (showCameraFly) {
      setCameraFlyPlayed()
    }
  }, [showCameraFly])

  useEffect(() => {
    // 動畫結束時才顯示提示
    if (!showCameraFly) {
      setShowHint(true)
      const timer = setTimeout(() => setShowHint(false), 5500)
      return () => clearTimeout(timer)
    }
  }, [showCameraFly])

  return (
    <>
      {/* 2D 雲朵 Parallax 層（RWD 隱藏） */}
      {showClouds && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <img
            src="img/clouds/cloud1.png"
            style={{
              position: 'absolute',
              left: `calc(18vw + ${cloudOffsets[0]}px)`,
              top: `calc(10vh + ${-scrollY * 0.15}px)`,
              width: '18vw',
              opacity: cloudIn ? 0.5 : 0,
              transform: cloudIn ? 'translateY(0)' : 'translateY(-40px)',
              transition: 'opacity 0.8s, transform 0.8s',
              userSelect: 'none',
            }}
            alt="cloud1"
          />
          <img
            src="img/clouds/cloud2.png"
            style={{
              position: 'absolute',
              left: `calc(65vw + ${cloudOffsets[1]}px)`,
              top: `calc(20vh + ${-scrollY * 0.25}px)`,
              width: '15vw',
              opacity: cloudIn ? 0.4 : 0,
              transform: cloudIn ? 'translateY(0)' : 'translateY(-40px)',
              transition: 'opacity 0.8s, transform 0.8s',
              userSelect: 'none',
            }}
            alt="cloud2"
          />
          {/* <img
            src="img/clouds/cloud3.png"
            style={{
              position: 'absolute',
              left: `calc(3vw + ${cloudOffsets[2]}px)`,
              top: `calc(20vh + ${-scrollY * 0.18}px)`,
              width: '10vw',
              opacity: cloudIn ? 0.6 : 0,
              transform: cloudIn ? 'translateY(0)' : 'translateY(-40px)',
              transition: 'opacity 0.8s, transform 0.8s',
              userSelect: 'none',
            }}
            alt="cloud3"
          /> */}
          {/* <img
            src="img/clouds/cloud4.png"
            style={{
              position: 'absolute',
              right: `8vw`,
              left: 'auto',
              top: `calc(12vh + ${-scrollY * 0.22}px)`,
              width: '16vw',
              opacity: cloudIn ? 0.65 : 0,
              transform: cloudIn
                ? `translateY(0) translateX(${cloudOffsets[3]}px)`
                : 'translateY(-40px)',
              transition: 'opacity 0.8s, transform 0.8s',
              userSelect: 'none',
            }}
            alt="cloud4"
          /> */}
        </div>
      )}
      {/* 3D 場景主體 */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          backgroundColor: '#FDFBF7',
        }}
      >
        {showHint && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '60%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.55)',
              color: '#fff',
              padding: '0.7em 1.5em',
              borderRadius: 24,
              fontSize: 18,
              zIndex: 1000,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              letterSpacing: '0.1em',
            }}
          >
            按住滑鼠拖曳可旋轉模型
          </div>
        )}
        <Canvas
          camera={{ position: [10, 1, 0], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true }}
        >
          {/* 3D 漸層天空球體，隨 scrollY 上下移動產生視差 */}
          <GradientSky position={[0, 100 + scrollY * 0.05, 0]} />
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
              <CameraFly
                duration={6}
                onComplete={() => setShowCameraFly(false)}
              />
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
    </>
  )
}
