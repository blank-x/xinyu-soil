// 四种函数定义
function add1(x, y) {
    return x + y;
}
// 变量定义函数类型
var add = function (a, b) { return a + b; };
// 必须参数
// 不能在可选参数之后
/* function add1(x?:number,y:number){
    return x+y
}*/
// 剩余参数
function add2(x) {
    var res = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        res[_i - 1] = arguments[_i];
    }
    return x + res.reduce(function (pre, cur) { return pre + cur; });
}
function add3(x) {
    if (typeof x === 'string') {
        return x;
    }
    if (typeof x === 'number') {
        return x;
    }
}
// add3(true)
add3(1);
