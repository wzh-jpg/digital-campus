import { COLORS } from '../constants.js'

export class BuildingHighlighter {
  constructor() {
    this.current = null
  }

  highlight(object) {
    this.clear()
    if (!object) return

    this.current = object
    this.traverseMeshes(object, (mesh) => {
      if (mesh.material) {
        mesh.material._origEmissive = mesh.material._origEmissive ?? mesh.material.emissive?.clone()
        mesh.material._origEmissiveIntensity = mesh.material._origEmissiveIntensity ?? mesh.material.emissiveIntensity
        mesh.material.emissive?.setHex(COLORS.HIGHLIGHT)
        mesh.material.emissiveIntensity = 0.3
      }
    })
  }

  hover(object) {
    this.clearHover()
    if (!object) return

    this.traverseMeshes(object, (mesh) => {
      if (mesh.material) {
        mesh.material._origEmissive = mesh.material._origEmissive ?? mesh.material.emissive?.clone()
        mesh.material._origEmissiveIntensity = mesh.material._origEmissiveIntensity ?? mesh.material.emissiveIntensity
        mesh.material.emissive?.setHex(COLORS.HOVER)
        mesh.material.emissiveIntensity = 0.15
      }
    })
  }

  clear() {
    if (this.current) {
      this.traverseMeshes(this.current, (mesh) => {
        this.restoreMaterial(mesh)
      })
      this.current = null
    }
  }

  clearHover() {
    if (this._hovered) {
      this.traverseMeshes(this._hovered, (mesh) => {
        if (mesh !== this.current) {
          this.restoreMaterial(mesh)
        }
      })
      this._hovered = null
    }
  }

  setHovered(object) {
    this.clearHover()
    this._hovered = object
  }

  restoreMaterial(mesh) {
    if (mesh.material) {
      if (mesh.material._origEmissive) {
        mesh.material.emissive?.copy(mesh.material._origEmissive)
        delete mesh.material._origEmissive
      }
      if (mesh.material._origEmissiveIntensity !== undefined) {
        mesh.material.emissiveIntensity = mesh.material._origEmissiveIntensity
        delete mesh.material._origEmissiveIntensity
      }
    }
  }

  traverseMeshes(object, fn) {
    object.traverse((child) => {
      if (child.isMesh) fn(child)
    })
  }
}
