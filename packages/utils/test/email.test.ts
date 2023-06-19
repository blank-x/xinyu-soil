import { validateEmail } from '../src/index'

const testEmail = ['1234@qq.com', 'wang@126.com', 'wang123@126.com', 'wang123@vip.163.com', 'wang_email@outlook.com', 'wang.email@gmail.com'];
testEmail.forEach((item) => {
  test(item, () => {
    expect(validateEmail(item)).toBe(true)
  })
});
