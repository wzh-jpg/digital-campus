import { Scene, AmbientLight, DirectionalLight, HemisphereLight, GridHelper } from 'three'
import { SCENE } from '../constants.js'

export class SceneSetup {
  constructor() {
    this.scene = new Scene()
    this.scene.background = null

    this.createLights()
    this.createHelpers()
  }

  createLights() {
    const ambient = new AmbientLight(0xffffff, SCENE.AMBIENT_LIGHT_INTENSITY)
    this.scene.add(ambient)

    const dir = new DirectionalLight(0xffffff, SCENE.DIRECTIONAL_LIGHT_INTENSITY)
    dir.position.set(...SCENE.DIRECTIONAL_LIGHT_POSITION)
    dir.castShadow = true
    this.scene.add(dir)

    const hemi = new HemisphereLight(
      SCENE.HEMI_LIGHT_SKY,
      SCENE.HEMI_LIGHT_GROUND,
      SCENE.HEMI_LIGHT_INTENSITY
    )
    this.scene.add(hemi)
  }

  createHelpers() {
    const grid = new GridHelper(200, 20, 0x444466, 0x222244)
    grid.position.y = -0.01
    this.scene.add(grid)
  }

  getScene() {
    return this.scene
  }
}
