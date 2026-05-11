export class Toolbar {
  constructor(cameraController) {
    this.camera = cameraController

    document.getElementById('btn-reset')?.addEventListener('click', () => {
      this.camera.resetView()
    })

    document.getElementById('btn-top')?.addEventListener('click', () => {
      this.camera.topView()
    })
  }
}
