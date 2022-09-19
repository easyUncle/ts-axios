import { parseHeaders } from '../helpers/header'
import {createError} from '../helpers/error'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, data = null, method = 'get', headers, responseType, timeout , cancelToken} = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }
    request.open(method.toUpperCase(), url!)
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
      if (request.status === 0) {
        return
      }
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const headers = parseHeaders(request.getAllResponseHeaders())
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        config,
        headers
      }
      handleResponse(response)
    }
    //网络异常处理
    request.onerror = function() {
      reject(createError('Network Error',config,null,request))
    }
    //请求超时处理
    request.ontimeout = function() {
        reject(
            createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
          )
    }
    if(cancelToken){
      cancelToken.promise.then(reason=>{
        request.abort()
        reject(reason)
      })
    }
    request.send(data)
    //响应结果处理
    function handleResponse(res: AxiosResponse) {
      if (request.status >= 200 && request.status < 300) {
        resolve(res)
      } else {
        reject(
            createError(
              `Request failed with status code ${res.status}`,
              config,
              null,
              request,
              res
            )
          )
      }
    }
  })
}
