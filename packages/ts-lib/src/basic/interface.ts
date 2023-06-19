interface List {
    readonly id: number;
    name: string;
    // [x: string]: any;  // 可以支持任意多个属性
    age?: number; // 可选属性
}
interface Result {
    data: List[]
}
function render(result: Result) {
    result.data.forEach((value) => {
        console.log(value.id, value.name)
        if (value.age) {
            console.log(value.age)
        }
        // value.id++  // 只读属性
    })
}
let result = {
    data: [
        // 鸭式变形法,存在sex属性照样能通过；  直接使用字面量对象可以使鸭式变形法失效
        {id: 1, name: 'A', sex: 'male'},

        {id: 2, name: 'B', age: 10}
    ]
}

render(result)
/*
render({
    data: [
        //   直接使用字面量对象可以使鸭式变形法失效；
        {id: 1, name: 'A', sex: 'male'},

        {id: 2, name: 'B', age: 10}
    ]
})*/
render({
    data: [
        //   直接使用字面量对象可以使鸭式变形法失效；
        {id: 1, name: 'A', sex: 'male'},

        {id: 2, name: 'B', age: 10}
    ]
} as Result)

render(<Result>{
    data: [
        //   直接使用字面量对象可以使鸭式变形法失效；
        {id: 1, name: 'A', sex: 'male'},

        {id: 2, name: 'B', age: 10}
    ]
})

// 可索引接口
// 此处相当于字符串数组
interface StringArray {
    [index: number]: string
}
let chars: StringArray = ['a', 'b']

interface Names {
    // [x: string]: string;
    [x: string]: any;
    y: number;
    [z: number]: number;
}




// 混合接口
interface Lib { // Lib首先是一个函数，version是这个函数的属性
    (): void;
    version: string;
    doSomething(): void;
}

function getLib() {
    let lib = (() => {}) as Lib
    lib.version = '1.0.0'
    lib.doSomething = () => {}
    return lib;
}
let lib1 = getLib()
lib1()
let lib2 = getLib()
lib2.doSomething()

