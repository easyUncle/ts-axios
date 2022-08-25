import { AxiosRequestConfig } from './type'
import xhr from './core/xhr'
import { buildUrl } from './helpers/url'
function axios(config: AxiosRequestConfig): void {
  //todo
  proccessConfig(config)
  xhr(config)
}
function proccessConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
}
function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}
export default axios
