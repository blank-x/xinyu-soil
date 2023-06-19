import isEmail from "../lib/validForm/isEmail";
import isPhoneNo from "../lib/validForm/isPhoneNo";

describe('表单校验/validForm',()=>{
    const email1 = '591533357@qq.com'
    const email2 = '591533357@qq.com.'

    test('校验是否是email',()=>{
        expect(isEmail(email1)).toBe(true)
        expect(isEmail(email2)).toBe(false)
    })

    const No = '15811064206'
    test('校验是否是电话号码',()=>{
        expect(isPhoneNo(No)).toBe(true)
    })
})
