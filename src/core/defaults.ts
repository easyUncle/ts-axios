import { transformRequestData, transformResponseData } from '../helpers/data'
import { proccessHeaders } from '../helpers/header'
import { AxiosRequestConfig } from '../type'
const DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
}
const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,
  // 对于post、put、patch这种带有requestData的请求方式，默认的content-type为application/x-www-form-urlencoded
  headers: {
    common: {
      Accept: 'application/json,text/plain,*/*'
    }
  },
  transformRequest: [
    function(data: any, headers?: any): any {
      proccessHeaders(headers, data)
      return transformRequestData(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponseData(data)
    }
  ],
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}

const requestWithoutData = ['get', 'delete', 'head', 'options']
requestWithoutData.forEach(method => {
  defaults.headers[method] = {}
})

const requestWithData = ['post', 'put', 'patch']
requestWithData.forEach(method => {
  defaults.headers[method] = DEFAULT_CONTENT_TYPE
})

export default defaults
