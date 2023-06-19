import { precision } from '../src/index'

const { strip, plus, minus, times, divide, round, digitLength, float2Fixed } = precision;

test('0.1 + 0.2 not equals 0.3', () => {
  expect(0.1 + 0.2).not.toBe(0.3)
})

test('strip(0.09999999999999998) equals 0.1', () => {
  expect(strip(0.09999999999999998)).toBe(0.1)
})

test('plus(0.1, 0.2) equals 0.3', () => {
  expect(plus(0.1, 0.2)).toBe(0.3)
})

test('minus(1.0, 0.9) equals 0.1', () => {
  expect(minus(1.0, 0.9)).toBe(0.1)
})

test('minus(0.1, 0.9) equals -0.8', () => {
  expect(minus(0.1, 0.9)).toBe(-0.8)
})

test('times(3, 0.3) equals 0.9', () => {
  expect(times(3, 0.3)).toBe(0.9)
})

test('divide(1.21, 1.1) equals 1.1', () => {
  expect(divide(1.21, 1.1)).toBe(1.1)
})

test('round(0.105, 2) equals 0.11', () => {
  expect(round(0.105, 2)).toBe(0.11)
})

test('digitLength(0.1055) equals 4', () => {
  expect(digitLength(0.1055)).toBe(4)
})

test('digitLength(400.00) equals 0', () => {
  expect(digitLength(400.00)).toBe(0)
})

test('digitLength(400.01) equals 40001', () => {
  expect(float2Fixed(400.01)).toBe(40001)
})

test('digitLength(400.00) equals 400', () => {
  expect(float2Fixed(400.00)).toBe(400)
})

