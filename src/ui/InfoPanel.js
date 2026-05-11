export class InfoPanel {
  constructor() {
    this.el = document.getElementById('info-panel')
    this.titleEl = document.getElementById('panel-title')
    this.tagEl = document.getElementById('panel-tag')
    this.descEl = document.getElementById('panel-desc')
    this.closeBtn = document.getElementById('panel-close')

    this.closeBtn?.addEventListener('click', () => this.hide())
  }

  show(data) {
    if (!data) return
    this.titleEl.textContent = data.name || '未知建筑'
    this.tagEl.textContent = data.category || '未分类'
    this.descEl.textContent = data.desc || '暂无描述'
    this.el.classList.add('visible')
  }

  hide() {
    this.el.classList.remove('visible')
  }

  isVisible() {
    return this.el.classList.contains('visible')
  }
}
