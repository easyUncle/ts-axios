import { buildUrl, isAbsoluteURL, combineURL, isURLSameOrigin } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildUrl', () => {
    test('should support null params', () => {
      expect(buildUrl('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      const params = {
        bar: 'baz'
      }
      expect(buildUrl('/foo', params)).toBe('/foo?bar=baz')
    })

    test("should ignore if params'value is null", () => {
      const params = {
        foo: 'bar',
        baz: null
      }
      expect(buildUrl('/foo', params)).toBe('/foo?foo=bar')
    })

    test('should ignore if the only param value is null', () => {
      const params = {
        bar: null
      }
      expect(buildUrl('/foo', params)).toBe('/foo')
    })

    test('should support object params', () => {
      const param = {
        foo: {
          bar: 'baz'
        }
      }
      expect(buildUrl('/foo', param)).toBe('/foo?foo=' + encodeURI('{"bar":"baz"}'))
    })

    test('should support array params', () => {
      const params = {
        foo: ['bar', 'baz']
      }
      expect(buildUrl('/foo', params)).toBe('/foo?foo[]=bar&foo[]=baz')
    })

    test('should support date params', () => {
      const date = new Date()
      const params = {
        date
      }
      expect(buildUrl('/foo', params)).toBe('/foo?date=' + date.toISOString())
    })

    test('should support special char params', () => {
      const params = {
        char: '@:$,[]+'
      }
      expect(buildUrl('/foo', params)).toBe('/foo?char=@:$,[]+')
    })

    test('should support existing params', () => {
      const params = {
        bar: 'baz'
      }
      expect(buildUrl('/foo?foo=bar', params)).toBe('/foo?foo=bar&bar=baz')
    })

    test('shoule corrent discard ulr hash mark', () => {
      const params = {
        foo: 'bar'
      }
      expect(buildUrl('/foo#hash', params)).toBe('/foo?foo=bar')
    })

    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = {
        foo: 'baz'
      }
      expect(buildUrl('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    test('should support URLSearchParams', () => {
      expect(buildUrl('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })
  })
  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://github.com')).toBeTruthy()
      expect(isAbsoluteURL('HTTPS://github.com')).toBeTruthy()
      expect(isAbsoluteURL('customer-schema-v1.0://example.com')).toBeTruthy()
    })

    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })
    // 1、<img src="https://www.ludou.org/logo.png" alt="" /> ==> 2、<img src="//www.ludou.org/logo.png" alt="" />两者都可以访问，URL省略了协议声明，浏览器可以正常访问资源，这种解决方案叫协议相对protocol-relative URL
    test('should return true if URL is protocol-relative URL', () => {
      expect(isAbsoluteURL('//example.com')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })
  describe('combineURL', () => {
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should not insert slash when relative url missing/empty', () => {
      expect(combineURL('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })

    test('should allow a single slash for relative url', () => {
      expect(combineURL('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect different origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
})
