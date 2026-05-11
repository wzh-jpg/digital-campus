import { WebGLRenderer } from 'three'
import { SceneSetup } from './scene/SceneSetup.js'
import { CampusBuilder } from './scene/CampusBuilder.js'
import { RoadSystem } from './scene/RoadSystem.js'
import { CameraController } from './camera/CameraController.js'
import { RaycasterHandler } from './interaction/RaycasterHandler.js'
import { BuildingHighlighter } from './interaction/BuildingHighlighter.js'
import { InfoPanel } from './ui/InfoPanel.js'
import { Toolbar } from './ui/Toolbar.js'

const loadingEl = document.getElementById('loading')

const _DATA = [
  { "id": "teaching-a", "name": "教学楼A", "category": "教学楼", "desc": "建于2010年，共6层，设有普通教室、多媒体教室和阶梯教室，可容纳3000名学生。", "model": "building-a.glb", "position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1] },
  { "id": "teaching-b", "name": "教学楼B", "category": "教学楼", "desc": "建于2015年，共5层，主要配备计算机实验室和语音教室。", "model": "building-b.glb", "position": [40, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1] },
  { "id": "library", "name": "图书馆", "category": "公共设施", "desc": "校园标志性建筑，共4层，藏书50万册，设有自习区、电子阅览室和学术报告厅。", "model": "building-c.glb", "position": [-30, 0, 20], "rotation": [0, 0, 0], "scale": [1, 1, 1] },
  { "id": "dormitory", "name": "学生宿舍", "category": "生活区", "desc": "共12层，标准四人间，配备空调、热水和独立卫浴。", "model": "building-d.glb", "position": [20, 0, -30], "rotation": [0, 0, 0], "scale": [1, 1, 1] },
  { "id": "cafeteria", "name": "食堂", "category": "生活区", "desc": "共3层，一楼大众餐饮、二楼风味小吃、三楼教职工餐厅。", "model": "building-e.glb", "position": [-20, 0, -25], "rotation": [0, 0, 0], "scale": [1, 1, 1] },
]

console.group('[校园孪生] 初始化')

if (location.protocol === 'file:') {
  console.warn('⚠ 当前以 file:// 协议运行，fetch/GLB 加载可能被 CORS 阻止。建议使用静态服务器：npx serve .')
}

let buildingData
try {
  const resp = await fetch('../assets/data/buildings.json')
  buildingData = await resp.json()
  console.log(`✓ 建筑数据加载成功：${buildingData.length} 栋建筑`, buildingData)
} catch (e) {
  console.warn('✗ fetch 加载 buildings.json 失败，使用内嵌数据', e.message)
  buildingData = _DATA
}

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
document.body.prepend(renderer.domElement)
console.log('✓ WebGLRenderer 已创建', {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: renderer.getPixelRatio(),
  shadowMap: renderer.shadowMap.enabled,
})

const sceneSetup = new SceneSetup()
const scene = sceneSetup.getScene()
console.log('✓ 场景已创建（环境光 + 方向光 + 半球光 + 网格）')

const cameraCtrl = new CameraController(renderer)
const camera = cameraCtrl.getCamera()
console.log('✓ 透视相机已创建', {
  fov: camera.fov,
  position: camera.position.toArray(),
  near: camera.near,
  far: camera.far,
})

const raycaster = new RaycasterHandler(camera, renderer.domElement)
const highlighter = new BuildingHighlighter()
const infoPanel = new InfoPanel()

new Toolbar(cameraCtrl)

async function init() {
  const builder = new CampusBuilder(scene)
  try {
    await builder.load(buildingData)
  } catch (e) {
    console.warn('✗ 部分建筑模型加载异常', e)
  }

  const allModels = builder.getAllBuildings().map((b) => b.model)
  raycaster.setTargets(allModels)

  let totalMeshes = 0
  const meshes = []
  allModels.forEach((m) => m.traverse((c) => { if (c.isMesh) { meshes.push(c); totalMeshes++ } }))
  console.log(`✓ 模型加载完成：${allModels.length} 组，共 ${totalMeshes} 个 Mesh`)

  const roads = new RoadSystem(scene)
  roads.build()
  console.log('✓ 道路系统已生成')

  raycaster
    .onClick((hits) => {
      highlighter.clear()
      infoPanel.hide()

      if (hits.length > 0) {
        const hit = hits[0]
        const obj = findBuildingRoot(hit.object)
        const id = obj?.userData?.buildingId
        console.log('[交互] 点击建筑', id, hit)
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

  console.log('✓ 光线投射器已就绪')
  loadingEl.classList.add('hidden')
  console.groupEnd()
  console.log('[校园孪生] 初始化完成')
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
