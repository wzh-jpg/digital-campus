import { Group, BoxGeometry, MeshStandardMaterial, Mesh } from 'three'

const ROAD_WIDTH = 4
const ROAD_HEIGHT = 0.08
const BUILDING_CLEARANCE = 4

const WAYPOINTS = {
  gate:    [-20, 35],
  north:   [-5, 28],
  east:    [42, 0],
  south:   [5, -32],
  west:    [-32, 0],
  plaza:   [-12, -10],
  library: [-28, 18],
}

const CONNECTIONS = [
  ['gate', 'north'],
  ['north', 'west'],
  ['west', 'library'],
  ['west', 'plaza'],
  ['plaza', 'south'],
  ['plaza', 'east'],
  ['south', 'east'],
]

const BUILDING_FOOTPRINTS = [
  { x: 0,  z: 0,  r: BUILDING_CLEARANCE },
  { x: 40, z: 0,  r: BUILDING_CLEARANCE },
  { x: -30, z: 20, r: BUILDING_CLEARANCE },
  { x: 20, z: -30, r: BUILDING_CLEARANCE },
  { x: -20, z: -25, r: BUILDING_CLEARANCE },
]

export class RoadSystem {
  constructor(scene) {
    this.scene = scene
    this.group = new Group()
  }

  build() {
    CONNECTIONS.forEach(([a, b]) => {
      const p1 = WAYPOINTS[a]
      const p2 = WAYPOINTS[b]
      if (!p1 || !p2) return
      const segment = this.createSegment(p1, p2)
      if (segment) this.group.add(segment)
    })

    this.scene.add(this.group)
    return this
  }

  createSegment(p1, p2) {
    const [x1, z1] = p1
    const [x2, z2] = p2
    const dx = x2 - x1
    const dz = z2 - z1
    const length = Math.sqrt(dx * dx + dz * dz)
    if (length < 0.5) return null

    const midX = (x1 + x2) / 2
    const midZ = (z1 + z2) / 2

    if (this.hitsBuilding(midX, midZ)) return null

    const angle = Math.atan2(dx, dz)

    const geo = new BoxGeometry(ROAD_WIDTH, ROAD_HEIGHT, length)
    const mat = new MeshStandardMaterial({
      color: 0x3a3a4a,
      roughness: 0.9,
      metalness: 0.0,
    })
    const mesh = new Mesh(geo, mat)
    mesh.position.set(midX, ROAD_HEIGHT / 2, midZ)
    mesh.rotation.y = angle
    mesh.receiveShadow = true
    return mesh
  }

  hitsBuilding(x, z) {
    const limit = BUILDING_CLEARANCE + ROAD_WIDTH / 2
    for (const b of BUILDING_FOOTPRINTS) {
      const dx = x - b.x
      const dz = z - b.z
      if (dx * dx + dz * dz < limit * limit) return true
    }
    return false
  }
}
