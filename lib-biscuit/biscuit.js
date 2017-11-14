class Biscuit {
  constructor(document) {
    this.document = document
  }

  get(name) {
    this.cookies = {}
    this.document.cookie.split(';').forEach(cookie => {
      cookie = cookie.split('=')
      if (cookie.length !== 2) return

      let name = cookie[0].trim()
      let value = cookie[1].trim()

      this.cookies[name] = value
    })

    return typeof name === 'undefined'
      ? this.cookies
      : this.cookies[name] || null
  }

  set(name, value = '', attr = {}) {
    name = encodeURIComponent(name)
    value = encodeURIComponent(value)
    let { path, domain, secure, expires } = attr

    let cookie = [
      [name, value].join('='),
      typeof path === 'undefined' ? '' : ';path=' + path,
      typeof domain === 'undefined' ? '' : ';domain=' + domain,
      typeof expires === 'undefined'
        ? ''
        : ';expires=' +
          new Date(Date.now() + expires * 24 * 60 * 60 * 1000).toUTCString(),
      typeof secure === 'undefined' ? '' : ';secure'
    ].join('')

    document.cookie = cookie
  }

  remove(name, attr = {}) {
    name = encodeURIComponent(name)
    let value = this.get(name)
    let { path, domain } = attr

    let cookie = [
      [name, value].join('='),
      typeof path === 'undefined' ? '' : ';path=' + path,
      typeof domain === 'undefined' ? '' : ';domain=' + domain,
      ';expires=' + new Date(Date.now() - 1000).toUTCString()
    ].join('')

    document.cookie = cookie
  }
}

export default Biscuit
