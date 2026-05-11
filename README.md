# 校园数字孪生系统

基于 Three.js 的校园三维数字孪生系统，提供场景漫游、建筑物交互和信息展示功能。

## 功能特性

- **三维校园场景** — 全局光照、阴影、网格辅助地平面
- **模型导入** — 通过 GLTFLoader 加载 `.glb` 模型，支持 Draco 压缩
- **透视相机** — OrbitControls 提供旋转/平移/缩放操作
- **建筑拾取** — Raycaster 点击选中建筑，悬停预览高亮
- **信息面板** — 选中建筑后右侧滑入建筑详情（名称、类别、描述）
- **视角控制** — 一键复位、俯瞰全貌

## 项目结构

```
campus-digital-twin/
├── index.html               # 入口页面，UI 布局 + Three.js CDN 引入
├── assets/
│   ├── models/              # 建筑 .glb 模型文件
│   ├── textures/            # 纹理图片
│   └── data/
│       └── buildings.json   # 建筑物元数据（位置、名称、描述等）
├── src/
│   ├── main.js              # 入口：初始化场景/相机/渲染器，事件绑定
│   ├── constants.js         # 相机/场景/颜色等统一常量
│   ├── scene/
│   │   ├── SceneSetup.js    # 场景 + 环境光/方向光/半球光 + 网格
│   │   └── CampusBuilder.js # 加载 GLB 模型并按 JSON 数据定位
│   ├── camera/
│   │   └── CameraController.js # Orbiting 透视相机控制器
│   ├── interaction/
│   │   ├── RaycasterHandler.js # 点击/悬停射线拾取
│   │   └── BuildingHighlighter.js # 建筑发光高亮效果
│   ├── ui/
│   │   ├── InfoPanel.js     # 建筑信息滑入面板
│   │   └── Toolbar.js       # 底部工具栏
│   └── utils/
│       └── LoaderManager.js # GLTFLoader 封装，支持批量与进度回调
└── README.md
```

## 快速开始

### 1. 准备模型

将 `.glb` 格式的建筑模型放入 `assets/models/` 目录，模型文件名需与 `assets/data/buildings.json` 中的 `model` 字段一致。

### 2. 启动服务

```bash
npx serve .
```

或使用任意静态文件服务器（Python、Live Server 等）。

### 3. 打开浏览器

访问 `http://localhost:3000`（或其他服务器指定端口）。

## 建筑数据配置

编辑 `assets/data/buildings.json`，每栋建筑包含以下字段：

```json
{
  "id": "unique-id",
  "name": "建筑名称",
  "category": "分类标签",
  "desc": "建筑描述文本",
  "model": "filename.glb",
  "position": [x, y, z],
  "rotation": [x, y, z],
  "scale": [x, y, z]
}
```

## 技术栈

| 技术 | 用途 |
|---|---|
| Three.js r160 | 3D 引擎 |
| OrbitControls | 相机轨道控制 |
| GLTFLoader + DRACOLoader | 模型加载 |
| Raycaster | 交互拾取 |
| ES Modules (ImportMap) | 模块管理 |

## 许可

MIT
