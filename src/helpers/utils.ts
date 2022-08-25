//多次访问到,用一个变量存储
const toString = Object.prototype.toString
export function isObject(obj: any): obj is Object {
  return obj !== null && typeof obj === 'object'
}

export function isDate(obj: any): obj is Date {
  return toString.call(obj) === '[object Date]'
}
