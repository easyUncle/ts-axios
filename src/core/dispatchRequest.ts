import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type'
import xhr from './xhr'
import { buildUrl } from '../helpers/url'
import { transformRequestData, transformResponseData } from '../helpers/data'
import { proccessHeaders } from '../helpers/header'
export function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // todo
  proccessConfig(config)
  return xhr(config).then(res => {
    return transformResponse(res)
  })
}
function proccessConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestBody(config)
}
function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url!, params)
}
function transformRequestBody(config: AxiosRequestConfig): any {
  const { data } = config
  return transformRequestData(data)
}
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return proccessHeaders(headers, data)
}
function transformResponse(res: AxiosResponse): AxiosResponse {
  const { data } = res
  res.data = transformResponseData(data)
  return res
}
