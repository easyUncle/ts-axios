import { isPlainObject } from './utils'
import {Methods} from '../type'
import {deepMerge} from '../helpers/utils'
function normalizeHeader(headers: any, normalName: string): void {
  Object.keys(headers).forEach(name => {
    if (name !== normalName && name.toUpperCase() === normalName.toUpperCase()) {
      headers[normalName] = headers[name]
      delete headers[name]
    }
  })
}
export function proccessHeaders(headers: any, data: any): any {
  normalizeHeader(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): any {
  if (!headers) {
    return
  }
  const parse = Object.create(null)
  headers.split('\r\n').forEach(item => {
    let [key, value] = item.split(':')
    if (!key) {
      return
    }
    key = key.toLowerCase().trim()
    value = value && value.trim()
    parse[key] = value
  })
  return parse
}

export function flattenHeaders(headers: any, method: Methods): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}