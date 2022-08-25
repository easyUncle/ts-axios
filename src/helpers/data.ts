import { isPlainObject } from './utils'
export function transformRequestData(data: any): any {
  if (isPlainObject(data)) {
    data = JSON.stringify(data)
  }
  return data
}
