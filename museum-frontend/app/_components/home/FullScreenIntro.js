// // app/components/FullScreenIntro.jsx
// 'use client'

// import React, { Suspense } from 'react'
// import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import * as THREE from 'three'
// import { OrbitControls, Html, useGLTF, Grid } from '@react-three/drei'
// import { easing } from 'maath'

// // MuseumModel：載入 public/models 資料夾下的 GLB 模型
// function MuseumModel() {
//   const { scene } = useGLTF(
//     '/models/simu-museum/simu-museum.gltf',
//     undefined,
//     (error) => {
//       console.error('模型加載錯誤:', error)
//     }
//   )

//   // 添加更多调试信息
//   console.log('模型加载成功，場景渲染:', {
//     position: scene.position,
//     scale: scene.scale,
//     children: scene.children.length,
//     boundingBox: new THREE.Box3().setFromObject(scene),
//   })

//   // 计算模型的边界框
//   const box = new THREE.Box3().setFromObject(scene)
//   const size = box.getSize(new THREE.Vector3())
//   const center = box.getCenter(new THREE.Vector3())

//   // 根据模型大小自动调整比例
//   const maxDim = Math.max(size.x, size.y, size.z)
//   const scale = 15 / maxDim // 将模型缩放到5个单位大小
//   scene.scale.set(scale, scale, scale)

//   // 将模型居中
//   scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

//   return <primitive object={scene} />
// }

// // CameraFly：相機從起點飛入終點，完成後呼叫 onComplete
// function CameraFly({ onComplete, duration = 8 }) {
//   const { camera } = useThree()
//   // 起始位置：从左侧观察
//   const start = new THREE.Vector3(5, 3, 5)
//   // 结束位置：更正面的视角
//   const end = new THREE.Vector3(10, 3, 0)
//   let hasCompleted = false

//   useFrame(({ clock }) => {
//     const t = Math.min(clock.getElapsedTime() / duration, 1)

//     // 使用三次贝塞尔曲线实现平滑的相机移动
//     const p0 = start
//     const p1 = new THREE.Vector3(-5, 4, 15) // 控制点1
//     const p2 = new THREE.Vector3(5, 4, 8) // 控制点2，调整z值使路径更平滑
//     const p3 = end

//     // 计算贝塞尔曲线上的点
//     const x =
//       Math.pow(1 - t, 3) * p0.x +
//       3 * Math.pow(1 - t, 2) * t * p1.x +
//       3 * (1 - t) * Math.pow(t, 2) * p2.x +
//       Math.pow(t, 3) * p3.x
//     const y =
//       Math.pow(1 - t, 3) * p0.y +
//       3 * Math.pow(1 - t, 2) * t * p1.y +
//       3 * (1 - t) * Math.pow(t, 2) * p2.y +
//       Math.pow(t, 3) * p3.y
//     const z =
//       Math.pow(1 - t, 3) * p0.z +
//       3 * Math.pow(1 - t, 2) * t * p1.z +
//       3 * (1 - t) * Math.pow(t, 2) * p2.z +
//       Math.pow(t, 3) * p3.z

//     camera.position.set(x, y, z)
//     camera.lookAt(0, 0, 0)

//     if (t === 1 && !hasCompleted) {
//       hasCompleted = true
//       onComplete()
//     }
//   })

//   return null
// }

// // FullScreenIntro：全螢幕容器 + Canvas + 3D 模型與飛入動畫
// export default function FullScreenIntro({ onComplete }) {
//   return (
//     <div
//       style={{
//         position: 'fixed',
//         inset: 0,
//         zIndex: 9999,
//         backgroundColor: '#FDFBF7',
//       }}
//     >
//       <Canvas
//         camera={{ position: [5, 3, 5], fov: 45 }}
//         gl={{ antialias: true }}
//       >
//         {/* 增强光照 */}
//         <ambientLight intensity={1.5} />
//         <directionalLight position={[5, 10, 5]} intensity={2} />
//         <directionalLight position={[-5, 10, -5]} intensity={1} />
//         <directionalLight position={[0, -10, 0]} intensity={0.5} />

//         {/* 添加网格辅助线 */}
//         <Grid
//           args={[100, 100]}
//           cellSize={1}
//           cellThickness={0.5}
//           cellColor="#6f6f6f"
//           sectionSize={3.3}
//           sectionThickness={1}
//           sectionColor="#9d4b4b"
//           fadeDistance={30}
//           fadeStrength={1}
//           followCamera={false}
//           infiniteGrid={true}
//         />

//         <Suspense
//           fallback={
//             <Html center>
//               <div
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   gap: '20px',
//                   color: '#fff',
//                   fontFamily: 'system-ui, -apple-system, sans-serif',
//                 }}
//               >
//                 <h1
//                   style={{
//                     fontSize: '2.5rem',
//                     fontWeight: 'bold',
//                     margin: 0,
//                     background: 'linear-gradient(45deg, #FFD700, #FFA500)',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent',
//                     textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
//                   }}
//                 >
//                   歡迎光臨
//                 </h1>
//                 <p
//                   style={{
//                     fontSize: '1.2rem',
//                     opacity: 0.8,
//                     margin: 0,
//                   }}
//                 >
//                   正在為您準備精彩的博物館之旅...
//                 </p>
//                 <div
//                   style={{
//                     width: '50px',
//                     height: '50px',
//                     border: '3px solid #fff',
//                     borderTop: '3px solid transparent',
//                     borderRadius: '50%',
//                     animation: 'spin 1s linear infinite',
//                   }}
//                 />
//                 <style>
//                   {`
//                     @keyframes spin {
//                       0% { transform: rotate(0deg); }
//                       100% { transform: rotate(360deg); }
//                     }
//                   `}
//                 </style>
//               </div>
//             </Html>
//           }
//         >
//           <MuseumModel />
//           <CameraFly onComplete={onComplete} duration={8} />
//         </Suspense>

