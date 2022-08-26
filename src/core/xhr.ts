import { parseHeaders } from '../helpers/header'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { url, data = null, method = 'get', headers, responseType } = config
    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    request.open(method.toUpperCase(), url)
    Object.keys(headers).forEach(key => {
      if (data === null && key.toLowerCase() === 'content-type') {
        delete headers[key]
      } else {
        request.setRequestHeader(key, headers[key])
      }
    })

    // 请求响应处理
    request.onreadystatechange = function() {
      if (request.readyState != 4) {
        return
      }
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      console.log(responseData)
      const headers = parseHeaders(request.getAllResponseHeaders())
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        config,
        headers
      }
      resolve(response)
    }
    request.send(data)
  })
}
