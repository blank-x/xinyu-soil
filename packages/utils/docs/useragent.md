## useragent 

### 使用

```
import { isMobile, getBrowserType, isAndroid, isIos } from 'cosmos-utils'

isMobile();  // true
```

### 方法

**isMobile**

判断是否是移动端

- 参数

无

- Example

```
isMobile(); // true
```

**getBrowserType**

获取当前是哪种类型的浏览器

- 参数

无

- Example

```
getBrowserType(); // edge | chrome | safari | opera | ff | ie11 | ie10 | ie9 | ie8 | ie7 | '' 都不满足会返回空字符串
```


**isAndroid**

判断是否是安卓系统

- 参数

无

- Example

```
isAndroid(); // true
```

**isIos**

判断是否是iOS系统

- 参数

无

- Example

```
isIos(); // true
```