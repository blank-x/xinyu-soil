// 方法一
function log<T>(value: T): T {
    console.log(value);
    return value;
}
log<string[]>(['a', ',b', 'c'])
log(['a', ',b', 'c'])

// 方法二
type Log1 = <T>(value: T) => T
let myLog: Log1 = function(value){
    console.log(value);
    return value;
}
// 方法三
interface Logs<T=string> {
    (value: T): T
}
let myLog3: Logs<number> =  function(value){
    console.log(value);
    return value;
}
myLog3(1)
// 默认类型number
let myLog4: Logs =  function(value){
    console.log(value);
    return value;
}
myLog4('sdsdsd')

// 泛型类
class Log<T> {
    run(value: T) {
        console.log(value)
        return value
    }
}
let log1 = new Log<number>()
log1.run(1)

let log2 = new Log()
log2.run({ a: 1 })

interface Length {
    length: number
}
function logAdvance<T extends Length>(value: T): T {
    console.log(value, value.length);
    return value;
}
logAdvance([1])
logAdvance('123')
logAdvance({ length: 3 })
