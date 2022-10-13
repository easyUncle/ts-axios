import { isPlainObject } from './utils'
export function transformRequestData(data: any): any {
  if (isPlainObject(data)) {
    data = JSON.stringify(data)
  }
  return data
}

export function transformResponseData(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (err) {
      /* istanbul ignore next */
      // do nothing
    }
  }
  return data
}
