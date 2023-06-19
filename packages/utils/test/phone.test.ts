import { validatePhone } from '../src/index'

const testPhone = ['13833334444', '18833334444', '17833334444', '15833334444'];
testPhone.forEach((item) => {
  test(item, () => {
    expect(validatePhone(item)).toBe(true)
  })
});
