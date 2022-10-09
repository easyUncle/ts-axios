import { isPlainObject, isDate, isURLSearchParams } from './utils'

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
    .replace(/%2B/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
export function buildUrl(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
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
    serializedParams = parts.join('&')
  }
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

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL.replace(/\/+$/, '')
}
