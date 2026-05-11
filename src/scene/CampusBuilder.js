import { Object3D, BoxGeometry, MeshStandardMaterial, Mesh } from 'three'
import { LoaderManager } from '../utils/LoaderManager.js'

export class CampusBuilder {
  constructor(scene) {
    this.scene = scene
    this.loader = new LoaderManager()
    this.buildings = new Map()
    this.buildingData = []
  }

  async load(buildingDataList) {
    this.buildingData = buildingDataList

    const results = await Promise.allSettled(
      buildingDataList
        .filter((d) => d.model)
        .map((d) => this.loader.loadGLTF(`assets/models/${d.model}`))
    )

    buildingDataList.forEach((data, i) => {
      const result = results[i]
      let model

      if (result?.status === 'fulfilled' && result.value) {
        model = result.value.scene
      } else {
        console.warn(`建筑 "${data.name}" 模型加载失败，生成占位模型`)
        model = this.createPlaceholder(data)
      }

      model.position.set(...data.position)
      model.rotation.set(...(data.rotation || [0, 0, 0]))
      model.scale.set(...(data.scale || [1, 1, 1]))
      model.userData = { buildingId: data.id, isBuilding: true }

      model.traverse((child) => {
        if (child.isMesh) {
          child.userData.buildingId = data.id
          child.userData.isBuilding = true
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      this.scene.add(model)
      this.buildings.set(data.id, { model, data })
    })

    return this
  }

  createPlaceholder(data) {
    const group = new Object3D()
    const geo = new BoxGeometry(8, 6, 8)
    const mat = new MeshStandardMaterial({
      color: 0x4096ff,
      transparent: true,
      opacity: 0.6,
      wireframe: false,
    })
    const mesh = new Mesh(geo, mat)
    mesh.position.y = 3
    group.add(mesh)
    return group
  }

  getBuilding(id) {
    return this.buildings.get(id)
  }

  getAllBuildings() {
    return Array.from(this.buildings.values())
  }
}
