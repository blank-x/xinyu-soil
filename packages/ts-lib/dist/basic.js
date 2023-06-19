function identity(arg) {
    return arg;
}
var myIdentity = identity;
var a = myIdentity(1);
console.log(a);
console.log(identity('sdsd'));
// let ddd:number[] =[1]
var dsd = false;
var arr = [111, 2, 2];
// 元组  数组的一种
var arr2 = ['sd', false];
// 枚举
var Flag;
(function (Flag) {
    Flag["success"] = "1212";
    Flag[Flag["err"] = 2] = "err";
    Flag[Flag["ok"] = 3] = "ok";
})(Flag || (Flag = {}));
console.log(Flag.success);
var c = Flag.err;
console.log(c);
// 根据上一个err 自动加1
console.log(Flag.ok);
// 安装 @types/jquery
console.log($('body'));
