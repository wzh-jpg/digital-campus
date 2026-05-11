import { WebGLRenderer } from 'three'
import { SceneSetup } from './scene/SceneSetup.js'
import { CampusBuilder } from './scene/CampusBuilder.js'
import { CameraController } from './camera/CameraController.js'
import { RaycasterHandler } from './interaction/RaycasterHandler.js'
import { BuildingHighlighter } from './interaction/BuildingHighlighter.js'
import { InfoPanel } from './ui/InfoPanel.js'
import { Toolbar } from './ui/Toolbar.js'
import buildingData from '../assets/data/buildings.json' with { type: 'json' }

const loadingEl = document.getElementById('loading')

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
document.body.prepend(renderer.domElement)

const sceneSetup = new SceneSetup()
const scene = sceneSetup.getScene()

const cameraCtrl = new CameraController(renderer)
const camera = cameraCtrl.getCamera()

const raycaster = new RaycasterHandler(camera, renderer.domElement)
const highlighter = new BuildingHighlighter()
const infoPanel = new InfoPanel()

new Toolbar(cameraCtrl)

async function init() {
  const builder = new CampusBuilder(scene)
  try {
    await builder.load(buildingData)
  } catch (e) {
    console.warn('部分建筑模型加载失败，已生成占位模型', e)
  }

  const allModels = builder.getAllBuildings().map((b) => b.model)
  raycaster.setTargets(allModels)

  const meshes = []
  allModels.forEach((m) => m.traverse((c) => { if (c.isMesh) meshes.push(c) }))

  raycaster
    .onClick((hits) => {
      highlighter.clear()
      infoPanel.hide()

      if (hits.length > 0) {
        const hit = hits[0]
        const obj = findBuildingRoot(hit.object)
        const id = obj?.userData?.buildingId
        if (id) {
          const entry = builder.getBuilding(id)
          if (entry) {
            highlighter.highlight(obj)
            infoPanel.show(entry.data)
          }
        }
      }
    })
    .onHover((hits) => {
      highlighter.clearHover()
      renderer.domElement.style.cursor = 'default'

      if (hits.length > 0) {
        const obj = findBuildingRoot(hits[0].object)
        if (obj?.userData?.isBuilding) {
          highlighter.setHovered(obj)
          highlighter.hover(obj)
          renderer.domElement.style.cursor = 'pointer'
        }
      }
    })

  loadingEl.classList.add('hidden')
}

function findBuildingRoot(object) {
  let current = object
  while (current) {
    if (current.userData?.isBuilding) return current
    current = current.parent
  }
  return null
}

init()

function animate() {
  requestAnimationFrame(animate)
  cameraCtrl.update()
  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
