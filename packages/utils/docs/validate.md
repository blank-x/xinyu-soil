## validate 校验

### 使用

```
import { validate } from 'cosmos-utils'
const { validatePhone, validateEmail, phoneReg, emailReg } = validate;

validatePhone('18413234343');   // true
console.log(phoneReg)  //  /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
```

### 方法

**validateEmail**

校验字符串是否为邮箱

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| email | 需要校验的字符串 | string | - | 1.1.0 |

- Example

```
validateEmail('1234567@qq.com'); // true
emailReg // 直接获取邮箱校验的正则表达式
```

**validatePhone**

加法运算，最少传递两个参数。

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| phone | 需要校验的字符串 | string | - | 1.1.0 |

- Example

```
validatePhone(18344443333); // true
phoneReg // 直接获取手机校验的正则表达式
```

### 测试

- 测试文件

[email.test.ts](http://gitlab.sftcwl.com/sftc-fe/cosmos-utils/blob/master/test/email.test.ts)
[phone.test.ts](http://gitlab.sftcwl.com/sftc-fe/cosmos-utils/blob/master/test/phone.test.ts)

- 测试运行方法
```
npm run test email
npm run test phone
```
