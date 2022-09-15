export type Methods =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Methods
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface AxiosResponse<T=any> {
  data: T
  status: number
  statusText: string
  config: AxiosRequestConfig
  headers: any
}

export interface AxiosPromise<T=any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}
/**
 *  axios.request(config)
    axios.get(url[, config])
    axios.delete(url[, config])
    axios.head(url[, config])
    axios.options(url[, config])
    axios.post(url[, data[, config]])
    axios.put(url[, data[, config]])
    axios.patch(url[, data[, config]]
 */

export interface Axios {
  interceptors:{
    request:AxiosInterceptorManager<AxiosRequestConfig>,
    response:AxiosInterceptorManager<AxiosResponse>
  }
  request<T=any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T=any>(url: string,data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T=any>(url: string,data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T=any>(url: string,data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T=any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T=any>(url:string,config?:AxiosRequestConfig):AxiosPromise<T>
}

//定义拦截器接口，请求拦截器接口和响应拦截接口
export interface AxiosInterceptorManager<T> {
  use(resolveFn:ResolvedFn<T>,rejectedFn?:RejectedFn):number

  eject(id:number):void
}

//因为请求拦截器传入的参数为config,而响应拦截器处理的参数为response，所以这里使用泛型
export interface ResolvedFn<T> {
  (val:T):T | Promise<T>
}

export interface RejectedFn {
  (err:any) : any
}