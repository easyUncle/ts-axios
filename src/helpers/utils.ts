// 多次访问到,用一个变量存储
const toString = Object.prototype.toString
export function isObject(obj: any): obj is Object {
  return obj !== null && typeof obj === 'object'
}

export function isDate(obj: any): obj is Date {
  return toString.call(obj) === '[object Date]'
}

export function isPlainObject(obj: any): obj is Object {
  return toString.call(obj) === '[object Object]'
}

export function extend<T,U>(to:T,from:U):T & U{
  for(const key in from){
    (to as T & U)[key] = from[key] as any
  }
  console.log(to)
  return to as T & U
}