## cookie

### 使用

```
import { getCookie } from 'cosmos-utils'

getCookie('STOKEN')
```

### 方法

#### getCookie

获取cookie

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| name | cookie的名称 | string | - | 1.1.0 |

- Example

```
getCookie('STOKEN');
```

#### getAllCookie

获取全部cookie

- 参数

无

- Example

```
getAllCookie();
```

#### setCookie

设置cookie

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| name | cookie的名称 | string | - | 1.1.0 |
| value | cookie的值 | string | - | 1.1.0 |
| exhours | cookie的过期时间 | number | - | 1.1.0 |
| path | cookie的path | string | - | 1.1.0 |
| domain | cookie的domain | string | - | 1.1.0 |

- Example

```
setCookie('STOKEN', '123', -1, '/', 'sftcwl.com');
```

#### delCookie

删除cookie

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| name | cookie的名称 | string | - | 1.1.0 |
| path | cookie的path | string | - | 1.1.0 |
| domain | cookie的domain | string | - | 1.1.0 |

- Example

```
delCookie('STOKEN', '/', 'sftcwl.com');
```
