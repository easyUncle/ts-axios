import Cancel from './cancel'
import { Canceler, CancelExecutor, CancelSource } from '../type'
interface ResolvePromise {
  (reason: Cancel): void
}
export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    let cancel = (message?:string)=>{
        if (this.reason) {
            return
          }
          this.reason = new Cancel(message!)
          resolvePromise(this.reason)
    }
    executor(cancel)
  }

  static source(): CancelSource {
    // 使用！的原因：TypeScript 2.7引入了一个新的控制严格性的标记 --strictPropertyInitialization，确保每个实例的属性都会初始值
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }

  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }
}
