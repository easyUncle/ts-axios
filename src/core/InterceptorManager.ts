import { ResolvedFn, RejectedFn } from '../type'
interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}
// 定义拦截器管理类
export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }
  //use方法返回的是intorceptor的id,用来实现eject方法（删除对应的intorceptor）
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  eject(id: number): void {
    if(this.interceptors[id]){
        this.interceptors[id] = null
    }
  }
  // 相当于做了一次事件派发，当外部调用此方法，相当于触发了forEach事件，从而访问到此类内部的属性值
  forEach(fn:(interceptor:Interceptor<T>)=>void):void{
    this.interceptors.forEach(interceptor=>{
       interceptor && fn(interceptor)
    })
  }

}
