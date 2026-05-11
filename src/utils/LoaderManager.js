import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

export class LoaderManager {
  constructor() {
    this.gltfLoader = new GLTFLoader()
    this.textureLoader = null
    this.total = 0
    this.loaded = 0

    const draco = new DRACOLoader()
    draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    this.gltfLoader.setDRACOLoader(draco)
  }

  loadGLTF(url) {
    this.total++
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          this.loaded++
          this.onProgress?.(this.loaded, this.total)
          resolve(gltf)
        },
        (xhr) => {
          const pct = xhr.loaded / xhr.total
          this.onProgress?.(this.loaded + pct, this.total)
        },
        reject
      )
    })
  }

  loadMultiple(urls) {
    return Promise.all(urls.map((url) => this.loadGLTF(url)))
  }

  onProgress(callback) {
    this.onProgress = callback
  }
}
