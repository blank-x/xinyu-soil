// 抽象类
// 只能被继承 不能实现
abstract class Animal {
    eat() {
        console.log('eat')
    }
    // 抽象函数
    abstract sleep(): void
}
// 实现 报错
// let animal = new Animal()

// 类的继承
class Dog extends Animal {
    // private constructor(name: string) {    //  private 之后不能实例化
    // protected constructor(name: string) {    //  protected 之后不能实例化  只能被继承
    constructor(name: string) {
        super()
        this.name = name
        this.pri()
    }
    // 实例属性
    public name: string = 'dog'
    run() {}
    private pri() {}
    protected pro() {}
    readonly legs: number = 4
    static food: string = 'bones'
    sleep() { // 实现抽象类中的抽象方法
        console.log('Dog sleep')
    }
}
// console.log(Dog.prototype)
let dog = new Dog('wangwang')
// console.log(dog)
// dog.pri()  // 私有成员在类外不能访问
// dog.pro()  // 受保护成员在类外不能访问
console.log(Dog.food)
dog.eat()

class Husky extends Dog {
    constructor(name: string, public color: string) {
        super(name)
        this.color = color
        // this.pri()  // 私有属性在子类中不能访问
        this.pro()
    }
    // color: string
}
console.log(Husky.food)

class Cat extends Animal {
    sleep() { // 多态
        console.log('Cat sleep')
    }
}
let cat = new Cat()
// 多态
let animals: Animal[] = [dog, cat]
animals.forEach(i => {
    i.sleep()
})


class A{
    // name 参数自动成为公共成员
    constructor(public name:string) {
    }
}
console.log( new A('sdsd'));
