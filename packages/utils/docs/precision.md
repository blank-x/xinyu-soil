## precision 浮点型计算

### 使用

```
import { precision } from 'cosmos-utils'
const { strip, plus, minus, times, divide, round, digitLength, float2Fixed } = precision;

plus(2.3, 2.4);
times(0.362, 100);
```

### 方法

**strip**

把浮点精度溢出的错误的数据修正

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| num | 需要处理的数字 | number | - | 1.1.0 |

- Example

```
strip(0.09999999999999998); // = 0.1
```

**plus**

加法运算，最少传递两个参数。

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| num1 | 需要相加的数字 | number | - | 1.1.0 |
| num2 | 需要相加的数字 | number | - | 1.1.0 |
| others | 需要相加的数字 | number[] | - | 1.1.0 |

- Example

```
plus(0.1, 0.2); // = 0.3, not 0.30000000000000004
```

**minus**

减法运算，最少传递两个参数。

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| num1 | 需要相减的数字 | number | - | 1.1.0 |
| num2 | 需要相减的数字 | number | - | 1.1.0 |
| others | 需要相减的数字 | number[] | - | 1.1.0 |
 
- Example

```
minus(1.0, 0.9); // = 0.1, not 0.09999999999999998
```

**times**

乘法运算，最少传递两个参数。

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| num1 | 需要相乘的数字 | number | - | 1.1.0 |
| num2 | 需要相乘的数字 | number | - | 1.1.0 |
| others | 需要相乘的数字 | number[] | - | 1.1.0 |

- Example

```
times(3, 0.3);  // = 0.9, not 0.8999999999999999
```

**divide**

除法运算，最少传递两个参数。

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| num1 | 需要相除的数字 | number | - | 1.1.0 |
| num2 | 需要相除的数字 | number | - | 1.1.0 |
| others | 需要相除的数字 | number[] | - | 1.1.0 |

- Example

```
divide(1.21, 1.1);  // = 1.1, not 1.0999999999999999
```

**round**

四舍五入，保留指定位数。

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| num | 数字 | number | - | 1.1.0 |
| ratio | 保留的位数 | number | - | 1.1.0 |

- Example
```
round(0.105, 2);            // = 0.11, not 0.1
```

**enableBoundaryChecking**

在数字计算过程中可能会出现将小数转换成整数的情况，如果要在转换后的整数超过Number的边界（Number.MAX_SAFE_INTEGER与Number.MIN_SAFE_INTEGER）会导致计算结果不准确。`enableBoundaryChecking`方法会在超过边界时在控制台打印出一条warning，你也可以将调用`enableBoundaryChecking(false)`以关闭这条warning信息。

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| flag | 是否开启安全的数字检查 | boolean | true | 1.1.0 |

- Example
```
enableBoundaryChecking(false)  // 关闭检查
```

### 测试

- 测试文件

[precision.test.ts](http://gitlab.sftcwl.com/sftc-fe/cosmos-utils/blob/master/test/precision.test.ts)

- 测试运行方法
```
npm run test precision
```
