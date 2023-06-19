import { objectFalsyFilter } from '../src/index'

test('测试对象', () => {
  expect(objectFalsyFilter({ a: 1, b: '', c: undefined, d: null, e: NaN })).toEqual({ a: 1, e: NaN });
})
