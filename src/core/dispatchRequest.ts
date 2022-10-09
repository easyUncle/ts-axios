import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type'
import xhr from './xhr'
import { buildUrl, combineURL, isAbsoluteURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/header'
import { transform } from './transform'
export function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // todo
  throwIfCancellationRequested(config)
  proccessConfig(config)
  return xhr(config).then(res => {
    return transformResponse(res)
  })
}
function proccessConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}
export function transformUrl(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildUrl(url!, params, paramsSerializer)
}
function transformResponse(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
