import { isEmptyObject } from '../src/index'

test('测试对象', () => {
  expect(isEmptyObject({})).toBe(true);
  expect(isEmptyObject({ a: 1 })).not.toBe(true);
})
