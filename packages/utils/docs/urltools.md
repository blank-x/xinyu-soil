## url方法汇总

### 使用

```
import { isValidUrl } from 'cosmos-utils'

isValidUrl('http://www.baidu.com') // true
```

### 方法

#### isValidUrl

判断一个字符串是否是url

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| targetStr | 需要判断的字符串 | string | - | 1.1.0 |

- Example

```
isValidUrl('http://www.baidu.com') // true
```

#### setUrlParams

设置urlParams

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| url | 目标url | string | - | 1.1.0 |
| addObj | 需要添加的字段 | Object? | - | 1.1.0 |
| delObj | 需要删除的字段 | Object? | - | 1.1.0 |

- Example

```
const url = 'http://example.com:1234/path/data?key=value&key2=value2#fragid1'
setUrlParams(url, {key3: 'value3'}, {key: ''}) // http://example.com:1234/path/data?key2=value2&key3=value3#fragid1
```

#### getUrlParams

获取urlParams

- 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ---- | ---- | 
| url | 目标url | string | - | 1.1.0 |
| key | 需要获取的key，不传则获取所有params | string? | - | 1.1.0 |

- Example

```
const url = 'http://example.com:1234/path/data?key=value&key2=value2#fragid1'

getUrlParams(url); // {"key": "value", "key2": "value2"}
```

### 测试

- 测试文件

[urltools.test.ts](http://gitlab.sftcwl.com/sftc-fe/cosmos-utils/blob/master/test/urltools.test.ts)

- 测试运行方法
```
npm run test urltools
```
