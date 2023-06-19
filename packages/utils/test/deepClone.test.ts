import { deepClone } from '../src/index'

const targetArray = ['13833334444', '18833334444', '17833334444', '15833334444'];
const targetObject = { a: 1 };

test('测试数组', () => {
  expect(deepClone(targetArray)).toEqual(targetArray);
  expect(deepClone(targetArray)).not.toBe(targetArray)
})

test('测试对象', () => {
  expect(deepClone(targetObject)).toEqual(targetObject);
  expect(deepClone(targetObject)).not.toBe(targetObject)
})

test('测试字符串', () => {
  expect(deepClone('123213123')).toEqual('123213123');
})
