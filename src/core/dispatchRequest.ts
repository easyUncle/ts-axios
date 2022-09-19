import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type'
import xhr from './xhr'
import { buildUrl } from '../helpers/url'
import { flattenHeaders } from '../helpers/header'
import { transform } from './transform'
export function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // todo
  proccessConfig(config)
  return xhr(config).then(res => {
    return transformResponse(res)
  })
}
function proccessConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transform(config.data,config.headers,config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}
function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url!, params)
}
function transformResponse(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data,res.headers,res.config.transformResponse)
  return res
}
