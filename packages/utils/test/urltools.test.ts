import { isValidUrl, setUrlParams, getUrlParams } from '../src/index'

const url = 'http://example.com:1234/path/data?key=value&key2=value2#fragid1'

test(url, () => {
  expect(isValidUrl(url)).toBe(true)
})

test(url, () => {
  expect(setUrlParams(url, {key3: 'value3'}, {key: ''})).toBe('http://example.com:1234/path/data?key2=value2&key3=value3#fragid1')
})

test(url, () => {
  expect(getUrlParams(url, 'key')).toBe('value')
})

test(url, () => {
  expect(JSON.stringify(getUrlParams(url))).toBe(JSON.stringify({"key": "value", "key2": "value2"}))
})
