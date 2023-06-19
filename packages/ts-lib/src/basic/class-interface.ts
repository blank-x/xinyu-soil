interface Human {
    // new (name:string): void // 不能约束构造函数
    name: string;
    eat(): void;
}
// 接口约束类的公有成员
// 实现接口
class Asian implements Human {
    constructor(name: string) {
        this.name = name;
    }
    name: string
    eat() {}
    age: number = 0
    sleep() {}
}
// 接口继承接口
interface Man extends Human {
    run(): void
}

interface Child {
    cry(): void
}
// 接口继承接口
interface Boy extends Man, Child {}

// 四个成员都得有
let boy: Boy = {
    name: '',
    run() {},
    eat() {},
    cry() {}
}

class Auto {
    state = 1
    // private state2 = 1  // C不是auto的子类，导致不能包含auto的非公共成员
}

// 接口继承类  抽取成员
interface AutoInterface extends Auto {

}

class C implements AutoInterface {
    state = 222
    // state2 = 222
    state1 = 222
}
class Bus extends Auto implements AutoInterface {

}
