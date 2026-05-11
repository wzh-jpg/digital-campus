import { PerspectiveCamera, Vector3, Box3 } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CAMERA } from '../constants.js'

export class CameraController {
  constructor(renderer) {
    this.camera = new PerspectiveCamera(
      CAMERA.FOV,
      window.innerWidth / window.innerHeight,
      CAMERA.NEAR,
      CAMERA.FAR
    )
    this.camera.position.set(...CAMERA.DEFAULT_POSITION)

    this.controls = new OrbitControls(this.camera, renderer.domElement)
    this.controls.target.set(...CAMERA.DEFAULT_TARGET)
    this.controls.enableDamping = true
    this.controls.dampingFactor = CAMERA.DAMPING_FACTOR
    this.controls.minDistance = CAMERA.MIN_DISTANCE
    this.controls.maxDistance = CAMERA.MAX_DISTANCE
    this.controls.rotateSpeed = CAMERA.ROTATE_SPEED
    this.controls.zoomSpeed = CAMERA.ZOOM_SPEED
    this.controls.update()

    this.defaultPosition = new Vector3(...CAMERA.DEFAULT_POSITION)
    this.defaultTarget = new Vector3(...CAMERA.DEFAULT_TARGET)
  }

  resetView() {
    this.camera.position.copy(this.defaultPosition)
    this.controls.target.copy(this.defaultTarget)
    this.controls.update()
  }

  focusOn(object, offset = new Vector3(10, 8, 10)) {
    if (!object) return
    const box = new Box3().setFromObject(object)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())
    const dist = Math.max(size.x, size.y, size.z) * 1.5

    this.controls.target.copy(center)
    this.camera.position.copy(center.clone().add(offset.clone().normalize().multiplyScalar(dist)))
    this.controls.update()
  }

  topView() {
    this.camera.position.set(0, 120, 0.01)
    this.controls.target.set(0, 0, 0)
    this.controls.update()
  }

  update() {
    this.controls.update()
  }

  getCamera() {
    return this.camera
  }

  getControls() {
    return this.controls
  }
}
