import { proccessHeaders, parseHeaders, flattenHeaders } from '../../src/helpers/header'

describe('helps:header', () => {
  describe('proccessHeaders', () => {
    test('should normalize Content-Type header name', () => {
      const headers: any = {
        'ConTenT-type': 'plain/text',
        'Content-length': 1024
      }
      proccessHeaders(headers, {})
      expect(headers['Content-Type']).toBe('plain/text')
      expect(headers['Content-length']).toBe(1024)
      expect(headers['ConTenT-type']).toBeUndefined()
    })

    test('should Content-Type be application/json;charset=utf-8 if it is not set and data is plainObject', () => {
      const headers: any = {}
      proccessHeaders(headers, { a: 1 })

      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })

    test('should not set Content-Type if not set and data is not PlainObject', () => {
      const headers: any = {}
      proccessHeaders(headers, new URLSearchParams('a=b'))
      expect(headers['Content-Type']).toBeUndefined()
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(proccessHeaders(undefined, { a: 1 })).toBeUndefined()
      expect(proccessHeaders(null, { a: 1 })).toBeNull()
    })
  })

  describe('parseHeaders', () => {
    test('should parse the headers', () => {
      const parsed = parseHeaders(
        'Content-Type: application/json\r\n' +
          'Connection: keep-alive\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
          ':aa\r\n' +
          'key:'
      )
      expect(parsed['content-type']).toBe('application/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['key']).toBe('')
    })

    test('should be {} if headers is nullString', () => {
      expect(parseHeaders('')).toEqual({})
    })
  })

  describe('flattenHeaders', () => {
    test('should flatten the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue'
      })
    })

    test('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }
      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(flattenHeaders(undefined, 'get')).toBeUndefined()
      expect(flattenHeaders(null, 'post')).toBeNull()
    })
  })
})
