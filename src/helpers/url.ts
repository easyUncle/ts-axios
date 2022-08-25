import { isObject, isDate } from './utils'
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
      } else if (isObject(val)) {
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
