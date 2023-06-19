var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 接口约束类的公有成员
// 实现接口
var Asian = /** @class */ (function () {
    function Asian(name) {
        this.age = 0;
        this.name = name;
    }
    Asian.prototype.eat = function () { };
    Asian.prototype.sleep = function () { };
    return Asian;
}());
// 四个成员都得有
var boy = {
    name: '',
    run: function () { },
    eat: function () { },
    cry: function () { }
};
var Auto = /** @class */ (function () {
    function Auto() {
        this.state = 1;
        // private state2 = 1  // C不是auto的子类，导致不能包含auto的非公共成员
    }
    return Auto;
}());
var C = /** @class */ (function () {
    function C() {
        this.state = 222;
        // state2 = 222
        this.state1 = 222;
    }
    return C;
}());
var Bus = /** @class */ (function (_super) {
    __extends(Bus, _super);
    function Bus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Bus;
}(Auto));