//         <OrbitControls
//           enablePan={false}
//           enableZoom={false}
//           autoRotate={false}
//           showGrid={false}
//         />
//       </Canvas>
//     </div>
//   )
// }


// 有蓋到地板的版本
// app/components/FullScreenIntro.jsx
// 'use client'

// import React, { Suspense } from 'react'
// import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import * as THREE from 'three'
// import { OrbitControls, Html, useGLTF } from '@react-three/drei'
// import { easing } from 'maath'

// // MuseumModel：載入並過濾掉地面（floor）網格，以避免黑點
// function MuseumModel() {
//   const { scene } = useGLTF(
//     '/models/simu-museum/simu-museum.gltf',
//     undefined,
//     (error) => console.error('模型加載錯誤:', error)
//   )

//   // 過濾掉高度極薄的地面平面，以移除黑點
//   // scene.traverse((child) => {
//   //   if (child.isMesh) {
//   //     const bbox = new THREE.Box3().setFromObject(child)
//   //     const size = bbox.getSize(new THREE.Vector3())
//   //     // 若高度極近於零，認為是地板，隱藏它
//   //     if (size.y < 0.01) {
//   //       child.visible = false
//   //     }
//   //   }
//   // })

//   // 計算剩餘模型邊界框以做自動縮放與居中
//   const visibleBox = new THREE.Box3().setFromObject(scene)
//   const size = visibleBox.getSize(new THREE.Vector3())
//   const center = visibleBox.getCenter(new THREE.Vector3())
//   const maxDim = Math.max(size.x, size.y, size.z)
//   const scale = 15 / maxDim
//   scene.scale.set(scale, scale, scale)
//   scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

//   return <primitive object={scene} />
// }

// // CameraFly：使用三次貝塞爾曲線做相機飛入動畫
// function CameraFly({ onComplete, duration = 8 }) {
//   const { camera } = useThree()
//   const start = new THREE.Vector3(5, 3, 5)
//   const end = new THREE.Vector3(10, 3, 0)
//   let finished = false

//   useFrame(({ clock }) => {
//     const t = Math.min(clock.getElapsedTime() / duration, 1)
//     const p0 = start
//     const p1 = new THREE.Vector3(-5, 4, 15)
//     const p2 = new THREE.Vector3(5, 4, 8)
//     const p3 = end
//     const lerp3 = (p0, p1, p2, p3, t) =>
//       p0
//         .clone()
//         .multiplyScalar(Math.pow(1 - t, 3))
//         .add(p1.clone().multiplyScalar(3 * Math.pow(1 - t, 2) * t))
//         .add(p2.clone().multiplyScalar(3 * (1 - t) * t * t))
//         .add(p3.clone().multiplyScalar(Math.pow(t, 3)))

//     const pos = lerp3(p0, p1, p2, p3, t)
//     camera.position.copy(pos)
//     camera.lookAt(0, 0, 0)

//     if (t === 1 && !finished) {
//       finished = true
//       onComplete()
//     }
//   })

//   return null
// }

// // FullScreenIntro：全螢幕容器 + Canvas + 模型 + 飛入動畫
// export default function FullScreenIntro({ onComplete }) {
//   return (
//     <div
//       style={{
//         position: 'fixed',
//         inset: 0,
//         zIndex: 9999,
//         backgroundColor: '#FDFBF7',
//       }}
//     >
//       <Canvas
//         camera={{ position: [5, 3, 5], fov: 45 }}
//         gl={{ antialias: true }}
//       >
//         {/* 燈光配置 */}
//         <ambientLight intensity={1.5} />
//         <directionalLight position={[5, 10, 5]} intensity={2} />
//         <directionalLight position={[-5, 10, -5]} intensity={1} />
//         <directionalLight position={[0, -10, 0]} intensity={0.5} />

//         {/* 純粹網格輔助線，可移除或保留 */}
//         {/* 使用平面地板替代網格和黑點 */}
//         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
//           <planeGeometry args={[100, 100]} />
//           <meshStandardMaterial color="#EDEADE" />
//         </mesh>

//         <Suspense
//           fallback={
//             <Html center>
//               <div style={{ textAlign: 'center', color: '#fff' }}>
//                 <h1 style={{ fontSize: '2.5rem', margin: 0 }}>歡迎光臨</h1>
//                 <p>正在準備博物館之旅...</p>
//                 <div
//                   style={{
//                     width: 40,
//                     height: 40,
//                     border: '3px solid #fff',
//                     borderTop: '3px solid transparent',
//                     borderRadius: '50%',
//                     animation: 'spin 1s linear infinite',
//                   }}
//                 />
//                 <style>{`@keyframes spin {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}`}</style>
//               </div>
//             </Html>
//           }
//         >
//           <MuseumModel />
//           <CameraFly onComplete={onComplete} duration={6} />
//         </Suspense>

//         <OrbitControls enablePan={false} enableZoom={false} />
//       </Canvas>
//     </div>
//   )
// }


// app/_components/home/FullScreenIntro.js
'use client'

import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, useGLTF } from '@react-three/drei'
// 預載模型，一進來就開始下載並快取
// useGLTF.preload('/models/simu-museum/simu-museum.gltf')

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
    const pos = p0.clone().multiplyScalar((1 - t) ** 3)
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
    <div style={{ position: 'relative', height: '100%', width: '100%', backgroundColor: '#FDFBF7' }}>
      <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <directionalLight position={[-5, 10, -5]} intensity={1} />
        <directionalLight position={[0, -10, 0]} intensity={0.5} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#DCC692" />
        </mesh>
        <MuseumModel />
        <CameraFly duration={6} />
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

