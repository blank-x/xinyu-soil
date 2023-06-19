import * as moment from"moment";
function identity<T>(arg: T): T {
    return arg;
}



let myIdentity: <T>(arg: T) => T = identity;
var a = myIdentity(1)
console.log(a)
console.log(identity<string>('sdsd'));

// let ddd:number[] =[1]
let dsd:boolean = false

let arr:Array<number> = [111,2,2]

// 元组  数组的一种
let arr2:[string,boolean] = ['sd',false]
// 枚举
enum Flag {
    success='1212',
    err=2,
    ok
}
console.log(Flag.success);

var c:Flag = Flag.err
console.log(c);
// 根据上一个err 自动加1
console.log(Flag.ok);

// 安装 @types/jquery



