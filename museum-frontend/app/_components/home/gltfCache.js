let cachedGltf = null
let hasPlayedCameraFly = false

export function setGltfCache(gltf) {
  cachedGltf = gltf
}

export function getGltfCache() {
  return cachedGltf
}

export function setCameraFlyPlayed() {
  hasPlayedCameraFly = true
}

export function getCameraFlyPlayed() {
  return hasPlayedCameraFly
} 