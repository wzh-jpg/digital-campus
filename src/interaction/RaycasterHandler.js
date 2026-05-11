import { Raycaster, Vector2 } from 'three'

export class RaycasterHandler {
  constructor(camera, domElement) {
    this.raycaster = new Raycaster()
    this.pointer = new Vector2()
    this.camera = camera
    this.domElement = domElement
    this._onClick = null
    this._onHover = null

    this.clickHandler = (event) => this.handleClick(event)
    this.moveHandler = (event) => this.handleMove(event)

    domElement.addEventListener('click', this.clickHandler)
    domElement.addEventListener('pointermove', this.moveHandler)
  }

  setPointer(event) {
    const rect = this.domElement.getBoundingClientRect()
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  intersect(objects) {
    this.raycaster.setFromCamera(this.pointer, this.camera)
    return this.raycaster.intersectObjects(objects, true)
  }

  handleClick(event) {
    this.setPointer(event)
    if (this._onClick) {
      const hits = this.intersect(this._targets || [])
      this._onClick(hits)
    }
  }

  handleMove(event) {
    this.setPointer(event)
    if (this._onHover) {
      const hits = this.intersect(this._targets || [])
      this._onHover(hits)
    }
  }

  onClick(callback) {
    this._onClick = callback
    return this
  }

  onHover(callback) {
    this._onHover = callback
    return this
  }

  setTargets(objects) {
    this._targets = objects
    return this
  }

  dispose() {
    this.domElement.removeEventListener('click', this.clickHandler)
    this.domElement.removeEventListener('pointermove', this.moveHandler)
  }
}
