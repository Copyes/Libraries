/**
 * 弹幕组建封装
 */
class Barrage {
  constructor() {
    this.createSence()
    this.dom = document.querySelector('#content')
    if (this.dom.style.position == '' || this.dom.style.position == 'static') {
      this.dom.style.position = 'relative'
    }
    this.dom.style.overflow = 'hidden'

    let reac = this.dom.getBoundingClientRect()
    this.domWidth = reac.right - reac.left
    this.domHeight = reac.bottom - reac.top
  }
  // 创建弹幕场景
  createSence() {
    let containerXtpl = `
      <div class="container">
        <div class="content" id="content"></div>
      </div>
    `
    document.getElementsByTagName('body')[0].innerHTML = containerXtpl
  }
  // 生成随机的颜色
  generateColor() {
    let r = Math.floor(Math.random() * 256)
    let g = Math.floor(Math.random() * 256)
    let b = Math.floor(Math.random() * 256)
    let color = `rgb(${r}, ${g}, ${b})`
    return color
  }
  // 发射弹幕
  shotBarrage(text) {
    let div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.left = this.domWidth + 'px'
    div.style.top = (this.domHeight - 20) * +Math.random().toFixed(2) + 'px'
    div.style.whiteSpace = 'nowrap'
    div.style.color = `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
    div.innerText = text
    this.dom.appendChild(div)

    let roll = timer => {
      let now = +new Date()
      roll.last = roll.last || now
      roll.timer = roll.timer || timer
      let left = div.offsetLeft
      let rect = div.getBoundingClientRect()
      if (left < rect.left - rect.right) {
        this.dom.removeChild(div)
      } else {
        if (now - roll.last >= roll.timer) {
          roll.last = now
          left -= 3
          div.style.left = left + 'px'
        }
        requestAnimationFrame(roll)
      }
    }
    roll(50 * +Math.random().toFixed(2))
  }
}

const textList = ['弹幕', '666', '233333333', 'javascript', 'html', 'css', '前端框架', 'Vue', 'React', 'Angular', '测试弹幕效果']
let barrage = new Barrage()

textList.forEach(s => {
  barrage.shotBarrage(s)
})
