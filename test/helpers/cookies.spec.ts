import cookie from '../../src/helpers/cookies'

describe('helpers:cookie', () => {
  test('should read cookie', () => {
    document.cookie = 'foo=bar'
    expect(cookie.read('foo')).toBe('bar')
  })

  test('should return null if the key cookie no exit', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('bar')).toBeNull()
  })
})
