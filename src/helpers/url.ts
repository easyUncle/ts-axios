import { isPlainObject, isDate } from './utils'

interface OriginURL {
  protocol: string
  host: string
}

function encode(url: string): string {
  return encodeURIComponent(url)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
export function buildUrl(url: string, params?: any): string {
  if (!params) {
    return url
  }
  let parts: string[] = []
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (typeof value === 'undefined' || value === null) return

    let vals: string[]
    if (Array.isArray(value)) {
      vals = value
      key += '[]'
    } else {
      vals = [value]
    }
    vals.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  let serializedParams = parts.join('&')
  if (serializedParams) {
    const hashIndex = url.indexOf('#')
    if (hashIndex >= 0) {
      url = url.slice(0, hashIndex)
    }
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }
  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const requestOrigin = parseURL(requestURL)
  const currentOrigin = parseURL(window.location.href)

  return (
    requestOrigin.protocol === currentOrigin.protocol && requestOrigin.host === currentOrigin.host
  )

  function parseURL(lawURL: string): OriginURL {
    const urlParsingNode = document.createElement('a')
    urlParsingNode.setAttribute('href', lawURL)
    const { protocol, host } = urlParsingNode
    return {
      protocol,
      host
    }
  }
}
