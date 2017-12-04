class Router {
  constructor(options) {
    this.routes = []
    this.mode =
      options &&
      options.mode &&
      options.mode === 'history' &&
      !!history.pushState
        ? 'history'
        : 'hash'
    this.root =
      options && options.root ? `/${this.clearSlashes(options.root)}/` : '/'
  }
  // 清除字符串两端的斜杠
  clearSlashes(path) {
    return path.replace(/\/$/, '').replace(/^\//, '')
  }
  // 获取两种模式下面对应的hash值
  getFragment() {
    let fragment = ''

    if (this.mode === 'history') {
      fragment = this.clearSlashes(
        decodeURI(location.pathname + location.search)
      )
      fragment = fragment.replace(/\?(.*)$/, '')
      fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment
      console.log(fragment)
    } else {
      let match = location.href.match(/#(.*)$/)
      fragment = match ? match[1] : ''
    }

    return this.clearSlashes(fragment)
  }
  // 刷新
  flush() {
    this.routes = []
    this.mode = null
    this.root = '/'
    return this
  }
  add(reg, handler) {
    if (typeof reg === 'function') {
      handler = reg
      reg = ''
    }
    this.routes.push({
      reg,
      handler
    })
    return this
  }
  remove(param) {
    for (let i = 0; i < this.routes.length; ++i) {
      let val = this.routes[i]
      if (val.reg === param || val.handler === param) {
        this.routes.splice(i, 1)
        return this
      }
    }
    return this
  }
  // 检测当前路由是不是存在
  check(f) {
    let fragment = f || this.getFragment()
    for (let i = 0; i < this.routes.length; ++i) {
      let match = fragment.match(this.routes[i].reg)
      if (match) {
        match.shift()
        // 传参数调用
        this.routes[i].handler.apply({}, match)
        return this
      }
    }
    return this
  }
  listen() {
    let curFragment = this.getFragment()
    console.log(curFragment)
    let fn = () => {
      if (curFragment !== this.getFragment()) {
        curFragment = this.getFragment()
        this.check(curFragment)
      }
    }
    clearInterval(this.timer)
    this.timer = setInterval(fn, 50)
    return this
  }
  // 跳转
  navigate(path = '') {
    if (this.mode === 'history') {
      history.pushState(null, null, `${this.root}${this.clearSlashes(path)}`)
    } else {
      window.location.href =
        window.location.href.replace(/#(.*)$/, '') + '#' + path
    }
    return this
  }
}

// configuration
let router = new Router({ mode: 'hash' })

// returning the user to the initial state
// router.navigate()

// adding routes
router
  .add(/about/, () => {
    console.log('about')
  })
  .add(/products\/(.*)\/edit\/(.*)/, () => {
    console.log('products', arguments)
  })
  .add(() => {
    console.log('default')
  })
  .check('/products/12/edit/22')
  .listen()

// forwarding
//router.navigate('/about')
