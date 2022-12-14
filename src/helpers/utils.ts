// 多次访问到,用一个变量存储
const toString = Object.prototype.toString
export function isDate(obj: any): obj is Date {
  return toString.call(obj) === '[object Date]'
}

export function isPlainObject(obj: any): obj is Object {
  return toString.call(obj) === '[object Object]'
}

export function isFormData(target: any): boolean {
  return typeof target !== 'undefined' && target instanceof FormData
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  let result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        let val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge({}, val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
