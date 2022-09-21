import { parseHeaders } from '../helpers/header'
import { createError } from '../helpers/error'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookies'
import { isFormData } from '../helpers/utils'
import { listenerCount } from 'process'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      data = null,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onUploadProgress,
      onDownloadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!)

    configureRequest()

    addEvent()

    processHeaders()

    processCancel()

    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = true
      }
    }

    function addEvent(): void {
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
        reject(createError('Network Error', config, null, request))
      }
      //请求超时处理
      request.ontimeout = function() {
        reject(
          createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
        )
      }
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const cookieVal = cookie.read(xsrfCookieName)
        if (cookieVal) {
          headers[xsrfHeaderName!] = cookieVal
        }
      }

      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if (auth) {
        const { username, password } = auth
        headers['Authorization'] = `Basic ${btoa(username + ':' + password)} `
      }

      Object.keys(headers).forEach(key => {
        if (data === null && key.toLowerCase() === 'content-type') {
          delete headers[key]
        } else {
          request.setRequestHeader(key, headers[key])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }
    //响应结果处理
    function handleResponse(res: AxiosResponse): void {
      if (validateStatus!(request.status)) {
        resolve(res)
      } else {
        reject(
          createError(`Request failed with status code ${res.status}`, config, null, request, res)
        )
      }
    }
  })
}
