const random = (min, max, point) => {
  return (min + Math.random() * (max - min)).toFixed(point)
}
// 删除数组某一个
const remove = (arr, name) => {
  let index = arr.indexOf(name)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

class Barrage {
  constructor(options) {
    this.textArr = options.textArr
    this.fontSize = options.fontSize
    this.container = document.querySelector(options.container)
    // 获取弹幕容器的宽高
    let reac = this.container.getBoundingClientRect()
    // 弹幕容器的宽
    this.containerWidth = reac.right - reac.left
    // 弹幕容器的高
    this.containerHeight = reac.bottom - reac.top
    this.pathNums = options.pathNums
    this.random = options.random
    this.topArr = this.setPath()
    // 速度范围
    this.speedRange = [this.containerWidth / options.speedRange[0] / 63, this.containerWidth / options.speedRange[1] / 63]
    // 屏幕中出现的弹幕最大数量
    this.nums = options.nums
    for (let i = 0; i < this.nums; ++i) {
      this.appendBarrage()
    }
  }
  // 添加一条弹幕数据
  appendBarrage() {
    let self = this
    let text = this.getRandomText()
    let color = this.getRandomColor()
    let size = this.getRandomSize()
    // 用了这个弹道就删除
    let top = this.getRandomTop()
    remove(this.topArr, top)
    // 构造dom节点
    let textWidth = text.length * this.fontSize[1] + 20

    let oDiv = document.createElement('div')
    oDiv.style.position = 'absolute'
    oDiv.style.right = `-${textWidth}px`
    // oDiv.style.top = (this.domHeight - 20) * +Math.random().toFixed(2) + 'px'
    oDiv.style.whiteSpace = 'nowrap'
    oDiv.style.willChange = 'transform'
    oDiv.style.color = color
    oDiv.style.fontSize = `${size}vm`
    oDiv.innerText = text

    this.container.appendChild(oDiv)

    let barrageObj = {
      oDiv: oDiv,
      textWidth: textWidth,
      position: random(0, self.random, 0),
      top: top,
      speed: random(self.speedRange[0], self.speedRange[1], 5)
    }
    this.run(barrageObj)
  }
  // 随机获取一条弹幕文字
  getRandomText() {
    let index = random(0, this.textArr.length - 1, 0)
    return this.textArr[index]
  }
  // 随机获取一个颜色
  getRandomColor() {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
  }
  // 随机生成一个弹道,该弹道距离顶部的距离
  getRandomTop() {
    let index = random(0, this.topArr.length - 1, 0)
    return this.topArr[index]
  }
  getRandomSize() {
    return random(this.fontSize[0], this.fontSize[1], 0)
  }
  // 设置弹道的位置
  setPath() {
    let itemHeight = this.containerHeight / this.pathNums
    let topArr = []
    for (let i = 0; i < this.pathNums; ++i) {
      topArr.push(i * itemHeight)
    }
    return topArr
  }
  // 使弹幕跑起来
  run(barrageObj) {
    window.requestAnimationFrame(() => {
      this.setMove(barrageObj)
    })
  }
  // 使弹幕动起来
  setMove(barrageObj) {
    barrageObj.oDiv.style.transform = `translate3D(${barrageObj.position}px, ${barrageObj.top}px, 0)`
    barrageObj.position = barrageObj.position - barrageObj.speed

    if (-barrageObj.position > this.containerWidth + barrageObj.textWidth) {
      barrageObj.oDiv.remove()
      this.topArr.push(barrageObj.top)
      this.appendBarrage()
    } else {
      this.run(barrageObj)
    }
  }
}

// var config = {
//   textArr: ['test'],
//   speedRange: [1, 10],
//   container: '.barrage_container',
//   nums: 30,
//   fontSize: [10, 100],
//   pathNums: 30,
//   random: 300
// }

// new Barrage(config)