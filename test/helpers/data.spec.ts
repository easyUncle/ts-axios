import { transformRequestData, transformResponseData } from '../../src/helpers/data'

// requestData支持Document 和 BodyInit 类型，BodyInit 包括了 Blob, BufferSource, FormData, URLSearchParams, ReadableStream、USVString，当没有数据的时候，我们还可以传入 null。
describe('helper:data', () => {
  describe('transformRequestData', () => {
    test('should return a string data is a plainObject', () => {
      const a = { foo: 1 }
      expect(transformRequestData(a)).toBe('{"foo":1}')
    })

    test('should do nothing if the data is not a plainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(transformRequestData(a)).toBe(a)
    })
  })

  describe('transformResponseData', () => {
    test('should transform data to a object if data is a JSON string', () => {
      const a = '{"foo":123}'
      expect(transformResponseData(a)).toEqual({ foo: 123 })
    })

    test('should do nothing if data is a not JSON string but a string', () => {
      const a = '{foo:123}'
      expect(transformResponseData(a)).toBe('{foo:123}')
    })

    test('should do nothing if data is not a string', () => {
      const a = { foo: 1 }
      expect(transformResponseData(a)).toBe(a)
    })
  })
})
