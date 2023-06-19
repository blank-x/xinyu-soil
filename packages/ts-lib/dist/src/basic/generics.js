// 方法一
function log(value) {
    console.log(value);
    return value;
}
log(['a', ',b', 'c']);
log(['a', ',b', 'c']);
var myLog = function (value) {
    console.log(value);
    return value;
};
var myLog3 = function (value) {
    console.log(value);
    return value;
};
myLog3(1);
// 默认类型number
var myLog4 = function (value) {
    console.log(value);
    return value;
};
myLog4('sdsdsd');
// 泛型类
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.prototype.run = function (value) {
        console.log(value);
        return value;
    };
    return Log;
}());
var log1 = new Log();
log1.run(1);
var log2 = new Log();
log2.run({ a: 1 });
function logAdvance(value) {
    console.log(value, value.length);
    return value;
}
logAdvance([1]);
logAdvance('123');
logAdvance({ length: 3 });
//# sourceMappingURL=generics.js.map