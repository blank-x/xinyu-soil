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
// 抽象类
// 只能被继承 不能实现
var Animal = /** @class */ (function () {
    function Animal() {
    }
    Animal.prototype.eat = function () {
        console.log('eat');
    };
    return Animal;
}());
// 实现 报错
// let animal = new Animal()
// 类的继承
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    // private constructor(name: string) {    //  private 之后不能实例化
    // protected constructor(name: string) {    //  protected 之后不能实例化  只能被继承
    function Dog(name) {
        var _this = _super.call(this) || this;
        // 实例属性
        _this.name = 'dog';
        _this.legs = 4;
        _this.name = name;
        _this.pri();
        return _this;
    }
    Dog.prototype.run = function () { };
    Dog.prototype.pri = function () { };
    Dog.prototype.pro = function () { };
    Dog.prototype.sleep = function () {
        console.log('Dog sleep');
    };
    Dog.food = 'bones';
    return Dog;
}(Animal));
// console.log(Dog.prototype)
var dog = new Dog('wangwang');
// console.log(dog)
// dog.pri()  // 私有成员在类外不能访问
// dog.pro()  // 受保护成员在类外不能访问
console.log(Dog.food);
dog.eat();
var Husky = /** @class */ (function (_super) {
    __extends(Husky, _super);
    function Husky(name, color) {
        var _this = _super.call(this, name) || this;
        _this.color = color;
        _this.color = color;
        // this.pri()  // 私有属性在子类中不能访问
        _this.pro();
        return _this;
    }
    return Husky;
}(Dog));
console.log(Husky.food);
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cat.prototype.sleep = function () {
        console.log('Cat sleep');
    };
    return Cat;
}(Animal));
var cat = new Cat();
// 多态
var animals = [dog, cat];
animals.forEach(function (i) {
    i.sleep();
});
var A = /** @class */ (function () {
    // name 参数自动成为公共成员
    function A(name) {
        this.name = name;
    }
    return A;
}());
console.log(new A('sdsd'));
//# sourceMappingURL=class.js.map