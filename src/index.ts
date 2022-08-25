import { AxiosRequestConfig } from './type'
import xhr from './core/xhr'
import { buildUrl } from './helpers/url'
import { transformRequestData } from './helpers/data'
function axios(config: AxiosRequestConfig): void {
  //todo
  proccessConfig(config)
  xhr(config)
}
function proccessConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transformRequestBody(config)
}
function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}
function transformRequestBody(config: AxiosRequestConfig): any {
  const { data } = config
  return transformRequestData(data)
}
export default axios
